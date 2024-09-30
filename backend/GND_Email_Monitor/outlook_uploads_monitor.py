import os, sys
import time
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import errno
import platform
if platform.system() == "Windows":
    from winotify import Notification, audio
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64
import json

encryption_key = 'IWIllreplacethislaterIWIllreplac'

GND_FOLDER = os.path.expanduser("~/Documents/GND/outlook-uploads")
GND_DATA_FOLDER = os.path.expanduser("~/Documents/GND/outlook-uploads-data")

os.makedirs(GND_DATA_FOLDER, exist_ok=True)

def decrypt(encrypted_data, key):
    try:
        # Decode the base64 encoded string
        raw_data = base64.b64decode(encrypted_data)
        
        # Split the data into iv and ciphertext (since it's CBC mode)
        iv = raw_data[:16]  # AES block size is 16 bytes
        ciphertext = raw_data[16:]

        # Create the AES cipher with the same key and IV
        cipher = AES.new(key.encode('utf-8'), AES.MODE_CBC, iv)
        
        # Decrypt the ciphertext
        decrypted_data = unpad(cipher.decrypt(ciphertext), AES.block_size)
        
        # Convert from bytes back to JSON
        return json.loads(decrypted_data.decode('utf-8'))
    except (ValueError, KeyError) as e:
        raise ValueError(f"Decryption failed: {str(e)}")

def get_resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except AttributeError:
        base_path = os.path.abspath(".")
        
    return os.path.join(base_path, relative_path)

API_URL = "http://localhost:8000/file-upload-new-monitor"

ALLOWED_EXTENSIONS = {'.docx', '.xlsx', '.pdf'}

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

            if platform.system() == "Windows":
                toast = Notification(app_id="GND",
                        title="New GND Report",
                        msg="A new GND report is available",
                        duration="short",
                        icon=get_resource_path('assets/toast_logo.png'))

                toast.set_audio(audio.Default, loop=False)

                toast.show()
        
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
