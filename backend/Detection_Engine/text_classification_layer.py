from .NER_model_access import NER
from .CA_model_access import CA
from .GDPR_model_access import GDPR
from .EM_model_access import EM

# from NER_model_access import NER
# from CA_model_access import CA

class text_classification_layer:

    def __init__(self):
        self.NER_model_ = NER()
        self.CA_model_ = CA()
        self.gdpr_base = GDPR()
        self.em_model = EM()

    def run_NER_model(self, text):
        res = self.NER_model_.run_NER(text)
        return res
    
    def run_CA_model(self, text):
        res = self.CA_model_.run_CA(text)
        return res

    def run_GDPR_model(self, text):
        return self.gdpr_base.run_GDPR(text)
    
    def run_EM_model(self, text):
        return self.em_model.run_EM(text)
    # def process(self, text):

if __name__ == "__main__":
    this_layer = text_classification_layer()
    print(this_layer.run_NER_model("Special Categories of Personal Data: Genetic Data: As a fictional character, Harvey Spectre's genetic makeup is not subject to real-world testing. However, within the show's narrative, his ancestry might be explored or referenced, showcasing a mix of backgrounds for storytelling purposes. Biometric Data: In the fictional world of 'Suits,' Harvey Spectre might utilize biometric security measures, such as fingerprint scans or facial recognition, to access his law firm's facilities. These details add depth to the character's portrayal in the show. Health Data: Fictional narratives may include references to characters' health conditions or medical histories for plot development. Any health-related information attributed to Harvey Spectre would be part of the show's storyline and not reflective of real-world data. Data revealing Racial and Ethnic Origin: Within the context of 'Suits,' Harvey Spectre's racial or ethnic background may be depicted or mentioned in the script to provide context to his character's identity and experiences. Political Opinions: Harvey Spectre's political views and affiliations are portrayed within the fictional world of 'Suits' to add depth to his character and drive plotlines involving legal and political matters. Religious or Ideological Convictions: References to Harvey Spectre's religious beliefs or philosophical convictions within the show contribute to character development and storyline progression. Trade Union Membership: As a corporate lawyer in the show, Harvey Spectre's involvement with trade unions or labor organizations might be addressed in specific plotlines but is not a central aspect of his character."))
