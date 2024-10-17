import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from backend.Detection_Engine.EM_model_access import EM

import unittest

class TestEM(unittest.TestCase):

    def setUp(self):
        self.em_classifier = EM()

    def test_run_EM(self):
        result = self.em_classifier.run_EM("Sure, you can use my data")
        self.assertIsInstance(result, list)
        for label in result:
            self.assertIsInstance(label, str) 

if __name__ == "__main__":
    unittest.main()
