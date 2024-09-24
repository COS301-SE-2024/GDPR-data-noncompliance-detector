from .text_classification_layer import text_classification_layer
from .biometric_detection import biometric_detection
from .lang_detection import location_finder
from langcodes import Language

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.colors import HexColor

import os

# from text_classification_layer import text_classification_layer
# from biometric_detection import biometric_detection

class report_generation_layer:

    def __init__(self):
        self.classification_layer = text_classification_layer()
        self.image_classification_layer = biometric_detection()
        self.eu_languages = [
            'bg', 'hr', 'cs', 'da', 'nl', 'et', 'fi', 'fr', 'de',
            'el', 'hu', 'ga', 'it', 'lv', 'lt', 'mt', 'pl', 'pt', 'ro',
            'sk', 'sl', 'es', 'sv'
        ]


    def location_report(self, text):
        countries = location_finder.detect_country(self, text)
        # countries = self.detect_country(result)

        if countries:
            for country in countries:
                language_code = Language.find(country[0]).to_tag()
                if language_code in self.eu_languages:
                    return "EU"
            return "Not EU"
        else:
            return "Undefined"
        
#----------------------------------------------------------REPORT GEN------------------------------------------------------------------#           
           
    def location_report_generation(self, text):
        countries = location_finder.detect_country(self, text)
        # countries = self.detect_country(result)

        if countries:
            for country in countries:
                language_code = Language.find(country[0]).to_tag()
                if language_code in self.eu_languages:
                    return 1
            return 0
        else:
            return 2
#----------------------------------------------------------REPORT GEN END------------------------------------------------------------------#           
           
        
    def ner_report(self, text):
        res1 = self.classification_layer.run_NER_model(text)
        entities = 0
        names = []

        for text,label in res1:
            if label == 'PERSON':
                if text not in names:
                    names.append(text)
                    entities += 1
    
        return f"Document potentially references {entities} different individuals\n\n"

#----------------------------------------------------------REPORT GEN------------------------------------------------------------------#           

    def ner_report_generation(self, text):
        res1 = self.classification_layer.run_NER_model(text)
        entities = 0
        names = []

        for text,label in res1:
            if label == 'PERSON':
                if text not in names:
                    names.append(text)
                    entities += 1
    
        return entities
    
#----------------------------------------------------------REPORT GEN END------------------------------------------------------------------#
    
    def CA_report(self, text):
        res1 = self.classification_layer.run_CA_model(text)
        if res1 == 'LABEL_0':
            return "The document does not seem to contain any data consent agreements\n\n"
        else:
            return "The document does appear to contain data consent agreements\n\n"

#----------------------------------------------------------REPORT GEN------------------------------------------------------------------#

    def CA_report_generation(self, text):
        res1 = self.classification_layer.run_CA_model(text)
        if res1 == 'LABEL_0':
            return False
        else:
            return True

#----------------------------------------------------------REPORT GEN------------------------------------------------------------------#

    def RAG_report(self, ner_result , personal, financial, contact, medical, ca_statement, gi, em, biometric):
        categories = []

        if ner_result > 0 :
            categories.append('transparency transgression')
        
        if ca_statement == False:
            categories.append('no consent agreement')

        if personal > 0 or financial > 0 or contact > 0:
            categories.append('personal')
        
        if gi > 0 or medical > 0:
            categories.append('genetic')

        if em > 0:
            categories.append('Data Revealing Racial and Ethnic Origin')

        if biometric > 0:
            categories.append('Biometric Data')

        rag_res = self.classification_layer.run_RAG(categories)
        result = "The following articles are potentially violated: " + ", ".join(rag_res)
        return result, len(rag_res)



        

#----------------------------------------------------------REPORT GEN END------------------------------------------------------------------#
        
    def Image_report(self, path):
        arr_ = self.image_classification_layer.biometric_detect_all(path)
        # return arr_
        if arr_ is None:
            return "0 persons can be identified through images in the document"
        
        count = 0
        for detection_list in arr_:
            for detection in detection_list:
                if detection.get('label') == 'person':
                    count += 1
        
        if count == 1:
            return f"{count} person can be identified through images in the document"
        else:
            return f"{count} persons can be identified through images in the document"
        
#----------------------------------------------------------REPORT GEN------------------------------------------------------------------#

    def Image_report_generation(self, path):
        arr_ = self.image_classification_layer.biometric_detect_all(path)
        # # return arr_
        # if arr_ is None:
        #     return 0
        
        # count = 0
        # for detection_list in arr_:
        #     for detection in detection_list:
        #         if detection.get('label') == 'person':
        #             count += 1
        
        return arr_

#----------------------------------------------------------REPORT GEN END------------------------------------------------------------------#

        
    def gen_report(self, text):
        test = self.classification_layer.run_GDPR_model(text)
        report = sum(1 for label in test if label != 'LABEL_0')
        return report          
    
    def EM_report(self, text):
        test = self.classification_layer.run_EM_model(text)
        report = sum(1 for label in test if label != 'LABEL_2')
        return report 
    
    def MD_report(self, text):
        result = self.classification_layer.run_MD_model(text)
        return len(result)
    
    def GF_report(self, text):
        test = self.classification_layer.run_GF_model(text)
        report = sum(1 for label in test if label != 'LABEL_1')
        return report 

    def generate_pdf(self, violation_data, output_file):
        c = canvas.Canvas(output_file, pagesize = A4)
        width, height = A4

        font_path = os.path.join(os.path.dirname(__file__), 'Mediator Narrow Web Extra Bold.ttf')
        pdfmetrics.registerFont(TTFont('MediatorNarrowExtraBold', font_path))

        c.setFillColor(colors.lightseagreen)
        c.rect(0, height - 40 * mm, width, 50 * mm, fill = 1, stroke = 0) 


        c.setFillColor(colors.whitesmoke)

        c.setFont("MediatorNarrowExtraBold", 24)
        c.drawString(20 * mm, height - 15 * mm, "GND")
        c.setFont("Helvetica", 12)
        c.drawString(20 * mm, height - 25 * mm, "Phone: 068 590 1787")
        c.drawString(20 * mm, height - 32 * mm, "Email: aprilfour301@gmail.com")

    
        logo_path = os.path.join(os.path.dirname(__file__), 'GND_LSG.jpg')
        logo_width = 35 * mm
        logo_height = 30 * mm
        c.drawImage(logo_path, width - logo_width - 25 * mm, height - logo_height - 5 * mm, width = logo_width, height = logo_height)

        c.setFillColor(colors.black)

        c.setFont("MediatorNarrowExtraBold", 28)
        c.drawCentredString(width/2, height - 55 * mm, "GDPR Violations Report")

        rect_width = 100 * mm
        rect_height = 10 * mm
        radius = 2 * mm
        
        rect_x = (width - rect_width) / 2
        rect_y = height - 65 * mm - rect_height
        


        if (violation_data['score']['Status'] == 1):
            c.setFillColor(colors.green)
            c.setStrokeColor(colors.black)
            c.roundRect(rect_x, rect_y, rect_width, rect_height, radius, fill=1, stroke=1)
            
            text = "This document does not appear to contain GDPR violations"
            text_width = c.stringWidth(text, "MediatorNarrowExtraBold", 12)
            text_x = rect_x + (rect_width - text_width) / 2
            text_y = rect_y + (rect_height - 8) / 2

            c.setFillColor(colors.whitesmoke)
            c.setFont("MediatorNarrowExtraBold", 12)
            c.drawString(text_x, text_y, text)

        else:
            c.setFillColor(colors.red)
            c.setStrokeColor(colors.black)
            c.roundRect(rect_x, rect_y, rect_width, rect_height, radius, fill=1, stroke=1)
            
            text = "This document may contain GDPR violations"
            text_width = c.stringWidth(text, "MediatorNarrowExtraBold", 12)
            text_x = rect_x + (rect_width - text_width) / 2
            text_y = rect_y + (rect_height - 8) / 2

            c.setFillColor(colors.whitesmoke)
            c.setFont("MediatorNarrowExtraBold", 12)
            c.drawString(text_x, text_y, text)

        y_position = height - 85 * mm

        c.setFillColor(colors.black)
        c.setFont("MediatorNarrowExtraBold", 14)        
        c.drawString(22 * mm, y_position, f"The document potentially references {str(violation_data['score']['NER'])} different individuals")
        # c.drawString(180 * mm, y_position, str(violation_data['score']['Personal']))
        # location_text = self.location_helper(violation_data['score']['Location'])
        # text_width = c.stringWidth(location_text, "Helvetica", 12)
        # icon_path = os.path.join(os.path.dirname(__file__), 'location-dot-solid.jpg')
        # c.drawString((width - text_width)/2, y_position, location_text)
        # icon_width = 3 * mm 
        # icon_height = 3 * mm 
        # c.drawImage(icon_path, 23 * mm - icon_width, y_position, width = icon_width, height = icon_height)

        descriptions = {
            "Personal": "This may include personal data such as names, identification number, dates of birth etc.",
            "Financial": "This may include personal financial data such as banking details, tax numbers, account details etc.",
            "Contact": "This may include personal contact details such as phone numbers, email addresses and social media.",
            "Medical": "This may include personal medical data such as chronic illnesses, past injuries, diseases etc.",
            "Biometric": "This may include biometric data such as fingerprints, facial recognition, iris scans etc.",
            "Ethnic": "This may include ethnic data such as racial or ethnic origin, nationality, language etc."
        }

        y_position = height - 100 * mm

        icon_path = os.path.join(os.path.dirname(__file__), 'circle-question-regular.jpg')
        icon_width = 3 * mm 
        icon_height = 3 * mm

        c.setFont("MediatorNarrowExtraBold", 18)        
        c.drawString(22 * mm, y_position, "General Personal Data")
        c.drawString(180 * mm, y_position, str(violation_data['score']['Personal']))

        c.setFillColor(colors.grey)

        c.setFont("Helvetica", 8)
        description = descriptions.get("Personal", "Description not available")
        c.drawImage(icon_path, 23 * mm - icon_width, y_position - 22, width=icon_width, height=icon_height)
        c.drawString(25 * mm, y_position - 20, description)

        c.setStrokeColor(colors.black)
        c.setLineWidth(0.5)
        c.line(20 * mm, y_position - 30, width - 20 * mm, y_position - 30)

        y_position -= 30 * mm

        c.setFillColor(colors.black)

        c.setFont("MediatorNarrowExtraBold", 18)        
        c.drawString(22 * mm, y_position, "Financial Data")
        c.drawString(180 * mm, y_position, str(violation_data['score']['Financial']))

        c.setFillColor(colors.grey)

        c.setFont("Helvetica", 8)
        description = descriptions.get("Financial", "Description not available")
        c.drawImage(icon_path, 23 * mm - icon_width, y_position - 22, width=icon_width, height=icon_height)
        c.drawString(25 * mm, y_position - 20, description)

        c.setStrokeColor(colors.black)
        c.setLineWidth(0.5)
        c.line(20 * mm, y_position - 30, width - 20 * mm, y_position - 30)

        y_position -= 30 * mm

        c.setFillColor(colors.black)

        c.setFont("MediatorNarrowExtraBold", 18)        
        c.drawString(22 * mm, y_position, "Contact Details")
        c.drawString(180 * mm, y_position, str(violation_data['score']['Contact']))

        c.setFillColor(colors.grey)

        c.setFont("Helvetica", 8)
        description = descriptions.get("Contact", "Description not available")
        c.drawImage(icon_path, 23 * mm - icon_width, y_position - 22, width=icon_width, height=icon_height)
        c.drawString(25 * mm, y_position - 20, description)

        c.setStrokeColor(colors.black)
        c.setLineWidth(0.5)
        c.line(20 * mm, y_position - 30, width - 20 * mm, y_position - 30)

        y_position -= 30 * mm

        c.setFillColor(colors.black)

        c.setFont("MediatorNarrowExtraBold", 18)        
        c.drawString(22 * mm, y_position, "Medical Information")
        c.drawString(180 * mm, y_position, str(violation_data['score']['Medical']))

        c.setFillColor(colors.grey)

        c.setFont("Helvetica", 8)
        description = descriptions.get("Medical", "Description not available")
        c.drawImage(icon_path, 23 * mm - icon_width, y_position - 22, width=icon_width, height=icon_height)
        c.drawString(25 * mm, y_position - 20, description)

        c.setStrokeColor(colors.black)
        c.setLineWidth(0.5)
        c.line(20 * mm, y_position - 30, width - 20 * mm, y_position - 30)

        y_position -= 30 * mm

        c.setFillColor(colors.black)

        c.setFont("MediatorNarrowExtraBold", 18)        
        c.drawString(22 * mm, y_position, "Ethnic Information")
        c.drawString(180 * mm, y_position, str(violation_data['score']['Ethnic']))

        c.setFillColor(colors.grey)

        c.setFont("Helvetica", 8)
        description = descriptions.get("Ethnic", "Description not available")
        c.drawImage(icon_path, 23 * mm - icon_width, y_position - 22, width=icon_width, height=icon_height)
        c.drawString(25 * mm, y_position - 20, description)

        c.setStrokeColor(colors.black)
        c.setLineWidth(0.5)
        c.line(20 * mm, y_position - 30, width - 20 * mm, y_position - 30)

        y_position -= 30 * mm

        c.setFillColor(colors.black)

        c.setFont("MediatorNarrowExtraBold", 18)        
        c.drawString(22 * mm, y_position, "Biometric Data")
        c.drawString(180 * mm, y_position, str(violation_data['score']['Biometric']))

        c.setFillColor(colors.grey)

        c.setFont("Helvetica", 8)
        description = descriptions.get("Biometric", "Description not available")
        c.drawImage(icon_path, 23 * mm - icon_width, y_position - 22, width=icon_width, height=icon_height)
        c.drawString(25 * mm, y_position - 20, description)

        c.setStrokeColor(colors.black)
        c.setLineWidth(0.5)
        c.line(20 * mm, y_position - 30, width - 20 * mm, y_position - 30)

        y_position -= 30 * mm

        c.setFillColor(colors.black)

        rect_width = 150 * mm
        rect_height = 10 * mm
        radius = 2 * mm
        
        rect_x = (width - rect_width) / 2
        rect_y = 25 * mm - rect_height
        


        if (violation_data['score']['Consent Agreement'] == False):
            c.setFillColor(HexColor("#0875e2"))
            c.setStrokeColor(colors.black)
            c.roundRect(rect_x, rect_y, rect_width, rect_height, radius, fill=1, stroke=1)
            
            text = "The document does not seem to contain any data consent agreements"
            text_width = c.stringWidth(text, "MediatorNarrowExtraBold", 12)
            text_x = rect_x + (rect_width - text_width) / 2
            text_y = rect_y + (rect_height - 8) / 2

            c.setFillColor(colors.whitesmoke)
            c.setFont("MediatorNarrowExtraBold", 12)
            c.drawString(text_x, text_y, text)

        else:
            c.setFillColor(HexColor("#0875e2"))
            c.setStrokeColor(colors.black)
            c.roundRect(rect_x, rect_y, rect_width, rect_height, radius, fill=1, stroke=1)
            
            text = "The document appears to contain a data consent agreement"
            text_width = c.stringWidth(text, "MediatorNarrowExtraBold", 12)
            text_x = rect_x + (rect_width - text_width) / 2
            text_y = rect_y + (rect_height - 8) / 2

            c.setFillColor(colors.whitesmoke)
            c.setFont("MediatorNarrowExtraBold", 12)
            c.drawString(text_x, text_y, text)

        
        c.setFillColor(colors.lightseagreen)
        c.rect(0, 0, width, 10 * mm, fill = 1, stroke = 0)

        c.save()

    def location_helper(self, data):
        if data == 0:
            return "The document does not appear to originate from within the EU"
        
        return "The document appears to originate from within the EU"


if __name__ == "__main__":
    cl_ = report_generation_layer()
    icl_ = biometric_detection()
    
    res = cl_.ner_report("Special Categories of Personal Data: Genetic Data: As a fictional character, Harvey Spectre's genetic makeup is not subject to real-world testing. However, within the show's narrative, his ancestry might be explored or referenced, showcasing a mix of backgrounds for storytelling purposes. Biometric Data: In the fictional world of 'Suits,' Harvey Spectre might utilize biometric security measures, such as fingerprint scans or facial recognition, to access his law firm's facilities. These details add depth to the character's portrayal in the show. Health Data: Fictional narratives may include references to characters' health conditions or medical histories for plot development. Any health-related information attributed to Harvey Spectre would be part of the show's storyline and not reflective of real-world data. Data revealing Racial and Ethnic Origin: Within the context of 'Suits,' Harvey Spectre's racial or ethnic background may be depicted or mentioned in the script to provide context to his character's identity and experiences. Political Opinions: Harvey Spectre's political views and affiliations are portrayed within the fictional world of 'Suits' to add depth to his character and drive plotlines involving legal and political matters. Religious or Ideological Convictions: References to Harvey Spectre's religious beliefs or philosophical convictions within the show contribute to character development and storyline progression. Trade Union Membership: As a corporate lawyer in the show, Harvey Spectre's involvement with trade unions or labor organizations might be addressed in specific plotlines but is not a central aspect of his character.")
    print(res)
    
    res_x = cl_.CA_report("Special Categories of Personal Data: Genetic Data: As a fictional character, Harvey Spectre's genetic makeup is not subject to real-world testing. However, within the show's narrative, his ancestry might be explored or referenced, showcasing a mix of backgrounds for storytelling purposes. Biometric Data: In the fictional world of 'Suits,' Harvey Spectre might utilize biometric security measures, such as fingerprint scans or facial recognition, to access his law firm's facilities. These details add depth to the character's portrayal in the show. Health Data: Fictional narratives may include references to characters' health conditions or medical histories for plot development. Any health-related information attributed to Harvey Spectre would be part of the show's storyline and not reflective of real-world data. Data revealing Racial and Ethnic Origin: Within the context of 'Suits,' Harvey Spectre's racial or ethnic background may be depicted or mentioned in the script to provide context to his character's identity and experiences. Political Opinions: Harvey Spectre's political views and affiliations are portrayed within the fictional world of 'Suits' to add depth to his character and drive plotlines involving legal and political matters. Religious or Ideological Convictions: References to Harvey Spectre's religious beliefs or philosophical convictions within the show contribute to character development and storyline progression. Trade Union Membership: As a corporate lawyer in the show, Harvey Spectre's involvement with trade unions or labor organizations might be addressed in specific plotlines but is not a central aspect of his character.")
    print(res_x)
    
    res_2 = icl_.biometric_detect_all('C:/Users/Mervyn Rangasamy/Documents/2024/COS 301/Capstone/Repo/GDPR-data-noncompliance-detector/backend/mockdata/twoBirds.pdf')
    res_2_d = cl_.Image_report('C:/Users/Mervyn Rangasamy/Documents/2024/COS 301/Capstone/Repo/GDPR-data-noncompliance-detector/backend/mockdata/twoBirds.pdf')
    print(res_2)
    
    print('\n')
    
    print(res_2_d)
    
    print('\n')
    
    res_3 = icl_.biometric_detect_all('C:/Users/Mervyn Rangasamy/Documents/2024/COS 301/Capstone/Repo/GDPR-data-noncompliance-detector/backend/mockdata/docxWimages.docx')
    res_3_d = cl_.Image_report('C:/Users/Mervyn Rangasamy/Documents/2024/COS 301/Capstone/Repo/GDPR-data-noncompliance-detector/backend/mockdata/docxWimages.docx')
    print(res_3)
    
    print('\n')

    print(res_3_d)
    print('\n')

    res_gr = cl_.gen_report("Special Categories of Personal Data: Genetic Data: As a fictional character, Harvey Spectre's genetic makeup is not subject to real-world testing. However, within the show's narrative, his ancestry might be explored or referenced, showcasing a mix of backgrounds for storytelling purposes. Biometric Data: In the fictional world of 'Suits,' Harvey Spectre might utilize biometric security measures, such as fingerprint scans or facial recognition, to access his law firm's facilities. These details add depth to the character's portrayal in the show. Health Data: Fictional narratives may include references to characters' health conditions or medical histories for plot development. Any health-related information attributed to Harvey Spectre would be part of the show's storyline and not reflective of real-world data. Data revealing Racial and Ethnic Origin: Within the context of 'Suits,' Harvey Spectre's racial or ethnic background may be depicted or mentioned in the script to provide context to his character's identity and experiences. Political Opinions: Harvey Spectre's political views and affiliations are portrayed within the fictional world of 'Suits' to add depth to his character and drive plotlines involving legal and political matters. Religious or Ideological Convictions: References to Harvey Spectre's religious beliefs or philosophical convictions within the show contribute to character development and storyline progression. Trade Union Membership: As a corporate lawyer in the show, Harvey Spectre's involvement with trade unions or labor organizations might be addressed in specific plotlines but is not a central aspect of his character.")
    print(res_gr)

    res_em = cl_.EM_report("Special Categories of Personal Data: Genetic Data: As a fictional character, Harvey Spectre's genetic makeup is not subject to real-world testing. However, within the show's narrative, his ancestry might be explored or referenced, showcasing a mix of backgrounds for storytelling purposes. Biometric Data: In the fictional world of 'Suits,' Harvey Spectre might utilize biometric security measures, such as fingerprint scans or facial recognition, to access his law firm's facilities. These details add depth to the character's portrayal in the show. Health Data: Fictional narratives may include references to characters' health conditions or medical histories for plot development. Any health-related information attributed to Harvey Spectre would be part of the show's storyline and not reflective of real-world data. Data revealing Racial and Ethnic Origin: Within the context of 'Suits,' Harvey Spectre's racial or ethnic background may be depicted or mentioned in the script to provide context to his character's identity and experiences. Political Opinions: Harvey Spectre's political views and affiliations are portrayed within the fictional world of 'Suits' to add depth to his character and drive plotlines involving legal and political matters. Religious or Ideological Convictions: References to Harvey Spectre's religious beliefs or philosophical convictions within the show contribute to character development and storyline progression. Trade Union Membership: As a corporate lawyer in the show, Harvey Spectre's involvement with trade unions or labor organizations might be addressed in specific plotlines but is not a central aspect of his character.")
    print(res_em)