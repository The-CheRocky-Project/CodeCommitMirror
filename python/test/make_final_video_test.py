# -*- coding: utf-8 -*-
import json
import os
import unittest
from unittest.mock import patch
from aws_lambda_context import LambdaContext
from moto import mock_s3
import boto3
from src.make_final_video import lambda_handler

absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/make_final_video_event.json'

with open(file_path, 'r') as f:
    event_json = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'make_final_video'


class TestMakeFinalVideo(unittest.TestCase):
    @mock_s3
    def test_video_mount_correctly(self):
        with patch('boto3.client') as mock:
            with patch('layers.media_manager.mount') as mediaManagerMock:
                mediaManagerMock.return_value = 'str'
                s3 = boto3.resource('s3')
                s3.create_bucket(Bucket='ahlconsolebucket')
                resume = s3.Object('ahlconsolebucket', 'tmp/modified-resume.json')
                arr = [{"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "6", "start": "3250",
                        "tfs": "6250", "type": "machine", "show": "true"},
                       {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                        "tfs": "8750", "type": "machine", "show": "true"}]
                resume.put(Body=json.dumps(arr))
                snsMock = mock.return_value
                snsMock.publish.return_value = {
                    'MessageId': 'string'
                }
                result = lambda_handler(event_json, CONTEXT)
                self.assertEqual(result, 'str')

    @mock_s3
    def test_file_not_present_in_s3_exception(self):
        with patch('boto3.client') as mock:
            with patch('layers.media_manager.mount') as mediaManagerMock:
                mediaManagerMock.return_value = 'str'
                s3 = boto3.resource('s3')
                snsMock = mock.return_value
                snsMock.publish.return_value = {
                    'MessageId': 'string'
                }
                self.assertRaises(Exception, lambda_handler, event_json, CONTEXT)
