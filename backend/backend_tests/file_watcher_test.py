import pytest
from unittest.mock import patch, mock_open
from backend.File_monitor.file_watcher import verifyFromTeams

@patch("builtins.open", new_callable=mock_open, read_data="ReferrerUrl=https://teams.microsoft.com/somepath")
@patch("platform.system", return_value="Windows")
def test_verify_from_teams(mock_platform, mock_file):
    ext = "somefile.txt"
    result = verifyFromTeams(ext)
    assert result is True

@patch("builtins.open", side_effect=FileNotFoundError)
@patch("platform.system", return_value="Windows")
def test_verify_from_teams_file_not_found(mock_platform, mock_file):
    ext = "somefile.txt"
    result = verifyFromTeams(ext)
    assert result is False



# import unittest
# from watchdog.events import FileModifiedEvent, FileCreatedEvent
# import json
# import file_watcher
# import time
# import os
# import signal


# class TestFileWatcher(unittest.TestCase):

#     def setUp(self):
#         self.extensions = ['txt', 'docx', 'pdf', 'xlsx']
#         self.event_handler = file_watcher.handle(self.extensions)

#     def test_on_created_with_valid_extension(self):
#         thread_watcher = file_watcher.start_watcher_thread(".", "txt", 0.0001)
#         time.sleep(0.0002)
#         with open('file.txt', 'w') as f:
#             f.write("test content\n")
#         event = FileCreatedEvent(os.path.join(os.getcwd(), '/file.txt'))
#         response = self.event_handler.on_created(event)
#         expected_response = os.path.join(os.getcwd(), '/file.txt')
#         self.assertEqual(response, expected_response)
#         file_watcher.stop_watcher_thread(thread_watcher)


#     def test_on_modified_with_valid_extension(self):
#         thread_watcher = file_watcher.start_watcher_thread(".", "txt", 0.0001)
#         time.sleep(0.0002)
#         with open('file.txt', 'a') as f:
#             f.write("test content 2\n")
#         event = FileCreatedEvent(os.path.join(os.getcwd(), '/file.txt'))
#         response = self.event_handler.on_created(event)
#         expected_response = os.path.join(os.getcwd(), '/file.txt')
#         self.assertEqual(response, expected_response)
#         file_watcher.stop_watcher_thread(thread_watcher)
#         os.remove('file.txt')
        

# if __name__ == '__main__':
#     unittest.main()
