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
            bodyJson = json.loads(body)
            assert bodyJson["fileKey"] == "partita_di_calcio.mp4"
            assert bodyJson["bucket"] == "ahlconsolebucket"
            assert bodyJson["recognizement"]["start"] == "01:54:20.1234"
            assert bodyJson["recognizement"]["duration"] == "3456"
            assert bodyJson["recognizement"]["labelIndex"] == "0"
            body = s3Client.get_object(Bucket='ahlconsolebucket', Key='singles/11partita_di_calcio.mp4.json')['Body'].read().decode("utf-8")
            bodyJson = json.loads(body)
            assert bodyJson["fileKey"] == "partita_di_calcio.mp4"
            assert bodyJson["bucket"] == "ahlconsolebucket"
            assert bodyJson["recognizement"]["start"] == "01:54:20.1234"
            assert bodyJson["recognizement"]["duration"] == "3456"
            assert bodyJson["recognizement"]["labelIndex"] == "1"

    def test_negative_result_malformed_json(self):
        with mock_s3():
            s3Client = boto3.client('s3', region_name='us-east-2')
            s3Client.create_bucket(Bucket='ahlconsolebucket')
            # Json malformato (manca fileKey e labelIndex). Dovrebbe far interrompere la lambda.
            jsonToUpload = {
                "list": [
                    {
                        "start": "01:54:20.1234",
                        "duration": "3456",
                    }
                ]
            }
            s3Client.put_object(Bucket='ahlconsolebucket', Key='partita_di_calcio.json', Body=json.dumps(jsonToUpload))
            # Controllo che ritorni False per avvertire che non ha avuto successo
            assert not(lambda_handler(event_json, context))
