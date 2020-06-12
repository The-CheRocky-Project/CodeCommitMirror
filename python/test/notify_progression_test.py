# # -*- coding: utf-8 -*-
# """ Modulo di test per la serverless Lambda Thumbfy
# """
import json
import os
import unittest
from unittest.mock import patch
from mock import patch
from src.notify_progression import lambda_handler
from aws_lambda_context import LambdaContext

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/notify_progression_event.json'

# Carico il file json con l'evento di test
with open(file_path, 'r') as f:
    event_json = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'notify_progression'


class TestThumbfy(unittest.TestCase):
    """
    Classe di test per il lambda_handler di notify_progression
    """

    def test_notify_progression_correctly(self):
        with patch('boto3.client') as mock:
            snsMock = mock.return_value
            snsMock.publish.return_value = {
                'MessageId': 'string'
            }
            result = lambda_handler(event_json, CONTEXT)
            expected = {
              "from": 5,
              "to": 10
            }
            self.assertEqual(result, expected)
