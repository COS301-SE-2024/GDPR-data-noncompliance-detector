import os
from transformers import BertTokenizer, BertForSequenceClassification, pipeline

# base_dir = os.path.dirname(__file__)
# model_path = os.path.join(base_dir, 'trained_model')
# tokenizer_path = os.path.join(base_dir,'ca_tokenizer')

# tokenizer_ = AutoTokenizer.from_pretrained("rdhinaz/gdpr_consent_agreement")
# mode+l = AutoModelForSequenceClassification.from_pretrained("rdhinaz/gdpr_consent_agreement")

class CA:

    def __init__(self):
        # self.model_ = model
        # self.tokenizer_ = tokenizer
        self.max_length_ = 512
        self.classifier = pipeline("text-classification", model="rdhinaz/gdpr_consent_agreement")
        self.max_length = self.max_length_

    def run_CA(self, text):
        return self.predict(text)

    def predict(self, input_text):
        tokens = self.classifier.tokenizer.encode(input_text, truncation=True, max_length=self.max_length_)
        truncated_text = self.classifier.tokenizer.decode(tokens, skip_special_tokens=True)
        
        result = self.classifier(truncated_text)
        # print(result)
        return result[0]['label']

if __name__ == '__main__':
    ca = CA()
    print(ca.run_CA("Sure, you can use my data"))