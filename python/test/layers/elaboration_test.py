# -*- coding: utf-8 -*-
"""
Test module for elaboration lambda
"""
import unittest
from src.layers import elaboration


class TestElaboration(unittest.TestCase):
    def test_compress_time_array_returned(self):
        arr = [{"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "6", "start": "3250",
                "tfs": "6250", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                "tfs": "8750", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                "tfs": "8750", "type": "machine", "show": "true"}]
        result = elaboration.compress_time(arr)
        expected = [{'frame_key': 'frames/match.0000002.jpg', 'accuracy': '0.969301', 'label': '6', 'start': "8250",
                     'tfs': "8750", 'type': 'machine', 'show': 'true'}]
        self.assertTrue(expected, result)

    def test_remove_frame_int_to_remove(self):
        arr = [{"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "6", "start": "3250",
                "tfs": "6250", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                "tfs": "8750", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                "tfs": "8750", "type": "machine", "show": "true"}]
        result_arr = elaboration.remove(2, arr)
        self.assertEqual('false', result_arr[2]['show'])

    def test_remove_frame_array_to_remove(self):
        arr = [{"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "6", "start": "3250",
                "tfs": "6250", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                "tfs": "8750", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                "tfs": "8750", "type": "machine", "show": "true"}]
        result_arr = elaboration.remove([1, 2], arr)
        self.assertEqual('false', result_arr[1]['show'])
        self.assertEqual('false', result_arr[2]['show'])

    def test_check_time_less_5_minutes(self):
        arr = [{"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "6", "start": "3250",
                "tfs": "6250", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                "tfs": "8750", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                "tfs": "8750", "type": "machine", "show": "false"}]
        result = elaboration.check_time(arr)
        self.assertTrue(result)

    def test_check_time_grather_than_5_minutes(self):
        arr = [{"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "6", "start": "3250",
                "tfs": "290000", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                "tfs": "2322200", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                "tfs": "8750", "type": "machine", "show": "true"}]
        result = elaboration.check_time(arr)
        self.assertFalse(result)

    def test_prioritize(self):
        arr = [{"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "6", "start": "3250",
                "tfs": "290000", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "2", "start": "4750",
                "tfs": "2322200", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                "tfs": "8750", "type": "machine", "show": "true"}]
        result = elaboration.prioritize(arr)
        self.assertEqual(1, result)

    def test_remove_useless(self):
        arr = [{"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "0", "start": "3250",
                "tfs": "290000", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "1", "start": "4750",
                "tfs": "2322200", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "2", "start": "4750",
                "tfs": "8750", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "3", "start": "3250",
                "tfs": "290000", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "4", "start": "3250",
                "tfs": "290000", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "5", "start": "3250",
                "tfs": "290000", "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "9", "start": "3250",
                "tfs": "290000", "type": "machine", "show": "true"}]
        result = elaboration.remove_useless(arr)
        expected = [0, 1, 4, 5, 6]
        self.assertCountEqual(result, expected)

    def test_prepare_for_serialize(self):
        arr = [{"frame_key": "frames/match.0000001.jpg", "accuracy": 0.916056, "label": 6, "start": 3250, "tfs": 290000,
                "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000002.jpg", "accuracy": 0.969301, "label": 2, "start": 4750,
                "tfs": 2322200, "type": "machine", "show": "true"},
               {"frame_key": "frames/match.0000015.jpg", "accuracy": 0.969301, "label": 6, "start": 4750, "tfs": 8750,
                "type": "machine", "show": "true"}]
        result = elaboration.prepare_for_serialize(arr)
        expected = [{"frame_key": "frames/match.0000001.jpg", "accuracy": "0.916056", "label": "6", "start": "3250",
                     "tfs": "290000", "type": "machine", "show": "true"},
                    {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "2", "start": "4750",
                     "tfs": "2322200", "type": "machine", "show": "true"},
                    {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750",
                     "tfs": "8750", "type": "machine", "show": "true"}]
        self.assertEqual(expected, result)
