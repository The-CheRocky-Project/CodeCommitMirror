from python.src.thumbfy import lambda_handler
from python.src.layers import media_manager
import json
import os

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path = absolute_path + '/../event/thumbfy_event.json'

# Carico il file json con l'evento di test
"""
    Campi importanti allo scopo di test:
    - Records[0].s3.bucket.name
    - Records[0].object.key
"""
with open(file_path, 'r') as f:
    event_json = json.load(f)

context = "fake"


def test_thumbfy(monkeypatch):
    # Mock della funzione createThumbnail()
    def create_thumbnail_mock(input_key, output_folder_key, queue):
        assert input_key == 's3://ahlconsolebucket/origin/partita_di_calcio.mp4'
        assert output_folder_key == 's3://ahlconsolebucket/origin/partita_di_calcio.mp4.jpg'
        assert queue == 'console_thumbnail'
        return 10  # Fake job id

    monkeypatch.setattr(media_manager, "create_thumbnail", create_thumbnail_mock)
    assert lambda_handler(event_json, context) == 10
