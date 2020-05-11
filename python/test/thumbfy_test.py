# -*- coding: utf-8 -*-
""" Modulo di test per la serverless Lambda Thumbfy
"""
import json
import os
import pytest
from src.layers import media_manager
from src.thumbfy import lambda_handler

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/thumbfy_event.json'

# Carico il file json con l'evento di test
"""
    Campi importanti dell'event.json allo scopo di test:
    - Records[0].s3.bucket.name
    - Records[0].object.key
"""
with open(file_path, 'r') as f:
    event_json = json.load(f)

CONTEXT = {
    "function_name": "thumbfy"
}


class TestThumbfy:
    """
    Classe di test per la lambda thubmfy
    """
    def test_positive_result(self, monkeypatch):
        """
        Classe di test per risultato positivo
        :param monkeypatch:
        :return:
        """
        print(self)
        def create_thumbnail_mock(input_key, output_folder_key, queue):
            """
            Mock della funzione create_thumbnail
            :param input_key:
            :param output_folder_key:
            :param queue:
            :return:
            """
            assert input_key == 's3://ahlconsolebucket/origin/partita_di_calcio.mp4'
            assert output_folder_key == 's3://ahlconsolebucket/origin/partita_di_calcio.mp4.jpg'
            assert queue == 'console_thumbnail'
            return 10  # Fake job id

        monkeypatch.setattr(media_manager, "create_thumbnail", create_thumbnail_mock)
        assert lambda_handler(event_json, CONTEXT) == 10

    def test_negative_result(self, monkeypatch):
        """
        Classe di test per risultato negativo
        :param monkeypatch:
        :return:
        """
        print(self)
        def create_thumbnail_mock(input_key, output_folder_key, queue):
            """
            Mock della funzione createThumbnail()
            :param input_key:
            :param output_folder_key:
            :param queue:
            :return:
            """
            raise Exception('Some error')

        monkeypatch.setattr(media_manager, "create_thumbnail", create_thumbnail_mock)
        # Controllo che sia stata lanciata un'eccezione
        with pytest.raises(Exception):
            lambda_handler(event_json, CONTEXT)
