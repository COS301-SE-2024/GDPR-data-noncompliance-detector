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

    def test_on_created_with_valid_extension(self):
        thread_watcher = file_watcher.start_watcher_thread(".", "txt", 0.0001)
        time.sleep(0.0002)
        with open('file.txt', 'w') as f:
            f.write("Initial content\n")
        event = FileCreatedEvent(os.path.join(os.getcwd(), '/file.txt'))
        response = self.event_handler.on_created(event)
        expected_response = os.path.join(os.getcwd(), '/file.txt')
        self.assertEqual(response, expected_response)
        file_watcher.stop_watcher_thread(thread_watcher)


    def test_on_modified_with_valid_extension(self):
        thread_watcher = file_watcher.start_watcher_thread(".", "txt", 0.0001)
        time.sleep(0.0002)
        with open('file.txt', 'w') as f:
            f.write("Initial content\n")
        event = FileCreatedEvent(os.path.join(os.getcwd(), '/file.txt'))
        response = self.event_handler.on_created(event)
        expected_response = os.path.join(os.getcwd(), '/file.txt')
        self.assertEqual(response, expected_response)
        file_watcher.stop_watcher_thread(thread_watcher)
        

if __name__ == '__main__':
    unittest.main()
