from document_parser import document_parser
import sys

def main():

    path = input("File Name: ")
    parser = document_parser(path)
    parser.process()

if __name__ == "__main__":
    try:
        main()
    except SystemExit as e:
        print("An error occurred: ", e)
        sys.exit(1)