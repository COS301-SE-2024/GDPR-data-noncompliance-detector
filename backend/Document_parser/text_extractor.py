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
from openpyxl.drawing.image import Image as OpenPyxlImage #we need this for excel
class text_extractor:
    def __init__(self):
        self.ext = ''

    def extract_text_from_pdf(self, file_path):
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

    def extract_text_from_docx(self, file_path):
        document = Document(file_path)
        combined_text = []

        for para in document.paragraphs:
            combined_text.append(para.text)
        
        for rel in document.part.rels:
            if "image" in document.part.rels[rel].target_ref:
                img = document.part.rels[rel].target_part.blob
                image = Image.open(io.BytesIO(img))
                
                ocr_text = pytesseract.image_to_string(image)
                combined_text.append(ocr_text)
        
        return "\n".join(combined_text)

    def extract_data_from_excel(self, file_path):
        wb = openpyxl.load_workbook(file_path)
        combined_text = []

        for sheet_name in wb.sheetnames:
            sheet = wb[sheet_name]

            df = pd.read_excel(file_path, sheet_name=sheet_name)
            if not df.empty:
                combined_text.append(df.to_string(index=False))

            for image in sheet._images:
                try:
                    img = image.ref
                    if isinstance(img, OpenPyxlImage):
                        img_stream = io.BytesIO(img.image)
                        image_pil = Image.open(img_stream)

                        ocr_text = pytesseract.image_to_string(image_pil)
                        combined_text.append(ocr_text)
                except Exception as e:
                    print(f"Error processing image: {e}")
                    combined_text.append('')

        return "\n".join(combined_text)

    def extract_text_multi(self, file_path, extension):
        if extension == '.pdf':
            text = self.extract_text_from_pdf(file_path)
        elif extension == '.docx':
            text = self.extract_text_from_docx(file_path)
        elif extension in ['.xlsx', '.xls']:
            text = self.extract_data_from_excel(file_path)
        else:
            text = None

        return text
