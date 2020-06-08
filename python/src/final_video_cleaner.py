# -*- coding: utf-8 -*-
""" Final video cleaner Lambda module
Questo modulo contiene l'handler che elimina
il video montato dalla lambda mount
Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""

# imports url utils and media management layer
import json
import urllib.parse
import boto3

# Definisce la risorsa s3
s3 = boto3.client('s3')


def lambda_handler(event, context):
    """
    Handler che riceve l'evento scaturante l'esecuzione che contiene
    la key del video da eliminare e il bucket che lo contiene
    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        True se il video è stato eliminato con successo, False altrimenti

    """
    print('Executing :' + context.function_name)
    try:
        # Preleva bucket name e key da event
        bucket = 'ahlconsolebucket'
        key = json.loads(event['Cause'])['errorMessage'].lstrip('(').rstrip(')').strip('\'')
        trimmed_key = key[:-4]
        s3.delete_object(
            Bucket=bucket,
            Key=trimmed_key,
        )
        return event
    except Exception as err:
        print(err)
        print('Impossibile eliminare il video')
        return event
