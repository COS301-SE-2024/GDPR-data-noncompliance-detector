import sys
import pandas as pd
from pdfminer.high_level import extract_text
from docx import Document
from datetime import datetime

class FileProcessor:
    def __init__(self, file_path):
        self.file_path = file_path
        now = datetime.now()
        self.timestamp_str = now.strftime("%Y%m%d_%H%M%S")
        self.filename = f'{self.timestamp_str}_o.txt'

    def extract_text_from_pdf(self):
        return extract_text(self.file_path)

    def extract_text_from_docx(self):
        doc = Document(self.file_path)
        return ' '.join([paragraph.text for paragraph in doc.paragraphs])

    def extract_data_from_excel(self):
        df = pd.read_excel(self.file_path)
        return df.to_string(index=False)

    def process_file(self):
        try:
            if self.file_path.lower().endswith('.pdf'):
                text = self.extract_text_from_pdf()
            elif self.file_path.lower().endswith('.docx'):
                text = self.extract_text_from_docx()
            elif self.file_path.lower().endswith(('.xlsx', '.xls')):
                text = self.extract_data_from_excel()
            else:
                print("Unsupported file type")
                sys.exit(1)

            with open(self.filename, 'w') as f:
                f.write(text)
        except FileNotFoundError:
            print(f"File not found: {self.file_path}")
            sys.exit(1)

if __name__ == "__main__":
    file_path = input("File Name: ")
    processor = FileProcessor(file_path)
    processor.process_file()