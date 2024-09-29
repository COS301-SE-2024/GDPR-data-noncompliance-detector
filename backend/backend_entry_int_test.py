import unittest
from backend_entry import backend_entry
import json
import os
import base64

class TestBackendEntryIntegration(unittest.TestCase):
    
    backend_entry = backend_entry()

    def test_process_returns_expected_output(self):
        # Arrange
        # path = './NCEWD1.docx'
        path = os.path.join(os.path.dirname(__file__), 'NCEWD1.docx')

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
# actual_output_lines = result.splitlines()
        # filtered_actual_output_lines = [
        #     line for line in actual_output_lines if not line.startswith("Probability:")
        # ]
        # filtered_actual_output = "\n".join(filtered_actual_output_lines).strip()  # Normalize newlines and strip whitespace

        # Debugging output

        expected_output = (
            "{'filename': 'NCEWD1.docx', 'result': {'score': {'Biometric': 0, 'Consent Agreement': True, 'Contact': 0, 'Ethnic': 2, 'Financial': 0, 'Genetic': 0, 'Location': 2, 'Medical': 0, 'NER': 3, 'Personal': 1, 'RAG_Statement': 'The following GDPR articles are potentially violated: 5, 9, 9(1), 9(2)(b), 9(2)(g), 12', 'Status': 5.175602897408009, 'lenarts': 3'}}}"
                        )
        
        result = backend_entry.process(self, path, "NCEWD1.docx")
        # dres = json.loads(result)
        dres = result
        if 'ner_result_text' in dres.get('result', {}).get('score', {}):
            del dres['result']['score']['ner_result_text']

        new_result = json.dumps(dres)

        if 'base64' in new_result:  # Adjust the condition as necessary
            decoded_bytes = base64.b64decode(new_result.split('base64,')[1])  # Assuming base64 is part of the string
            new_result = decoded_bytes.decode('utf-8', errors='replace')


        print("Expected Output:")
        print(expected_output)

        
        print("\nFiltered Actual Output:")
        print(new_result)
        # Assert

        self.assertEqual(new_result.strip(), expected_output.strip())


if __name__ == '__main__':
    unittest.main()
