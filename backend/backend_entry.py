import queue
import threading
from Document_parser.document_parser import document_parser
from Detection_Engine.detection_engine import detection_engine
import sys

file_queue = queue.Queue()
result_holder = queue.Queue()

def document_parser_worker(path):
    parser = document_parser()
    file = parser.process(path)
    file_queue.put(file) 

def detection_engine_worker():
    engine = detection_engine()
    while True:
        file = file_queue.get()
        if file is None:
            break
        result = engine.process(file)
        file_queue.task_done() 
        result_holder.put(result)


class backend_entry:

    @staticmethod
    def mq_process(path):
        parser_thread = threading.Thread(target=document_parser_worker, args=(path,))
        engine_thread = threading.Thread(target=detection_engine_worker)

        parser_thread.start()
        engine_thread.start()

        parser_thread.join() 
        file_queue.put(None)
        engine_thread.join()

        if result_holder.empty():
            return "No result available"

        result = result_holder.get()
        return result
    
    def process(self, path):
        parser = document_parser()
        engine = detection_engine()
        # path = input("File Name:  ")
        file = parser.process(path)
        result = engine.process(file)
        # print(result)

        # print(file)
        return result


if __name__ == "__main__":
    try:
        res = backend_entry.process("C:/Users/Mervyn Rangasamy/Documents/2024/COS 301/Capstone/Repo/GDPR-data-noncompliance-detector/backend/mockdata/NCE1.pdf")
        print(res)
    except SystemExit as e:
        print("An error occurred: ", e)
        sys.exit(1)