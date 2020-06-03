# -*- coding: utf-8 -*-
""" Mount Lambda module

Questo modulo contiene l'handler che elimina il json tmp/resume.json
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
    Handler che riceve l'evento scaturante l'esecuzione
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
        key = 'tmp/resume.json'
        s3.delete_object(
            Bucket=bucket,
            Key=key,
        )
        return True
    except Exception as err:
        print(err)
        print('Impossibile eliminare il file resume.json')
        return False
