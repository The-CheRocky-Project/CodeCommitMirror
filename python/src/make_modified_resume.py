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
import layers.elaboration

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

    data = elaboration.prepare_for_serialize(all_frames)

    s3object = s3R.Object('ahlconsolebucket', 'tmp/modified-resume.json')
    s3object.put(Body=json.dumps(data))

    # TODO decidere se ritornare e utilizzare
    # una step function oppure se usare sns
    return 'tmp/modified-resume.json'
