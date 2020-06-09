# -*- coding: utf-8 -*-
""" Mount Lambda module
Questo modulo contiene l'handler che pulisce i records
creati su DynamoDB da frame_identifier
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

import json
import boto3
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    """
    Handler che riceve l'evento scaturante l'esecuzione che contiene
    la key del video eliminato ed elimina i corrispondenti records
    presenti nella tabella rekognitions e contenenti come parte della
    primary key il nome del video eliminato.
    N.B: La lambda NON verifica che ad esempio se si vogliono cancellare
    i records di una partita che si chiama roma, non vengano cancellat
    anche i records di un'altra partita che chiama roma-fiorentina. Tiene
    in conto che i nomi delle partite siano abbastanza identificativi.

    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        True se i records sono stati eliminati con successo, False altrimenti
    """
    print('Executing :' + context.function_name)
    try:
        # Prendo la tabella in base al nome
        key = json.loads(event['Cause'])['errorMessage'].lstrip('(').rstrip(')').strip('\'')

        table = dynamodb.Table('rekognitions')

        response = table.scan(
            FilterExpression=Attr('frame_key').contains(key)
        )
        items = response['Items']

        for single_item in items:
            table.delete_item(Key=single_item)

        return event
    except Exception as err:
        print(err)
        print('Impossibile eliminare i records')
        return False
