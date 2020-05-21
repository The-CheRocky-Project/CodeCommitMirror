# -*- coding: utf-8 -*-
""" label_individuator module
Questo modulo contiene l'handler che effettua l'analisi dei dati raccolti
nel database ed individua degli intervalli contenenti le label
Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""

import json
import boto3

dynamo = boto3.resource('dynamoDB')


def lambda_handler(event, context):
    """
    Handler che riceve l'evento scaturente l'esecuzione ovvero la key per
    ottenere i files dal database
    Args:
        event: L"evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        void TODO
    """
    print('Executing ' + context['function_name'])
    source_key = event['key']
    split_key = source_key.split('.')
    trunc_key = split_key[:-1]
    request_param = {
        TableName: 'recognitions',
        KeyConditionExpression: 'contains(stored_key, source_key)',
        ExpressionAttributeNames: {
            'stored_key': frame_key
        },
        ExpressionAttributeValues: {
            'source_key': trunc_key
        }
    }
    try:
        result = dynamo.query(request_param)
        print(result)
    except Exception as err:
        print(err)
        raise err
