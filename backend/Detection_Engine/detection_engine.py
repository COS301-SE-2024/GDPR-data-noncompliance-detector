import re
from Detection_Engine.lang_detection import location_finder
from Detection_Engine.regex_layer import regex_layer
from Detection_Engine.report_generation_layer import report_generation_layer

import datetime
import os

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
        return self.regex_filter.process_personal_regex(path)
    
    def regex_report_financial(self, path):
        return self.regex_filter.process_financial(path)
    
    def regex_report_contact(self, path):
        return self.regex_filter.process_contact_details(path)
    
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
        
        location = self.report_generator.location_report(text)
        ner_result = self.report_generator.ner_report(text)
        # location = self.determine_country_of_origin(path)
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

#----------------------------------------------------------REPORT GEN------------------------------------------------------------------# 
        
        location_report = self.report_generator.location_report_generation(text)
        ner_result_report = self.report_generator.ner_report_generation(text)
        reg_result_personal_report = self.regex_report_personal(text)
        reg_result_financial_report = self.regex_report_financial(text)
        reg_result_contact_report = self.regex_report_contact(text)
        ca_statement_report = self.report_generator.CA_report_generation(text)
        gi_result_report = self.report_generator.gen_report(text)
        em_result_report = self.report_generator.EM_report(text)
        md_result_report = self.report_generator.MD_report(text)
        image_result_report = self.report_generator.Image_report_generation(path_)

        violation_data = {
            "score": {
                "Location": location_report,
                "NER": ner_result_report,
                "Personal": reg_result_personal_report,
                "Financial": reg_result_financial_report,
                "Contact": reg_result_contact_report,
                "Consent Agreement": ca_statement_report,
                "Genetic": gi_result_report,
                "Ethnic": em_result_report,
                "Medical": md_result_report,
                "Biometric": image_result_report,
            }
        }

#----------------------------------------------------------REPORT GEN END------------------------------------------------------------------#
        
        result = ""
        result += status
        result += "\n\n"
        result += ner_result
        result += "\n\n"
        # result += "\n"
        result += "Potential Location of Origin : "
        result += "\n"
        result += location
        result += "\n\n"
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
    
#----------------------------------------------------------REPORT GEN------------------------------------------------------------------# 
    
    def report_generation(self, path, path_):

        text = path

        location_report = self.report_generator.location_report_generation(text)
        ner_result_report = self.report_generator.ner_report_generation(text)
        reg_result_personal_report = self.regex_report_personal(text) + self.report_generator.gen_report(text)
        reg_result_financial_report = self.regex_report_financial(text)
        reg_result_contact_report = self.regex_report_contact(text)
        ca_statement_report = self.report_generator.CA_report_generation(text)
        gi_result_report = 0
        em_result_report = self.report_generator.EM_report(text)
        md_result_report = self.report_generator.MD_report(text)
        image_result_report = self.report_generator.Image_report_generation(path_)

        status = 1

        if (reg_result_personal_report > 0 or 
            reg_result_financial_report > 0 or 
            reg_result_contact_report > 0 or  
            gi_result_report > 0 or 
            em_result_report > 0 or 
            md_result_report > 0 or 
            image_result_report > 0):
    
                status = 0


        violation_data = {            
            "score": {
                "Status": status,
                "Location": location_report,
                "NER": ner_result_report,
                "Personal": reg_result_personal_report,
                "Financial": reg_result_financial_report,
                "Contact": reg_result_contact_report,
                "Consent Agreement": ca_statement_report,
                "Genetic": gi_result_report,
                "Ethnic": em_result_report,
                "Medical": md_result_report,
                "Biometric": image_result_report,
            }
        }

        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        # output_file = f"violation_report_{timestamp}.pdf"
        output_dir = os.path.join(".", "Generated_Reports")
        output_file = os.path.join(output_dir, f"violation_report_{timestamp}.pdf")

        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        self.report_generator.generate_pdf(violation_data, output_file)
        return violation_data

#----------------------------------------------------------REPORT GEN END------------------------------------------------------------------#


if __name__ == "__main__":
    this_ = detection_engine()

    print(this_.process("Special Categories of Personal Data: Genetic Data: As a fictional character, Harvey Spectre's genetic makeup is not subject to real-world testing. However, within the show's narrative, his ancestry might be explored or referenced, showcasing a mix of backgrounds for storytelling purposes. Biometric Data: In the fictional world of 'Suits,' Harvey Spectre might utilize biometric security measures, such as fingerprint scans or facial recognition, to access his law firm's facilities. These details add depth to the character's portrayal in the show. Health Data: Fictional narratives may include references to characters' health conditions or medical histories for plot development. Any health-related information attributed to Harvey Spectre would be part of the show's storyline and not reflective of real-world data. Data revealing Racial and Ethnic Origin: Within the context of 'Suits,' Harvey Spectre's racial or ethnic background may be depicted or mentioned in the script to provide context to his character's identity and experiences. Political Opinions: Harvey Spectre's political views and affiliations are portrayed within the fictional world of 'Suits' to add depth to his character and drive plotlines involving legal and political matters. Religious or Ideological Convictions: References to Harvey Spectre's religious beliefs or philosophical convictions within the show contribute to character development and storyline progression. Trade Union Membership: As a corporate lawyer in the show, Harvey Spectre's involvement with trade unions or labor organizations might be addressed in specific plotlines but is not a central aspect of his character."))
