# -*- coding: utf-8 -*-
"""
Test module for final_video_cleaner lambda
"""
import json
import os
import unittest
from unittest.mock import patch
from aws_lambda_context import LambdaContext
from moto import mock_s3
import boto3
from src.change_label_status import lambda_handler

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path1 = absolute_path + '/../event/change_label_status_checkRow_event.json'

with open(file_path1, 'r') as f:
    event_json1 = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'change_label_status'


class TestChangeLabelStatus(unittest.TestCase):
    """
    Classe di test per il lambda_handler di change_label_status
    """

    @mock_s3
    def test_change_label_status_true(self):
        with patch('boto3.client') as mock:
            s3 = boto3.resource('s3')
            s3.create_bucket(Bucket='ahlconsolebucket')
            resume = s3.Object('ahlconsolebucket', 'tmp/modified-resume.json')
            resumeJson = [
                {"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "6", "start": "3250",
                 "tfs": "290000", "type": "machine", "show": "false"},
                {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "2", "start": "4750",
                 "tfs": "2322200", "type": "machine", "show": "false"},
                {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                 "tfs": "8750", "type": "machine", "show": "false"}]
            resume.put(Body=json.dumps(resumeJson))
            snsMock = mock.return_value
            snsMock.publish.return_value = {
                'MessageId': 'string'
            }
            result = lambda_handler(event_json1, CONTEXT)
            self.assertTrue(result)
            resume_res = resume.get()
            all_frames = json.loads(resume_res['Body'].read().decode('utf-8'))
            expectedFrames = [
                {'frame_key': 'frames/match.0000001.jpg', 'accuracy': '0.916056', 'label': '6', 'start': '3250',
                 'tfs': '290000', 'type': 'machine', 'show': 'false'},
                {'frame_key': 'frames/match.0000002.jpg', 'accuracy': '0.969301', 'label':
                    '2', 'start': '4750', 'tfs': '2322200', 'type': 'machine', 'show': 'true'},
                {'frame_key': 'frames/match.0000015.jpg', 'accuracy': '0.969301', 'label': '6', 'start': '4750',
                 'tfs': '8750', 'type': 'machine', 'show': 'false'}]
            self.assertEqual(all_frames, expectedFrames)
