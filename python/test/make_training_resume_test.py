# -*- coding: utf-8 -*-
import json
import os
import unittest
from unittest.mock import patch
from aws_lambda_context import LambdaContext
from moto import mock_s3
import boto3
from src.make_training_resume import lambda_handler

absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/make_training_resume_event.json'

with open(file_path, 'r') as f:
    event_json = json.load(f)

file_path2 = absolute_path + '/../event/make_training_resume_false_event.json'

with open(file_path2, 'r') as f:
    event_json2 = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'make_training_resume'


class TestMakeTrainingResume(unittest.TestCase):

    @mock_s3
    def test_modified_resume_successfully_modified(self):
        s3 = boto3.resource('s3')
        s3.create_bucket(Bucket='ahlconsolebucket')
        mod_resume = s3.Object('ahlconsolebucket', 'tmp/training-resume.json')
        mod_resume.put(Body='{ "name":"John", "age":30, "city":"New York"}')
        result = lambda_handler(event_json, CONTEXT)
        self.assertEqual(result,'tmp/modified-resume.json')

        excpected=[{"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "6", "start": "3250",
            "tfs": "6250", "type": "uman", "show": "true"},
           {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
            "tfs": "8750", "type": "uman", "show": "true"}]
        res=json.loads(mod_resume.get()['Body'].read().decode('utf-8'))
        self.assertEqual(excpected, res)

    def test_modified_resume_unsuccessfully_modified(self):
        result = lambda_handler(event_json2, CONTEXT)
        self.assertFalse(result)