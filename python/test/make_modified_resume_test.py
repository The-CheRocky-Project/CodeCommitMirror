# -*- coding: utf-8 -*-
import json
import os
import unittest
from unittest.mock import patch
from aws_lambda_context import LambdaContext
from moto import mock_s3
import boto3
from src.make_modified_resume import lambda_handler

CONTEXT = LambdaContext()
CONTEXT.function_name = 'make_modified_resume'


class TestMakeModifiedResume(unittest.TestCase):

    @mock_s3
    def test_the_file_modified_resume_is_modified(self):
        with patch('boto3.client') as mock:
            s3 = boto3.resource('s3')
            s3.create_bucket(Bucket='ahlconsolebucket')
            resume = s3.Object('ahlconsolebucket', 'tmp/resume.json')
            mod_resume = s3.Object('ahlconsolebucket', 'tmp/modified-resume.json')
            arr = [{"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "6", "start": "3250",
                    "tfs": "6250", "type": "machine", "show": "true"}]
            resume.put(Body=json.dumps(arr))
            mod_resume.put(Body=json.dumps('ciaociao'))
            snsMock = mock.return_value
            snsMock.publish.return_value = {
                'MessageId': 'string'
            }
            result = lambda_handler('', CONTEXT)
            self.assertEqual(result,'{key: "tmp/modified-resume.json"}')
            res=json.loads(mod_resume.get()['Body'].read().decode('utf-8'))
            self.assertEqual(res, arr)