import unittest
from datetime import datetime
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from backend.Document_parser.storage_and_submission import storage_and_submission



class TestStorageAndSubmission(unittest.TestCase):
    def setUp(self):
        self.storage = storage_and_submission()

    def test_storage_creation_and_submission(self):
        now = datetime.now()
        timestamp_str = now.strftime("%Y%m%d_%H%M%S")
        filename = f'{timestamp_str}_o.txt'
        self.storage.filename = filename

        text = 'Test text'
        with open(self.storage.filename, 'w') as f:
            f.write(text)

        with open(self.storage.filename, 'r') as f:
            file_text = f.read()
        self.assertEqual(file_text, text)

    
        os.remove(self.storage.filename)

if __name__ == '__main__':
    unittest.main()