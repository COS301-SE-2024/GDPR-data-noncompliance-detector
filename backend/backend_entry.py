from Document_parser.document_parser import document_parser
from Detection_Engine.detection_engine import detection_engine
import sys

class backend_entry:

    @staticmethod
    def process(path):

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
        backend_entry.process()
    except SystemExit as e:
        print("An error occurred: ", e)
        sys.exit(1)