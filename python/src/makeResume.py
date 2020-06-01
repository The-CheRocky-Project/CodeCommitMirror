""" make_Resume Lambda module

Questo modulo contiene l'handler che effettua il prelievo dei dati dal DB
e utilizzando delle funzioni ausiliarie e individua (elaborando i dati)
i principali spezzoni video da ritagliare.
Contenuto:
    * lambda_handler - l'handler principale per la lambda

"""

# imports url utils and media management layer
import json
import boto3
from python.src.layers import elaboration

# Definisce la risorsa s3


s3R = boto3.resource('s3')
#Definisce la risorsa dynamo DB
dynamo = boto3.resource("dynamodb")



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

    folder = 'frames'
    bucket = 'ahlconsolebucket'
    basekey = event['key']
    table_name = 'rekognitions'

    table = dynamo.Table('rekognitions')

    all_frames = []

    label_json = s3R.Object(bucket, 'utils/labels.json')
    label_res = label_json.get()
    labels_content = json.loads(label_res['Body'].read().decode('utf-8'))

    try:
        for i in range(event['to']):
            zeros = ""
            for k in range(7 - len(str(i))):
                zeros = zeros + "0"
            key = basekey + '.' + zeros + str(i) + '.jpg'
            response = table.get_item(
                Key={
                    'frame_key': key
                }
            )
            all_frames.append(response['Item'])

        succession = []
        frame_info = {}

        for i in range(event['to'] - 1):
            index = 0
            top = all_frames[i][str(index)]
            for k in range(len(labels_content['labels']) - 1):
                tmp = all_frames[i][str(k + 1)]
                if top < tmp:
                    index = k + 1
                    top = tmp
            frame_info = {
                'frame_key': all_frames[i]['frame_key'],
                'accuracy': top,
                'label': index,
                'start': 0,
                'tfs': all_frames[i]['tfs'],
                'auto' : False
            }
            succession.append(frame_info)

        resume = []

        for k in range(event['to'] - 1):
            if succession[k]['accuracy'] >= 0.80:
                if find_trasholder(succession, succession[k], k, 11, event['to'] - 1):
                    resume.append(succession[k])

        resume = compress_time(resume)

        data = prepare_for_serialize(resume)

        s3object = s3R.Object('ahlconsolebucket', 'tmp/resume.json')
        s3object.put(Body=json.dumps(data))

        key= 'ahlconsolebucket/tmp/resume.json'
        ret = {
            'key': key
        }
        if len(data) != 0:
            return ret
        else
            return False
    except Exception as err:
        print(err)
        print('Impossibile recuperare i dati dal DB')
        raise err

