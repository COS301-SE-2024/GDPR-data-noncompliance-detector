import os

class validator:
    def process_file(self, file_path):
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")

            extension = os.path.splitext(file_path)[1].lower()
            if extension == '.pdf':
                proceed = True
            elif extension == '.docx':
                proceed = True
            elif extension in ['.xlsx', '.xls']:
                proceed = True
            else:
                raise ValueError("Unsupported file type")

        except FileNotFoundError:
            raise FileNotFoundError(f"File not found: {file_path}")

        return extension
