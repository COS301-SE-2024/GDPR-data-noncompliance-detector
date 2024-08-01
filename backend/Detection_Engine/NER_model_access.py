import spacy
import os
base_dir = os.path.dirname(__file__)
model_path = os.path.join(base_dir, 'Entity_builder')

model = spacy.load(model_path)

class NER:

    # def __init__(self):

    def extract_entities(self, res):
        entities = []
        for i in res.ents:
            entities.append((i.text, i.label_))
        return entities

    def run_NER(self, text):
        res = model(text)
        processed = self.extract_entities(res)
        return processed
    
if __name__ == '__main__':
    ner_ = NER()
    x = input("Enter a sentence: ")
    res = ner_.run_NER(x)
    print(res)
    
