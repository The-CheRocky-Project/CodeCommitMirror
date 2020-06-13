# import json
# import os
# import unittest
# from unittest.mock import patch
# from aws_lambda_context import LambdaContext
# from moto import mock_dynamodb2
# from moto import mock_s3
# import boto3
# from src.recognize import lambda_handler

# # Percorso assouluto per caricare il file event.json
# absolute_path = os.path.dirname(os.path.abspath(__file__))
# file_path = absolute_path + '/../event/recognize_event.json'

# with open(file_path, 'r') as f:
#     event_json = json.load(f)

# CONTEXT = LambdaContext()
# CONTEXT.function_name = 'recognize'


# class TestRecognize(unittest.TestCase):
#     @mock_s3
#     def test_db_record_successfully_delete(self):
#         """
#         L'evento è scatenato dal caricamento di un file
#         che quindi deve essere cancellato
#         :return:
#         """
#         with mock_dynamodb2():
#           with patch('boto3.client') as mock:
#             file=[2,6]
#             formatted = f"{int(str(2)):07d}"
#             key='frames/file.'+ formatted + '.jpg'
#             s3_client = boto3.resource('s3')
#             s3_client.create_bucket(Bucket='ahlconsolebucket')
#             resume = s3_client.Object('ahlconsolebucket', key)
#             sageMaker = mock.return_value
#             sageMaker.invoke_endpoint.return_value = {
#                 'Body': file,
#                 'ContentType': 'dict',
#                 'InvokedProductionVariant': 'dict',
#                 'CustomAttributes': 'dict'
#             }
#             # Get the service resource.
#             db_client = boto3.resource('dynamodb')
#             # Create the DynamoDB table.
#             table = db_client.create_table(
#                 TableName='rekognitions',
#                 KeySchema=[{
#                     'AttributeName': 'frame_key',
#                     'KeyType': 'HASH'
#                 }],
#                 AttributeDefinitions=[{
#                     'AttributeName': 'frame_key',
#                     'AttributeType': 'S'
#                 }],
#                 ProvisionedThroughput={
#                     'ReadCapacityUnits': 5,
#                     'WriteCapacityUnits': 5
#                 })

#             table = db_client.Table('rekognitions')
#             table.put_item(Item={
#                 'frame_key': 'non_cancellare'
#               }
#             )

#             result = lambda_handler(event_json, CONTEXT)
#             self.assertNotEqual(result, False)