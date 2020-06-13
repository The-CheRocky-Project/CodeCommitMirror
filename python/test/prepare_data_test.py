import json
import os
import unittest
from aws_lambda_context import LambdaContext
from moto import mock_dynamodb2
import boto3
from src.prepare_data import lambda_handler

absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/prepare_data_event.json'

with open(file_path, 'r') as f:
    event_json = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'prepare_data'


class TestPrepareData(unittest.TestCase):

    def test_context_variables_returned_and_db_frames_put_successfully(self):
        with mock_dynamodb2():
            db_client = boto3.resource('dynamodb')
            table=db_client.create_table(
                TableName='rekognitions',
                KeySchema=[{
                    'AttributeName': 'frame_key',
                    'KeyType': 'HASH'
                }],
                AttributeDefinitions=[{
                    'AttributeName': 'frame_key',
                    'AttributeType': 'S'
                }],
                ProvisionedThroughput={
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                })
            result1 = lambda_handler(event_json, CONTEXT)
            expected = {'key': 'frames/file', 'from': 0, 'to': 2, 'detail': {'items': []}, 'continue': False}
            self.assertEqual(expected, result1)
            result=[]
            for i in range(2):
              result.append(table.get_item(Key={
                  'frame_key': 'frames/file.' + f"{i:07d}" + '.jpg',
                  'tfs': 250 * i
              }))
            expected1={
              'frame_key': 'frames/file.' + f"{0:07d}" + '.jpg',
              'tfs': 250 * 0
            }
            expected2={
              'frame_key': 'frames/file.' + f"{1:07d}" + '.jpg',
              'tfs': 250 * 1
            }
            self.assertEqual(result[0]['Item'], expected1)
            self.assertEqual(result[1]['Item'], expected2)

    def test_exception_db_not_present(self):
      with mock_dynamodb2():
          self.assertRaises(Exception,lambda_handler,event_json, CONTEXT)
          