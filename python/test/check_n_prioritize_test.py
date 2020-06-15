# -*- coding: utf-8 -*-
"""
Test module for final_video_cleaner lambda
"""
import json
import os
import unittest
from aws_lambda_context import LambdaContext
from moto import mock_s3
import boto3
from src.check_n_prioritize import lambda_handler
# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/check_n_prioritize_event.json'

with open(file_path, 'r') as f:
    event_json = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'check_n_prioritize'


class TestCheckNPrioritize(unittest.TestCase):
    """
    Classe di test per il lambda_handler di check_n_prioritize
    """

    def test_check_n_prioritize_true(self):
        with mock_s3():
            s3 = boto3.resource('s3')
            s3.create_bucket(Bucket='ahlconsolebucket')
            resume = s3.Object('ahlconsolebucket', 'frames.json')
            arr = [{"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "6", "start": "3250",
                    "tfs": "290000", "type": "machine", "show": "true"},
                   {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "2", "start": "4750",
                    "tfs": "2322200", "type": "machine", "show": "true"},
                   {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                    "tfs": "8750", "type": "machine", "show": "true"}]
            resume.put(Body=json.dumps(arr))
            result = lambda_handler(event_json, CONTEXT)
            expectedRes = {
                'key': 'tmp/resume.json'
            }
            self.assertEqual(result, expectedRes)
            resume_json = s3.Object('ahlconsolebucket', result["key"])
            resume_res = resume_json.get()
            all_frames = json.loads(resume_res['Body'].read().decode('utf-8'))
            expectedFrames = [
                {'frame_key': 'frames/match.0000001.jpg', 'accuracy': '0.916056', 'label': '6', 'start': '3250',
                 'tfs': '290000', 'type': 'machine', 'show': 'true'},
                {'frame_key': 'frames/match.0000002.jpg', 'accuracy': '0.969301', 'label':
                    '2', 'start': '4750', 'tfs': '2322200', 'type': 'machine', 'show': 'false'},
                {'frame_key': 'frames/match.0000015.jpg', 'accuracy': '0.969301', 'label': '6', 'start': '4750',
                 'tfs': '8750', 'type': 'machine', 'show': 'true'}]
            self.assertEqual(all_frames, expectedFrames)

    def test_check_n_prioritize_false(self):
        with mock_s3():
            s3 = boto3.resource('s3')
            s3.create_bucket(Bucket='ahlconsolebucket')
            resume = s3.Object('ahlconsolebucket', 'frames.json')
            arr = []
            resume.put(Body=json.dumps(arr))
            result = lambda_handler(event_json, CONTEXT)
            self.assertFalse(result)
