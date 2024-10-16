import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import unittest
from backend.Detection_Engine.RAG import RAG

import numpy as np
from unittest.mock import MagicMock

class TestRAG(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.rag = RAG()
        cls.sample_query = ["personal data", "consent", "biometric data"]
        cls.sample_metadata = {
            'statements': ["This is a sample statement on consent", "Biometric data detected here"],
        }
        cls.rag.metadata = cls.sample_metadata

    def test_query_faiss_db(self):
        self.rag.index = MagicMock()
        self.rag.index.search = MagicMock(return_value=(np.array([[0.9]]), np.array([[0]])))
        self.rag.embedding_model.encode = MagicMock(return_value=np.array([[0.1, 0.2, 0.3]]))
        
        result = self.rag.query_faiss_db(["consent agreement"])
        self.assertEqual(len(result), 1)
        self.assertIn("statement", result[0])
        self.assertEqual(result[0]['statement'], "consent")

    def test_sliding_window(self):
        self.rag.classifier.tokenizer.encode = MagicMock(return_value=[1, 2, 3, 4, 5, 6, 7])
        chunks = self.rag.sliding_window("Sample text", 3, 1)
        self.assertEqual(len(chunks), 3)
        self.assertEqual(chunks, [[1, 2, 3], [3, 4, 5], [5, 6, 7]])

    def test_predict(self):
        self.rag.classifier = MagicMock()
        self.rag.classifier.return_value = [{'label': 'LABEL_1'}]
        self.rag.classifier.tokenizer.encode = MagicMock(return_value=[1, 2, 3])
        self.rag.classifier.tokenizer.decode = MagicMock(return_value="Sample decoded text")

        result = self.rag.predict("test input")
        self.assertEqual(result, 'LABEL_1')

    def test_generate(self):
        self.rag.predict = MagicMock(return_value='LABEL_1')
        sample_results = [{"statement": "Some statement about consent"}]
        labels = self.rag.generate(sample_results)
        self.assertEqual(len(labels), 1)
        self.assertEqual(labels[0], 'LABEL_1')

    def test_interpret_findings(self):
        labels = ['LABEL_1', 'LABEL_4', 'LABEL_4', 'LABEL_3']
        articles, count = self.rag.interpret_findings(labels)
        self.assertEqual(count, 6)
        self.assertIn('5', articles)
        self.assertIn('9', articles)
    
    def test_process(self):
        self.rag.query_faiss_db = MagicMock(return_value=[{"statement": "consent"}])
        self.rag.generate = MagicMock(return_value=['LABEL_1', 'LABEL_2'])
        self.rag.interpret_findings = MagicMock(return_value=(['5', '6'], 2))

        output = self.rag.process(self.sample_query)
        self.assertEqual(output, (['5', '6'], 2))

if __name__ == '__main__':
    unittest.main()
