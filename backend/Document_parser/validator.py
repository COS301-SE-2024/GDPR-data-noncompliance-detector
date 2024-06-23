import os
import subprocess as sp

class validator:

    def anti_virus(self,file_path):
        defender_path = "C:\\ProgramData\\Microsoft\Windows Defender\Platform\\4.18.24040.4-0\\MpCmdRun.exe"        
        if not os.path.isfile(defender_path):
            raise FileNotFoundError(f"MpCmdRun.exe not found at {defender_path}")
        
        if not os.path.isfile(file_path):
            raise FileNotFoundError(f"File to scan not found at {file_path}")

        command = [defender_path, "-Scan", "-ScanType", "3", "-File", file_path]
        
        try:
            result = sp.run(command, stdout=sp.PIPE, stderr=sp.PIPE, text=True)
            print("Scan Result:", result.stdout)
            print("Scan Errors:", result.stderr)
            
            if result.returncode == 0:
                print(f"The file {file_path} was scanned successfully.")
            else:
                print(f"There was an issue scanning the file {file_path}.")
            
            return result.stdout, result.stderr
        except Exception as e:
            print(f"An error occurred while scanning the file: {e}")
            return None

    def process_file(self, file_path):
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

            elif extension in ['.xlsx']:
                proceed = True
                print(proceed)
            else:
                raise ValueError("Unsupported file type")

        except FileNotFoundError:
            raise FileNotFoundError(f"File not found: {file_path}")

        return extension
