import os
from transformers import BertTokenizer, BertForSequenceClassification, pipeline

# base_dir = os.path.dirname(__file__)
# model_path = os.path.join(base_dir, 'trained_model')
# tokenizer_path = os.path.join(base_dir,'ca_tokenizer')

# tokenizer_ = AutoTokenizer.from_pretrained("rdhinaz/gdpr_consent_agreement")
# mode+l = AutoModelForSequenceClassification.from_pretrained("rdhinaz/gdpr_consent_agreement")

class GF:

    def __init__(self):
        # self.model_ = model
        # self.tokenizer_ = tokenizer
        self.max_length_ = 512
        self.classifier = pipeline("text-classification", model="rdhinaz/genome-finder")
        self.max_length = self.max_length_

    def run_GF(self, text):
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
    GF = GF()
    print(GF.run_CA("Sure, you can use my data"))