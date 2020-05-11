# coding=utf-8
""" Thumbfy Lambda module

Questo modulo contiene tutti i layer utili all'esecuzione della
AWS Serverless Lambda thumbfy

Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import urllib.parse
from src.layers import media_manager


def lambda_handler(event, context):
    """
    Handler che crea le
    thumbnail dei video caricati sul bucket
    "ahlconsolebucket" con prefisso origin
    e avvia un job su transcoder che la produce
    con Key e prefisso identici ma con suffisso aggiuntivo
    ".jpg"

    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        string: job_id del lavoro avviato in Media Convert oppure false
    """
    print('Executing :' + context['function_name'])
    try:
        # Extract bucket and fileKey strings
        record = event['Records'][0]['s3']
        bucket = record['bucket']['name']
        key = urllib.parse.unquote_plus(record['object']['key'], encoding='utf-8')
        full_qualifier = 's3://' + bucket + '/' + key
        # creates job
        job_id = media_manager.create_thumbnail(
            full_qualifier,
            full_qualifier + '.jpg',
            'console_thumbnail')
        return job_id
    except Exception as err:
        print(err)
        print('Impossibile creare la thumbnail di ' + full_qualifier)
        raise err
