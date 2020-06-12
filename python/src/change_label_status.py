# -*- coding: utf-8 -*-
""" change_label status Lambda module

Questo modulo contiene l'handler che effettua la modifica
dello stato di una label all'interno del file resume
Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""
# imports url and media manager layer
import urllib.parse
import json
import boto3

# definizione della risorsa s3
s3 = boto3.resource('s3')
sns = boto3.client('sns')


def lambda_handler(event, context):
    """
        Handler che riceve l'evento che fa scaturire l'esecuzione,
        e che contiene l'indice della label da aggiungere

        Args:
            event: L'evento che ha fatto scaturire l'avvio dell'handler
            context: Il dizionario rappresentante le variabili di contesto
                d'esecuzione

        Returns:
            True se l'esecuzione è andata a buon fine False altrimenti

        """
    print('Executing :' + context.function_name)
    try:
        # Preleva oggetto s3 contenente il resume
        content = event["Records"][0]["Sns"]

        resume = s3.Object('ahlconsolebucket', 'tmp/modified-resume.json')
        resume_res = resume.get()
        resume_content = json.loads(resume_res['Body'].read().decode('utf-8'))

        # Controlla il contenuto del messaggio
        message = content['Message']
        if message == "checkRow" or message == "uncheckRow":
            attributes = content['MessageAttributes']
            index = int(attributes['target']['Value'])
            resume_content[index]['show'] = "true" if attributes['check']['Value'] == "True" else "false"
            b_to_write = json.dumps(resume_content)
            resume.put(Body=b_to_write)

            # notifies of addLabel done status
            result = sns.publish(
                TopicArn='arn:aws:sns:us-east-2:693949087897:editLabels',
                Message='update'
            )
            return True
        return False
    except Exception as err:
        print(err)
        print('Impossibile modificare lo stato della label ')
        raise err
