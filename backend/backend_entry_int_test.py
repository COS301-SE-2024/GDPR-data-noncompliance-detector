import unittest
from backend_entry import backend_entry
import json

class TestBackendEntryIntegration(unittest.TestCase):
    
    backend_entry = backend_entry()

    def test_process_returns_expected_output(self):
        # Arrange
        path = './mockdata/NCE1.pdf'
        # expected_output = (
        #     "Most probable countries of origin:\n"
        #     "Predominant Language of Country of Origin: English,\n"
        #     "\n"
        #     "Violation Report:\n"
        #     "Category: General Personal Data\n"
        #     "Total per category: 56\n"
        #     "\n"
        #     "Category: Genetic Data\n"
        #     "Total per category: 0\n"
        #     "\n"
        #     "Category: Biometric Data\n"
        #     "Total per category: 0\n"
        #     "\n"
        #     "Category: Data relating to Health\n"
        #     "Total per category: 0\n"
        #     "\n"
        #     "Category: Data revealing Racial and Ethnic Origin\n"
        #     "Total per category: 0\n"
        #     "\n"
        #     "Category: Political Opinions\n"
        #     "Total per category: 0\n"
        #     "\n"
        #     "Category: Religious or Ideological Convictions\n"
        #     "Total per category: 0\n"
        #     "\n"
        #     "Category: Occupational Information\n"
        #     "Total per category: 2\n"
        #     "\n"
        # )

        expected_output = (
            '{"score": {"Status": 0, "Location": 0, "NER": 5, "Personal": 2, "Financial": 0, "Contact": 2, "Consent Agreement": false, "Genetic": 0, "Ethnic": 7, "Medical": 3, "Biometric": 0}}'
            # "Non-compliant\n\n"
            # "Document potentially references 5 different individuals\n\n\n"
            # "Potential Location of Origin : \n"
            # "Not EU\n\n"
            # "Violation Report: \n\n"
            # "General Personal Data:\n"
            # "Financial Data:\n"
            # "Total per category : 0\n\n"
            # "Personal Identification Data:\n"
            # "Total per category : 2\n\n"
            # "Contact Details:\n"
            # "Total per category : 2\n\n"
            # "Biometrics and Imaging:\n"
            # "0 persons can be identified through images in the document\n\n"
            # "Data relating to Health:\n"
            # "Total per category : 3\n\n"
            # "Data revealing Racial and Ethnic Origin:\n"
            # "Total per category : 1\n\n"
            # "The document does not seem to contain any data consent agreements"            
            # "Non-compliant\n"
            # "\n"
            # "Document potentially references 5 different individuals\n"
            # "\n"
            # "Most probable countries of origin:\n"
            # "Predominant Language of Country of Origin: English, \n"
            # "\n"
            # "Violation Report: \n"
            # "\n"
            # "General Personal Data:\n"
            # "54\n"
            # "\n"
            # "Biometrics and Imaging:\n"
            # "0 persons can be identified through images in the document\n"
            # "\n"
            # "Data relating to Health:\n"
            # "\n"
            # "Data revealing Racial and Ethnic Origin:\n"
            # "1\n"
            # "\n"
            # "The document does not seem to contain any data consent agreements\n"
            )
        
        result = backend_entry.process(self, path)
        new_result = json.dumps(result)

        # actual_output_lines = result.splitlines()
        # filtered_actual_output_lines = [
        #     line for line in actual_output_lines if not line.startswith("Probability:")
        # ]
        # filtered_actual_output = "\n".join(filtered_actual_output_lines).strip()  # Normalize newlines and strip whitespace

        # Debugging output
        print("Expected Output:")
        print(expected_output)
        print("\nFiltered Actual Output:")
        print(new_result)

        # Assert
        for line in expected_output.splitlines():
            self.assertIn(line.strip(), new_result.strip())

if __name__ == '__main__':
    unittest.main()
