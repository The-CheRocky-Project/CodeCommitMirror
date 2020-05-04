""" thumbfy Lambda module

Questo modulo contiene tutti i layer utili all'esecuzione della
AWS Serverless Lambda thumbfy

Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import urllib.parse
import media_manager as media_lib

def lambda_handler(event, context):
    """
    Handler che crea le
    thumbnail dei video carcati sul bucket
    "ahlconsolebucket" con prefisso origin
    e avvia un job su transcoder che la produce
    con Key e prefisso identici ma con suffisso aggiuntivo
    ".jpg"
    :param event: L'evento che ha fatto scaturire l'avvio dell'handler 
    :param context: Il dizionario rappresentante le variabili di contesto
        d'esecuzione
    :return: Esito dell'esecuzione
    """
    try:
        # Extract bucket and fileKey strings
        record = event['Records'][0]['s3']
        bucket = record['bucket']['name']
        key = urllib.parse.unquote_plus(record['object']['key'], encoding= 'utf-8')
        full_qualifier = bucket + '/' +key
        # creates job
        job_id = media_lib.createThumbnail(full_qualifier, full_qualifier + '.jpg', 'console_thumbnail')
        return job_id
    except Exception as e:
        print(e)
        print('Impossibile creare la thumbnail di ' + full_qualifier)
        raise e