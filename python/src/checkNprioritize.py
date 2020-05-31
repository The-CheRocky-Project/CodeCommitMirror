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
from python.src.layers import elaboration

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

    all_frames = event['Response']

    all_frames = remove(remove_useless(all_frames), all_frames)
    while (check_time(all_frames) == False):
        all_frames = remove(prioritize(all_frames), all_frames)

    # Serializzazione in JSON
    data = prepare_for_serialize(all_frames)

    s3object = s3R.Object('ahlconsolebucket', 'tmp/resume.json')
    s3object.put(Body=json.dumps(data))

    #TODO aggiustare logica di ritorno secondo le esigenze
    return all_frames

