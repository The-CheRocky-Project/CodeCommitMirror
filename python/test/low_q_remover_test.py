import json
import os
import boto3
from moto import mock_s3
from python.src.low_q_remover import lambda_handler
import pytest


# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path_correct = absolute_path + '/../event/low_q_remover_correct_event.json'
file_path_wrong = absolute_path + '/../event/low_q_remover_wrong_event.json'

# Carico il file json con l'evento di test
"""
    Campi importanti dell'event.json allo scopo di test:
    - Records[0].s3.bucket.name
    - Records[0].object.key
"""
with open(file_path_correct, 'r') as f:
    correct_event_json = json.load(f)

with open(file_path_wrong, 'r') as f:
    wrong_event_json = json.load(f)

context = "fake"


class TestLowQRemover:
    # L'evento è scatenato da un file che finisce con -low.mp4 e quindi deve essere cancellato
    def test_file_is_deleted(self):
        with mock_s3():
            s3Client = boto3.client('s3', region_name='us-east-2')
            s3Client.create_bucket(Bucket='ahlconsolebucket')
            s3Client.put_object(Bucket='ahlconsolebucket', Key='origin/file-low.mp4', Body="body")
            assert lambda_handler(correct_event_json, context)
            # Dovrebbe lanciare un'eccezione siccome il file che sto cercando di ottenere dovrebbe essere stato cancellato
            with pytest.raises(Exception):
                s3Client.get_object(Bucket='ahlconsolebucket', Key='origin/file-low.mp4')

    # L'evento è scatenato da un file che NON finisce con -low.mp4 e quindi NON deve essere cancellato
    def test_file_is_not_deleted(self):
        with mock_s3():
            s3Client = boto3.client('s3', region_name='us-east-2')
            s3Client.create_bucket(Bucket='ahlconsolebucket')
            s3Client.put_object(Bucket='ahlconsolebucket', Key='origin/file.mp4', Body="body")
            assert not(lambda_handler(wrong_event_json, context))
            result = s3Client.get_object(Bucket='ahlconsolebucket', Key='origin/file.mp4')
            # Se arriva a questo punto vuol dire che il file esiste (altrimenti avrebbe lanciato un'eccezione)
            assert not(result is None)
