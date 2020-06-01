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

    key = event['key']

    resumeJson = s3R.Object('ahlconsolebucket', key)
    resumeRes = resumeJson.get()
    all_frames = json.loads(resumeRes['Body'].read().decode('utf-8'))


    all_frames = elaboration.remove(remove_useless(all_frames), all_frames)
    while elaboration.check_time(all_frames) == False:
        all_frames = elaboration.remove(elaboration.prioritize(all_frames), all_frames)

    # Serializzazione in JSON
    data = elaboration.(all_frames)

    s3object = s3R.Object('ahlconsolebucket', 'tmp/resume.json')
    s3object.put(Body=json.dumps(data))

    if len(data) !=0:
        return all_frames
    else
        return False

