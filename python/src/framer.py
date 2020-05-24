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

# le variabili di configurazione dell"ambiente
env_settings = {
    "AccelerationSettings": {
        "Mode": "DISABLED"
    },
    "BillingTagsSource": "QUEUE",
    "QueuePrefix": "arn:aws:mediaconvert:us-east-2:693949087897:queues/",
    "Role": "arn:aws:iam::693949087897:role/mediaRole"
}


def lambda_handler(event, context):
    """
    Handler che riceve l'evento scaturente l'esecuzione e che contiene
    la key del video da frammentare, i cui frmmenti mantengono il nome
    del video stesso

    Args:
        event: L"evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        true se l'avvio del job è stato effettuato correttamente, false altrimenti
    """
    print("Executing " + context.function_name)
    media_conv = boto3.client("mediaconvert",
                          endpoint_url="https://" +
                                       "fkuulejsc.mediaconvert.us-east-2.amazonaws.com")
    try:
        if event["Records"][0]["Sns"]["Message"] == "startProcess":
            bucket = event["Records"][0]["Sns"]["MessageAttributes"]["bucket"]["Value"]
            key = event["Records"][0]["Sns"]["MessageAttributes"]["key"]["Value"]
            dest_folder = "frames/"
            media_settings = {
                "OutputGroups": [
                    {
                        "Name": "frames",
                        "OutputGroupSettings": {
                            "Type": "FILE_GROUP_SETTINGS",
                            "FileGroupSettings": {
                                "Destination": "s3://" + bucket + "/" + dest_folder
                            }
                        },
                        "Outputs": [
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
                                "Extension": ".mp4",
                                "NameModifier": "-low",
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
                "Inputs": [
                    {
                        "FileInput": "s3://" + bucket + "/" + key,
                        # inserire un clipping permette di evitare di prelevare il primo frame (blackscreen)
                        "InputClippings": [
                            {
                                "StartTimecode": "00:00:00:00"
                            }
                        ],
                        "TimecodeSource": "SPECIFIEDSTART",
                        "TimecodeStart": "00:00:00:00"
                    }
                ]
            }
            # sends the request
            result = media_conv.create_job(
                Role=env_settings["Role"],
                Settings=media_settings,
                AccelerationSettings=env_settings["AccelerationSettings"],
                StatusUpdateInterval="SECONDS_60",
                Priority=0,
                Queue="arn:aws:mediaconvert:us-east-2:693949087897:queues/framer"
            )
            return result["Job"]["Id"]
        return False
    except Exception as err:
        print(err)
        raise err
