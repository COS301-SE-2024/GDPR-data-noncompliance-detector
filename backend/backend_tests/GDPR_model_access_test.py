import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import unittest
from backend.Detection_Engine.GDPR_model_access import GDPR

class TestGDPR(unittest.TestCase):

    def setUp(self):
        self.gdpr = GDPR()

    def test_run_GDPR(self):
        text = "Samantha Schultz lives at 5365 Julie Union, Lake Jorgemouth, PA 90372."
        result = self.gdpr.run_GDPR(text)
        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 0)

    def test_sliding_window(self):
        text = "This is a test text for sliding window."
        chunks = self.gdpr.sliding_window(text, window_size=10, overlap=5)
        self.assertIsInstance(chunks, list)
        self.assertGreater(len(chunks), 0)

    def test_predict(self):
        text = "John lives in New York."
        result = self.gdpr.predict(text)
        self.assertIsInstance(result, list)

if __name__ == "__main__":
    unittest.main()
