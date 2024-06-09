from lang_detection import location_finder

class detection_engine:

    def __init__(self):
        self.locale_search = location_finder()


    def determine_country_of_origin(self, path):
        countries = self.locale_search.detect_country(path)

        if countries:
            result  = "Most probable countries of origin:"
            for country in countries:
                result += '\n'
                result += f'Predominant Language of Country of Origin: {country[0]}, Probability: {country[1]}'
                result += '\n'

        else:
            result = "Could not determine the country of origin."

        return result

    def process(self, path):
        
        location = self.determine_country_of_origin(path)

        return location

