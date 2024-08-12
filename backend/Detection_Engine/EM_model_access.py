import os
from transformers import BertTokenizer, BertForSequenceClassification, pipeline

class EM:

    def __init__(self):
        # self.model_ = model
        # self.tokenizer_ = tokenizer
        self.max_length_ = 512
        self.classifier = pipeline("text-classification", model="BananaFish45/Ethnicity_model")
        self.max_length = self.max_length_

    def run_EM(self, text):
        return self.predict(text)

    def predict(self, input_text):
        count = 0
        tokens = self.classifier.tokenizer.encode(input_text, truncation=True, max_length=self.max_length_)
        truncated_text = self.classifier.tokenizer.decode(tokens, skip_special_tokens=True)
        
        result = self.classifier(truncated_text)
        label = result[0]['label']
        if label != 'LABEL_2':
            count += 1
        else:
            count += 0
        
        return count

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

