from langdetect import detect_langs
from langcodes import Language

def detect_country(file):
    with open(file, 'r', encoding='utf-8') as file:
        data = file.read()

    try:
        languages = detect_langs(data)
        # primary_language = str(languages[0]).split(':')[0]
        # return primary_language

        possible_languages = []

        for language in languages:
            country_code = language.lang
            full_country_name = Language.make(country_code).display_name()
            possible_languages.append((full_country_name, language.prob))

        return possible_languages

    except Exception as e:
        print("Error:", e)
        return None

def main():
    
    file = "../../mock_data/language_data/polish.txt"
    countries = detect_country(file)

    if countries:
        print("Most probable countries of origin:")
        for country in countries:
            print(f'Country: {country[0]}, Probability: {country[1]}')

    else:
        print("Could not determine the country of origin.")


if __name__ == "__main__":
    main()