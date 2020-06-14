# -*- coding: utf-8 -*-
""" labelReset Lambda module

Questo modulo contiene l'handler che effettua il reset del file dei riconoscimenti
Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""
import urllib.parse
import json
import boto3

# definizione della risorsa s3
s3 = boto3.resource('s3')


def lambda_handler(event, context):
    """
        Handler che riceve l'evento che fa scaturire l'esecuzione,
        e che contiene l'indice della label da modificare

        Args:
            event: L'evento che ha fatto scaturire l'avvio dell'handler
            context: Il dizionario rappresentante le variabili di contesto
                d'esecuzione

        Returns:
            True se la modifica è andata a buon fine, False altrimenti

        """
    print('Executing :' + context.function_name)
    sns = boto3.client('sns')
    try:
        content = event["Records"][0]["Sns"]

        new_resume = s3.Object('ahlconsolebucket', 'tmp/resume.json')
        old_resume = s3.Object('ahlconsolebucket', 'tmp/modified-resume.json')
        resume_res = new_resume.get()
        resume_content = resume_res['Body'].read()

        message = content['Message']
        if message == "reset":
            old_resume.put(Body=resume_content)

            # notifies of addLabel done status
            sns.publish(
                TopicArn='arn:aws:sns:us-east-2:693949087897:editLabels',
                Message='update'
            )
            return True
        return False
    except Exception as err:
        print(err)
        print('Impossibile aggiungere la label ')
        raise err
