import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import unittest
from backend.Detection_Engine.lang_detection import location_finder

class TestLocationFinder(unittest.TestCase):

    def setUp(self):
        self.finder = location_finder()

    def test_detect_country_EU_language(self):
        text = "Bonjour tout le monde" 
        result = self.finder.detect_country(text)
        self.assertEqual(result, 0)

    def test_detect_country_english(self):
        text = "Hello, how are you?" 
        result = self.finder.detect_country(text)
        self.assertEqual(result, 2)

    def test_detect_country_non_EU_language(self):
        text = "Привет, как дела?"
        result = self.finder.detect_country(text)
        self.assertEqual(result, 1)

    def test_detect_country_EU_language_another(self):
        text = "Hola, ¿cómo estás?"
        result = self.finder.detect_country(text)
        self.assertEqual(result, 1)

if __name__ == "__main__":
    unittest.main()
