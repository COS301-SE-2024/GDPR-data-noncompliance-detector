import spacy

class NER:

    def __init__(self):
        self.model = spacy.load('Entity_builder')

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
    
