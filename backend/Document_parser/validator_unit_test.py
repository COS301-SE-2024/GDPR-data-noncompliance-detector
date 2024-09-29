import unittest
import os
from .validator import validator


class TestValidator(unittest.TestCase):
    def setUp(self):
        self.validator = validator()

    def test_process_file_pdf(self):
        v = validator()
        result = v.process_file('../mockdata/NCE1.pdf')
        self.assertEqual(result, '.pdf')

    def test_process_file_docx(self):
        v = validator()
        result = v.process_file('../mockdata/NCEWD1.docx')
        self.assertEqual(result, '.docx')

    def test_process_file_xlsx(self):
        v = validator()
        result = v.process_file('../mockdata/NCEX1.xlsx')
        self.assertEqual(result, '.xlsx')

    def test_process_file_unsupported_type(self):
        with self.assertRaises(ValueError) as context:
            self.validator.process_file('copy.txt')
        self.assertEqual(str(context.exception), "Unsupported file type")

    def test_process_file_not_found(self):
        with self.assertRaises(FileNotFoundError) as context:
            self.validator.process_file('nonexistent.pdf')
        self.assertTrue('File not found' in str(context.exception))

    def test_process_file_supported_type(self):
        original_exists = os.path.exists
        os.path.exists = lambda x: True
        try:
            extension = self.validator.process_file('existing_file.pdf')
            self.assertEqual(extension, '.pdf')
        finally:
            os.path.exists = original_exists


if __name__ == '__main__':
    unittest.main()