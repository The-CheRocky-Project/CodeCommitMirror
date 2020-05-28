# # -*- coding: utf-8 -*-
# """ Modulo di test per la serverless Lambda Thumbfy
# """
import json
import os
import pytest
import unittest
import botocore
from mock import patch, call
from src.thumbfy import lambda_handler
from aws_lambda_context import LambdaContext

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/thumbfy_event.json'

# Carico il file json con l'evento di test
"""
    Campi importanti dell'event.json allo scopo di test:
    - Records[0].s3.bucket.name
    - Records[0].object.key
"""
with open(file_path, 'r') as f:
    event_json = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'thumbfy'


class TestThumbfy(unittest.TestCase):
  """
  Classe di test per il lambda_handler di framer
  """
  def test_job_creato_correttamente(self):
    with patch('boto3.client') as mock:
      media_conv = mock.return_value
      media_conv.create_job.return_value = {\
        'Job':{\
          'Id': 'string'
        },\
      }
      expected = "string"
      result = lambda_handler(event_json, CONTEXT)
      self.assertEqual(expected, result)
      
  def test_job_non_creato_correttamente(self):
    with patch('boto3.client') as mock:
      media_conv = mock.return_value
      media_conv.create_job.return_value = {\
        'Job':{\
          'Id': ''
        },\
      }
      expected = False
      result = lambda_handler(event_json, CONTEXT)
      self.assertEqual(expected, result)
      
      #TODO fare il test dell'eccezione lanciata
  # def test_job_exception(self):
  #   with patch('boto3.client') as mock:
  #     media_conv = mock.return_value
  #     media_conv.create_job.raiseError.side_effect = Exception('error')
  #     self.assertRaises(Exception, lambda_handler, event_json, CONTEXT)