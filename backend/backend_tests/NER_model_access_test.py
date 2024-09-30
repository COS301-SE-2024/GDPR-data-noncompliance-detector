import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import unittest
from backend.Detection_Engine.NER_model_access import NER

class TestNER(unittest.TestCase):

    def setUp(self):
        self.ner = NER()

    def test_run_NER(self):
        text = "Barack Obama is the former president of the United States."
        entities = self.ner.run_NER(text)
        self.assertIsInstance(entities, list)
        self.assertGreater(len(entities), 0)

    def test_extract_entities(self):
        text = "John lives in New York."
        res = self.ner.run_NER_raw(text)
        entities = self.ner.extract_entities(res)
        self.assertIsInstance(entities, list)

if __name__ == "__main__":
    unittest.main()
