# -*- coding: utf-8 -*-
"""
Modulo di test per la lambda streamer
"""
import json
import os

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
    "function_name": "streamer"
}
