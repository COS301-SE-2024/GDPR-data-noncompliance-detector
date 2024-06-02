from document_parser import document_parser

def main():

    path = input("File Name: ")
    parser = document_parser(path)
    parser.process()

if __name__ == "__main__":
    main()