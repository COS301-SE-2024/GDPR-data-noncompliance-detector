import spacy
import os, sys

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

def load_spacy_model():
    try:
        model = spacy.load("en_core_web_sm")
    
    except OSError:
        from spacy.cli import download
        download("en_core_web_sm")
        model = spacy.load("en_core_web_sm")
    return model

class NER:

    def __init__(self):
        self.model = load_spacy_model()


    def extract_entities(self, res):
        entities = []
        for i in res.ents:
            entities.append((i.text, i.label_))
        return entities

    def run_NER(self, text):
        res = self.model(text)
        processed = self.extract_entities(res)
        return processed
    
if __name__ == '__main__':
    ner_ = NER()
    x = input("Enter a sentence: ")
    res = ner_.run_NER(x)
    print(res)
