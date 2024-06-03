import unittest
import os
from datetime import datetime
from storage_and_submission import storage_and_submission

class TestStorageAndSubmission(unittest.TestCase):
    def setUp(self):
        self.storage = storage_and_submission()

    def test_init(self):
        now = datetime.now()
        timestamp_str = now.strftime("%Y%m%d_%H%M%S")
        filename = f'{timestamp_str}_o.txt'
        self.assertEqual(self.storage.timestamp_str, timestamp_str)
        self.assertEqual(self.storage.filename, filename)

    def test_submit(self):
        text = 'Test text'
        self.storage.submit(text)
        with open(self.storage.filename, 'r') as f:
            file_text = f.read()
        self.assertEqual(file_text, text)
        os.remove(self.storage.filename)

if __name__ == '__main__':
    unittest.main()