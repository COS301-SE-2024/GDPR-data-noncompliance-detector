import os, sys
import pytest
import requests
import requests_mock
from unittest.mock import patch, MagicMock
from outlook_uploads_monitor import (
    decrypt,
    FileUploadHandler,
    get_resource_path,
    encryption_key
)

def test_upload_file_success(mocker):
    handler = FileUploadHandler()

    mock_open = mocker.patch("builtins.open", mocker.mock_open(read_data="data"))
    mock_post = mocker.patch("requests.post")
    
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {"result": "success"}

    handler.upload_file("testfile.docx")
    
    assert mock_open.call_count == 2
    mock_open.assert_any_call("testfile.docx", 'rb')

def test_upload_file_failure(mocker, capsys):
    handler = FileUploadHandler()

    mock_open = mocker.patch("builtins.open", mocker.mock_open(read_data="data"))
    mock_post = mocker.patch("requests.post")
    
    mock_post.return_value.status_code = 400
    mock_post.return_value.text = "Error"

    handler.upload_file("testfile.docx")
    
    mock_open.assert_called_once_with("testfile.docx", 'rb')
    mock_post.assert_called_once()

    captured = capsys.readouterr()
    assert "Failed to upload file" in captured.out


def test_delete_file(mocker):
    handler = FileUploadHandler()
    
    mock_remove = mocker.patch("os.remove")
    handler.delete_file("testfile.docx")
    
    mock_remove.assert_called_once_with("testfile.docx")
