import re
from .lang_detection import location_finder
from .regex_layer import regex_layer
from .report_generation_layer import report_generation_layer

class detection_engine:

    def __init__(self):
        self.locale_search = location_finder()
        self.regex_filter = regex_layer()
        self.report_generator = report_generation_layer()


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
    
    def regex_report_personal(self, path):
        return self.regex_filter.categorize_and_report_personal(path)
    
    def regex_report_financial(self, path):
        return self.regex_filter.categorize_and_report_financial(path)
    
    def regex_report_contact(self, path):
        return self.regex_filter.categorize_and_report_contact(path)
    
    def biometric_and_image_report(self, path):
        return self.biometric_and_image_report(path)
    
    def extract_number(self, ner_result):
        pattern = r'\d+'
        
        match = re.search(pattern, ner_result)
        
        if match:
            return int(match.group())
        else:
            return 0

    def flag(self, ner_result, reg_result_contact,reg_result_financial,reg_result_personal, gi_result, em_result):
        ner_val = self.extract_number(ner_result)
        total = ner_val + reg_result_contact + reg_result_financial + reg_result_personal + gi_result + em_result

    def process(self, path, path_):
        
        text = path
        
        ner_result = self.report_generator.ner_report(text)
        location = self.determine_country_of_origin(path)
        reg_result_personal = self.regex_report_personal(text)
        reg_result_financial = self.regex_report_financial(text)
        reg_result_contact = self.regex_report_contact(text)
        ca_statement = self.report_generator.CA_report(text)
        gi_result = self.report_generator.gen_report(text)
        em_result = self.report_generator.EM_report(text)
        md_result = self.report_generator.MD_report(text)
        status = ""
        
        if self.flag(ner_result, reg_result_contact,reg_result_financial,reg_result_personal, gi_result, em_result) == 0:
            status = "Compliant"
        else:
            status = "Non-compliant"
        
        result = ""
        result += status
        result += "\n\n"
        result += ner_result
        # result += "\n"
        result += location
        result += "\n"
        result += "Violation Report: \n\n"
        result += "General Personal Data:\n"
        result += "Financial Data:\n"
        result += "Total per category : " + str(reg_result_financial)
        result += "\n"
        result += "\n"
        result += "Personal Identification Data:\n"
        result += "Total per category : " + str(reg_result_personal + gi_result)
        result += "\n"
        result += "\n"
        result += "Contact Details:\n"
        result += "Total per category : " + str(reg_result_contact)
        result += "\n"
        result += "\n"
        result += "Biometrics and Imaging:\n"
        result += self.report_generator.Image_report(path_)
        result += "\n\n"
        result += "Data relating to Health:\n"
        result += "Total per category : " + str(md_result)
        result += "\n\n"
        result += "Data revealing Racial and Ethnic Origin:\n"
        result += "Total per category : " + str(em_result)
        result += "\n\n"
        result += ca_statement
        result += "\n\n"
        # print(path_)
        # print(self.report_generator.Image_report(path_))
        return result


if __name__ == "__main__":
    this_ = detection_engine()

    print(this_.process("Special Categories of Personal Data: Genetic Data: As a fictional character, Harvey Spectre's genetic makeup is not subject to real-world testing. However, within the show's narrative, his ancestry might be explored or referenced, showcasing a mix of backgrounds for storytelling purposes. Biometric Data: In the fictional world of 'Suits,' Harvey Spectre might utilize biometric security measures, such as fingerprint scans or facial recognition, to access his law firm's facilities. These details add depth to the character's portrayal in the show. Health Data: Fictional narratives may include references to characters' health conditions or medical histories for plot development. Any health-related information attributed to Harvey Spectre would be part of the show's storyline and not reflective of real-world data. Data revealing Racial and Ethnic Origin: Within the context of 'Suits,' Harvey Spectre's racial or ethnic background may be depicted or mentioned in the script to provide context to his character's identity and experiences. Political Opinions: Harvey Spectre's political views and affiliations are portrayed within the fictional world of 'Suits' to add depth to his character and drive plotlines involving legal and political matters. Religious or Ideological Convictions: References to Harvey Spectre's religious beliefs or philosophical convictions within the show contribute to character development and storyline progression. Trade Union Membership: As a corporate lawyer in the show, Harvey Spectre's involvement with trade unions or labor organizations might be addressed in specific plotlines but is not a central aspect of his character."))
