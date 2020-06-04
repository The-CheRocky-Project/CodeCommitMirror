# -*- coding: utf-8 -*-
"""
Test module for json_splitter lambda
"""
import json
import os
import unittest
from aws_lambda_context import LambdaContext
from moto import mock_s3
import boto3
from src.reco_json_cleaner import lambda_handler

CONTEXT = LambdaContext()
CONTEXT.function_name = 'reco_json_cleaner'

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/reco_json_cleaner_event.json'

with open(file_path, 'r') as f:
    event_json = json.load(f)


class TestRecoJsonCleaner(unittest.TestCase):
    """
    Classe di test per il lambda_handler di recoJsonCleaner
    """

    def test_resume_json_delete_successfully(self):
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
                Key='tmp/resume.json',
                Body="body")
            # Dovrebbe ritornare true visto che il file
            # deve essere stato cancellato
            assert lambda_handler(event_json, CONTEXT)
            # Dovrebbe lanciare un'eccezione siccome il file che sto cercando
            # di ottenere dovrebbe essere stato cancellato
            self.assertRaises(
                Exception,
                s3_client.get_object,
                Bucket='ahlconsolebucket',
                Key='origin/file.mp4')

    def test_resume_json_delete_fail(self):
        """
        Durante l'esecuzione della lambda succede qualcosa di inaspettato
        (in questo test il bucket da cui cancellare non esiste) che deve
        far tornare False per avvisare che la cancellazione non è andata
        a buon fine
        :return:
        """
        with mock_s3():
            result = lambda_handler(event_json, CONTEXT)
            self.assertEqual(False, result)
