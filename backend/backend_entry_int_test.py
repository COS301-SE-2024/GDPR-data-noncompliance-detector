import unittest
from backend_entry import backend_entry

class TestBackendEntryIntegration(unittest.TestCase):

    def test_process_returns_expected_output(self):
        # Arrange
        path = './mockdata/NCE1.pdf'
        expected_output = (
            "Most probable countries of origin:\n"
            "Predominant Language of Country of Origin: English,\n"
            "\n"
            "Violation Report:\n"
            "Category: General Personal Data\n"
            "Total per category: 56\n"
            "\n"
            "Category: Genetic Data\n"
            "Total per category: 0\n"
            "\n"
            "Category: Biometric Data\n"
            "Total per category: 0\n"
            "\n"
            "Category: Data relating to Health\n"
            "Total per category: 0\n"
            "\n"
            "Category: Data revealing Racial and Ethnic Origin\n"
            "Total per category: 0\n"
            "\n"
            "Category: Political Opinions\n"
            "Total per category: 0\n"
            "\n"
            "Category: Religious or Ideological Convictions\n"
            "Total per category: 0\n"
            "\n"
            "Category: Occupational Information\n"
            "Total per category: 2\n"
            "\n"
        )

        # Act
        result = backend_entry.process(path)

        # Remove the 'Probability' line from the actual result
        actual_output_lines = result.splitlines()
        filtered_actual_output_lines = [
            line for line in actual_output_lines if not line.startswith("Probability:")
        ]
        filtered_actual_output = "\n".join(filtered_actual_output_lines).strip()  # Normalize newlines and strip whitespace

        # Debugging output
        print("Expected Output:")
        print(expected_output)
        print("\nFiltered Actual Output:")
        print(filtered_actual_output)

        # Assert
        for line in expected_output.splitlines():
            self.assertIn(line.strip(), filtered_actual_output)

if __name__ == '__main__':
    unittest.main()
