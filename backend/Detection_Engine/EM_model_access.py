import os
from transformers import BertTokenizer, BertForSequenceClassification, pipeline


class CA:

    def __init__(self):
        # self.model_ = model
        # self.tokenizer_ = tokenizer
        self.max_length_ = 512
        self.classifier = pipeline("text-classification", model="BananaFish45/Ethnicity_model")
        self.max_length = self.max_length_

    def run_CA(self, text):
        return self.predict(text)

    def predict(self, input_text):
        tokens = self.classifier.tokenizer.encode(input_text, truncation=True, max_length=self.max_length_)
        truncated_text = self.classifier.tokenizer.decode(tokens, skip_special_tokens=True)
        
        result = self.classifier(truncated_text)
        label = result[0]['label']
        return label != 'LABEL_2'

if __name__ == '__main__':
    ca = CA()
    print(ca.run_CA("Sure, you can use my data"))#No ethnicity
    print(ca.run_CA("Paul is an Indian"))#Indian
    print(ca.run_CA("Dhinaz is an African young man very strong"))#African
    print(ca.run_CA("Yeshlen is an Asian business man crooked man indeed"))#Asian
    print(ca.run_CA("Yudi is a Middle Eastern Rug business man honest guy hey but loves money"))#Middle Eastern
    print(ca.run_CA("Jonas is a school admin clerk"))#No Ethnicity 
    print(ca.run_CA("Micheal is an Caucasian programmer "))#European
    print(ca.run_CA("Nevin is an Hispanic scammer"))#Hispanic
    print(ca.run_CA("Samantha is an African American"))#African American

