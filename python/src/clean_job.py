# -*- coding: utf-8 -*-
""" cleanJobs Lambda module

Questo modulo contiene l'handler che avvia la state machine per eliminare un lavoro in corso
Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""
import urllib.parse
import json
import boto3
from layers import elaboration

# definizione della risorsa s3
s3 = boto3.resource('s3')


def lambda_handler(event, context):
    """
        Handler che recupera la chiave in lavorazione e ripulisce tutto il
        sistema dai files generati

        Args:
            event: L'evento che ha fatto scaturire l'avvio dell'handler
            context: Il dizionario rappresentante le variabili di contesto
                d'esecuzione

        Returns:
            True se l'aggiunta è andata a buon fine, False altrimenti

        """
    print('Executing :' + context.function_name)
    sns = boto3.client('sns')
    try:
        content = event["Records"][0]["Sns"]

        resume = s3.Object('ahlconsolebucket', 'tmp/modified-resume.json')
        resume_res = resume.get()
        resume_content = json.loads(resume_res['Body'].read().decode('utf-8'))
        index = 0
        while index < len(resume_content) and resume_content[index]['frame_key'] == '':
            index += 1
        eof = index == len(resume_content)
        if not eof:
            raise elaboration.VideoCreationError(resume_content[index]['frame_key'])
    except Exception as err:
        print(err)
        raise err
