import sys
import pandas as pd
from pdfminer.high_level import extract_text
from docx import Document

def extract_text_from_pdf(file_path):
    return extract_text(file_path)

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    return ' '.join([paragraph.text for paragraph in doc.paragraphs])

def extract_data_from_excel(file_path):
    df = pd.read_excel(file_path)
    return df.to_string(index=False)

if __name__ == "__main__":
    path = "NCEWD1.docx"
    if path.lower().endswith('.pdf'):
        text = extract_text_from_pdf(path)
    elif path.lower().endswith('.docx'):
        text = extract_text_from_docx(path)
    elif path.lower().endswith(('.xlsx', '.xls')):
        text = extract_data_from_excel(path)
    else:
        print("Unsupported file type")
        sys.exit(1)

    with open('output.txt', 'w') as f:
        f.write(text)

#pip install document
#pip install PdfFileReader
#pip install PyPDF2
#pip install python-docx