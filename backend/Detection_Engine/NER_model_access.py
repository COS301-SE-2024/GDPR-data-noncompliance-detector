import os
from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline
# base_dir = os.path.dirname(__file__)
# model_path = os.path.join(base_dir, 'Entity_builder')

# base_dir = os.path.dirname(os.path.abspath(__file__))

# model_path = os.path.join(base_dir, 'en_core_web_sm/en_core_web_sm-3.7.1')

# model = spacy.load(model_path)

model_name = "xlm-roberta-large-finetuned-conll03-english"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)

# Create a pipeline for named entity recognition
nlp = pipeline("ner", model=model, tokenizer=tokenizer)

class NER:

    # def __init__(self):

    def extract_entities(self, res):
        person_count = 0
        for i in res:
            if i['entity'] == 'I-PER':
                person_count += 1
        print(f'Number of persons found: {person_count}')
        return person_count

    def run_NER(self, text):
        entities = nlp(text)
        return self.extract_entities(entities)
    
if __name__ == '__main__':
    ner_ = NER()
    x = input("Enter a sentence: ")
    res = ner_.run_NER(x)
    print(res)
    
