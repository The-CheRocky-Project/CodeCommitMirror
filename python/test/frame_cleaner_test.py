# -*- coding: utf-8 -*-
"""
Test module for frame_cleaner_event lambda
"""
import json
import os
import unittest
import boto3
from aws_lambda_context import LambdaContext
from moto import mock_s3
from src.frame_cleaner import lambda_handler

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/frame_cleaner_event.json'

# Carico il file json con l'evento di test
"""
    Campi importanti dell'event.json allo scopo di test:
    - event["Records"][0]["Sns"]["MessageAttributes"]["key"]["Value"]
"""
with open(file_path, 'r') as f:
    event_json = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'frame_cleaner'


class TestFinalVideoCleaner(unittest.TestCase):
    """
    Classe di test per il lambda_handler di frame_cleaner
    """

    def test_delete_frames(self):
        with mock_s3():
            s3_client = boto3.client('s3', region_name='us-east-2')
            s3_client.create_bucket(Bucket='ahlconsolebucket')
            for i in range(1500):
                s3_client.put_object(
                    Bucket='ahlconsolebucket',
                    Key='frames/Football_Red_card_to_Top_Players_2019' + str(i) + '.jpg',
                    Body="body")
            s3_client.put_object(Bucket='ahlconsolebucket',
                                 Key='frames/non_cancellare.jpg',
                                 Body="body")

            # Dovrebbe ritornare true visto che
            # il file deve essere stato cancellato
            result = lambda_handler(event_json, CONTEXT)
            self.assertNotEqual(result, False)

            # Dovrebbe lanciare un'eccezione siccome il file che sto
            # cercando di ottenere dovrebbe essere stato cancellato
            try:
                s3_client.get_object(Bucket='ahlconsolebucket', Key='frames/non_cancellare.jpg')
                pass
            except Exception:
                self.fail('è stato cancellato un file da non cancellare')
            for i in range(1500):
                self.assertRaises(
                    Exception,
                    s3_client.get_object,
                    Bucket='ahlconsolebucket',
                    Key='frames/Football_Red_card_to_Top_Players_2019' + str(i) + '.jpg')

    def test_delete_frames_fail(self):
        """
        Durante l'esecuzione della lambda succede qualcosa di inaspettato
        (in questo test il bucket da cui cancellare non esiste)che deve far
        tornare False per avvisare che la cancellazione
        non è andata a buon fine
        :return:
        """
        with mock_s3():
            result = lambda_handler(event_json, CONTEXT)
            self.assertEqual(False, result)
