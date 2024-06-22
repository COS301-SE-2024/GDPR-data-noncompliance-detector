import unittest
from watchdog.events import FileModifiedEvent, FileCreatedEvent
import json
import file_watcher
import time
import os
import signal

class TestFileWatcher(unittest.TestCase):

    def setUp(self):
        self.extensions = ['txt', 'docx', 'pdf', 'xlsx']
        self.event_handler = file_watcher.handle(self.extensions)

    # def test_on_created_with_valid_extension(self):
    #     file_watcher.startWatcher(".", 'txt')
    #     with open('file.txt', 'w') as f:
    #         f.write("Initial content\n")
    #     event = FileCreatedEvent(os.path.join(os.getcwd(), '/file.txt'))
    #     response = self.event_handler.on_created(event)
    #     expected_response = os.path.join(os.getcwd(), '/file.txt')
    #     self.assertEqual(response, expected_response)
    #     os.kill(signal.SIGINT)


    def test_on_created_with_invalid_extension(self):
        event = FileCreatedEvent('/file.bmp')
        response = self.event_handler.on_created(event)
        self.assertIsNone(response)

    def test_on_modified_with_valid_extension(self):
        event = FileModifiedEvent('/file.txt')
        response = self.event_handler.on_modified(event)
        expected_response = json.dumps({"type": "modified", "path": "/file.txt"})
        self.assertEqual(response, expected_response)

    def test_on_modified_with_invalid_extension(self):
        event = FileModifiedEvent('/file.jpg')
        response = self.event_handler.on_modified(event)
        self.assertIsNone(response)
        

if __name__ == '__main__':
    unittest.main()
