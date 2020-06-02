""" make_training_resume Lambda module

Questo modulo contiene l'handler che effettua la creazione del
file modified_resume.json, contenente i dati delle label modificati
dall'utente e ricevuti tramite sns
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
    all_frames = event['Records'][0]['Sns']['MessageAttributes']['elements']

    if not elaboration.check_time(all_frames):
        return False

    uman_frames =[]

    for i in range(len(all_frames)-1):
        if all_frames[i]['type'] == "uman" and all_frames[i]['show'] == "true":
            uman_frames.append(all_frames[i])

    data = elaboration.prepare_for_serialize(uman_frames)

    s3object = s3R.Object('ahlconsolebucket', 'tmp/training-resume.json');
    s3object.put(Body=json.dumps(data));

    #TODO decidere se ritornare e utilizzare una step function oppure se usare sns
    return 'tmp/modified-resume.json'

