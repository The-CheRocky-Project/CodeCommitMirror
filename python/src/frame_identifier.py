""" frame_identifier Lambda module

Questo modulo contiene l'handler che effettua la richiesta di riconoscimento
di un frame utilizzando l'endpoint di Sage Maker e provvede al salvataggio
dei risultati all'interno di Dynamo DB
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import json
import os
import urllib.parse
import boto3
from layers import media_manager

# Definisce la risorsa s3
s3 = boto3.resource('s3')
ENDPOINT_NAME = os.environ['ENDPOINT_NAME']



def lambda_handler(event, context):
    """
    Handler che riceve l'evento scaturante l'esecuzione che contiene
    la key del frame da riconoscere

    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        id del job di inserimento in Dynamo DB oppure, False altrimenti

    """
    print('Executing :' + context.function_name)
    try:
        # Preleva bucket name e key da event
        record = event['Records'][0]['s3']
        bucket = record['bucket']['name']
        key = urllib.parse.unquote_plus(record['object']['key'], encoding='utf-8')
        full_qualifier = 's3://' + bucket + '/' + key
        # ottenimento frame
        image = s3.Object(bucket, key)
        image_get = image.get()
        payload = bytearray(image_get['Body'].read())
        #use endpoint
        result = media_manager.get_frame_details(ENDPOINT_NAME, payload)
        label_json = s3.Object(bucket, '/utils/label.json')
        labelres = label_json.get()
        label_content = json.loads(labelres['Body'].read().decode('utf-8'))
        label = label_content['labels'][result['index']]

        splitted = key.split('/')
        newkey = splitted[len(splitted)-1]

        job_id = media_manager.dynamo_insertion(result, label, newkey)
        return job_id
    except Exception as err:
        print(err)
        print('Impossibile effettuare il riconoscimento del frame ' + full_qualifier)
        raise err
