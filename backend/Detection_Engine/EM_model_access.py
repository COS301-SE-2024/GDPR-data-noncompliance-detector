import os, sys
from transformers import BertTokenizer, BertForSequenceClassification, pipeline

def resource_path(relative_path):

    try:
        base_path = sys._MEIPASS
    
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)
class EM:

    def __init__(self):
        # self.model_ = model
        # self.tokenizer_ = tokenizer
        self.max_length_ = 512
        self.classifier = pipeline("text-classification", model="BananaFish45/Ethnicity_model")
        self.max_length = self.max_length_

    def run_EM(self, text):
        return self.predict(text)

    def sliding_window(self, text, window_size, overlap):
        tokens = self.classifier.tokenizer.encode(text, truncation=False)
        chunks = []
        for i in range(0, len(tokens), window_size - overlap):
            chunk = tokens[i:i + window_size]
            if len(chunk) < window_size:
                break
            chunks.append(chunk)
        return chunks

    def predict(self, input_text):
        window_size = 128  
        overlap = 64       

        chunks = self.sliding_window(input_text, window_size, overlap)
        labels = []

        for chunk in chunks:
            truncated_text = self.classifier.tokenizer.decode(chunk, skip_special_tokens=True)
            result = self.classifier(truncated_text)
            label = result[0]['label']
            labels.append(label)

        return labels

if __name__ == '__main__':
    em = EM()
    print(em.run_EM("Sure, you can use my data"))#No ethnicity
    print(em.run_EM("Paul is an Indian"))#Indian
    print(em.run_EM("Dhinaz is an African young man very strong"))#African
    print(em.run_EM("Yeshlen is an Asian business man crooked man indeed"))#Asian
    print(em.run_EM("Yudi is a Middle Eastern Rug business man honest guy hey but loves money"))#Middle Eastern
    print(em.run_EM("Jonas is a school admin clerk"))#No Ethnicity 
    print(em.run_EM("Micheal is an Caucasian programmer "))#European
    print(em.run_EM("Nevin is an Hispanic scammer"))#Hispanic
    print(em.run_EM("Samantha is an African American"))#African American

