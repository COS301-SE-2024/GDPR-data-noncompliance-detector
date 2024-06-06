import sys
import time
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


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
            print(f"modified:{event.src_path}")

    def on_created(self, event):
        # print(f'{event.event_type}  path : {event.src_path}')
        if (check_file_extension(event.src_path, self.file_extension)):
            print(f"created:{event.src_path}")

    # def on_deleted(self, event):
    #     print(f'{event.event_type}  path : {event.src_path}')


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    path = sys.argv[1]
    ext = sys.argv[2]
    extparams = ext.split(',')
    logging.info(f'start watching directory {path!r}')
    
    event_handler = handle(extparams)
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True) # watches subfolders
    observer.start()

    try:
        while True:
            time.sleep(1)
    finally:
        observer.stop()
        observer.join()
