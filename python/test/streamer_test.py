# -*- coding: utf-8 -*-
"""
Modulo di test per la lambda streamer
"""
import json
import os
import pytest
import boto3
import unittest
from moto import mock_sns
from python.src.streamer import lambda_handler

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/streamer_event.json'

# Carico il file json con l'evento di test
with open(file_path, 'r') as f:
    event_json = json.load(f)

"""
Campi importanti dell'event.json allo scopo di test:
    - Records[0].s3.bucket.name
    - Records[0].object.key
"""

class TestStreamer(unittest.TestCase):
    def setup(self):
        
        self.CONTEXT = {
            "function_name": "streamer"
        }
    def test_message_is_publish(self):
        with mock_sns():
            '''
            client = boto3.client('sns')
            response = client.list_topics()
            print(response)
            response = client.create_topic(
                Name='ahlTopic'
            )
            print(response)
            dsds = client.list_topics()
            print(dsds)
            expected = {'MessageId': 'String'}
            #jsonToUpload = {"fileKey": "partita_di_calcio.mp4"}
            message_id = lambda_handler(event_json, self.CONTEXT)
            assert(expected, message_id)
            '''
            

