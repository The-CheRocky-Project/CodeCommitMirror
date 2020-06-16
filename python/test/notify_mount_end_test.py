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
from src.notify_mount_end import lambda_handler

absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path_true = absolute_path + '/../event/notify_mount_end_true_event.json'
file_path_false = absolute_path + '/../event/notify_mount_end_false_event.json'

with open(file_path_true, 'r') as f:
    event_json_true = json.load(f)
with open(file_path_false, 'r') as f:
    event_json_false = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'notify_mount_end'


class TestNotifyMountEnd(unittest.TestCase):
    def test_key_recognized(self):
        with patch('boto3.client') as mock:
            service = mock.return_value
            service.publish.return_value = {
                'MessageId': 'msgId'
            }
            result = lambda_handler(event_json_true, CONTEXT)
            self.assertEqual(event_json_true, result)
    
    def test_job_doesnt_start_correctly(self):
        
        result = lambda_handler(event_json_false, CONTEXT)
        self.assertEqual(event_json_false, result)

    