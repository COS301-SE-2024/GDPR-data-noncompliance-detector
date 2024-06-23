import fitz
import pytesseract
from PIL import Image
import io
import pdfplumber
from docx import Document
# from docx.shared import Inches

def pdf_extract_text_with_ocr(pdf_path):
    combined_text = []

    # Open the PDF file using pdfplumber
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            # Extract text blocks and order them
            text = page.extract_text()
            if text:
                combined_text.append(text)
    
    # Re-open the PDF file using PyMuPDF to extract images
    pdf_document = fitz.open(pdf_path)

    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        images = page.get_images(full=True)
        
        for img_index, img in enumerate(images):
            xref = img[0]
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image["image"]
            image = Image.open(io.BytesIO(image_bytes))

            # Perform OCR on the image
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
pdf_path = input("path:")
combined_text = extract_text_with_ocr_from_docx(pdf_path)
print(combined_text)

if __name__ == "__main__":
    pdf_path = input("Enter the path to the PDF file: ")
    extracted_text = pdf_extract_text_with_ocr(pdf_path)
    print(extracted_text)