# import fitz
import pytesseract
from PIL import Image
import io
import pdfplumber
from docx import Document
from pdf2image import convert_from_path
# from docx.shared import Inches

def pdf_extract_text_with_ocr(file_path):
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

def extract_text_with_ocr_from_docx(docx_path):
    document = Document(docx_path)
    combined_text = []

    for para in document.paragraphs:
        combined_text.append(para.text)
    
    for rel in document.part.rels:
        if "image" in document.part.rels[rel].target_ref:
            img = document.part.rels[rel].target_part.blob
            image = Image.open(io.BytesIO(img))
            
            # Perform OCR on the image
            ocr_text = pytesseract.image_to_string(image)
            combined_text.append(ocr_text)
    
    return "\n".join(combined_text)

# Usage
# pdf_path = input("path:")
# combined_text = extract_text_with_ocr_from_docx(pdf_path)
# print(combined_text)

if __name__ == "__main__":
    pdf_path = 'C:/Users/Mervyn Rangasamy/Documents/2024/COS 301/Capstone/Repo/GDPR-data-noncompliance-detector/backend/Document_parser/COS332_EXAM_2022PDF_240617_194915.pdf'
    extracted_text = pdf_extract_text_with_ocr(pdf_path)
    print(extracted_text)