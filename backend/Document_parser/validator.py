import os
import subprocess as sp

class validator:

    def anti_virus(self,file_path):
        try:
            command = f"Start-MpScan -ScanPath {file_path} -ScanType QuickScan"
            sp.run(["powershell","-Command",command], check=True)
        except sp.CalledProcessError as e:
            raise RuntimeError(f"Virus Scan Failed : {e}")


    def process_file(self, file_path):
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")

            print("Initial Virus Scan :")
            self.anti_virus(file_path)

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
