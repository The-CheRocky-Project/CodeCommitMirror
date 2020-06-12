# -*- coding: utf-8 -*-
"""
Test module for framer lambda
"""
import json
import os
import unittest
import boto3
from unittest.mock import patch
from aws_lambda_context import LambdaContext
from src.framer import lambda_handler

absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path_true = absolute_path + '/../event/framer_event_start_process.json'
file_path_false = absolute_path + '/../event/framer_event_not_start.json'
file_path_exc = absolute_path + '/../event/framer_exception_event.json'

with open(file_path_true, 'r') as f:
    event_json_true = json.load(f)
with open(file_path_false, 'r') as f:
    event_json_false = json.load(f)
with open(file_path_exc, 'r') as f:
    event_json_exc = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'framer'


class TestFramer(unittest.TestCase):
    def test_job_start_correctly(self):
        with patch('boto3.client') as mock:
            service = mock.return_value
            service.create_job.return_value = {
                'Job': {
                    'Id': 'string'
                },
            }
            service.publish.return_value = {
                'MessageId': 'msgId'
            }
            expected = "string"
            result = lambda_handler(event_json_true, CONTEXT)
            self.assertEqual(expected, result)
    
    def test_job_doesnt_start_correctly(self):
        with patch('boto3.client') as mock:
            service = mock.return_value
            service.create_job.return_value = {
                'Job': {
                    'Id': 'string'
                },
            }
            expected = False
            result = lambda_handler(event_json_false, CONTEXT)
            self.assertEqual(expected, result)
    
    def test_event_malformed_exception(self):
        with patch('boto3.client') as mock:
            service = mock.return_value
            service.create_job.return_value = {
                'Job': {
                    'Id': 'string'
                },
            }
            self.assertRaises(Exception, lambda_handler, event_json_exc, CONTEXT)

    