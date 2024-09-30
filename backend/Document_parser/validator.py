import os
import subprocess as sp

class validator:

    def process_file(self, file_path):
        print("CURRENT WORKING DIR -------", os.getcwd())
        os.system('ls -a')
        os.chdir('..')
        print("CURRENT WORKING DIR -------", os.getcwd())
        os.system('ls -a')

        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")

            # print("Initial Virus Scan :")
            # self.anti_virus(file_path)

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
        
        except ValueError as ve:
            print(ve)
            return None
        
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

        return extension
