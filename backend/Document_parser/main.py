import pandas as pd
from pdfminer.high_level import extract_text
from docx import Document
from docx.shared import Inches
# import fitz
import pytesseract
from PIL import Image
import io
import pdfplumber
import openpyxl #we need this for excel
from openpyxl_image_loader import SheetImageLoader

from pdf2image import convert_from_path
# from docx.shared import Inches

def extract_text_from_pdf(file_path):
    combined_text = []

    # Extract text using pdfplumber
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                combined_text.append(text)

        # Convert PDF pages to images using pdf2image
        images = convert_from_path(file_path)

        # Perform OCR on each image using pytesseract
        for image in images:
            ocr_text = pytesseract.image_to_string(image)
            combined_text.append(ocr_text)

        return "\n".join(combined_text)
        
def main():
    extracted_text = extract_text_from_pdf('COS332_EXAM_2022PDF_240617_194915.pdf')
    print(extracted_text)

if __name__ == "__main__":
    main()