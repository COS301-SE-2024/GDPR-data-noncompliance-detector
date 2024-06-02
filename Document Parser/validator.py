import sys
import os

class validator:
    def process_file(self, file_path):
        try:
            extension = os.path.splitext(file_path)[1].lower()
            if extension == '.pdf':
                proceed = True
            elif extension == '.docx':
                proceed = True
            elif extension in ['.xlsx', '.xls']:
                proceed = True
            else:
                print("Unsupported file type")
                sys.exit(1)

        except FileNotFoundError:
            print(f"File not found: {file_path}")
            sys.exit(1)

        if not proceed:
            extension = ''

        return extension