import pandas as pd
from pdfminer.high_level import extract_text
from docx import Document

class text_extractor:
    def __init__(self):
        self.ext = ''

    def extract_text_from_pdf(self, file_path):
        return extract_text(file_path)

    def extract_text_from_docx(self, file_path):
        doc = Document(file_path)
        return ' '.join([paragraph.text for paragraph in doc.paragraphs])

    def extract_data_from_excel(self, file_path):
        df = pd.read_excel(file_path)
        if df.empty:
            column_name = df.columns[0]
            return column_name
        else:
            return df.to_string(index=False)

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
