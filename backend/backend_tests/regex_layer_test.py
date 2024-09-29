import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import unittest
from backend.Detection_Engine.regex_layer import regex_layer

class TestRegexLayer(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.regex_layer = regex_layer()

    def test_financial_data_regex(self):
        sample_text = "Visa card 4111 1111 1111 1111 and IBAN GB82 WEST 1234 5698 7654 32"
        result = self.regex_layer.financial_data_regex(sample_text)
        
        self.assertEqual(len(result["Visa Card Number"]), 1)

    def test_personal_data_regex(self):
        sample_text = "My SSN is 123-45-6789 and DOB is 01/01/1990. Passport is A1234567."
        result = self.regex_layer.personal_data_regex(sample_text)

        self.assertEqual(result["Social Security Number"], ["123-45-6789"])
        self.assertEqual(result["Date"], ["01/01/1990"])
        self.assertEqual(result["EU Passport Number"], [])

    def test_contact_data_regex(self):
        sample_text = "You can contact me at john.doe@example.com or 555-123-4567"
        result = self.regex_layer.contact_data_regex(sample_text)

        self.assertEqual(result["Email Address"], ["john.doe@example.com"])
        self.assertEqual(result["Phone Number"], ["555-123-4567"])

    def test_categorize_and_report_personal(self):
        sample_results = {
            "Social Security Number": ["123-45-6789"],
            "Date": ["01/01/1990"],
            "ID": ["A1B2C3D4"],
            "File Path": ["C:\\Users\\example.txt"],
            "EU Passport Number": ["A1234567"]
        }
        total = self.regex_layer.categorize_and_report_personal(sample_results)
        self.assertEqual(total, 5)

if __name__ == '__main__':
    unittest.main()
