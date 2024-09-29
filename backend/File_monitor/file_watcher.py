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
from winotify import Notification, audio
from urllib.parse import urlparse

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

API_URL = "http://localhost:8000/file-upload-new"

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

    # Expanded list of domains to include '1drv.com'
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

            # Added retry logic to handle delay in Zone.Identifier creation
            retries = 5  # Number of retries
            delay = 1    # Delay between retries in seconds

            for attempt in range(retries):
                try:
                    with open(zone_identifier_path, 'r') as f:
                        content = f.read()
                        print(f"[DEBUG] CONTENT: {content}")  # For debugging

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
                                        print(f"[INFO] File {ext} is from Teams-related domain: {domain}")
                                        return True
                        print(f"[INFO] File {ext} is not from a recognized Teams-related domain.")
                        return False
                except FileNotFoundError:
                    if attempt < retries - 1:
                        print(f"[WARN] Zone.Identifier not found for {ext}. Retrying {attempt + 1}/{retries}...")
                        time.sleep(delay)  # Wait before retrying
                        continue
                    else:
                        print(f"[ERROR] No Zone.Identifier found for {ext} after {retries} attempts.")
                        return False
                except Exception as e:
                    print(f"[ERROR] Error reading Zone.Identifier for {ext}: {e}")
                    return False
        elif platform.system() == 'Darwin':
            # Implement macOS logic here if needed
            return True

    except Exception as e:
        print(f"[ERROR] Error in verifyFromTeams: {e}")
        return False

class Handle(FileSystemEventHandler):
    def __init__(self, file_extension):
        self.file_extension = file_extension

    # Changed from 'on_any_event' to specific event handlers
    def on_created(self, event):
        self.process(event)

    def on_modified(self, event):
        self.process(event)

    # New method to process events
    def process(self, event):
        if event.is_directory:
            return None

        try:
            print(f"[DEBUG] Detected event: {event.event_type} for file: {event.src_path}")
            if check_file_extension(event.src_path, self.file_extension):
                # Added delay to ensure file and metadata are fully written
                print(f"[INFO] File {event.src_path} has a monitored extension. Waiting before processing...")
                time.sleep(2)  # Adjust the sleep duration if needed

                # Keep the original path format (no replacement)
                normalized_path = event.src_path
                print(f"[DEBUG] Normalized path: {normalized_path}")

                if verifyFromTeams(normalized_path):
                    print(f"[INFO] Processing file: {normalized_path}")
                    self.upload_file(normalized_path)
                    sys.stdout.flush()
                else:
                    print(f"[INFO] File {normalized_path} is not from Teams. Skipping upload.")
        except Exception as e:
            print(f"[ERROR] Error in process: {e}")

    def upload_file(self, file_path):
        try:
            # Additional wait to ensure the file is ready
            print(f"[INFO] Waiting before uploading file: {file_path}")
            time.sleep(1)
            with open(file_path, 'rb') as file:
                files = {'file': file}
                print(f"[INFO] Uploading file: {file_path} to API: {API_URL}")
                response = requests.post(API_URL, files=files)

            if response.status_code == 200:
                api_response = response.json()
                print(f"[INFO] File {file_path} uploaded successfully. Server response: {api_response}")

                toast = Notification(app_id="GND",
                                     title="New GND Report",
                                     msg="A new GND report is available",
                                     duration="short",
                                     icon=get_resource_path('assets/toast_logo.png'))

                toast.set_audio(audio.Default, loop=False)
                toast.show()

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
            print(f"[INFO] API response saved to {txt_file_path}")
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
        print(f"[INFO] Observer started for path: {path}")

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
            print(f"[INFO] Observer stopped for path: {path}")

def start_watcher_thread_downloads(ext, wt=3):
    downloads_path = str(Path.home() / "Downloads")
    global watcher_timer
    watcher_timer = wt

    global stop_watcher
    stop_watcher = False
    thread = threading.Thread(target=startWatcher, args=(downloads_path, ext))
    thread.start()
    print(f"[INFO] Watcher thread started for extensions: {ext}")
    return thread

def stop_watcher_thread(thread):
    global stop_watcher
    stop_watcher = True
    thread.join()
    print("[INFO] Watcher thread stopped.")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    print("[INFO] Starting file watcher...")
    start_watcher_thread_downloads("pdf,xlsx,docx", 1)  # default is 1 second
