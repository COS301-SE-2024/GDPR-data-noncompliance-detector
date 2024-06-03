import os


class validator:
    def process_file(self, file_path):
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")

            extension = os.path.splitext(file_path)[1].lower()
            if extension == '.pdf':
                proceed = True
                print(proceed)
            elif extension == '.docx':
                proceed = True
                print(proceed)

            elif extension in ['.xlsx', '.xls']:
                proceed = True
                print(proceed)
            else:
                raise ValueError("Unsupported file type")

        except FileNotFoundError:
            raise FileNotFoundError(f"File not found: {file_path}")

        return extension
