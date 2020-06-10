# -*- coding: utf-8 -*-
"""
Test module for elaboration lambda
"""
import unittest
from src.layers import elaboration
from unittest.mock import patch


class TestElaboration(unittest.TestCase):
    # def test_find_trashhold_true(self):
    #     frame_list = [
    #         {
    #             "label": 0,
    #             "accuracy": 0.7
    #         },
    #         {
    #             "label": 1,
    #             "accuracy": 0.7
    #         },
    #         {
    #             "label": 2,
    #             "accuracy": 0.7
    #         },
    #         {
    #             "label": 3,
    #             "accuracy": 0.7
    #         },
    #         {
    #             "label": 4,
    #             "accuracy": 0.7
    #         }
    #     ]
    #     frame = {
    #         "label": 0
    #     }
    #     frame_number = 3
    #     how_much = 1
    #     n_frames = 5
    #     result = elaboration.find_trashold(frame_list, frame, frame_number, how_much, n_frames)
    #     print(result)
    #     self.assertFalse(True)
        # self.assertTrue(result)

    def test_compress_time_array_returned(self):
        arr=[{"frame_key": "frames/match.0000001.jpg","accuracy": "0.916056", "label": "6", "start": "3250", "tfs": 6250, "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": 8750, "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": 8750, "type": "machine", "show": "true"}]
        result = elaboration.compress_time(arr)
        expected = [{'frame_key': 'frames/match.0000002.jpg', 'accuracy': '0.969301', 'label': '6', 'start': 8250, 'tfs': 8750, 'type': 'machine', 'show': 'true'}]
        self.assertTrue(expected, result)
    
    def test_remove_frame_int_to_remove(self):
        arr=[{"frame_key": "frames/match.0000001.jpg","accuracy": "0.916056", "label": "6", "start": "3250", "tfs": 6250, "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": 8750, "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": 8750, "type": "machine", "show": "true"}]
        result_arr = elaboration.remove(2, arr)
        self.assertEqual('false', result_arr[2]['show'])
    
    def test_remove_frame_array_to_remove(self):
        arr=[{"frame_key": "frames/match.0000001.jpg","accuracy": "0.916056", "label": "6", "start": "3250", "tfs": 6250, "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": 8750, "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": 8750, "type": "machine", "show": "true"}]
        result_arr = elaboration.remove([1,2], arr)
        self.assertEqual('false', result_arr[1]['show'])
        self.assertEqual('false', result_arr[2]['show'])

    def test_check_time_less_5_minutes(self):
        arr=[{"frame_key": "frames/match.0000001.jpg","accuracy": "0.916056", "label": "6", "start": "3250", "tfs": "6250", "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": "8750", "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": "8750", "type": "machine", "show": "false"}]
        result = elaboration.check_time(arr)
        self.assertTrue(result)

    def test_check_time_grather_than_5_minutes(self):
        arr=[{"frame_key": "frames/match.0000001.jpg","accuracy": "0.916056", "label": "6", "start": "3250", "tfs": "290000", "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": "2322200", "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": "8750", "type": "machine", "show": "true"}]
        result = elaboration.check_time(arr)
        self.assertFalse(result)

    def test_prioritize_(self):
        arr=[{"frame_key": "frames/match.0000001.jpg","accuracy": "0.916056", "label": "6", "start": "3250", "tfs": "290000", "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "2", "start": "4750", "tfs": "2322200", "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": "8750", "type": "machine", "show": "true"}]
        result = elaboration.prioritize(arr)
        self.assertEqual(1,result)

    def test_prepare_for_serialize(self):
        arr=[{"frame_key": "frames/match.0000001.jpg","accuracy": 0.916056, "label": 6, "start": 3250, "tfs": 290000, "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000002.jpg", "accuracy": 0.969301, "label": 2, "start": 4750, "tfs": 2322200, "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000015.jpg", "accuracy": 0.969301, "label": 6, "start": 4750, "tfs": 8750, "type": "machine", "show": "true"}]
        result = elaboration.prepare_for_serialize(arr)
        expected = [{"frame_key": "frames/match.0000001.jpg","accuracy": "0.916056", "label": "6", "start": "3250", "tfs": "290000", "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000002.jpg", "accuracy": "0.969301", "label": "2", "start": "4750", "tfs": "2322200", "type": "machine", "show": "true"},
        {"frame_key": "frames/match.0000015.jpg", "accuracy": "0.969301", "label": "6", "start": "4750", "tfs": "8750", "type": "machine", "show": "true"}]
        self.assertEqual(expected, result)
