from document_parser import document_parser
from detection_engine import detection_engine
import sys

def main():

    parser = document_parser()
    engine = detection_engine()
    path = input("File Name:  ")
    file = parser.process(path)
    result = engine.process(file)
    print(result)
    # print(file)
    
    

if __name__ == "__main__":
    try:
        main()
    except SystemExit as e:
        print("An error occurred: ", e)
        sys.exit(1)