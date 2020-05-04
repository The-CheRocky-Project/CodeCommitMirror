""" media_manager lambda layer

Il layer media manager si occupa di wrappare tutte le richieste
di media editing come conversione video, creazione di thumbnails,
framizzazione e montaggio

Contenuto:
    * create_thumbnail - crea thumbnail a partire da video
"""

# Import boto3 sdk
import boto3 as AWS


def create_thumbnail(input_key, output_folder_key, queue):
    """Funzione che avvia un job sulla coda "queue" transcoder per creare
    una thumbnail del video di chiave s3 "input_key" che verrà salvata in
    "output_queue"
    
    Args:
        input_key: la chiave S3 del video di origine
        output_key: la chiave S3 di destinazione della thumbnail
        queue: la coda desiderata per il transcoding job

    Returns:
        il job_id del lavoro creato o false se non è stato possibile avviarlo
    """
    # le variabili di configurazione dell'ambiente
    env_settings = {
        'AccelerationSettings': {
            'Mode': 'DISABLED'
        },
        'BillingTagsSource': 'QUEUE',
        'Queue': 'arn:aws:mediaconvert:us-east-2:693949087897:queues/' + queue,
        'Role': 'arn:aws:iam::693949087897:role/mediaRole'
    }
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
    media_conv = AWS.client('mediaconvert')
    result = media_conv.create_job(
        Role= env_settings['Role'],
        Settings=  media_settings,
        AccelerationSettings= env_settings['AccelerationSettings'],
        StatusUpdateInterval= 'SECONDS_60',
        Priority= 0
    )
    return result['Job']['Id']
