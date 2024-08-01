import queue
import threading
import uuid
from Document_parser.document_parser import document_parser
from Detection_Engine.detection_engine import detection_engine

task_queue = queue.Queue()
result_queue = queue.Queue()
results = {}

def document_parser_worker():
    while True:
        task_id, path = task_queue.get()
        if path is None:
            break
        parser = document_parser()
        file = parser.process(path)
        result_queue.put((task_id, file))
        task_queue.task_done()

def detection_engine_worker():
    while True:
        task_id, file = result_queue.get()
        if file is None:
            break
        engine = detection_engine()
        result = engine.process(file)
        results[task_id] = result
        result_queue.task_done()

def start_workers():
    threading.Thread(target=document_parser_worker, daemon=True).start()
    threading.Thread(target=detection_engine_worker, daemon=True).start()
