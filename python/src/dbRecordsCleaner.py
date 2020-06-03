# -*- coding: utf-8 -*-
""" Mount Lambda module

Questo modulo contiene l'handler che elimina il video montato dalla lambda mount
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
# import json
# import urllib.parse
# import boto3
# from layers import media_manager

# # Definisce la risorsa s3
# dynamo = boto3.client('dynamodb')

# def lambda_handler(event, context):
#     """
#     Handler che riceve l'evento scaturante l'esecuzione che contiene
#     la key del video da eliminare e il bucket che lo contiene
#     Args:
#         event: L'evento che ha fatto scaturire l'avvio dell'handler
#         context: Il dizionario rappresentante le variabili di contesto
#             d'esecuzione

#     Returns:
#         True se il video è stato eliminato con successo, False altrimenti

#     """
#     print('Executing :' + context.function_name)
#     try:
#         # Preleva bucket name e key da event
#         bucket = event["Records"][0]["Sns"]["MessageAttributes"]["bucket"]["Value"]
#         key = event["Records"][0]["Sns"]["MessageAttributes"]["key"]["Value"]
#         dynamo.query(TableName='frame_rekognitions')

#         return True
#     except Exception as err:
#         print(err)
#         print('Impossibile eliminare il video')
#         return False


import boto3
from boto3.dynamodb.conditions import Key, Attr

# Get the service resource.
dynamodb = boto3.resource('dynamodb')

# Prendo la tabella in base al nome
table = dynamodb.Table('rekognitions')

response = table.scan(
    FilterExpression=Attr('frame_key').contains('metaxas-keller-Bell-1')
)
items = response['Items']
print(len(items))
for single_item in items:
    print(single_item["frame_key"])
