import sys
import time
import logging
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# take in input string to run command
# take in path and automatically look for

# runs with : python file_watcher.py <path1>,<pathN> <file_extension>
# eg : python3 file_watcher.py /Users/Library/CloudStorage/OneDrive-Personal/Uni/a,/Users/Library/CloudStorage/OneDrive-Personal/Uni/b txt,pdf
# output:
# 2024-06-10 16:38:20 - start watching directory '/Users/Library/CloudStorage/OneDrive-Personal/Uni/a'
# 2024-06-10 16:38:20 - start watching directory '/Users/Library/CloudStorage/OneDrive-Personal/Uni/b'
# {"type": "created", "path": "/Users/Library/CloudStorage/OneDrive-Personal/Uni/a/test.txt"}
# {"type": "modified", "path": "/Users/Library/CloudStorage/OneDrive-Personal/Uni/a/test.txt"}
# {"type": "created", "path": "/Users/Library/CloudStorage/OneDrive-Personal/Uni/b/test.pdf"}
# {"type": "modified", "path": "/Users/Library/CloudStorage/OneDrive-Personal/Uni/b/test.pdf"}


def check_file_extension(filename, reg):
    for str in reg:
        if filename.endswith(f".{str}"):
            return True


class handle(FileSystemEventHandler):
    def __init__(self, file_extension):
        self.file_extension = file_extension

    def on_modified(self, event):
        # print(f'{event.event_type}  path : {event.src_path}')
        if (check_file_extension(event.src_path, self.file_extension)):
            print(json.dumps({"type": "modified", "path": event.src_path}))
            return json.dumps({"type": "modified", "path": event.src_path})

    def on_created(self, event):
        # print(f'{event.event_type}  path : {event.src_path}')
        if (check_file_extension(event.src_path, self.file_extension)):
            print(json.dumps({"type": "created", "path": event.src_path}))
            return json.dumps({"type": "created", "path": event.src_path})

    # def on_deleted(self, event):
    #     print(f'{event.event_type}  path : {event.src_path}')


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    if (len(sys.argv) < 3):
        logging.error("Please provide the path and file extension")
        sys.exit(1)

    paths = sys.argv[1].split(',')
    ext = sys.argv[2]
    extparams = ext.split(',')
    observers = []

    for path in paths:
        logging.info(f'start watching directory {path!r}')
        event_handler = handle(extparams)
        observer = Observer()
        observer.schedule(event_handler, path, recursive=True) # watches subfolders
        observers.append(observer)
        observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        for observer in observers:
            observer.stop()
    finally:
        for observer in observers:
            observer.join()
