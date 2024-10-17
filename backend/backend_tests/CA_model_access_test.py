import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from backend.Detection_Engine.CA_model_access import CA

import unittest


class TestCA(unittest.TestCase):

    def setUp(self):
        self.ca_classifier = CA()

    def test_run_CA(self):
        result = self.ca_classifier.run_CA("Sure, you can use my data")
        self.assertIn(result, ['LABEL_0', 'LABEL_0'])

if __name__ == "__main__":
    unittest.main()
