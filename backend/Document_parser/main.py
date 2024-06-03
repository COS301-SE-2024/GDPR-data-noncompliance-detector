from document_parser import document_parser
from lang_detection import location_finder
import sys

def main():

    path = input("File Name: ")
    parser = document_parser(path)
    file = parser.process()
    print(file)
    locale_search = location_finder()
    countries = locale_search.detect_country(file)

    if countries:
        print("Most probable countries of origin:")
        for country in countries:
            print(f'Country: {country[0]}, Probability: {country[1]}')

    else:
        print("Could not determine the country of origin.")
    

if __name__ == "__main__":
    try:
        main()
    except SystemExit as e:
        print("An error occurred: ", e)
        sys.exit(1)