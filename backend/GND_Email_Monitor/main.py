import threading
from GND_Email_Monitor import attachment_retrieval
from GND_Email_Monitor import outlook_uploads_monitor

def start_monitors():
    """Start both the Outlook watcher and folder monitor in parallel threads."""
    outlook_thread = threading.Thread(target=attachment_retrieval.main)
    folder_thread = threading.Thread(target=outlook_uploads_monitor.monitor_folder)
    
    outlook_thread.start()
    folder_thread.start()
    
    outlook_thread.join()
    folder_thread.join()

if __name__ == "__main__":
    start_monitors()
