import sys
import time
import logging
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEvent, FileSystemEventHandler
import os
import threading
# import xattr
import plistlib
import platform
from pathlib import Path
from biplist import readPlistFromString
import requests
import errno


GND_FOLDER = os.path.expanduser("~/Documents/GND/downloads-uploads")
GND_DATA_FOLDER = os.path.expanduser("~/Documents/GND/downloads-uploads-data")

os.makedirs(GND_DATA_FOLDER, exist_ok=True)

API_URL = "http://localhost:8000/file-upload-new"



# run with start_watcher_thread(paths, extensions, time to wait between checks)

# take in input string to run command
# take in path and automatically look for

# runs with : python file_watcher.py <path1>,<pathN> <file_extension1>,<file_extensionN>
# example: python file_watcher.py /Users/a txt,pdf


# scan_directories("/Users/Library/CloudStorage/OneDrive-Personal/Uni/a", "txt,pdf")
# {"type": "found", "path": "/Users/Library/CloudStorage/OneDrive-Personal/Uni/a/test.txt"}
# {"type": "found", "path": "/Users/Library/CloudStorage/OneDrive-Personal/Uni/a/dir2/abc.txt"}


def check_file_extension(filename, reg):
    # print("filename : ", filename, "reg : ", reg) 
    # print(f"filename : {filename} -- reg : {reg}")
    try:
        for str in reg:
            if (filename.endswith(f".{str}") and ".download" not in filename):
                return True
    except Exception as e:
        print(f"error in file_watcher-checkfileextension : {e}")

    return False


def verifyFromTeams(ext):
    if isinstance(ext, bytes):
        ext = ext.decode('utf-8')

    # look at files properties for my.sharepoint.com (possibly teams.microsoft.com)
    # trigger function when monitor sees a new file
    domains = [
        'my.sharepoint.com',
        'teams.microsoft.com',
        'teams.live.com',
        'onedrive.live.com',
        'sharepoint.com',
        'live.com',
        'office.com',
        'microsoft.com',
        '1drv.ms'
    ]

    try:
        if platform.system() == 'Darwin':
            downloads_path = str(Path.home() / "Downloads")
        #     # print(downloads_path)
        #     attributes = xattr.xattr(f"{ext}")
            
        #     where_from_key = 'com.apple.metadata:kMDItemWhereFroms'
        #     raw_metadata = xattr.getxattr(ext, where_from_key)
        #     plist_data = readPlistFromString(raw_metadata)
        #     for item in plist_data:
        #         for domain in domains:
        #             if domain in item:
        #                 # print("teams")
        #                 return True

        #     return False
        
        elif platform.system() == 'Windows':
            zone_identifier_path = ext + ':Zone.Identifier'

            if os.path.exists(zone_identifier_path):
                with open(zone_identifier_path, 'r') as f:
                    content = f.read()
                    for domain in domains:
                        if domain in content:
                            # print("file is from teams")
                            return True
            return False

    except Exception as e:
        print(f"error in file_watcher-verifyfromteams : {e}")


def scan_directories(paths, extensions):
    paths = paths.split(',')
    extensions = extensions.split(',')
    for path in paths:
        for root, _, files in os.walk(path):
            for file in files:
                if check_file_extension(file, extensions):
                    print(json.dumps({"type": "found", "path": os.path.join(root, file)}))


watcher_timer = 3

class handle(FileSystemEventHandler):
    # backslash to foward slash. path is actual path. string output only. look for default install folder for outlook and teams
    # problem, its not identifying .pdf as normal. only .download.pdf and verify from teams running after that but .downlload.pdf doesnt exist
    
    def __init__(self, file_extension):
        self.file_extension = file_extension
        self.prev_output = time.time()
    
    def on_any_event(self, event):
        try:
            global watcher_timer
            current_time = time.time()
            # print("mov")
            if (check_file_extension(event.src_path, self.file_extension) and current_time - self.prev_output >= watcher_timer): # watching every 3 seconds
                self.prev_output = current_time
                
                if (event.src_path.find("\\") != -1):
                    event.src_path = event.src_path.replace("\\", "/")

                if (verifyFromTeams(event.src_path)):
                    print(event.src_path)
                    #is from teams and
                    self.upload_file(event.src_path)

                    sys.stdout.flush()

                    # return event.src_path
        except Exception as e:
            print(f"error in file_watcher-on_any_event : {e}")

    def upload_file(self, file_path):
        try:
            time.sleep(2)
            
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

    # def on_deleted(self, event):
    #     print(f'{event.event_type}  path : {event.src_path}')


stop_watcher = False
watcher_thread = None

def startWatcher(paths, ext):
    global stop_watcher

    paths = paths.split(',')
    ext = ext.split(',')
    observers = []
    # print(f"Watcher is watching: {paths} with extensions: {ext}")
    for path in paths:
        logging.info(f'start watching directory {path!r}')
        event_handler = handle(ext)
        observer = Observer()
        observer.schedule(event_handler, path, recursive=True) # watches subfolders
        observers.append(observer)
        observer.start()
    try:
        while not stop_watcher:
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"error in file_watcher-startwatcher : {e}")
    finally:
        for observer in observers:
            observer.stop()
            observer.join()


def start_watcher_thread_downloads(ext, wt=3):  # default is 3 seconds
    # this function will watch the downloads dir and will first check
    #   if the file is from teams then it will log it
    downloads_path = str(Path.home() / "Downloads")
    # print(downloads_path)
    global watcher_timer
    watcher_timer = wt

    global stop_watcher
    stop_watcher = False
    thread = threading.Thread(target=startWatcher, args=(downloads_path, ext))
    thread.start()
    return thread



def stop_watcher_thread(thread):
    global stop_watcher
    stop_watcher = True
    thread.join()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    
    start_watcher_thread_downloads("pdf,xlsx,docx", 1)  # default is 3 seconds



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


#     # define 2 functions. one which watches a folder. one wich watches downloads
