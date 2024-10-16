import base64
import re
from Detection_Engine.lang_detection import location_finder
from Detection_Engine.regex_layer import regex_layer
from Detection_Engine.report_generation_layer import report_generation_layer
import math
import datetime
import os
import math
import base64
import concurrent.futures

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

    def generate_location_report(self, text):
        return self.report_generator.location_report_generation(text)

    def generate_ner_report(self, text):
        return self.report_generator.ner_report(text)

    def generate_regex_report_personal(self, text):
        return self.regex_report_personal(text)

    def generate_regex_report_financial(self, text):
        return self.regex_report_financial(text)

    def generate_regex_report_contact(self, text):
        return self.regex_report_contact(text)

    def generate_ca_report(self, text):
        return self.report_generator.CA_report(text)

    def generate_gi_report(self, text):
        return self.report_generator.gen_report(text)

    def generate_em_report(self, text):
        return self.report_generator.EM_report(text)

    def generate_md_report(self, text):
        return self.report_generator.MD_report(text)
    
    def generate_image_report(self, path_):
        return self.report_generator.Image_report_generation(path_)


    def process(self, path, path_):
        
        text = path
        
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_location = executor.submit(self.generate_location_report, text)
            future_ner = executor.submit(self.generate_ner_report, text)
            future_reg_personal = executor.submit(self.generate_regex_report_personal, text)
            future_reg_financial = executor.submit(self.generate_regex_report_financial, text)
            future_reg_contact = executor.submit(self.generate_regex_report_contact, text)
            future_ca = executor.submit(self.generate_ca_report, text)
            future_gi = executor.submit(self.generate_gi_report, text)
            future_em = executor.submit(self.generate_em_report, text)
            # future_md = executor.submit(self.generate_md_report, text)

            location = future_location.result()
            ner_result = future_ner.result()
            reg_result_personal = future_reg_personal.result()
            reg_result_financial = future_reg_financial.result()
            reg_result_contact = future_reg_contact.result()
            ca_statement = future_ca.result()
            gi_result = future_gi.result()
            em_result = 50000
            # em_result = future_em.result()
            md_result = 50000
            # md_result = future_md.result()
            
        # location = self.report_generator.location_report_generation(text)
        # ner_result = self.report_generator.ner_report(text)
        # location = self.determine_country_of_origin(path)
        # reg_result_personal = self.regex_report_personal(text)
        # reg_result_financial = self.regex_report_financial(text)
        # reg_result_contact = self.regex_report_contact(text)
        # ca_statement = self.report_generator.CA_report(text)
        # gi_result = self.report_generator.gen_report(text)
        # em_result = self.report_generator.EM_report(text)
        # md_result = self.report_generator.MD_report(text)
        status = ""
        
        if self.flag(ner_result, reg_result_contact,reg_result_financial,reg_result_personal, gi_result, em_result) == 0:
            status = "Compliant"
        else:
            status = "Non-compliant"

#----------------------------------------------------------REPORT GEN------------------------------------------------------------------# 
        
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
        rag_stat, rag_count = self.report_generator.RAG_report(ner_result_report , reg_result_personal_report, reg_result_financial_report, reg_result_contact_report, md_result_report,ca_statement_report, gi_result_report, em_result_report, image_result_report)

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
                "RAG Statement":rag_stat,
                "lenarts":rag_count
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
    
    def get_status(self, ner_count, personal_data,financial_data, contact_data, medical_data, genetic_data, ethnic_data, biometric_data):
        w_per = 1
        w_med = 0.4
        w_gen = 0.2
        w_eth = 0.4
        w_bio = 0.8

        e_personal_data = math.exp((ner_count) + financial_data + contact_data + personal_data)
        e_med = math.exp(medical_data)
        e_gen = math.exp(genetic_data)
        e_eth = math.exp(ethnic_data)
        e_bio = math.exp(biometric_data)

        exp_values = [e_personal_data, e_med, e_gen, e_eth, e_bio]

        max_exp_value = max(exp_values)

        N_e_personal_data = (e_personal_data / max_exp_value) * w_per
        N_e_med = (e_med / max_exp_value) * w_med
        N_e_gen = (e_gen / max_exp_value) * w_gen
        N_e_eth = (e_eth / max_exp_value) * w_eth
        N_e_bio = (e_bio / max_exp_value) * w_bio

        metric_score = N_e_personal_data + N_e_med + N_e_gen + N_e_eth + N_e_bio

        return metric_score

#----------------------------------------------------------REPORT GEN------------------------------------------------------------------# 
    
    def report_generation(self, path, path_):

        location_report = 0
        reg_result_personal_report = 0
        # ca_statement_report = 0
        em_result_report = 0
        image_result_report = 0

        text = path
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_location = executor.submit(self.generate_location_report, text)
            future_reg_personal = executor.submit(self.generate_regex_report_personal, text)
            future_ca = executor.submit(self.generate_ca_report, text)
            future_em = executor.submit(self.generate_em_report, text)
            future_image = executor.submit(self.generate_image_report,path_)

            location_report = future_location.result()
            reg_result_personal_report = future_reg_personal.result()
            # ca_statement_report = future_ca.result()
            em_result_report = future_em.result()
            image_result_report = future_image.result()

        # location_report = self.report_generator.location_report_generation(text)
        ner_result_report = self.report_generator.ner_report_generation(text)
        # reg_result_personal_report = self.regex_report_personal(text) + self.report_generator.gen_report(text)
        reg_result_financial_report = self.regex_report_financial(text)
        reg_result_contact_report = self.regex_report_contact(text)
        ca_statement_report = self.report_generator.CA_report_generation(text)
        gi_result_report = self.report_generator.GF_report(text)
        # em_result_report = self.report_generator.EM_report(text)
        md_result_report = self.report_generator.MD_report(text)
        # image_result_report = self.report_generator.Image_report_generation(path_)
        rag_stat, rag_count = self.report_generator.RAG_report(ner_result_report , reg_result_personal_report, reg_result_financial_report, reg_result_contact_report, md_result_report,ca_statement_report, gi_result_report, em_result_report, image_result_report)
        # ca_statement_report = self.report_generator.CA_report_generation(text)
        # ner_result_text = self.report_generator.ner_report_text(text)
        ner_pdf_bytes = self.report_generator.ner_report_text(text, path_)
        pdf_base64 = base64.b64encode(ner_pdf_bytes.read()).decode('utf-8')


        # status = 1

        status = self.get_status(ner_result_report,reg_result_personal_report, reg_result_financial_report, reg_result_contact_report, md_result_report, gi_result_report,em_result_report,image_result_report)
        # ner_count, financial_data, contact_data, medical_data, genetic_data, ethnic_data, biometric_data
        
        if (reg_result_personal_report + 
            reg_result_financial_report + 
            reg_result_contact_report +  
            gi_result_report + 
            em_result_report + 
            md_result_report + 
            image_result_report) == 0:
    
            rag_stat = "This document does not violate any GDPR articles"
            rag_count = 0

        ner_pdf_bytes = self.report_generator.ner_report_text(text, path_)
        pdf_base64 = base64.b64encode(ner_pdf_bytes.read()).decode('utf-8')
        
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
                "RAG_Statement":rag_stat,
                "lenarts":rag_count,
                "ner_result_text": pdf_base64
            }
        }

        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        # output_file = f"violation_report_{timestamp}.pdf"
        # output_dir = os.path.join(".", "Generated_Reports")
        GENERATED_REPORTS_FOLDER = os.path.expanduser("~/Documents/GND/generated-reports")
        os.makedirs(GENERATED_REPORTS_FOLDER, exist_ok=True)
        output_file = os.path.join(GENERATED_REPORTS_FOLDER, f"violation_report_{timestamp}.pdf")

        # if not os.path.exists(output_dir):
            # os.makedirs(output_dir)

        self.report_generator.generate_pdf(violation_data, output_file)
        return violation_data

#----------------------------------------------------------REPORT GEN END------------------------------------------------------------------#


if __name__ == "__main__":
    this_ = detection_engine()
    print(this_.report_generation("Special Categories of Personal Data: Genetic Data: As a fictional character, Harvey Spectre's genetic makeup is not subject to real-world testing. However, within the show's narrative, his ancestry might be explored or referenced, showcasing a mix of backgrounds for storytelling purposes. Biometric Data: In the fictional world of 'Suits,' Harvey Spectre might utilize biometric security measures, such as fingerprint scans or facial recognition, to access his law firm's facilities. These details add depth to the character's portrayal in the show. Health Data: Fictional narratives may include references to characters' health conditions or medical histories for plot development. Any health-related information attributed to Harvey Spectre would be part of the show's storyline and not reflective of real-world data. Data revealing Racial and Ethnic Origin: Within the context of 'Suits,' Harvey Spectre's racial or ethnic background may be depicted or mentioned in the script to provide context to his character's identity and experiences. Political Opinions: Harvey Spectre's political views and affiliations are portrayed within the fictional world of 'Suits' to add depth to his character and drive plotlines involving legal and political matters. Religious or Ideological Convictions: References to Harvey Spectre's religious beliefs or philosophical convictions within the show contribute to character development and storyline progression. Trade Union Membership: As a corporate lawyer in the show, Harvey Spectre's involvement with trade unions or labor organizations might be addressed in specific plotlines but is not a central aspect of his character.","../mockData/NCE1.pdf"))
    # print(this_.process("Special Categories of Personal Data: Genetic Data: As a fictional character, Harvey Spectre's genetic makeup is not subject to real-world testing. However, within the show's narrative, his ancestry might be explored or referenced, showcasing a mix of backgrounds for storytelling purposes. Biometric Data: In the fictional world of 'Suits,' Harvey Spectre might utilize biometric security measures, such as fingerprint scans or facial recognition, to access his law firm's facilities. These details add depth to the character's portrayal in the show. Health Data: Fictional narratives may include references to characters' health conditions or medical histories for plot development. Any health-related information attributed to Harvey Spectre would be part of the show's storyline and not reflective of real-world data. Data revealing Racial and Ethnic Origin: Within the context of 'Suits,' Harvey Spectre's racial or ethnic background may be depicted or mentioned in the script to provide context to his character's identity and experiences. Political Opinions: Harvey Spectre's political views and affiliations are portrayed within the fictional world of 'Suits' to add depth to his character and drive plotlines involving legal and political matters. Religious or Ideological Convictions: References to Harvey Spectre's religious beliefs or philosophical convictions within the show contribute to character development and storyline progression. Trade Union Membership: As a corporate lawyer in the show, Harvey Spectre's involvement with trade unions or labor organizations might be addressed in specific plotlines but is not a central aspect of his character."))
