import pandas as pd
from pdfminer.high_level import extract_text
from docx import Document
from docx.shared import Inches
import fitz
import pytesseract
from PIL import Image
import io
import pdfplumber
import openpyxl #we need this for excel
from openpyxl_image_loader import SheetImageLoader

def extract_text_from_pdf(file_path):
        combined_text = []

        with pdfplumber.open(file_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    combined_text.append(text)
        
        pdf_document = fitz.open(file_path)

        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            images = page.get_images(full=True)
            
            for img_index, img in enumerate(images):
                xref = img[0]
                base_image = pdf_document.extract_image(xref)
                image_bytes = base_image["image"]
                image = Image.open(io.BytesIO(image_bytes))

                ocr_text = pytesseract.image_to_string(image)
                combined_text.append(ocr_text)

        return "\n".join(combined_text)

def main():
    
    extracted_text = extract_text_from_pdf('COS332_EXAM_2022PDF_240617_194915.pdf')
    print(extracted_text)

if __name__ == "__main__":
    main()