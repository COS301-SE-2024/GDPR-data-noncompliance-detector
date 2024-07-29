# import os
# from transformers import BertTokenizer, BertForSequenceClassification, pipeline

# base_dir = os.path.dirname(__file__)
# model_path = os.path.join(base_dir, 'trained_model')

# tokenizer = BertTokenizer.from_pretrained(model_path)
# model = BertForSequenceClassification.from_pretrained(model_path)

# class CA:

#     def __init__(self):
#         self.model_ = model
#         self.tokenizer_ = tokenizer
#         self.max_length_ = 512
#         self.classifier = pipeline("text-classification", model=self.model_, tokenizer=self.tokenizer_)
#         self.max_length = self.max_length_

#     def run_CA(self, text):
#         return self.predict(text)

#     def predict(self, input_text):
#         tokens = self.classifier.tokenizer.encode(input_text, truncation=True, max_length=self.max_length_)
#         truncated_text = self.classifier.tokenizer.decode(tokens, skip_special_tokens=True)
        
#         result = self.classifier(truncated_text)
#         return result[0]['label']

# if __name__ == '__main__':
#     ca = CA()
#     print(ca.run_CA("Sure, you can use my data"))
