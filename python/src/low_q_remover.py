# -*- coding: utf-8 -*-
""" Low Quality Remover Lambda module

Questo modulo contiene l'handler che elimina un particolare
video in bassa qualità che è stato inserito su un bucket s3
per vincoli di plug-in
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import urllib.parse
import boto3

# Definisce il client s3
s3 = boto3.client('s3')


def lambda_handler(event, context):
    """
        Handler che, analizza la key del file che ha fatto scaturire l'evento e,
        ogniqualvolta viene caricato sul bucket ahlconsolebucket un file
        con prefisso "origin/" e suffisso "-low.mp4", lo elimina

    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        bool: True se la rimozione è andata a buon fine False altrimenti
    """

    # Preleva bucket name e key da event
    record = event['Records'][0]['s3']
    bucket = record['bucket']['name']
    key = urllib.parse.unquote_plus(record['object']['key'], encoding='utf-8')

    # Controlla se il video è un .mp4 con suffisso "-low"
    if (key[-4:] == '.mp4') & (key[-8:-4] == '-low'):
        s3.delete_object(Bucket=bucket, Key=key)
        return True
    return False
