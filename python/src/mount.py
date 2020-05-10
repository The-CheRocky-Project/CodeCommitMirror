# -*- coding: utf-8 -*-
""" Mount Lambda module

Questo modulo contiene l'handler che effettua il motaggio di un video
a partire dalle parti indicate nel file resume.json
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import json
import urllib.parse
import boto3
import media_manager

# Definisce la risorsa s3
s3 = boto3.resource('s3')

def lambda_handler(event, context):
    """
    Handler che riceve l'evento scaturante l'esecuzione che contiene
    la key del file di riassunto formattato json contenente tutti i 
    dati degli spezzoni che vanno montati in un unico video il nome
    del file originale 
    
    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        id del job Elemental Media Convert oppure, False altrimenti

    """
    try:
        # Preleva bucket name e key da event
        record = event['Records'][0]['s3']
        bucket = record['bucket']['name']
        key = urllib.parse.unquote_plus(record['object']['key'], encoding='utf-8')
        full_qualifier = 's3://' + bucket + '/' + key
        #ottenimento resume file
        resumejson = s3.Object(bucket, 'resume.json')
        resume = resumejson.get()
        resumecontent = json.loads(resume['Body'].read().decode('utf-8'))
        #avvio job di creazione video
        job_id = media_manager.mount(full_qualifier, resumecontent,'console_mount')
        return job_id
    except Exception as e:
        print(e)
        print('Impossibile creare il video di ' + full_qualifier)
        raise e
