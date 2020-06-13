""" checkNprioritize Lambda module

Questo modulo contiene l'handler che controlla il limite di 5 minuti e se è
stato superato, rimuove un ritaglio per volta partendo dalla priorità più
bassa, fino a quando non si rientra nel range.
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import json
import boto3
from src.layers import elaboration

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

    key = event['key']

    resume_json = s3R.Object('ahlconsolebucket', key)
    resume_res = resume_json.get()
    all_frames = json.loads(resume_res['Body'].read().decode('utf-8'))

    all_frames = elaboration.remove(
        elaboration.remove_useless(all_frames),
        all_frames)
    while not elaboration.check_time(all_frames):
        all_frames = elaboration.remove(
            elaboration.prioritize(all_frames),
            all_frames)

    # Serializzazione in JSON
    data = elaboration.prepare_for_serialize(all_frames)

    file_param = {
        'key': 'tmp/resume.json'
    }
    s3object = s3R.Object('ahlconsolebucket', file_param['key'])
    s3object.put(Body=json.dumps(data))
    return file_param if len(data) != 0 else False
