import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'backend')))

import unittest
from backend.Detection_Engine.text_classification_layer import text_classification_layer
from backend.Detection_Engine.NER_model_access import NER
from backend.Detection_Engine.CA_model_access import CA
from backend.Detection_Engine.GDPR_model_access import GDPR
from backend.Detection_Engine.EM_model_access import EM
from backend.Detection_Engine.MD_model_access import MD
from backend.Detection_Engine.GF_model_access import GF
from backend.Detection_Engine.RAG import RAG


class TestTextClassificationLayer(unittest.TestCase):

    def setUp(self):
        self.layer = text_classification_layer()

    def test_run_NER_model(self):
        text = "Special Categories of Personal Data: Genetic Data."
        result = self.layer.run_NER_model(text)
        self.assertIsNotNone(result)  # Ensure model returns a result
        self.assertIsInstance(result, list)

    def test_run_NER_model_return_strings(self):
        text = "Special Categories of Personal Data: Genetic Data."
        result = self.layer.run_NER_model_return_strings(text)
        self.assertIsInstance(result, list)
        self.assertTrue(all(isinstance(i, str) for i in result))

    def test_run_CA_model(self):
        text = "Confidential data must be handled with care."
        result = self.layer.run_CA_model(text)
        self.assertIsNotNone(result)
        print(result)
        self.assertIsInstance(result, str)

    def test_run_GDPR_model(self):
        text = "This text contains GDPR-related information."
        result = self.layer.run_GDPR_model(text)
        self.assertIsNotNone(result)
        self.assertIsInstance(result, list)

    def test_run_EM_model(self):
        text = "An emotional message that triggers the model."
        result = self.layer.run_EM_model(text)
        self.assertIsNotNone(result)
        self.assertIsInstance(result, list)

    def test_run_MD_model(self):
        text = "Some medical-related content."
        result = self.layer.run_MD_model(text)
        self.assertIsNotNone(result)
        self.assertIsInstance(result, list)

    def test_run_GF_model(self):
        text = "A text that requires general filtering."
        result = self.layer.run_GF_model(text)
        self.assertIsNotNone(result)
        print(result)
        self.assertIsInstance(result, int)

    def test_run_RAG(self):
        query = "What's the weather today?"
        result = self.layer.run_RAG([query])
        self.assertIsNotNone(result)

if __name__ == "__main__":
    unittest.main()
