from backend.display import disp
import fitz
from io import BytesIO
from unittest.mock import patch, MagicMock
from PIL import Image


@patch('fitz.open')  
@patch('PIL.Image.frombytes')  
def test_highlight_pdf_violations(mock_frombytes, mock_fitz_open):
    
    mock_doc = MagicMock()
    mock_page = MagicMock()
    mock_doc.__len__.return_value = 1  
    mock_doc.__getitem__.return_value = mock_page 

    mock_fitz_open.return_value = mock_doc

    mock_pix = MagicMock()
    mock_pix.width = 100
    mock_pix.height = 100
    mock_page.get_pixmap.return_value = mock_pix

    mock_image = MagicMock()
    mock_frombytes.return_value = mock_image

    violations = [["test violation"]]
    result = disp.highlight_pdf_violations('dummy_path', violations, 'output_path')

    assert isinstance(result, BytesIO), "bytesio"

    assert mock_fitz_open.called, "fitz"
    assert mock_frombytes.called, "pil"
    assert mock_page.get_pixmap.called, "getpixmap"
