from .lang_detection import location_finder
from .regex_layer import regex_layer

class detection_engine:

    def __init__(self):
        self.locale_search = location_finder()
        self.regex_filter = regex_layer()


    def determine_country_of_origin(self, path):
        countries = self.locale_search.detect_country(path)

        if countries:
            result  = "Most probable countries of origin:"
            for country in countries:
                result += '\n'
                result += f'Predominant Language of Country of Origin: {country[0]}, \nProbability: {country[1]}'
                result += '\n'

        else:
            result = "Could not determine the country of origin. /n"

        return result
    
    def regex_report(self, path):
        return self.regex_filter.process(path)

    def process(self, path):
        
        text = path

        location = self.determine_country_of_origin(path)
        reg_result = self.regex_report(text)

        result = location
        result += "\n"
        result+= "Violation Report: \n"
        result += reg_result

        return result


