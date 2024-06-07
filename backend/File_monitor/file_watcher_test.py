import unittest
from watchdog.events import FileModifiedEvent, FileCreatedEvent
import json
import file_watcher
import os

class TestFileWatcher(unittest.TestCase):

    def setUp(self):
        self.extensions = ['txt', 'docx', 'pdf', 'xlsx']
        self.event_handler = file_watcher.handle(self.extensions)

    def test_on_modified_with_valid_extension(self):
        event = FileModifiedEvent('{wd}/file.txt')
        response = self.event_handler.on_modified(event)
        wd = os.getcwd()
        expected_response = json.dumps({"type": "modified", "path": "{wd}/file.txt"})
        self.assertEqual(response, expected_response)

    def test_on_modified_with_invalid_extension(self):
        event = FileModifiedEvent('{wd}/file.jpg')
        response = self.event_handler.on_modified(event)
        self.assertIsNone(response)

    def test_on_created_with_valid_extension(self):
        event = FileCreatedEvent('{wd}/file.pdf')
        response = self.event_handler.on_created(event)
        expected_response = json.dumps({"type": "created", "path": "{wd}/file.pdf"})
        self.assertEqual(response, expected_response)

    def test_on_created_with_invalid_extension(self):
        event = FileCreatedEvent('{wd}/file.bmp')
        response = self.event_handler.on_created(event)
        self.assertIsNone(response)

if __name__ == '__main__':
    unittest.main()
