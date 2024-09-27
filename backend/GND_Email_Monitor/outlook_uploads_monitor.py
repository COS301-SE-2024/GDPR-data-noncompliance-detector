import os
import time
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import errno

GND_FOLDER = os.path.expanduser("~/Documents/GND/outlook-uploads")
GND_DATA_FOLDER = os.path.expanduser("~/Documents/GND/outlook-uploads-data")

os.makedirs(GND_DATA_FOLDER, exist_ok=True)

API_URL = "http://localhost:8000/file-upload-new"

ALLOWED_EXTENSIONS = {'.docx', '.xls', '.xlsx', '.pdf'}

class FileUploadHandler(FileSystemEventHandler):
    """Handler to process files when a new file is created."""
    
    def on_created(self, event):
        """Triggered when a new file is created in the monitored folder."""
        if not event.is_directory:
            file_path = event.src_path
            file_extension = os.path.splitext(file_path)[1].lower()
            
            if file_extension in ALLOWED_EXTENSIONS:
                print(f"New file detected: {file_path}")
                self.upload_file(file_path)
            else:
                print(f"Ignored file (not a monitored type): {file_path}")
    
    def upload_file(self, file_path):
        try:
            time.sleep(2)
            
            #Send file to the API
            with open(file_path, 'rb') as file:
                files = {'file': file}
                response = requests.post(API_URL, files=files)
                
            if response.status_code == 200:
                api_response = response.json()
                print(f"File {file_path} uploaded successfully. Server response: {api_response}")      #For Logging
                
                self.delete_file(file_path)
                
                self.save_response_as_txt(file_path, api_response)
            
            else:
                print(f"Failed to upload file {file_path}. Server response: {response.text}")
        
        except PermissionError as e:
            print(f"Permission error while accessing the file {file_path}: {e}")
        
        except Exception as e:
            print(f"Error processing file {file_path}: {e}")
    
    def delete_file(self, file_path):
        try:
            os.remove(file_path)
            print(f"File {file_path} deleted successfully.")
        
        except PermissionError as e:
            print(f"Permission denied while trying to delete {file_path}: {e}")
        
        except OSError as e:
            if e.errno == errno.ENOENT:
                print(f"File {file_path} not found.")
            
            else:
                print(f"Error deleting file {file_path}: {e}")

    def save_response_as_txt(self, original_file_path, api_response):
        file_name_without_ext = os.path.splitext(os.path.basename(original_file_path))[0]

        txt_file_path = os.path.join(GND_DATA_FOLDER, f"{file_name_without_ext}.txt")
        
        try:
            with open(txt_file_path, 'w', encoding='utf-8') as txt_file:
                txt_file.write(str(api_response))
            
            print(f"API response saved to {txt_file_path}")                     #For Logging
        
        except Exception as e:
            print(f"Error saving API response to {txt_file_path}: {e}")

def monitor_folder():
    event_handler = FileUploadHandler()
    observer = Observer()
    observer.schedule(event_handler, GND_FOLDER, recursive=False)
    observer.start()
    
    print(f"Monitoring folder: {GND_FOLDER} for new files.")                    #For Logging
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    
    observer.join()

if __name__ == "__main__":
    monitor_folder()