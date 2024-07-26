from transformers import BertTokenizer, BertForSequenceClassification, pipeline

tokenizer = BertTokenizer.from_pretrained('./trained_model')
model = BertForSequenceClassification.from_pretrained('./trained_model')

class CA:

    def run_CA(self, text):
        return self.predict(text)

        
    def predict(self, input):
        classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)
        return classifier(input)

    if __name__ == '__main__':
        print(predict("Sure, you can use my data"))