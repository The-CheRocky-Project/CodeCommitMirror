# -*- coding: utf-8 -*-
""" Mount Lambda module

Questo modulo contiene l'handler che elimina il video montato dalla lambda mount
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import json
# import urllib.parse
# import boto3
# from layers import media_manager

#Definisce la risorsa s3
import boto3
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb')

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
        # Prendo la tabella in base al nome
        key = event["Records"][0]["Sns"]["MessageAttributes"]["key"]["Value"]
        key = key[:-4]

        table = dynamodb.Table('rekognitions')

        response = table.scan(
            FilterExpression=Attr('frame_key').contains(key)
        )
        items = response['Items']
        print(len(items))
        
        for single_item in items:
            table.delete_item(Key=single_item)

        return True
    except Exception as err:
        print(err)
        print('Impossibile eliminare i records')
        return False