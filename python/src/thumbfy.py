# coding=utf-8
""" Thumbfy Lambda module

Questo modulo contiene tutti i metodi utili all'esecuzione della
AWS Serverless Lambda thumbfy

Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import urllib.parse
import boto3

s3 = boto3.resource('s3')
media_conv = boto3.client('mediaconvert',
                          endpoint_url='https://' +
                                       'fkuulejsc.mediaconvert.us-east-2.amazonaws.com')
# le variabili di configurazione dell'ambiente
env_settings = {
    'AccelerationSettings': {
        'Mode': 'DISABLED'
    },
    'BillingTagsSource': 'QUEUE',
    'QueuePrefix': "arn:aws:mediaconvert:us-east-2:693949087897:queues/",
    'Role': "arn:aws:iam::693949087897:role/mediaRole"
}


def lambda_handler(event, context):
    """
    Handler che crea le
    thumbnail dei video caricati sul bucket
    "ahlconsolebucket" con prefisso origin
    e avvia un job su transcoder che crea le thumbnail nella cartella
    "thumbnails"

    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        string: job_id del lavoro avviato in Media Convert oppure false
    """
    # Extract bucket and fileKey strings
    record = event['Records'][0]['s3']
    bucket = record['bucket']['name']
    key = urllib.parse.unquote_plus(record['object']['key'], encoding='utf-8')
    print('Executing :' + context.function_name + ' on ' + key)
    full_qualifier = 's3://' + bucket + '/' + key
    try:
        # sets up the job configuration
        media_settings = {
            'OutputGroups': [
                {
                    "Name": "thumb",
                    "OutputGroupSettings": {
                        "Type": "FILE_GROUP_SETTINGS",
                        "FileGroupSettings": {
                            "Destination": "thumbnails"
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
                    'FileInput': full_qualifier,
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
        result = media_conv.create_job(
            Role=env_settings['Role'],
            Settings=media_settings,
            AccelerationSettings=env_settings['AccelerationSettings'],
            StatusUpdateInterval='SECONDS_60',
            Priority=0,
            Queue=env_settings["QueuePrefix" + "Default"]
        )
        job_id = result['Job']['Id']
        return job_id if job_id else False
    except Exception as err:
        print(err)
        print('Impossibile creare la thumbnail di ' + full_qualifier)
        raise err
