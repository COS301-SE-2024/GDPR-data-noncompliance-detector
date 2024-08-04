# from .text_classification_layer import text_classification_layer
# from .biometric_detection import biometric_detection

from text_classification_layer import text_classification_layer
from biometric_detection import biometric_detection

class report_generation_layer:

    def __init__(self):
        self.classification_layer = text_classification_layer()
        self.image_classification_layer = biometric_detection()

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
    
    def CA_report(self, text):
        res1 = self.classification_layer.run_CA_model(text)
        if res1 == 'LABEL_0':
            return "The document does not seem to contain any data consent agreements\n\n"
        else:
            return "The document does appear to contain data consent agreements\n\n"
        
    def Image_report(self, path):
        arr_ = self.image_classification_layer.biometric_detect_all(path)
        count = 0
        for detection_list in arr_:
            for detection in detection_list:
                if detection.get('label') == 'person':
                    count += 1
        if count == 1:
            return f"{count} person can be identified through images in the document"
        else:
            return f"{count} persons can be identified through images in the document"



    
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