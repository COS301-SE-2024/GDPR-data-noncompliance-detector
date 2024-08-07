import re

class regex_layer:

    def financial_data_regex(self, text):
        visa = re.findall(r'\b([4]\d{3}[\s]\d{4}[\s]\d{4}[\s]\d{4}|[4]\d{3}[-]\d{4}[-]\d{4}[-\d{4}|[4]\d{3}[.]\d{4}[.]\d{4}[.]\d{4}|[4]\d{3}\d{4}\d{4}\d{4})\b', text)

        mastercard = re.findall(r'^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$', text)

        financial_data = re.findall(r'\b[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}\b', text)

        return {
            "Visa Card Number": visa,
            "Mastercard Number": mastercard,
            "Financial Data": financial_data
        }


    def personal_data_regex(self, text):
        
        # names = re.findall(r'\b[A-Z][a-z]+\s[A-Z][a-z]+\b', text)

        ssns = re.findall(r'\b\d{3}-\d{2}-\d{4}\b', text)
        
        dobs = re.findall(r'\b(?:\d{1,2}/\d{1,2}/\d{2,4}|\d{1,2}\s(?:January|February|March|April|May|June|July|August|September|October|November|December)\s\d{2,4}|\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{2,4}|\d{1,2}-(?:January|February|March|April|May|June|July|August|September|October|November|December)-\d{2,4}|\d{1,2}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*-\d{2,4})\b', text, re.IGNORECASE)       
        
        # ip_addresses = re.findall(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', text)
        # ip_addresses.extend(re.findall(r'\b([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b', text))
        
        personal_ids = re.findall(r'\b[A-Z0-9]{8,10}\b', text) 

        eu_passport_numbers = re.findall('\b[A-Z]{1}[0-9A-Z]{7,8}\b',text)

        paths = re.findall(r'\\[^\\]+$',text)
        return {
            "Social Security Number": ssns,
            "Date": dobs,
            "ID": personal_ids,
            "EU Passport Number": eu_passport_numbers,
            "File Path":paths
        }
    
    def contact_data_regex(self, text):

        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        phones = re.findall(r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b', text)

        return {
            "Email Address": emails,
            "Phone Number": phones
        }

    def categorize_and_report_personal(self,results):
        categories = {
            "General Personal Data": ["Date","ID","EU Passport Number","Social Security Number","File Path"]
            # "Genetic Data": [],  
            # "Biometric Data": ["ID"],
            # "Data relating to Health": [],
            # "Data revealing Racial and Ethnic Origin": [], 
            # "Political Opinions": [], 
            # "Religious or Ideological Convictions": [],
            # "Occupational Information": ["Date","Social Security Number"] 
        }
        
        report = ""
        exclude = ""
        for category, keys in categories.items():
            report += f"Category: {category}\n"
            for key in keys:
                if key in results and results[key]:
                    for instance in results[key]:
                        exclude += f"    {key}: {instance}\n"
            total = sum(len(results[key]) for key in keys)
            report += f"Total per category: {total}\n\n"
        
        return total
    
    def process(self,text):
        res = self.personal_data_regex(text)
        report = self.categorize_and_print_report(res)
        return report
    