# -*- coding: utf-8 -*-
""" media_manager lambda layer

Il layer media manager si occupa di wrappare tutte le richieste
di media editing come conversione video, creazione di thumbnails,
framizzazione e montaggio

Contenuto:
    * create_thumbnail - crea thumbnail a partire da video
"""

# Import boto3 sdk

import json
import decimal
import boto3
from boto3 import client

runtime = boto3.client('runtime.sagemaker')
dynamodb = boto3.resource('dynamodb')

# le variabili di configurazione dell'ambiente
    env_settings = {
        'AccelerationSettings': {
            'Mode': 'DISABLED'
        },
        'BillingTagsSource': 'QUEUE',
        'QueuePrefix': "arn:aws:mediaconvert:us-east-2:693949087897:queues/",
        'Role': "arn:aws:iam::693949087897:role/mediaRole"
    }


def create_thumbnail(input_key, output_folder_key, queue):
    """Funzione che avvia un job sulla coda "queue" transcoder per creare
    una thumbnail del video di chiave s3 "input_key" che verrà salvata in
    "output_queue"
    Args:
        output_folder_key: il prefisso di chiave S3 di destinazione
        input_key: la chiave S3 del video di origine
        queue: la coda desiderata per il transcoding job

    Returns:
        il job_id del lavoro creato o false se non è stato possibile avviarlo
    """
    # le variabili di configurazione del processo
    media_settings = {
        'OutputGroups': [
            {
                "Name": "thumb",
                "OutputGroupSettings": {
                    "Type": "FILE_GROUP_SETTINGS",
                    "FileGroupSettings": {
                        "Destination": output_folder_key
                    }
                },
                'Outputs': [
                    # output del frame da usare come thumbnail
                    {
                        "ContainerSettings": {
                            "Container": "RAW"
                        },
                        "Extension": ".jpg",
                        "VideoDescription": {
                            "ScalingBehavior": "DEFAULT",
                            "TimecodeInsertion": "DISABLED",
                            "AntiAlias": "ENABLED",
                            "Sharpness": 50,
                            "CodecSettings": {
                                "Codec": "FRAME_CAPTURE",
                                "FrameCaptureSettings": {
                                    "FramerateNumerator": 1,
                                    "FramerateDenominator": 1,
                                    "MaxCaptures": 1,
                                    "Quality": 80
                                }
                            },
                            "DropFrameTimecode": "ENABLED",
                            "ColorMetadata": "INSERT"
                        }
                    },
                    # output obbligatorio di almeno 1 video, scelto volutamente di bassa qualità
                    {
                        'Extension': '.mp4',
                        'NameModifier': '-low',
                        "VideoDescription": {
                            "Width": 852,
                            "ScalingBehavior": "DEFAULT",
                            "Height": 480,
                            "TimecodeInsertion": "DISABLED",
                            "AntiAlias": "ENABLED",
                            "Sharpness": 50,
                            "CodecSettings": {
                                "Codec": "H_264",
                                "H264Settings": {
                                    "InterlaceMode": "PROGRESSIVE",
                                    "NumberReferenceFrames": 3,
                                    "Syntax": "DEFAULT",
                                    "Softness": 0,
                                    "GopClosedCadence": 1,
                                    "GopSize": 90,
                                    "Slices": 1,
                                    "GopBReference": "DISABLED",
                                    "SlowPal": "DISABLED",
                                    "SpatialAdaptiveQuantization": "ENABLED",
                                    "TemporalAdaptiveQuantization": "ENABLED",
                                    "FlickerAdaptiveQuantization": "DISABLED",
                                    "EntropyEncoding": "CABAC",
                                    "Bitrate": 3195,
                                    "FramerateControl": "INITIALIZE_FROM_SOURCE",
                                    "RateControlMode": "CBR",
                                    "CodecProfile": "MAIN",
                                    "Telecine": "NONE",
                                    "MinIInterval": 0,
                                    "AdaptiveQuantization": "HIGH",
                                    "CodecLevel": "AUTO",
                                    "FieldEncoding": "PAFF",
                                    "SceneChangeDetect": "ENABLED",
                                    "QualityTuningLevel": "SINGLE_PASS",
                                    "FramerateConversionAlgorithm": "DUPLICATE_DROP",
                                    "UnregisteredSeiTimecode": "DISABLED",
                                    "GopSizeUnits": "FRAMES",
                                    "ParControl": "INITIALIZE_FROM_SOURCE",
                                    "NumberBFramesBetweenReferenceFrames": 2,
                                    "RepeatPps": "DISABLED",
                                    "DynamicSubGop": "STATIC"
                                }
                            },
                            "AfdSignaling": "NONE",
                            "DropFrameTimecode": "ENABLED",
                            "RespondToAfd": "NONE",
                            "ColorMetadata": "INSERT"
                        },
                        "ContainerSettings": {
                            "Container": "MP4",
                            "Mp4Settings": {
                                "CslgAtom": "INCLUDE",
                                "CttsVersion": 0,
                                "FreeSpaceBox": "EXCLUDE",
                                "MoovPlacement": "PROGRESSIVE_DOWNLOAD"
                            }
                        }
                    }
                ]
            }
        ],
        'Inputs': [
            {
                'FileInput': input_key,
                # inserire un clipping permette di evitare di prelevare il primo frame (blackscreen)
                'InputClippings': [
                    {
                        'StartTimecode': '00:00:10:00'
                    }
                ],
                'TimecodeSource': 'SPECIFIEDSTART',
                'TimecodeStart': '00:00:00:00'
            }
        ]
    }
    media_conv = client("mediaconvert")
    result = media_conv.create_job(
        Role=env_settings['Role'],
        Settings=media_settings,
        AccelerationSettings=env_settings['AccelerationSettings'],
        StatusUpdateInterval='SECONDS_60',
        Priority=0,
        Queue=env_settings["QueuePrefix" + queue]
    )
    return result['Job']['Id']


def mount(input_file_key, destination_key, details_array,first_start, queue):
    """
    Effettua la creazione del lavoro di montaggio di alcuni spezzoni
    di un video indicato come input in base al contenuto della
    lista degli spezzoni sulla coda di lavori passata come parametro
    Args:
        input_file_key: la key del file da cui estrarre le parti
        destination_key: la key della destinazione del nuovo file
        con tutte le parti video inserite
        details_array: lista contenente i tempi di inizio e fine del
        clipping di tutti i pezzi video
        first_start: tempo di inizio del primo pezzo da clippare
        queue: postfisso della coda utilizzata per il montaggio video

    Returns:
        job_id se il lavoro è stato correttamente avviato, false altrimenti
    """

    media_settings = {
        "OutputGroups": [
            {
                "Name": "File Group",
                "Outputs": [
                    {
                        "ContainerSettings": {
                            "Container": "MP4",
                            "Mp4Settings": {
                                "CslgAtom": "INCLUDE",
                                "CttsVersion": 0,
                                "FreeSpaceBox": "EXCLUDE",
                                "MoovPlacement": "PROGRESSIVE_DOWNLOAD"
                            }
                        },
                        "VideoDescription": {
                            "Width": 1280,
                            "ScalingBehavior": "DEFAULT",
                            "Height": 720,
                            "TimecodeInsertion": "DISABLED",
                            "AntiAlias": "ENABLED",
                            "Sharpness": 100,
                            "CodecSettings": {
                                "Codec": "H_264",
                                "H264Settings": {
                                    "InterlaceMode": "PROGRESSIVE",
                                    "NumberReferenceFrames": 3,
                                    "Syntax": "DEFAULT",
                                    "Softness": 0,
                                    "GopClosedCadence": 1,
                                    "GopSize": 90,
                                    "Slices": 1,
                                    "GopBReference": "DISABLED",
                                    "SlowPal": "DISABLED",
                                    "SpatialAdaptiveQuantization": "ENABLED",
                                    "TemporalAdaptiveQuantization": "ENABLED",
                                    "FlickerAdaptiveQuantization": "DISABLED",
                                    "EntropyEncoding": "CABAC",
                                    "Bitrate": 1000000,
                                    "FramerateControl": "INITIALIZE_FROM_SOURCE",
                                    "RateControlMode": "CBR",
                                    "CodecProfile": "MAIN",
                                    "Telecine": "NONE",
                                    "MinIInterval": 0,
                                    "AdaptiveQuantization": "HIGH",
                                    "CodecLevel": "AUTO",
                                    "FieldEncoding": "PAFF",
                                    "SceneChangeDetect": "ENABLED",
                                    "QualityTuningLevel": "SINGLE_PASS",
                                    "FramerateConversionAlgorithm": "DUPLICATE_DROP",
                                    "UnregisteredSeiTimecode": "DISABLED",
                                    "GopSizeUnits": "FRAMES",
                                    "ParControl": "INITIALIZE_FROM_SOURCE",
                                    "NumberBFramesBetweenReferenceFrames": 2,
                                    "RepeatPps": "DISABLED",
                                    "DynamicSubGop": "STATIC"
                                }
                            },
                            "AfdSignaling": "NONE",
                            "DropFrameTimecode": "ENABLED",
                            "RespondToAfd": "NONE",
                            "ColorMetadata": "INSERT"
                        },
                        "AudioDescriptions": [
                            {
                                "AudioTypeControl": "FOLLOW_INPUT",
                                "CodecSettings": {
                                    "Codec": "AAC",
                                    "AacSettings": {
                                        "AudioDescriptionBroadcasterMix": "NORMAL",
                                        "Bitrate": 96000,
                                        "RateControlMode": "CBR",
                                        "CodecProfile": "LC",
                                        "CodingMode": "CODING_MODE_2_0",
                                        "RawFormat": "NONE",
                                        "SampleRate": 48000,
                                        "Specification": "MPEG4"
                                    }
                                },
                                "LanguageCodeControl": "FOLLOW_INPUT"
                            }
                        ],
                        "Extension": ".mp4",
                        "NameModifier": "-combination"
                    }
                ],
                "OutputGroupSettings": {
                    "Type": "FILE_GROUP_SETTINGS",
                    "FileGroupSettings": {
                        "Destination": destination_key
                    }
                }
            }
        ],
        "AdAvailOffset": 0,
        "Inputs": [{
            "AudioSelectors": {
                "Audio Selector 1": {
                    "Offset": 0,
                    "DefaultSelection": "DEFAULT",
                    "ProgramSelection": 1
                }
            },
            "VideoSelector": {
                "ColorSpace": "FOLLOW",
                "Rotate": "DEGREE_0",
                "AlphaBehavior": "DISCARD"
            },
            "FilterEnable": "AUTO",
            "PsiControl": "USE_PSI",
            "FilterStrength": 0,
            "DeblockFilter": "DISABLED",
            "DenoiseFilter": "DISABLED",
            'FileInput': input_file_key,
            "InputClippings": details_array,
            'TimecodeSource': 'SPECIFIEDSTART',
            'TimecodeStart': first_start
        }]
    }

    media_conv = client("mediaconvert")
    result = media_conv.create_job(
        Role=env_settings["Role"],
        Settings=media_settings,
        AccelerationSettings=env_settings["AccelerationSettings"],
        StatusUpdateInterval="SECONDS_60",
        Priority=0,
        Queue=env_settings["QueuePrefix" + queue]
    )
    return result['Job']['Id']


def frame(input_file_key, duration, queue):
    """
    TODO
    :param input_file_key: la key del file di origine
    :param duration:
    :param queue:
    :return:
    """
    media_settings = {
        'Inputs': [
            {
                'AudioSelectors': {
                    'Audio Selector 1': {
                        'Offset': 0,
                        'DefaultSelection': 'DEFAULT',
                        'ProgramSelection': 1
                    }
                },
                'VideoSelector': {
                    'ColorSpace': 'FOLLOW',
                    'Rotate': 'DEGREE_0',
                    'AlphaBehavior': 'DISCARD'
                },
                'FilterEnable': 'AUTO',
                'PsiControl': 'USE_PSI',
                'FilterStrength': 0,
                'DeblockFilter': 'DISABLED',
                'DenoiseFilter': 'DISABLED',
                'TimecodeSource': 'EMBEDDED',
                'FileInput': input_file_key
            }
        ],
        'OutputGroups': [
            {
                'Name': 'File Group',
                'Outputs': [
                    {
                        'Preset': 'Low',
                        'Extension': 'mp4',
                        'NameModifier': 'low'
                    },
                    {
                        "VideoDescription": {
                            "ScalingBehavior": "DEFAULT",
                            "TimecodeInsertion": "DISABLED",
                            "AntiAlias": "ENABLED",
                            "Sharpness": 50,
                            "CodecSettings": {
                                "Codec": "FRAME_CAPTURE",
                                "FrameCaptureSettings": {
                                    "FramerateNumerator": 30,
                                    # nel caso da modificare a piacimento
                                    # TODO verificare il funzionamento
                                    "FramerateDenominator": (duration * 30) / 10,
                                    "MaxCaptures": 10000000,
                                    "Quality": 80
                                }
                            },
                            "DropFrameTimecode": "ENABLED",
                            "ColorMetadata": "INSERT"
                        },
                        "ContainerSettings": {
                            "Container": "RAW"
                        }
                    }
                ],
                'OutputGroupSettings': {
                    'Type': 'FILE_GROUP_SETTINGS',
                    'FileGroupSettings': {
                        'Destination': 's3://ahlconsolebucket/frames/'
                    }
                }
            }
        ],
        'AdAvailOffset': 0,
    }
    media_conv = client("mediaconvert")
    result = media_conv.create_job(
        Role=env_settings['Role'],
        Settings=media_settings,
        AccelerationSettings=env_settings['AccelerationSettings'],
        StatusUpdateInterval='SECONDS_60',
        Priority=0,
        Queue=env_settings["QueuePrefix" + queue]
    )
    return result['Job']['Id']


def get_frame_details(endpoint, payload):
    """
    Funzione che recupera i dettagli di un frame TODO
    :param endpoint:
    :param payload:
    :return:
    """
    response = runtime.invoke_endpoint(EndpointName=endpoint,
                                       ContentType='application/x-image',
                                       Body=payload)
    result = json.loads(response['Body'].read().decode())

    index = 0
    top = result[index]
    for i in range(len(result) - 1):
        tmp = result[i + 1]
        if top < tmp:
            index = i + 1
            top = tmp

    return {
        'index': index,
        'accuracy': top
    }


def dynamo_insertion(frame_info, label, name):
    """
    Funzione per inserire su dynamo TODO
    :param frame_info:
    :param label:
    :param name:
    :return:
    """
    table = dynamodb.Table('frame_rekognitions')

    return table.put_item(
        Item={
            'file_name': name,
            'label': label,
            'accuracy': decimal.Decimal(frame_info.accuracy)
        }
    )


def cutter(name, start, duration):
    """
    TODO funzione non implementata
    :param name:
    :param start:
    :param duration:
    :return:
    """
    print(name, start, duration)
    return 'lavoro1'
