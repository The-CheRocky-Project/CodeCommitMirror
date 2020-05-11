# -*- coding: utf-8 -*-
""" Framer Lambda module

Questo modulo contiene l'handler che effettua la frammentazione di un video in input
a seconda della sua durata
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url and media manager layer
import urllib.parse
import boto3
import media_manager
from moviepy.editor import VideoFileClip

# definizione della risorsa s3
s3 = boto3.resource('s3')


def lambda_handler(event, context):
    """
        Handler che riceve l'evento scaturante l'esecuzione che contiene
        la key del video da frammentare, i cui frmmenti mantengono il nome
        del video stesso

        Args:
            event: L'evento che ha fatto scaturire l'avvio dell'handler
            context: Il dizionario rappresentante le variabili di contesto
                d'esecuzione

        Returns:
            id del job Elemental Media Convert oppure, False altrimenti

        """
    print('Executing :' + context['function_name'])
    try:
        # Preleva bucket name e key da event
        record = event['Records'][0]['s3']
        bucket = record['bucket']['name']
        key = urllib.parse.unquote_plus(record['object']['key'], encoding='utf-8')
        full_qualifier = 's3://' + bucket + '/' + key
        # ottenimento durata video
        # TODO da verificare che funzioni
        video = s3.Object(bucket, 'resume.json')
        videoget = video.get()
        clip = VideoFileClip(videoget)
        duration = clip.duration
        # avvio job di creazione frame
        job_id = media_manager.frame(full_qualifier, duration, 'console_mount')
        return job_id
    except Exception as err:
        print(err)
        print('Impossibile frammentare il video di ' + full_qualifier)
        raise err
