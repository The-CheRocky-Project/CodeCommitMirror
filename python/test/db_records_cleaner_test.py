import json
import os
import unittest
from aws_lambda_context import LambdaContext
from moto import mock_dynamodb2
import boto3
from src.dbRecordsCleaner import lambda_handler

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/db_records_cleaner_event.json'

# Carico il file json con l'evento di test
"""
    Campi importanti dell'event.json allo scopo di test:
    - event["Records"][0]["Sns"]["MessageAttributes"]["key"]["Value"]
"""
with open(file_path, 'r') as f:
    event_json = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'dbRecordsCleaner'


class TestDbRecordsCleaner(unittest.TestCase):
    """
    Classe di test per il lambda_handler di dbRecordsCleaner(
    """

    def test_video_successfully_delete(self):
        """
        L'evento è scatenato dal caricamento di un file che quindi deve essere cancellato
        :return:
        """
        with mock_dynamodb2():
            # Get the service resource.
            db_client = boto3.resource('dynamodb')
            # Create the DynamoDB table.
            table = db_client.create_table(TableName='rekognitions',KeySchema=[
                {
                  'AttributeName': 'frame_key', 
                  'KeyType': 'HASH'
                }
              ],
              AttributeDefinitions=[
                {
                  'AttributeName': 'frame_key',
                  'AttributeType': 'S'
                }
              ],
              ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
              }
            )
    
            table = db_client.Table('rekognitions')
            
            for i in range(10):
              table.put_item(Item={
                  'frame_key':'frames/file'+str(i)
                }
              )
            table.put_item(Item={
                  'frame_key':'frames/non_cancellare'
                }
            )
            assert lambda_handler(event_json, CONTEXT)

            result=table.get_item(Key={
             'frame_key':'frames/non_cancellare'
            })

            self.assertEqual(result['Item']['frame_key'],'frames/non_cancellare')

            for i in range(10):
              response = table.get_item(Key={
                  'frame_key':'frames/file'+str(i)
                }
              )
              #se gli items sono presenti nella tabella da errore, altrimenti il test viene superato
              if 'Item' in response:
                  self.fail('non sono state cancellate tutte le righe/tuple')
              else:
                  pass

    def test_video_delete_fail(self):
      self.assertFalse(lambda_handler(event_json, CONTEXT))