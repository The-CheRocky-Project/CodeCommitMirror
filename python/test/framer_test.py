# -*- coding: utf-8 -*-
"""
Test module for json_splitter lambda
"""
import json
import os
import unittest
from unittest.mock import patch
from aws_lambda_context import LambdaContext
from src.framer import lambda_handler

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path_true = absolute_path + '/../event/framer_event_start_process.json'
file_path_false = absolute_path + '/../event/framer_event_not_start.json'

# Carico il file json con l'evento di test
"""
    Campi importanti dell'event.json allo scopo di test:
    - event["Records"][0]["Sns"]["Message"]
    - event["Records"][0]["Sns"]["MessageAttributes"]["bucket"]["Value"]
    - event["Records"][0]["Sns"]["MessageAttributes"]["key"]["Value"]
"""
with open(file_path_true, 'r') as f:
    event_json_true = json.load(f)
with open(file_path_false, 'r') as f:
    event_json_false = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'framer'


class TestFramer(unittest.TestCase):
    """
    Classe di test per il lambda_handler di framer
    """

    def test_job_start_correctly(self):
        with patch('boto3.client') as mock:
            media_conv = mock.return_value
            media_conv.create_job.return_value = { \
                'Job': { \
                    'Id': 'string'
                }, \
                }
            expected = "string"
            result = lambda_handler(event_json_true, CONTEXT)
            self.assertEqual(expected, result)

    def test_job_doesnt_start_correctly(self):
        expected = False
        result = lambda_handler(event_json_false, CONTEXT)
        self.assertEqual(expected, result)

    def test_job_exception(self):
        with patch('boto3.client') as mock:
            #media_conv = mock.return_value
            #media_conv.create_job.raiseError.side_effect = Exception('error')
            self.assertRaises(Exception, lambda_handler, file_path_true, CONTEXT)
