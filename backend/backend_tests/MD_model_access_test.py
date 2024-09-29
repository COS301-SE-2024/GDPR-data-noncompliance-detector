import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import unittest
from backend.Detection_Engine.MD_model_access import MD

class TestMD(unittest.TestCase):

    def setUp(self):
        self.md = MD()

    def test_run_MD(self):
        text = "John has a disease called COVID-19."
        diseases = self.md.run_MD(text)
        self.assertIsInstance(diseases, list)
        self.assertGreaterEqual(len(diseases), 0)

    def test_predict(self):
        text = "COVID-19"
        diseases = self.md.predict(text)
        self.assertIsInstance(diseases, list)

if __name__ == "__main__":
    unittest.main()
