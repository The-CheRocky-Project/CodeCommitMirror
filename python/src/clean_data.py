# coding=utf-8
"""clean_data lambda module
Questo modulo contiene tutti i metodi utili all'esecuzione della
AWS Serverless Lambda clean_data

Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""
import json
import boto3

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
    bucket = "ahlconsolebucket"
    dest_folder = "frames/"

    # fetches data from s3
    img_list = s3_cli.list_objects_v2(
        Bucket=bucket,
        Prefix=dest_folder
    )

    """
        sub-dimensioned key data that permits to perform packaged
        parallel executions
        """
    key = img_list['Contents'][1]['Key']
    splitted = key.split('.')

    # removes extension and framenumber
    frame = ''
    for i in range(len(splitted) - 2):
        frame = frame + splitted[i] + '.'
    frame = frame[:-1]

    # Creates the items that are going to be inserted in DynamoDB
    frames = []
    table = dynamo_res.Table('rekognitions')
    for i in range(1, len(img_list['Contents'])):
        key = img_list['Contents'][i]['Key']
        splitted = key.split('/')
        frame = splitted[len(splitted) - 1]
        splitted = frame.split('.')
        number = splitted[len(splitted) - 2]
        insertion = table.put_item(
            Item={
                'frame_key': img_list['Contents'][i]['Key'],
                'tfs': 500 * int(number)
            }
        )

    # TODO remove from and put a decreasing count instead of to
    remaining_insertions = {
        'key': frame,
        'from': 0,
        'to': len(img_list['Contents']) - 1,
        'detail': {
            'items': []
        },
        'continue': "false"
    }

    return remaining_insertions