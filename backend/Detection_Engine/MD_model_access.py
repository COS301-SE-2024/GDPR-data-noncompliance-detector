from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline

class MD:

    def __init__(self):
        tokenizer = AutoTokenizer.from_pretrained("ugaray96/biobert_ncbi_disease_ner")
        model = AutoModelForTokenClassification.from_pretrained(
            "ugaray96/biobert_ncbi_disease_ner"
        )

        self.ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer)

    def run_MD(self, input):
        # result = self.ner_pipeline(input)
        return self.predict(input)

    def predict(self, input):
        
        result = self.ner_pipeline(input)

        diseases = []
        for entity in result:
            if entity["entity"] == "Disease":
                diseases.append(entity["word"])
            elif entity["entity"] == "Disease Continuation" and diseases:
                diseases[-1] += f" {entity['word']}"

        return diseases
        # print(f"Diseases: {', '.join(diseases)}")

if __name__ == '__main__':
    md = MD()
    output = md.run_MD("Personal Information: Name: Harvey Spectre Date of Birth: July 18, 1972 Address: 123 Pearson Street, New York, NY Email Address: harvey.spectre@example.com Phone Number: (555) 555-1234 National Identification Number: 123-45-6789 IP Address: 192.168.1.100 Social Media Profile: @HarveySpectreLaw (Twitter) Special Categories of Personal Data: Health Data: Harvey Spectre's medical records detail his health history, including  treatment for a sports-related injury sustained during his college years and regular check-ups for managing hypertension. Medication records show prescriptions for blood pressure management and occasional pain relief medication.")
    print(len(output))