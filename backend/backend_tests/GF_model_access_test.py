import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import unittest
from backend.Detection_Engine.GF_model_access import GF

class TestGF(unittest.TestCase):

    def setUp(self):
        self.gf = GF()

    def test_run_GF(self):
        text = "ATGTCAGGTCA"
        match_count = self.gf.run_GF(text)
        self.assertIsInstance(match_count, int)
        self.assertGreaterEqual(match_count, 0)

if __name__ == "__main__":
    unittest.main()
