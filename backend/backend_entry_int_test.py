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


        result = backend_entry.process(self, path, "NCEWD1.docx")

        # print(result)

        if isinstance(result, dict):
            dres = result
        else:
            dres = json.loads(result)

        result_str = str(dres)

        if 'ner_result_text' in result_str:
            result_str = result_str.split('ner_result_text')[0] + '}'

        result_str = result_str.split("'Status':")[1].split(", ", 1)[1]

        print("Processed Result after removing ner_result_text:")
        print(result_str)

        expected_output_str = (
            "'Location': 2, 'NER': 3, 'Personal': 1, 'Financial': 0, 'Contact': 0, 'Consent Agreement': True, 'Genetic': 0, 'Ethnic': 2, 'Medical': 0, 'Biometric': 0, 'RAG_Statement': 'The following GDPR articles are potentially violated: 5, 9, 9(1), 9(2)(b), 9(2)(g), 12', 'lenarts': 3, '}"        )

        self.assertEqual(result_str.strip(), expected_output_str.strip())




if __name__ == '__main__':
    unittest.main()
