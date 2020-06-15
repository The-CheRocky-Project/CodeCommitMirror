# coding=utf-8
""" recognize Lambda module
Questo modulo contiene tutte le fuzioni utili
all'esecuzione della serverless Lambda recognize

Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""
import json
import os
import boto3
import decimal
import layers.elaboration

s3R = boto3.resource('s3')
dynamoR = boto3.resource('dynamodb')
ENDPOINT_NAME = os.environ['ENDPOINT_NAME']


def lambda_handler(event, context):
    """
    Handler che tramite l'endpoint sagemaker, registra e
    immagazzina in DynamoDB i dati sui riconoscimenti
    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        dict: I dati utili all'esecuzione
                del successivo step della State Machine
    """
    print('Executiong ' + context.function_name)
    folder = 'frames'
    bucket = 'ahlconsolebucket'
    basekey = event['key']
    tableName = 'rekognitions'
    runtime = boto3.client('runtime.sagemaker')
    try:

        formatted = f"{int(str(event['n'])):07d}"

        key = folder + '/' + basekey + '.' + formatted + '.jpg'

        image = s3R.Object(bucket, key)
        imageGet = image.get()
        payload = bytearray(imageGet['Body'].read())

        response = runtime.invoke_endpoint(EndpointName=ENDPOINT_NAME,
                                           ContentType='application/x-image',
                                           Body=payload)
        result = json.loads(response['Body'].read().decode())

        for i in range(len(result)):
            text = f"{result[i]:.6f}"
            result[i] = decimal.Decimal(text)

        table = dynamoR.Table(tableName)

        response = table.get_item(
            Key={
                'frame_key': key
            }
        )
        item = response['Item']

        # update
        for i in range(len(result)):
            item[str(i)] = (result[i])

        # put (idempotent)
        table.put_item(Item=item)

        outForPut = {
            'succeded': True,
        }

        return outForPut
    except Exception as err:
        print(err)
        raise elaboration.VideoCreationError(event['key'])
