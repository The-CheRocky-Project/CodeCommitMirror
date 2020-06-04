# -*- coding: utf-8 -*-
"""
Key thumb transformer
Questo modulo contiene le funzioni per eseguire la lambda key thumb transformer

Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""

import urllib.parse


def lambda_handler(event, context):
    """
    Handler che prende l'evento in input
    trasforma la key per passarlo al remover
    Args:
        event (object): evento che ha scaturito l'esecuzione
        context: dizionario rappresentante il contesto di esecuzione

    Returns:
        event: evento di input per la lambda remover
    """
    print("Executing " + context.function_name)
    record = event['Records'][0]['s3']
    key = urllib.parse.unquote_plus(
        record['object']['key'],
        encoding='utf-8'
    )
    event['Records'][0]['s3']['object']['key'] = key.replace(
        ".mp4",
        "0000000.jpg"
    ).replace(
        "origin/",
        "thumbnails/"
    )
    return event
