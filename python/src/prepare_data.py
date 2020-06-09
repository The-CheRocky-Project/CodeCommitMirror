# coding=utf-8
"""prepare_data lambda module
Questo modulo contiene tutti i metodi utili all'esecuzione della
AWS Serverless Lambda clean_data

Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""
import json
import boto3
from layers.elaboration import VideoCreationError

s3_cli = boto3.client('s3')
dynamo_res = boto3.resource('dynamodb')


def lambda_handler(event, context):
    """
    Handler che crea la tabella su DynamoDB e prepara i dati per l'esecuzione
    della Step Function
    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        dict: I dati utili all'esecuzione della Step Function State Machine
    """
    print('Executing ' + context.function_name)
    output_group = event['detail']['outputGroupDetails'][0]
    last_processed = output_group['outputDetails'][0]['outputFilePaths'][0]
    splitted = last_processed.split('.')
    string_frame_number = splitted[-2]
    frame_number = int(string_frame_number)
    try:
        # removes s3 prefix
        key_array = last_processed.split('/')[3:]
        key = key_array[0]
        for i in range(1, len(key_array)):
            key += '/' + key_array[i]

        splitted = key.split('.')
        # removes extension and framenumber
        key_prefix = ''
        for i in range(len(splitted) - 2):
            key_prefix = key_prefix + splitted[i] + '.'
        key_prefix = key_prefix[:-1]

        # Creates the items that are going to be inserted in DynamoDB
        table = dynamo_res.Table('rekognitions')
        for i in range(frame_number):
            table.put_item(
                Item={
                    'frame_key': key_prefix + '.' + f"{i:07d}" + '.jpg',
                    'tfs': 250 * i
                }
            )

        # TODO remove from and put a decreasing count instead of to
        remaining_insertions = {
            'key': key_prefix,
            'from': 0,
            'to': frame_number,
            'detail': {
                'items': []
            },
            'continue': False
        }

        return remaining_insertions
    except Exception as err:
        print(err)
        raise VideoCreationError(key_prefix.replace('frames/', ''))
