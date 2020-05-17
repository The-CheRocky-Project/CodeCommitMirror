# -*- coding: utf-8 -*-
""" Framer Lambda module

Questo modulo contiene l'handler che effettua la frammentazione di un video in input
a seconda della sua durata
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url and media manager layer
import json
import boto3


def lambda_handler(event, context):
    """
    Handler che riceve l'evento scaturente l'esecuzione e che contiene
    la key del video da frammentare, i cui frmmenti mantengono il nome
    del video stesso

    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        true se l'avvio del job è stato effettuato correttamente, false altrimenti
    """
    try:
        if event['Records'][0]['Sns']['Message'] == "videoEdit":
            bucket = event['Records'][0]['Sns']['MessageAttributes']['bucket']['Value']
            key = event['Records'][0]['Sns']['MessageAttributes']['key']['Value']
            dest_folder = 'frames/'
            media_settings = {
                'OutputGroups': [
                    {
                        "Name": "frames",
                        "OutputGroupSettings": {
                            "Type": "FILE_GROUP_SETTINGS",
                            "FileGroupSettings": {
                                "Destination": 's3://' + bucket + '/' + dest_folder
                            }
                        },
                        'Outputs': [
                            # output dei frame da analizzare
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
                                            "FramerateNumerator": 2,
                                            "FramerateDenominator": 1,
                                            "MaxCaptures": 10000000,
                                            "Quality": 80
                                        }
                                    },
                                    "DropFrameTimecode": "ENABLED",
                                    "ColorMetadata": "INSERT"
                                }
                            },
                            # output obbligatorio di almeno 1 video,
                            # scelto volutamente di bassa qualità
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
                        'FileInput': 's3://' + bucket + '/' + key,
                        # inserire un clipping permette di evitare di prelevare il primo frame (blackscreen)
                        'InputClippings': [
                            {
                                'StartTimecode': '00:00:00:00'
                            }
                        ],
                        'TimecodeSource': 'SPECIFIEDSTART',
                        'TimecodeStart': '00:00:00:00'
                    }
                ]
            }
            result = mediaConv.create_job(
                Role="arn:aws:iam::693949087897:role/mediaRole",
                AccelerationSettings={
                    'Mode': 'DISABLED'
                },
                StatusUpdateInterval='SECONDS_60',
                Priority=0,
                Settings=media_settings,
                Queue='arn:aws:mediaconvert:us-east-2:693949087897:queues/Default'
            )
            return result['Job']['Id']
        return false
    except Exception as err:
        print(err)
