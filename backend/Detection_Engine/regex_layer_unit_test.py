import unittest
from regex_layer import regex_layer

class TestRegexLayer(unittest.TestCase):

    def setUp(self):
        self.regex = regex_layer()

    def test_personal_data_regex_emails(self):
        text = "Contact me at example@example.com."
        result = self.regex.personal_data_regex(text)
        self.assertIn("example@example.com", result["Email Address"])

    def test_personal_data_regex_phones(self):
        text = "Call me at 123-456-7890."
        result = self.regex.personal_data_regex(text)
        self.assertIn("123-456-7890", result["Phone Number"])

    def test_personal_data_regex_visa(self):
        text = "My card is 4111 1111 1111 1111."
        result = self.regex.personal_data_regex(text)
        self.assertIn("4111 1111 1111 1111", result["Visa Card Number"])

    def test_categorize_and_print_report(self):
        results = {
            "Email Address": ["example@example.com"],
            "Phone Number": [],
            "Potential Name": [],
            "Visa Card Number": [],
            "Mastercard Number": [],
            "Social Security Number": [],
            "Date": [],
            "IP Address": [],
            "Financial Data": [],
            "ID": [],
            "EU Passport Number": [],
            "File Path": []
        }
        report = self.regex.categorize_and_print_report(results)
        self.assertIn("Category: General Personal Data", report)
        self.assertIn("Email Address: example@example.com", report)

    def test_process(self):
        text = "Contact me at example@example.com or call 123-456-7890."
        report = self.regex.process(text)
        self.assertIn("Email Address: example@example.com", report)
        self.assertIn("Phone Number: 123-456-7890", report)

if __name__ == '__main__':
    unittest.main()