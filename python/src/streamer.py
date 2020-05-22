""" Streamer Lambda module (NOT TO TEST!!!)

Questo modulo contiene l'handler che effettua la creazione della notifica
di pubblicazione del video appena creato
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import urllib.parse
import boto3

# Definisce la risorsa s3
s3 = boto3.resource('s3')
sns = boto3.client('sns')


def lambda_handler(event, context):
    """
    Handler che riceve l'evento scaturante l'esecuzione che contiene
    il bucket e la key del video appena creato e notifica la sua pubblicazione

    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        message ID

    """
    print('Executing :' + context.function_name)
    try:
        # Preleva bucket name e key da event
        record = event['Records'][0]['s3']
        bucket = record['bucket']['name']
        key = urllib.parse.unquote_plus(record['object']['key'], encoding='utf-8')

        message_id = sns.publish(
            TopicArn="arn:aws:sns:us-east-2:693949087897:ahlTopic",
            Message='created video published',
            Subject="video publish confirmation",
            MessageStructure="json",
            MessageAttributes={
                'bucket': {
                    'DataType': 'String',
                    'StringValue': bucket
                },
                'key': {
                    'DataType': 'String',
                    'StringValue': key
                }
            }
        )
        return message_id
    except Exception as err:
        print(err)
        print('Impossibile inviare il messaggio di pubblicazione video')
        raise err
