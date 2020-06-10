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
from src.final_video_cleaner import lambda_handler

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/final_video_cleaner_event.json'

# Carico il file json con l'evento di test
"""
    Campi importanti dell'event.json allo scopo di test:
    - event["Records"][0]["Sns"]["Message"]
    - event["Records"][0]["Sns"]["MessageAttributes"]["bucket"]["Value"]
    - event["Records"][0]["Sns"]["MessageAttributes"]["key"]["Value"]
"""
with open(file_path, 'r') as f:
    event_json = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'final_video_cleaner'


class TestFinalVideoCleaner(unittest.TestCase):
    """
    Classe di test per il lambda_handler di finalVideoCleaner
    """

    def test_video_successfully_delete(self):
        """
        L'evento è scatenato dal caricamento di un file
        che quindi deve essere cancellato
        :return:
        """
        with mock_s3():
            s3_client = boto3.client('s3', region_name='us-east-2')
            s3_client.create_bucket(Bucket='ahlconsolebucket')
            s3_client.put_object(
                Bucket='ahlconsolebucket',
                Key='modify/Football_Red_card_to_Top_Players_2019.mp4',
                Body="body")
            # Non dovrebbe ritornare False visto che
            # il file deve essere stato cancellato
            result = lambda_handler(event_json, CONTEXT)
            self.assertNotEqual(result, False)
            # Dovrebbe lanciare un'eccezione siccome il file che sto
            # cercando di ottenere dovrebbe essere stato cancellato
            self.assertRaises(
                Exception,
                s3_client.get_object,
                Bucket='ahlconsolebucket',
                Key='modify/Football_Red_card_to_Top_Players_2019.mp4')

    def test_video_delete_fail(self):
        """
        Durante l'esecuzione della lambda succede qualcosa di inaspettato
        (in questo test il bucket da cui cancellare non esiste)che deve far
        tornare False per avvisare che la cancellazione
        non è andata a buon fine
        :return:
        """
        with mock_s3():
            result = lambda_handler(event_json, CONTEXT)
            self.assertEqual(result, False)
