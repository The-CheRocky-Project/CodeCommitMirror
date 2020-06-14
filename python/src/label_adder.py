# -*- coding: utf-8 -*-
""" labelAdder Lambda module

Questo modulo contiene l'handler che effettua l'aggiunta di una label
individuata dal modello di ML o indicata dall'utente
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
        e che contiene l'indice della label da aggiungere

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

        message = content['Message']
        if message == "addRow":
            print("entra dentro l'if")
            attributes = content['MessageAttributes']
            start = int(attributes['start']['Value'])
            duration = int(attributes['duration']['Value'])
            label = int(attributes['label']['Value'])
            index = 0
            while index < len(resume_content) and int(resume_content[index]['start']) <= start:
                index += 1
            resume_content.insert(index, {
                'frame_key': '',
                'accuracy': '0.0',
                'label': label,
                'start': start,
                'tfs': duration,
                'type': 'user',
                'show': 'true'
            })
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
        print('Impossibile aggiungere la label ')
        raise err
