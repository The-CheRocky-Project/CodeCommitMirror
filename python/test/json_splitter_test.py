# -*- coding: utf-8 -*-
"""
Test module for json_splitter lambda
"""
import json
import os
import boto3
from moto import mock_s3
from src.json_splitter import lambda_handler


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

CONTEXT = "fake"


class TestJsonSplitter:
    """
    Classe di test per il lambda_handler di json_splitter
    """
    def test_json_is_splitted(self):
        """
        Test di divisione
        :return:
        """
        print(self)
        with mock_s3():
            s3_client = boto3.client('s3', region_name='us-east-2')
            s3_client.create_bucket(Bucket='ahlconsolebucket')
            json_to_upload = {
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
            s3_client.put_object(Bucket='ahlconsolebucket',
                                 Key='partita_di_calcio.json',
                                 Body=json.dumps(json_to_upload))
            # Verifico che abbia ritornato True e quindi sia andato tutto a posto
            assert lambda_handler(event_json, CONTEXT)
            # Verifico che nel bucket ci siano i json splittati
            # La key dei singoli json è così costruita:
            # labelIndex + progressiveNumber + fileKey + .json
            body = s3_client.get_object(Bucket='ahlconsolebucket',
                                        Key='singles/00partita_di_calcio.mp4.json')['Body']\
                .read()\
                .decode("utf-8")
            body_json = json.loads(body)
            assert body_json["fileKey"] == "partita_di_calcio.mp4"
            assert body_json["bucket"] == "ahlconsolebucket"
            assert body_json["recognizement"]["start"] == "01:54:20.1234"
            assert body_json["recognizement"]["duration"] == "3456"
            assert body_json["recognizement"]["labelIndex"] == "0"
            body = s3_client.get_object(
                Bucket='ahlconsolebucket',
                Key='singles/11partita_di_calcio.mp4.json')['Body']\
                .read().\
                decode("utf-8")
            body_json = json.loads(body)
            assert body_json["fileKey"] == "partita_di_calcio.mp4"
            assert body_json["bucket"] == "ahlconsolebucket"
            assert body_json["recognizement"]["start"] == "01:54:20.1234"
            assert body_json["recognizement"]["duration"] == "3456"
            assert body_json["recognizement"]["labelIndex"] == "1"

    def test_negative_result_malformed_json(self):
        """
        Test per json malformed
        :return:
        """
        print(self)
        with mock_s3():
            s3_client = boto3.client('s3', region_name='us-east-2')
            s3_client.create_bucket(Bucket='ahlconsolebucket')
            # Json malformato (manca fileKey e labelIndex). Dovrebbe far interrompere la lambda.
            json_to_upload = {
                "list": [
                    {
                        "start": "01:54:20.1234",
                        "duration": "3456",
                    }
                ]
            }
            s3_client.put_object(Bucket='ahlconsolebucket',
                                 Key='partita_di_calcio.json',
                                 Body=json.dumps(json_to_upload))
            # Controllo che ritorni False per avvertire che non ha avuto successo
            assert not lambda_handler(event_json, CONTEXT)
