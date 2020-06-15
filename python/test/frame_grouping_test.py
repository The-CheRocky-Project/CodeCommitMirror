# -*- coding: utf-8 -*-
"""
Modulo di test per il modulo remover
"""
import json
import os
import unittest
from aws_lambda_context import LambdaContext
from src.frame_grouping import lambda_handler

# Percorso assouluto per caricare il file event.json
absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path1 = absolute_path + '/../event/frame_grouping_continue_event.json'

absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path2 = absolute_path + '/../event/frame_grouping_not_continue_event.json'

absolute_path = os.path.dirname(os.path.abspath(__file__))
file_path3 = absolute_path + '/../event/frame_grouping_incorrect_for_test.json'

# Carico il file json con l'evento di test
"""
    Campi importanti dell'event.json allo scopo di test:
    - Records[0].s3.bucket.name
    - Records[0].object.key
"""
# Evento di un caricamento di un file
with open(file_path1, 'r') as f:
    event_json1 = json.load(f)

with open(file_path2, 'r') as f:
    event_json2 = json.load(f)

with open(file_path3, 'r') as f:
    event_json3 = json.load(f)

CONTEXT = LambdaContext()
CONTEXT.function_name = 'frame_grouping'


class TestFrameGrouping(unittest.TestCase):
    """
    Classe di test per frame_grouping
    """
    def test_data_next_step_state_machine_returned_continue(self):
        result = lambda_handler(event_json1,CONTEXT)
        expected = {
            'detail': {
                'items': []
            },
            'to': 222,
            'from': 222,
            'key': 'frames/qualcosa',
            'continue': True
        }
        self.assertEqual(expected, result)
        self.assertTrue(result["continue"])

    def test_data_next_step_state_machine_returned_not_continue(self):
        result = lambda_handler(event_json2,CONTEXT)
        expected = {'detail': {'items': [{'key': 'qualcosa', 'n': 250}, {'key': 'qualcosa', 'n': 251}, {'key': 'qualcosa', 'n': 252}, {'key': 'qualcosa', 'n': 253}, {'key': 'qualcosa', 'n': 254}, {'key': 'qualcosa', 'n': 255}, {'key': 'qualcosa', 'n': 256}, {'key': 'qualcosa', 'n': 257}, {'key': 'qualcosa', 'n': 258}, {'key': 'qualcosa', 'n': 259}, {'key': 'qualcosa', 'n': 260}, {'key': 'qualcosa', 'n': 261}, {'key': 'qualcosa', 'n': 262}, {'key': 'qualcosa', 'n': 263}, {'key': 'qualcosa', 'n': 264}, {'key': 'qualcosa', 'n': 265}, {'key': 'qualcosa', 'n': 266}, {'key': 'qualcosa', 'n': 267}, {'key': 'qualcosa', 'n': 268}, {'key': 'qualcosa', 'n': 269}, {'key': 'qualcosa', 'n': 270}, {'key': 'qualcosa', 'n': 271}, {'key': 'qualcosa', 'n': 272}, {'key': 'qualcosa', 'n': 273}, {'key': 'qualcosa', 'n': 274}, {'key': 'qualcosa', 'n': 275}, {'key': 'qualcosa', 'n': 276}, {'key': 'qualcosa', 'n': 277}, {'key': 'qualcosa', 'n': 278}, {'key': 'qualcosa', 'n': 279}, {'key': 'qualcosa', 'n': 280}, {'key': 'qualcosa', 'n': 281}, {'key': 'qualcosa', 'n': 282}, {'key': 'qualcosa', 'n': 283}, {'key': 'qualcosa', 'n': 284}, {'key': 'qualcosa', 'n': 285}, {'key': 'qualcosa', 'n': 286}, {'key': 'qualcosa', 'n': 287}, {'key': 'qualcosa', 'n': 288}, {'key': 'qualcosa', 'n': 289}, {'key': 'qualcosa', 'n': 290}, {'key': 'qualcosa', 'n': 291}, {'key': 'qualcosa', 'n': 292}, {'key': 'qualcosa', 'n': 293}, {'key': 'qualcosa', 'n': 294}, {'key': 'qualcosa', 'n': 295}, {'key': 'qualcosa', 'n': 296}, {'key': 'qualcosa', 'n': 297}, {'key': 'qualcosa', 'n': 298}, {'key': 'qualcosa', 'n': 299}]}, 'to': 310, 'from': 300, 'key': 'frames/qualcosa', 'continue': False}
        print(result)
        self.assertEqual(expected, result)
        self.assertFalse(result["continue"])

    def test_exception_raised_caused_from_incorrect_event(self):
        self.assertRaises(Exception, lambda_handler,event_json3, CONTEXT)