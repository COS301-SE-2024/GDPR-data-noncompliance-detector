from pypdf import PdfReader
import os
import docx2txt


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
