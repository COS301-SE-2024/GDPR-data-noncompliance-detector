# from langdetect import detect_langs
# from langcodes import Language
# from guess_language import guess_language

class location_finder:
    EU_LANGUAGES = [
        'bg', 'ca', 'cs', 'cy', 'da', 'de', 'et', 'es', 'fi', 'fr', 'hr', 'hu', 
        'it', 'lt', 'lv', 'mk', 'nb', 'nl', 'pl', 'pt', 'pt_BR', 'pt_PT', 
        'ro', 'sk', 'sl', 'sv'
    ]
    
    # Non-EU languages
    NON_EU_LANGUAGES = [
        'ar', 'az', 'ceb', 'eu', 'fa', 'ha', 'haw', 'hi', 'id', 'is', 'kk', 'ky', 
        'la', 'mn', 'ne', 'nr', 'nso', 'ps', 'ru', 'so', 'sq', 'sr', 'ss', 'st', 
        'sw', 'tl', 'tlh', 'tn', 'tr', 'ts', 'uk', 'ur', 'uz', 've', 'xh', 'zu'
    ]

    def classify_language(self, language):
        if language == 'UNKNOWN' or language == 'en':  
            return "undefined"
        elif language in self.EU_LANGUAGES:
            return "EU"
        elif language in self.NON_EU_LANGUAGES:
            return "non-EU"
        else:
            return "undefined"

    def detect_country(self, file):
        # res = guess_language(text)
        # return self.classify_language(res)
        return 0
        # with open(file, 'r', encoding='utf-8') as file:
        #     data = file.read()
        # data = file

        # try:
        #     languages = detect_langs(data)
        #     # primary_language = str(languages[0]).split(':')[0]
        #     # return primary_language

        #     possible_languages = []

        #     for language in languages:
        #         country_code = language.lang
        #         full_country_name = Language.make(country_code).display_name()
        #         possible_languages.append((full_country_name, language.prob))

        #     return possible_languages

        # except Exception as e:
        #     print("Error:", e)
        #     return None

# def main():
    
#     file = "../../mock_data/language_data/polish.txt"
#     countries = detect_country(file)

#     if countries:
#         print("Most probable countries of origin:")
#         for country in countries:
#             print(f'Country: {country[0]}, Probability: {country[1]}')

#     else:
#         print("Could not determine the country of origin.")

# if __name__ == "__main__":
#     main()