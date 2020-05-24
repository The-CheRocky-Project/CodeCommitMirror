# -*- coding: utf-8 -*-
"""
Test module for json_splitter lambda
"""
import json
import os
import unittest
from unittest.mock import patch
import pytest
from aws_lambda_context import LambdaContext
from src.framer import lambda_handler

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/framer_event.json'

# Carico il file json con l'evento di test
"""
    Campi importanti dell'event.json allo scopo di test:
    - event["Records"][0]["Sns"]["Message"]
    - event["Records"][0]["Sns"]["MessageAttributes"]["bucket"]["Value"]
    - event["Records"][0]["Sns"]["MessageAttributes"]["key"]["Value"]
"""
with open(file_path, 'r') as f:
    event_json = json.load(f)


CONTEXT = LambdaContext()
CONTEXT.function_name = 'framer'

class TestFramer(unittest.TestCase):
    """
    Classe di test per il lambda_handler di framer
    """
    def test_do_video_fragmentation(self):
        with patch('boto3.client') as mock:
            media_conv = mock.return_value
            media_conv.create_job.return_value = {\
                'Job':{\
                    'Id': 'string'
                },\
            }
            expected = "string"
            result = lambda_handler(event_json, CONTEXT)
            assert expected == result