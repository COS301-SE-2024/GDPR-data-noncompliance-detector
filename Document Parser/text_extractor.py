import sys
import pandas as pd
from pdfminer.high_level import extract_text
from docx import Document
from datetime import datetime

def extract_text_from_pdf(file_path):
    return extract_text(file_path)

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    return ' '.join([paragraph.text for paragraph in doc.paragraphs])

def extract_data_from_excel(file_path):
    df = pd.read_excel(file_path)
    return df.to_string(index=False)

def file_processor():
    now = datetime.now()
    timestamp_str = now.strftime("%Y%m%d_%H%M%S")
    filename = f'{timestamp_str}_o.txt'
    file_path = input("File Name: ")
    if file_path.lower().endswith('.pdf'):
        text = extract_text_from_pdf(file_path)
    elif file_path.lower().endswith('.docx'):
        text = extract_text_from_docx(file_path)
    elif file_path.lower().endswith(('.xlsx', '.xls')):
        text = extract_data_from_excel(file_path)
    else:
        print("Unsupported file type")
        sys.exit(1)

    with open(filename, 'w') as f:
        f.write(text)

if __name__ == "__main__":
    file_processor()
    

#pip install document
#pip install PdfFileReader
#pip install PyPDF2
#pip install python-docx