# -*- coding: utf-8 -*-
""" Mount Lambda module

Questo modulo contiene l'handler che effettua il motaggio di un video
a partire dalle parti indicate nel file resume.json
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import json
import boto3
from layers import media_manager

# Definisce la risorsa s3
s3R = boto3.resource('s3')
sns = boto3.client('sns')


def lambda_handler(event, context):
    """
    Handler che riceve l'evento scaturante l'esecuzione che contiene
    la key del file di riassunto formattato json contenente tutti i
    dati degli spezzoni che vanno montati in un unico video il nome
    del file originale
    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        id del job Elemental Media Convert oppure, False altrimenti

    """
    print('Executing :' + context.function_name)
    video_key = ''
    try:
        key = event['key']

        resume_json = s3R.Object('ahlconsolebucket', key)
        resume_res = resume_json.get()
        all_frames = json.loads(resume_res['Body'].read().decode('utf-8'))

        details_array = []
        first_start = ""
        first = False

        for i in range(len(all_frames) - 1):
            if all_frames[i]['show'] == "true":
                start_seconds = round(
                    (int(all_frames[i]['start']) / 1000) % 60
                )
                start_minute = round((int(all_frames[i]['start']) / 1000) / 60)
                start_hours = round(start_minute / 60)
                end_seconds = round((int(all_frames[i]['tfs']) / 1000) % 60)
                end_minute = round((int(all_frames[i]['tfs']) / 1000) / 60)
                end_hours = round(end_minute / 60)
                s = (
                        str(start_hours).zfill(2) +
                        ":" + str(start_minute).zfill(2) +
                        ":" + str(start_seconds).zfill(2) +
                        ":00"
                )
                e = (
                        str(end_hours).zfill(2) +
                        ":" + str(end_minute).zfill(2) +
                        ":" + str(end_seconds).zfill(2) +
                        ":00"
                )
                if not first:
                    first_start = (
                            str(start_hours).zfill(2) +
                            ":" + str(start_minute).zfill(2) +
                            ":" + str(start_seconds).zfill(2) +
                            ":00"
                    )
                    details_array.append({
                        'EndTimecode': e
                    })
                    first = True
                else:
                    details_array.append({
                        'EndTimecode': e,
                        'StartTimecode': s
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
        sns.publish(
            TopicArn='arn:aws:sns:us-east-2:693949087897:progression',
            Message="{ \"progression\": 100 }")
        return job_id
    except Exception as err:
        print(err)
        print('Impossibile creare il video')
        raise VideoCreationError('ahlconsolebucket', 'modify/' + video_key)


class VideoCreationError(Exception):
    """
    An error class containing information about the video bucket and key
    that are causing the error
    """
    key: str
    bucket: str

    def __init__(self, bucket: str, key: str):
        """
        Constructor
        :param key: the filekey that causes the error
        :param bucket: the bucket where the file is contained
        """
        self.key = key
        self.bucket = bucket
