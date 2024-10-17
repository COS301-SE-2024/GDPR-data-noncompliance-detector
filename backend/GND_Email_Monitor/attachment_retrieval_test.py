import pytest
from unittest.mock import MagicMock, patch
from pathlib import Path
from attachment_retrieval import (
    get_domain,
    get_country_from_domain,
    process_email,
    download_attachments,
    EU_Countries
)

@pytest.fixture
def mock_email():
    email = MagicMock()
    email.SenderEmailAddress = "user@example.com"
    email.Attachments.Count = 1
    attachment = MagicMock()
    attachment.Filename = "test.txt"
    email.Attachments.Item.return_value = attachment
    return email

def test_get_domain():
    email = "USER@Example.COM"
    domain = get_domain(email)
    assert domain == "example.com"

@patch('attachment_retrieval.email2country')
def test_get_country_from_domain_success(mock_email2country):
    mock_email2country.return_value = "Netherlands"
    domain = "example.nl"
    country = get_country_from_domain(domain)
    mock_email2country.assert_called_with(domain)
    assert country == "Netherlands"

@patch('attachment_retrieval.email2country')
def test_get_country_from_domain_fail(mock_email2country):
    mock_email2country.side_effect = Exception("Lookup failed")
    domain = "example.unknown"
    country = get_country_from_domain(domain)
    mock_email2country.assert_called_with(domain)
    assert country is None

@patch('attachment_retrieval.download_attachments')
@patch('attachment_retrieval.get_country_from_domain')
@patch('attachment_retrieval.get_domain')
def test_process_email_eu_country(mock_get_domain, mock_get_country, mock_download_attachments, mock_email):
    mock_get_domain.return_value = "example.de"
    mock_get_country.return_value = "Germany"

    with patch('attachment_retrieval.output_dir', Path("/fake/output")):
        process_email(mock_email)
    
    mock_get_domain.assert_called_with("user@example.com")
    mock_get_country.assert_called_with("example.de")
    mock_download_attachments.assert_called_with(mock_email, Path("/fake/output"), "Germany")

    
@patch('attachment_retrieval.download_attachments')
@patch('attachment_retrieval.get_country_from_domain')
@patch('attachment_retrieval.get_domain')
def test_process_email_non_eu_country(mock_get_domain, mock_get_country, mock_download_attachments, mock_email):
    mock_get_domain.return_value = "example.us"
    mock_get_country.return_value = "United States"
    
    with patch('attachment_retrieval.output_dir', Path("/fake/output")):
        process_email(mock_email)
    
    mock_get_domain.assert_called_with("user@example.com")
    mock_get_country.assert_called_with("example.us")
    mock_download_attachments.assert_not_called()

@patch('attachment_retrieval.Path.mkdir')
def test_get_user_documents_folder(mock_mkdir):
    with patch('attachment_retrieval.os.path.expanduser', return_value="/home/user/Documents"):
        from attachment_retrieval import get_user_documents_folder
        
        folder = get_user_documents_folder()
        assert folder == Path("/home/user/Documents")

def test_download_attachments_with_attachments(mock_email):
    with patch('attachment_retrieval.os.path.join') as mock_join:
        mock_join.return_value = "/fake/output/test - Germany.txt"
        
        mock_email.Attachments.Item.return_value.FileName = "test.txt"
        
        download_attachments(mock_email, "/fake/output", "Germany")
        
        mock_email.Attachments.Item.assert_called_with(1)
        mock_join.assert_called_with("/fake/output", "test - Germany.txt")
        mock_email.Attachments.Item.return_value.SaveAsFile.assert_called_with("/fake/output/test - Germany.txt")

def test_download_attachments_no_attachments():
    from attachment_retrieval import download_attachments
    
    email = MagicMock()
    email.Attachments.Count = 0
    
    with patch('builtins.print') as mock_print:
        download_attachments(email, Path("/fake/output"), "Germany")
        mock_print.assert_called_with("No attachments found.")

@patch('attachment_retrieval.email2country')
def test_get_country_from_domain_case_insensitivity(mock_email2country):
    mock_email2country.return_value = "France"
    domain = "Example.FR"
    
    country = get_country_from_domain(domain.lower())
    mock_email2country.assert_called_with("example.fr")
    assert country == "France"