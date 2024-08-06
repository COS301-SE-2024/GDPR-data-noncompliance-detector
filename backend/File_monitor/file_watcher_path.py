import sys
import time
import logging
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEvent, FileSystemEventHandler
import os
import threading
import xattr
import plistlib
import platform
from pathlib import Path
from biplist import readPlistFromString




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
    
    def on_modified(self, event):
        global watcher_timer
        current_time = time.time()
        
        if (check_file_extension(event.src_path, self.file_extension) and current_time - self.prev_output >= watcher_timer): # watching every 3 seconds
            self.prev_output = current_time
            # print("mod")
            if (event.src_path.find("\\") != -1):
                event.src_path = event.src_path.replace("\\", "/")

            print(event.src_path)
            return event.src_path


    def on_created(self, event):
        global watcher_timer
        current_time = time.time()

        if (check_file_extension(event.src_path, self.file_extension) and current_time - self.prev_output >= watcher_timer):
            self.prev_output = current_time
            # print("cre")
            if (event.src_path.find("\\") != -1):
                event.src_path = event.src_path.replace("\\", "/")

            print(event.src_path)
            return event.src_path
            

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


def start_watcher_thread_path(paths, ext, wt=3):  # default is 3 seconds
    # this function will watch a specific dir for the extensions and logs all 
    #   file updates/additions in the dir
    global watcher_timer
    watcher_timer = wt

    global stop_watcher
    stop_watcher = False
    thread = threading.Thread(target=startWatcher, args=(paths, ext))
    thread.start()
    return thread


def stop_watcher_thread(thread):
    global stop_watcher
    stop_watcher = True
    thread.join()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    # if (len(sys.argv) < 3):
    #     logging.error("Please provide the path and file extension")
    #     sys.exit(1)

    # start_watcher_thread(sys.argv[1], sys.argv[2], 1)
    # verifyFromTeams('sf')
    start_watcher_thread_path("/Users/yudigovender/Downloads/COS326 Lecture 4 Demo Files", "pdf,xlsx,docx", 1)  # default is 3 seconds


    # define 2 functions. one which watches a folder. one wich watches downloads
