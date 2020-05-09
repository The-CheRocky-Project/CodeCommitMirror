import json
import os
import boto3
from moto import mock_s3
from python.src.json_splitter import lambda_handler

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/json_splitter_event.json'

# Carico il file json con l'evento di test
"""
    Campi importanti dell'event.json allo scopo di test:
    - Records[0].s3.bucket.name
    - Records[0].object.key
"""
with open(file_path, 'r') as f:
    event_json = json.load(f)

context = "fake"

"""
with mock_s3():
    s3Client = boto3.client('s3', region_name='us-east-2')
    s3Client.create_bucket(Bucket='ahlconsolebucket')
    jsonToUpload = {
        "fileKey": "partita_di_calcio.mp4",
        "list": [
            {"labelIndex": "0"}, {"labelIndex": "1"}
        ]
    }
    s3Client.put_object(Bucket='ahlconsolebucket', Key='partita_di_calcio.json', Body=json.dumps(jsonToUpload))
    #assert lambda_handler(event_json, context)


    body = s3Client.get_object(Bucket='ahlconsolebucket', Key='partita_di_calcio.json')['Body'].read().decode("utf-8")
    print(body)

    reco_data = json.loads(body)
    reco_file_key = reco_data['fileKey']
    reco_list = reco_data['list']
    counter = 0
    for single_reco in reco_list:
        print(reco_file_key)
        print(single_reco)
        #print(single_reco['labelIndex'])
        print(counter)
"""


class TestJsonSplitter:
    def test_positive_result(self):
        with mock_s3():
            s3Client = boto3.client('s3', region_name='us-east-2')
            s3Client.create_bucket(Bucket='ahlconsolebucket')
            jsonToUpload = {
                "fileKey": "partita_di_calcio.mp4",
                "list": [
                    {
                        "start": "01:54:20.1234",
                        "duration": "3456",
                        "labelIndex": "0"
                    },
                    {
                        "start": "01:54:20.1234",
                        "duration": "3456",
                        "labelIndex": "1"
                    }
                ]
            }
            s3Client.put_object(Bucket='ahlconsolebucket', Key='partita_di_calcio.json', Body=json.dumps(jsonToUpload))
            # Verifico che abbia ritornato True e quindi sia andato tutto a posto
            assert lambda_handler(event_json, context)
            # Verifico che nel bucket ci siano i json splittati
            # La key dei singoli json è così costruita: labelIndex + progressiveNumber + fileKey + .json
            body = s3Client.get_object(Bucket='ahlconsolebucket', Key='singles/00partita_di_calcio.mp4.json')['Body'].read().decode("utf-8")
            assert body == '{"fileKey": "partita_di_calcio.mp4", ' \
                           '"bucket": "ahlconsolebucket", ' \
                           '"recognizement": {"start": "01:54:20.1234", "duration": "3456", "labelIndex": "0"}}'
            body = s3Client.get_object(Bucket='ahlconsolebucket', Key='singles/11partita_di_calcio.mp4.json')['Body'].read().decode("utf-8")
            assert body == '{"fileKey": "partita_di_calcio.mp4", ' \
                           '"bucket": "ahlconsolebucket", ' \
                           '"recognizement": {"start": "01:54:20.1234", "duration": "3456", "labelIndex": "1"}}'
