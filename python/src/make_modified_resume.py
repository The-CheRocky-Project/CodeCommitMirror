""" make_modified_resume Lambda module

Questo modulo contiene l'handler che effettua la creazione del
file modified_resume.json, contenente i dati delle label modificati
dall'utente e ricevuti tramite sns
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""
# TODO resource out of template (@GGotta, va tolta?)
# imports url utils and media management layer
import json
import boto3
from layers import elaboration

# Definisce la risorsa s3
s3R = boto3.resource('s3')


def lambda_handler(event, context):
    """
    Handler che riceve l'evento scaturante l'esecuzione che contiene
    la key del frame da riconoscere

    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        dizionario contenente i risultati dell'elaborazione

    """

    sns = boto3.client('sns')
    s3object = s3R.Object('ahlconsolebucket', 'tmp/modified-resume.json')
    origin = s3R.Object('ahlconsolebucket', 'tmp/resume.json')
    get_res = origin.get();
    body = get_res['Body']
    content = body.read()
    s3object.put(Body=content)
    sns.publish(
        TopicArn='arn:aws:sns:us-east-2:693949087897:progression',
        Message="{ \"progression\": 100 }")
    return '{key: "tmp/modified-resume.json"}'
