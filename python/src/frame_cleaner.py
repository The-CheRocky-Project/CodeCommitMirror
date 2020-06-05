# -*- coding: utf-8 -*-
"""  json_splitter Lambda module
Questo modulo elimina tutti i frames inerenti al video in ingresso

Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""

import boto3

s3 = boto3.client('s3')


def lambda_handler(event, context):
    """
    Handler che elimina i frames relativi al video in ingresso

    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        string: true se l'eliminazione è andata a buon fine false altrimenti
    """
    print('Executing :' + context.function_name)
    try:
        bucket = 'ahlconsolebucket'
        key = event["Records"][0]["Sns"]["MessageAttributes"]["key"]["Value"]
        key = key[:-4]

        isTrunc = True
        while isTrunc:
            response = s3.list_objects(Bucket=bucket, Prefix='frames/' + key)
            isTrunc = response['IsTruncated']
            keys_to_delete = [{'Key': obj['Key']} for obj in response["Contents"]]
            s3.delete_objects(
                Bucket=bucket,
                Delete={
                    'Objects': keys_to_delete
                }
            )
        return True
    except Exception as err:
        print(err)
        return False
