import os
import subprocess as sp

class validator:

    # def anti_virus(self,file_path):
    #     try:
    #         mp_cmd_run = "C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\*\\MpCmdRun.exe"
    #         command = f"{mp_cmd_run} -Scan -ScanType 3 -File {file_path} -DisableRemediation"
            
    #         result = sp.run(["powershell", "-Command", command], capture_output=True, text=True, check=True)
            
    #         print(result.stdout)
    #     except sp.CalledProcessError as e:
    #         raise RuntimeError(f"Virus Scan Failed : {e}")


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

            elif extension in ['.xlsx', '.xls']:
                proceed = True
                print(proceed)
            else:
                raise ValueError("Unsupported file type")

        except FileNotFoundError:
            raise FileNotFoundError(f"File not found: {file_path}")

        return extension
