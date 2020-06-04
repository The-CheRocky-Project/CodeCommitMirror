# -*- coding: utf-8 -*-
""" Remover Lambda module

Questo modulo contiene l'handler che elimina un particolare
file
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import urllib.parse
import boto3

# Definisce il client s3
s3 = boto3.client('s3')


def lambda_handler(event, context):
    """
        Handler che, ricevuto un evento s3,
        elimina l'oggetto che lo ha fatto scaturire

    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        bool: True se la rimozione è andata a buon fine False altrimenti
    """
    try:
        print('Executing :' + context.function_name)
        # Preleva bucket name e key da event
        record = event['Records'][0]['s3']
        bucket = record['bucket']['name']
        key = urllib.parse.unquote_plus(
            record['object']['key'],
            encoding='utf-8')

        # call the remove via boto
        s3.delete_object(Bucket=bucket, Key=key)
        return True
    except Exception as err:
        print(err)
        return False
