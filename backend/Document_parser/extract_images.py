from pypdf import PdfReader
import os
import docx2txt
from openpyxl import load_workbook
from openpyxl.drawing.image import Image

def extract_images_from_excel(excel_path):
    output_dir = "../Detection_Engine/extracted_images/pdf_images"

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    workbook = load_workbook(excel_path)
    
    for sheet_name in workbook.sheetnames:
        sheet = workbook[sheet_name]
        for image in sheet._images:
            img = image.image
            
            img_format = img.format if img.format else 'png'
            
            img_filename = f"{sheet_name}_{image.anchor._from.row}_{image.anchor._from.col}.{img_format.lower()}"
            img_path = os.path.join(output_dir, img_filename)
            
            with open(img_path, 'wb') as f:
                f.write(img._data())


def extract_images_from_pdf(dir):
    # ensure folders are removed/replaced after each run
    # add to document parser
    pypdf_reader = PdfReader(dir)

    # this folder is made detection engine extracted images
    output_dir = "../Detection_Engine/extracted_images/pdf_images"
    os.makedirs(output_dir, exist_ok=True)

    for page in pypdf_reader.pages:
        for image in page.images:
            image_path = os.path.join(output_dir, image.name)
            with open(image_path, "wb") as fp:
                fp.write(image.data)


def extract_images_from_docx(docx_path):
    docx2txt.process(docx_path, '../Detection_Engine/extracted_images/docx_images')
