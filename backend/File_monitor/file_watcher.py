import sys
import time
import logging
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEvent, FileSystemEventHandler
import os
import threading
import platform
from pathlib import Path
import requests
import errno
if platform.system() == 'Windows':
    from winotify import Notification, audio
# from winotify import Notification, audio
from urllib.parse import urlparse
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64
import json

encryption_key = 'IWIllreplacethislaterIWIllreplac'

API_URL = "http://localhost:8000/file-upload-new-monitor"

GND_FOLDER = os.path.expanduser("~/Documents/GND/downloads-uploads")
GND_DATA_FOLDER = os.path.expanduser("~/Documents/GND/downloads-uploads-data")

os.makedirs(GND_DATA_FOLDER, exist_ok=True)

def decrypt(encrypted_data, key):
    encrypted_data_bytes = base64.b64decode(encrypted_data)
    
    iv = encrypted_data_bytes[:32]
    ciphertext = encrypted_data_bytes[32:]
    
    cipher = AES.new(key.encode('utf-8'), AES.MODE_CBC, iv)
    
    decrypted_data = unpad(cipher.decrypt(ciphertext), AES.block_size)
    
    return json.loads(decrypted_data.decode('utf-8'))

def get_domain(url):
    try:
        parsed_url = urlparse(url)
        return parsed_url.hostname
    except Exception as e:
        print(f"Error parsing URL {url}: {e}")
        return None

GND_FOLDER = os.path.expanduser("~/Documents/GND/downloads-uploads")
GND_DATA_FOLDER = os.path.expanduser("~/Documents/GND/downloads-uploads-data")

os.makedirs(GND_DATA_FOLDER, exist_ok=True)

API_URL = "http://localhost:8000/file-upload-new-monitor"

def get_resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except AttributeError:
        base_path = os.path.abspath(".")
        
    return os.path.join(base_path, relative_path)

def check_file_extension(filename, reg):
    try:
        for str_ext in reg:
            if (filename.endswith(f".{str_ext}") and ".download" not in filename):
                return True
    except Exception as e:
        print(f"error in check_file_extension: {e}")

    return False

def verifyFromTeams(ext):
    if isinstance(ext, bytes):
        ext = ext.decode('utf-8')

    domains = [
        'my.sharepoint.com',
        'teams.microsoft.com',
        'teams.live.com',
        'onedrive.live.com',
        'sharepoint.com',
        'live.com',
        'office.com',
        'microsoft.com',
        '1drv.ms',
        '1drv.com',  # Added '1drv.com' to cover additional URLs
        'graph.microsoft.com',
        'files.teams.microsoft.com',
        'login.microsoftonline.com',
        'sharepointonline.com',
        'office365.com',
        'sfbassets.com',
        'cdn.teams.microsoft.com'
    ]

    try:
        if platform.system() == 'Windows':
            zone_identifier_path = ext + ':Zone.Identifier'

            retries = 3  #Retries to find Zone Identifier
            delay = 1

            for attempt in range(retries):
                try:
                    with open(zone_identifier_path, 'r') as f:
                        content = f.read()
                        # print(f"[D.EBUG] CONTENT: {content}")  #For logging

                        urls = []
                        for line in content.splitlines():
                            if line.startswith('ReferrerUrl=') or line.startswith('HostUrl='):
                                url = line.split('=', 1)[1]
                                urls.append(url)
                        for url in urls:
                            domain = get_domain(url)
                            if domain:
                                for d in domains:
                                    if domain == d or domain.endswith('.' + d):
                                        # print(f"[INFO] File {ext} is from Teams-related domain: {domain}")
                                        return True
                        # print(f"[INFO] File {ext} is not from a recognized Teams-related domain.")
                        return False
                except FileNotFoundError:
                    if attempt < retries - 1:
                        # print(f"[WARN] Zone.Identifier not found for {ext}. Retrying {attempt + 1}/{retries}...")
                        time.sleep(delay)
                        continue
                    else:
                        # print(f"[ERROR] No Zone.Identifier found for {ext} after {retries} attempts.")
                        return False
                except Exception as e:
                    # print(f"[ERROR] Error reading Zone.Identifier for {ext}: {e}")
                    return False
        
        elif platform.system() == 'Darwin':
            # Implement macOS logic here if needed
            return True

    except Exception as e:
        # print(f"[ERROR] Error in verifyFromTeams: {e}")
        return False

class Handle(FileSystemEventHandler):
    def __init__(self, file_extension):
        self.file_extension = file_extension
    
    def on_modified(self, event):
        self.process(event)

    def on_modified(self, event):
        self.process(event)

    # New method to process events
    def process(self, event):
        if event.is_directory:
            return None

        try:
            # print(f"[DEBUG] Detected event: {event.event_type} for file: {event.src_path}")
            if check_file_extension(event.src_path, self.file_extension):
                # print(f"[INFO] File {event.src_path} has a monitored extension. Waiting before processing...")
                time.sleep(2)

                normalized_path = event.src_path
                # print(f"[DEBUG] Normalized path: {normalized_path}")

                if verifyFromTeams(normalized_path):
                    # print(f"[INFO] Processing file: {normalized_path}")
                    self.upload_file(normalized_path)
                    sys.stdout.flush()
                # else:
                    # print(f"[INFO] File {normalized_path} is not from Teams. Skipping upload.")
        except Exception as e:
            print(f"[ERROR] Error in process: {e}")

    def upload_file(self, file_path):
        try:
            # print(f"[INFO] Waiting before uploading file: {file_path}")
            time.sleep(1)
            with open(file_path, 'rb') as file:
                files = {'file': file}
                # print(f"[INFO] Uploading file: {file_path} to API: {API_URL}")
                response = requests.post(API_URL, files=files)

            if response.status_code == 200:

                api_response = response.json()
                # print(f"[INFO] File {file_path} uploaded successfully. Server response: {api_response}")

                self.save_response_as_txt(file_path, api_response)
            else:
                print(f"[ERROR] Failed to upload file {file_path}. Server response: {response.text}")

        except PermissionError as e:
            print(f"[ERROR] Permission error while accessing the file {file_path}: {e}")

        except Exception as e:
            print(f"[ERROR] Error processing file {file_path}: {e}")

    def save_response_as_txt(self, original_file_path, api_response):
        file_name_without_ext = os.path.splitext(os.path.basename(original_file_path))[0]
        txt_file_path = os.path.join(GND_DATA_FOLDER, f"{file_name_without_ext}.txt")

        try:
            with open(txt_file_path, 'w', encoding='utf-8') as txt_file:
                txt_file.write(str(api_response))
                if platform.system() == 'Windows':
                    toast = Notification(app_id="GND",
                                        title="New GND Report",
                                        msg="A new GND report is available",
                                        duration="short",
                                        icon=get_resource_path('assets/toast_logo.png'))

                    toast.set_audio(audio.Default, loop=False)
                    toast.show()

            # print(f"[INFO] API response saved to {txt_file_path}")
        except Exception as e:
            print(f"[ERROR] Error saving API response to {txt_file_path}: {e}")

stop_watcher = False
watcher_thread = None

def startWatcher(paths, ext):
    global stop_watcher

    paths = paths.split(',')
    ext = ext.split(',')
    observers = []
    for path in paths:
        logging.info(f'Start watching directory {path!r}')
        event_handler = Handle(ext)
        observer = Observer()
        observer.schedule(event_handler, path, recursive=True)
        observers.append(observer)
        observer.start()
        # print(f"[INFO] Observer started for path: {path}")

    try:
        while not stop_watcher:
            time.sleep(1)
    except KeyboardInterrupt:
        print("[INFO] KeyboardInterrupt received. Stopping watchers...")
    except Exception as e:
        print(f"[ERROR] Error in startWatcher: {e}")
    finally:
        for observer in observers:
            observer.stop()
            observer.join()
            # print(f"[INFO] Observer stopped for path: {path}")

def start_watcher_thread_downloads(ext, wt=3):
    downloads_path = str(Path.home() / "Downloads")
    global watcher_timer
    watcher_timer = wt

    global stop_watcher
    stop_watcher = False
    thread = threading.Thread(target=startWatcher, args=(downloads_path, ext))
    thread.start()
    # print(f"[INFO] Watcher thread started for extensions: {ext}")
    return thread

def stop_watcher_thread(thread):
    global stop_watcher
    stop_watcher = True
    thread.join()
    # print("[INFO] Watcher thread stopped.")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    print("[INFO] Starting file watcher...")
    start_watcher_thread_downloads("pdf,xlsx,docx", 1)

# define 2 functions. one which watches a folder. one wich watches downloads
# import sys
# import time
# import logging
# import json
# from watchdog.observers import Observer
# from watchdog.events import FileSystemEvent, FileSystemEventHandler
# import os
# import threading
# # import xattr
# import plistlib
# import platform
# from pathlib import Path
# from biplist import readPlistFromString




# # run with start_watcher_thread(paths, extensions, time to wait between checks)

# # take in input string to run command
# # take in path and automatically look for

# # runs with : python file_watcher.py <path1>,<pathN> <file_extension1>,<file_extensionN>
# # example: python file_watcher.py /Users/a txt,pdf


# # scan_directories("/Users/Library/CloudStorage/OneDrive-Personal/Uni/a", "txt,pdf")
# # {"type": "found", "path": "/Users/Library/CloudStorage/OneDrive-Personal/Uni/a/test.txt"}
# # {"type": "found", "path": "/Users/Library/CloudStorage/OneDrive-Personal/Uni/a/dir2/abc.txt"}


# def check_file_extension(filename, reg):
#     # print("filename : ", filename, "reg : ", reg) 
#     # print(f"filename : {filename} -- reg : {reg}")
#     try:
#         for str in reg:
#             if (filename.endswith(f".{str}") and ".download" not in filename):
#                 return True
#     except Exception as e:
#         print(f"error in file_watcher-checkfileextension : {e}")

#     return False


# def verifyFromTeams(ext):
#     if isinstance(ext, bytes):
#         ext = ext.decode('utf-8')

#     # look at files properties for my.sharepoint.com (possibly teams.microsoft.com)
#     # trigger function when monitor sees a new file
#     domains = [
#         'my.sharepoint.com',
#         'teams.microsoft.com',
#         'teams.live.com',
#         'onedrive.live.com',
#         'sharepoint.com',
#         'live.com',
#         'office.com',
#         'microsoft.com',
#         '1drv.ms'
#     ]

#     try:
#         if platform.system() == 'Darwin':
#             downloads_path = str(Path.home() / "Downloads")
#         #     # print(downloads_path)
#         #     attributes = xattr.xattr(f"{ext}")
            
#         #     where_from_key = 'com.apple.metadata:kMDItemWhereFroms'
#         #     raw_metadata = xattr.getxattr(ext, where_from_key)
#         #     plist_data = readPlistFromString(raw_metadata)
#         #     for item in plist_data:
#         #         for domain in domains:
#         #             if domain in item:
#         #                 # print("teams")
#         #                 return True

#         #     return False
        
#         elif platform.system() == 'Windows':
#             zone_identifier_path = ext + ':Zone.Identifier'

#             if os.path.exists(zone_identifier_path):
#                 with open(zone_identifier_path, 'r') as f:
#                     content = f.read()
#                     for domain in domains:
#                         if domain in content:
#                             # print("file is from teams")
#                             return True
#             return False

#     except Exception as e:
#         print(f"error in file_watcher-verifyfromteams : {e}")


# def scan_directories(paths, extensions):
#     paths = paths.split(',')
#     extensions = extensions.split(',')
#     for path in paths:
#         for root, _, files in os.walk(path):
#             for file in files:
#                 if check_file_extension(file, extensions):
#                     print(json.dumps({"type": "found", "path": os.path.join(root, file)}))


# watcher_timer = 3

# class handle(FileSystemEventHandler):
#     # backslash to foward slash. path is actual path. string output only. look for default install folder for outlook and teams
#     # problem, its not identifying .pdf as normal. only .download.pdf and verify from teams running after that but .downlload.pdf doesnt exist
    
#     def __init__(self, file_extension):
#         self.file_extension = file_extension
#         self.prev_output = time.time()
    
#     def on_any_event(self, event):
#         try:
#             global watcher_timer
#             current_time = time.time()
#             # print("mov")
#             if (check_file_extension(event.src_path, self.file_extension) and current_time - self.prev_output >= watcher_timer): # watching every 3 seconds
#                 self.prev_output = current_time
                
#                 if (event.src_path.find("\\") != -1):
#                     event.src_path = event.src_path.replace("\\", "/")

#                 if (verifyFromTeams(event.src_path)):
#                     print(event.src_path)
#                     return event.src_path
#         except Exception as e:
#             print(f"error in file_watcher-on_any_event : {e}")

#     # def on_modified(self, event):
#     #     global watcher_timer
#     #     current_time = time.time()
        
#     #     if (check_file_extension(event.src_path, self.file_extension) and current_time - self.prev_output >= watcher_timer): # watching every 3 seconds
#     #         self.prev_output = current_time
#     #         # print("mod")
#     #         if (event.src_path.find("\\") != -1):
#     #             event.src_path = event.src_path.replace("\\", "/")

#     #         if (verifyFromTeams(event.src_path)):
#     #             return event.src_path

#     # def on_created(self, event):
#     #     global watcher_timer
#     #     current_time = time.time()
        

#     #     if (check_file_extension(event.src_path, self.file_extension) and current_time - self.prev_output >= watcher_timer):
#     #         self.prev_output = current_time
#     #         # print("cre")
#     #         if (event.src_path.find("\\") != -1):
#     #             event.src_path = event.src_path.replace("\\", "/")

#     #         if (verifyFromTeams(event.src_path)):
#     #             return event.src_path



#     # def on_deleted(self, event):
#     #     print(f'{event.event_type}  path : {event.src_path}')


# stop_watcher = False
# watcher_thread = None

# def startWatcher(paths, ext):
#     global stop_watcher

#     paths = paths.split(',')
#     ext = ext.split(',')
#     observers = []
#     # print(f"Watcher is watching: {paths} with extensions: {ext}")
#     for path in paths:
#         logging.info(f'start watching directory {path!r}')
#         event_handler = handle(ext)
#         observer = Observer()
#         observer.schedule(event_handler, path, recursive=True) # watches subfolders
#         observers.append(observer)
#         observer.start()
#     try:
#         while not stop_watcher:
#             time.sleep(1)
#     except KeyboardInterrupt:
#         pass
#     except Exception as e:
#         print(f"error in file_watcher-startwatcher : {e}")
#     finally:
#         for observer in observers:
#             observer.stop()
#             observer.join()


# def start_watcher_thread_downloads(ext, wt=3):  # default is 3 seconds
#     # this function will watch the downloads dir and will first check
#     #   if the file is from teams then it will log it
#     downloads_path = str(Path.home() / "Downloads")
#     # print(downloads_path)
#     global watcher_timer
#     watcher_timer = wt

#     global stop_watcher
#     stop_watcher = False
#     thread = threading.Thread(target=startWatcher, args=(downloads_path, ext))
#     thread.start()
#     return thread



# def stop_watcher_thread(thread):
#     global stop_watcher
#     stop_watcher = True
#     thread.join()


# if __name__ == "__main__":
#     logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
#     # if (len(sys.argv) < 3):
#     #     logging.error("Please provide the path and file extension")
#     #     sys.exit(1)

#     # start_watcher_thread(sys.argv[1], sys.argv[2], 1)
#     # verifyFromTeams('sf')
#     start_watcher_thread_downloads("pdf,xlsx,docx", 1)  # default is 3 seconds
