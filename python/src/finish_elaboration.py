# -*- coding: utf-8 -*-
""" finish_elaboration Lambda module

Questo modulo contiene l'handler che effettua la copia del video in seguito
alla conferma dell'utente
Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""
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
            True se la copia è andata a buon fine, False altrimenti

        """
    print('Executing :' + context.function_name)
    sns = boto3.client('sns')
    try:
        content = event["Records"][0]["Sns"]
        message = content['Message']

        if message == "confirmTable":
            attributes = content['MessageAttributes']
            key = attributes['key']['Value']
            origin = s3.Object('ahlconsolebucket', 'modify/' + key)
            destination = s3.Object('ahlconsolebucket', 'origin/' + key)
            origin_res = origin.get()
            origin_body = origin_res['Body'].read()
            destination.put(Body=origin_body)

            # notifies of addLabel done status
            sns.publish(
                TopicArn='arn:aws:sns:us-east-2:693949087897:confirmation',
                Message='finish'
            )
            return True
        return False
    except Exception as err:
        print(err)
        print('Impossibile copiare il video')
        raise err
