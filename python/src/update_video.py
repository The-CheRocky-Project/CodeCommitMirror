# -*- coding: utf-8 -*-
""" update_video Lambda module

Questo modulo contiene l'handler che effettua il motaggio di un video
a partire dalle parti indicate nel file resume.json
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import json
import boto3
import urllib
from layers import media_manager
from layers import elaboration

# Definisce la risorsa s3
s3R = boto3.resource('s3')


def lambda_handler(event, context):
    """
    Handler che riceve l'evento scaturante l'esecuzione contenente informazioni
     riguardo alla modifica del file di riassunto formattato json contenente tutti i
    dati degli spezzoni che vanno montati in un unico video il nome
    del file originale
    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        id del job Elemental Media Convert, False altrimenti

    """
    print('Executing :' + context.function_name)
    video_key = "resume"
    try:
        record = event['Records'][0]['s3']
        bucket = record['bucket']['name']
        key = urllib.parse.unquote_plus(record['object']['key'], encoding='utf-8')

        resume_json = s3R.Object(bucket, key)
        resume_res = resume_json.get()
        all_frames = json.loads(resume_res['Body'].read().decode('utf-8'))

        details_array = []
        first_start = "00:00:00:00"

        for i in range(len(all_frames) - 1):
            if all_frames[i]['show'] == "true":
                print("Record " + str(i))
                start = int(all_frames[i]['start'])
                start_ms = int(start % 1000)
                rest = int((start - start_ms) / 1000)
                start_seconds = int((rest % 60))
                rest = int((rest - start_seconds) / 60)
                start_minute = int(rest % 60)
                start_hours = int((rest - start_minute) / 60)
                end = int(all_frames[i]['tfs']) + int(all_frames[i]['start'])
                print(end)
                duration = int(all_frames[i]['tfs'])
                end = start + duration
                end_ms = int(end % 1000)
                rest = int((end - end_ms) / 1000)
                end_seconds = int((rest % 60))
                rest = int((rest - end_seconds) / 60)
                end_minute = int(rest % 60)
                end_hours = int((rest - end_minute) / 60)

                s = (
                        str(start_hours).zfill(2) +
                        ":" + str(start_minute).zfill(2) +
                        ":" + str(start_seconds).zfill(2) +
                        ":00"
                )
                print(s)
                e = (
                        str(end_hours).zfill(2) +
                        ":" + str(end_minute).zfill(2) +
                        ":" + str(end_seconds).zfill(2) +
                        ":00"
                )
                print(e)
                details_array.append({
                    'StartTimecode': s,
                    'EndTimecode': e
                })

        splitted = all_frames[0]['frame_key'].split('/')
        name = splitted[-1]
        splitted = name.split('.')
        video_key = splitted[-3]

        input_file_key = 's3://ahlconsolebucket/origin/' + video_key + '.mp4'
        destination_key = "s3://ahlconsolebucket/modify/" + video_key
        # avvio job di creazione video
        job_id = media_manager.mount(
            input_file_key,
            destination_key,
            details_array,
            first_start,
            'videoMount'
        )
        return job_id
    except Exception as err:
        print(err)
        print('Impossibile creare il video')
        raise elaboration.VideoCreationError(video_key)
