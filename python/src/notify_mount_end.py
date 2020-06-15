# -*- coding: utf-8 -*-
""" notifyProgression Lambda module

Questo modulo contiene l'handler che effettua la notifica di progressione
in base agli step della state machine.
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import json
import boto3

sns = boto3.client('sns')


def lambda_handler(event, context):
    """
    Handler che riceve l'evento scaturante l'esecuzione che contiene
    la key del frame da riconoscere

    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        dizionario contenente i risultati dell'elaborazione
        della lambda precedente

    """

    try:
        output_group = event['detail']['outputGroupDetails'][0]
        video_key = output_group['outputDetails'][0]['outputFilePaths'][0]
        sns.publish(
            TopicArn='arn:aws:sns:us-east-2:693949087897:progression',
            Message="videoEndpoint",
            MessageAttributes={
                'key': {
                    'StringValue': video_key,
                    'DataType': 'String'
                }
            }
        )
    except Exception as err:
        print(err)
    return event
