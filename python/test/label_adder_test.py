# -*- coding: utf-8 -*-
"""
Test module for final_video_cleaner lambda
"""
import json
import os
import unittest
from unittest.mock import patch
from aws_lambda_context import LambdaContext
import boto3
from moto import mock_s3
import boto3
from src.label_adder import lambda_handler

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path1 = absolute_path + '/../event/label_adder_true_event.json'

file_path2 = absolute_path + '/../event/label_adder_false_event.json'

file_path3 = absolute_path + '/../event/label_adder_exception_event.json'

with open(file_path1, 'r') as f:
    event_json1 = json.load(f)

with open(file_path2, 'r') as f:
    event_json2 = json.load(f)

with open(file_path3, 'r') as f:
    event_json3 = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'label_adder'


class TestLabelAdder(unittest.TestCase):
    """
    Classe di test per il lambda_handler di label_adder
    """
    @mock_s3
    def test_add_row(self):
        with patch('boto3.client') as mock:
          s3 = boto3.resource('s3')
          s3.create_bucket(Bucket='ahlconsolebucket')
          resume = s3.Object('ahlconsolebucket', 'tmp/modified-resume.json')
          arr=[{"frame_key": "frames/match.0000001.jpg","accuracy": "0.916056", "label": "6", "start": "3250", "tfs": "6250", "type": "machine", "show": "true"},
          {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": "8750", "type": "machine", "show": "true"}]
          resume.put(Body=json.dumps(arr))
          snsMock = mock.return_value
          snsMock.publish.return_value = {
               'MessageId': 'string'
          }
          result = lambda_handler(event_json1, CONTEXT)
          self.assertTrue(result)

    @mock_s3
    def test_not_add_row(self):
      s3 = boto3.resource('s3')
      s3.create_bucket(Bucket='ahlconsolebucket')
      resume = s3.Object('ahlconsolebucket', 'tmp/modified-resume.json')
      arr=[{"frame_key": "frames/match.0000001.jpg","accuracy": "0.916056", "label": "6", "start": "3250", "tfs": "6250", "type": "machine", "show": "true"},
      {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": "8750", "type": "machine", "show": "true"}]
      resume.put(Body=json.dumps(arr))
      result = lambda_handler(event_json2, CONTEXT)
      self.assertFalse(result)
    
    def test_malformed_json(self):
      self.assertRaises(Exception, lambda_handler, event_json3, CONTEXT)