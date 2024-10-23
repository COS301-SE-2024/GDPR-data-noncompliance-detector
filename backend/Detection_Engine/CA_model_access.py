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
        # Use sliding window to handle long texts
        window_size = self.max_length_ - 2  # Account for special tokens
        overlap = 50  # Define the overlap between windows

        chunks = self.sliding_window(input_text, window_size, overlap)
        labels = []

        for chunk in chunks:
            tokens = self.classifier.tokenizer.encode(chunk, truncation=True, max_length=self.max_length_)
            truncated_text = self.classifier.tokenizer.decode(tokens, skip_special_tokens=True)
            result = self.classifier(truncated_text)
            labels.append(result[0]['label'])

        return labels

    def sliding_window(self, text, window_size, overlap):
        # Split the text into chunks using a sliding window approach
        words = text.split()
        chunks = []
        for i in range(0, len(words), window_size - overlap):
            chunk = " ".join(words[i:i + window_size])
            chunks.append(chunk)
        return chunks

if __name__ == '__main__':
    ca = CA()
    print(ca.run_CA("Sure, you can use my data"))