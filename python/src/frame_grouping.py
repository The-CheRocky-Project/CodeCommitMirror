# coding=utf-8
"""frame_grouping lambda module
Questo modulo contiene tutti i metodi utili all'esecuzione della
AWS Serverless Lambda frame_grouping

Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""


def lambda_handler(event, context):
    """
    Handler che crea gruppi di frame da riconoscere
    per alleggerire l'informazione scambiata
    fra gli stati della Step Function State Machine
    che predispone la decisione sull'interruzione
    del processo
    Args:
        event: L'evento che ha fatto scaturire l'avvio dell'handler
        context: Il dizionario rappresentante le variabili di contesto
            d'esecuzione

    Returns:
        dict: I dati utili all'esecuzione del successivo
        step della State Machine
    """
    print('Executiong ' + context.function_name)
    step = 50

    event['detail']['items'] = []

    if (event['to'] - (event['from'] + step)) < 0:
        step = event['to'] - event['from']

    splitted = event['key'].split('/')
    key = splitted[len(splitted) - 1]

    for i in range(event['from'], event['from'] + step):
        tmp = {
            'key': key,
            'n': i
        }
        event['detail']['items'].append(tmp)

    event['from'] = event['from'] + step

    if event['to'] == event['from']:
        event['continue'] = True

    return event
