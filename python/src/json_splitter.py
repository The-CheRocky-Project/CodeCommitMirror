# -*- coding: utf-8 -*-
# TODO resource out of template (missing initial training)
"""  json_splitter Lambda module
Questo modulo contiene tutti i layer utili all'esecuzione della
AWS Serverless Lambda thumbfy

Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""

# imports url utils, json utils & boto3 sdk
import urllib.parse
import json
import boto3

s3 = boto3.resource('s3')


def lambda_handler(event, context):
    """
    Handler che spezzetta un file json identificante degli higlights
    all'interno di un video di un competizione rilevati a mano dall'utente
    in piccoli file di dettaglio di ogni singolo highlight in base alla
    classificazione

    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        string: true se lo splitting è andato a buon fine false altrimenti
    """
    print('Executing :' + context.function_name)
    try:
        # retrieves the file infos from event
        record = event['Records'][0]['s3']
        bucket = record['bucket']['name']
        key = urllib.parse.unquote_plus(record['object']['key'], encoding='utf-8')
        destination_key_prefix = 'singles/'

        # fetches the object
        origin_object = s3.Object(bucket, key)
        origin = origin_object.get()

        # deserialize the content
        reco_data = json.loads(origin['Body'].read().decode('utf-8'))
        reco_file_key = reco_data['fileKey']
        reco_list = reco_data['list']
        counter = 0
        for single_reco in reco_list:
            destination_dict = {
                'fileKey': reco_file_key,
                'bucket': bucket,
                'recognizement': single_reco
            }
            dest_object = s3.Object(bucket, destination_key_prefix +
                                    single_reco['labelIndex'] +
                                    str(counter) +
                                    reco_file_key +
                                    ".json")
            dest_dump = json.dumps(destination_dict)
            dest_object.put(Body=dest_dump)
            counter += 1
        return True
    except Exception as err:
        print(err)
        raise err
