import unittest
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'backend')))

from backend.Document_parser.validator import validator



class TestValidator(unittest.TestCase):
    def setUp(self):
        self.validator = validator()

    def test_process_file_pdf(self):
        v = validator()
        path = os.path.join(os.path.dirname(__file__), 'NCE1.pdf')
        result = v.process_file(path)
        self.assertEqual(result, '.pdf')

    def test_process_file_docx(self):
        v = validator()
        path = os.path.join(os.path.dirname(__file__), 'NCEWD1.docx')
        result = v.process_file(path)
        self.assertEqual(result, '.docx')

    def test_process_file_xlsx(self):
        v = validator()
        path = os.path.join(os.path.dirname(__file__), 'NCEX1.xlsx')
        result = v.process_file(path)
        self.assertEqual(result, '.xlsx')


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