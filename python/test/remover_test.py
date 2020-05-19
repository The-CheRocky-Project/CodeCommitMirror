# -*- coding: utf-8 -*-
"""
Modulo di test per il modulo remover
"""
import json
import os
import boto3
from mock import patch, call
from moto import mock_s3
import pytest
from src.remover import lambda_handler



# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/remover_event.json'

# Carico il file json con l'evento di test
"""
    Campi importanti dell'event.json allo scopo di test:
    - Records[0].s3.bucket.name
    - Records[0].object.key
"""
# Evento di un caricamento di un file
with open(file_path, 'r') as f:
    event_json = json.load(f)

CONTEXT = {
    "function_name": "remover"
}


class TestRemover:
    """
    Classe di test per remover
    """
    def test_file_is_deleted(self):
        """
        L'evento è scatenato dal caricamento di un file che quindi deve essere cancellato
        :return:
        """
        print(self)
        with mock_s3():
            s3_client = boto3.client('s3', region_name='us-east-2')
            s3_client.create_bucket(Bucket='ahlconsolebucket')
            s3_client.put_object(Bucket='ahlconsolebucket', Key='origin/file.mp4', Body="body")
            # Dovrebbe ritornare true visto che il file deve essere stato cancellato
            assert lambda_handler(event_json, CONTEXT)
            # Dovrebbe lanciare un'eccezione siccome il file che sto cercando di ottenere dovrebbe
            # essere stato cancellato
            with pytest.raises(Exception):
                s3_client.get_object(Bucket='ahlconsolebucket', Key='origin/file.mp4')
