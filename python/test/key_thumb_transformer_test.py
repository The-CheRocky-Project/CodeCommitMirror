# -*- coding: utf-8 -*-
"""

"""
import json
import os
import unittest
import boto3
from aws_lambda_context import LambdaContext
# from moto import mock_s3
from src.key_thumb_transformer import lambda_handler

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/key_thumb_transformer_event.json'

# Carico il file json con l'evento di test
"""
    Campi importanti dell'event.json allo scopo di test:
    - event['Records'][0]['s3']['object']['key']

"""
with open(file_path, 'r') as f:
    event_json = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'key_thumb_transformer'


class TestKeyThumbTransformer(unittest.TestCase):
    """
    Classe di test per il lambda_handler di key_thumb_transformer
    """

    def test_delete_frames(self):

        result = lambda_handler(event_json, CONTEXT)
        expected = 'thumbnails/nomeFile.0000000.jpg'
        self.assertEqual(result['Records'][0]['s3']['object']['key'], expected)
