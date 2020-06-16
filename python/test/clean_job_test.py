# -*- coding: utf-8 -*-
import json
import os
import unittest
from aws_lambda_context import LambdaContext
from moto import mock_s3
import boto3
from src.clean_job import lambda_handler

CONTEXT = LambdaContext()
CONTEXT.function_name = 'clean_job'


class TestCleanJob(unittest.TestCase):
    @mock_s3
    def test_raise_exception_caused_from_modified_resume_incorrect(self):
        s3 = boto3.resource('s3')
        s3.create_bucket(Bucket='ahlconsolebucket')
        resume = s3.Object('ahlconsolebucket', 'tmp/modified-resume.json')
        arr = [{"frame_key": "", "accuracy": "0.916056", "label": "6", "start": "3250",
                "tfs": "6250", "type": "machine", "show": "true"},
                {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                "tfs": "8750", "type": "machine", "show": "true"}]
        resume.put(Body=json.dumps(arr))
        self.assertRaises(Exception, lambda_handler, '', CONTEXT)

    @mock_s3
    def test_raise_exception_caused_bucket_not_present(self):
        self.assertRaises(Exception, lambda_handler, '', CONTEXT)
