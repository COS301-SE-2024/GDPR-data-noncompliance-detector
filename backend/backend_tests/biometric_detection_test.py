import unittest
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from backend.Detection_Engine.biometric_detection import biometric_detection

class TestBiometricDetection(unittest.TestCase):

    def setUp(self):
        self.detector = biometric_detection()

    def test_biometric_detect_people(self):
        result = self.detector.biometric_detect_people("../mockdata/p7.png")
        self.assertIsInstance(result, list)
        if result: 
            for person in result:
                self.assertEqual(person['label'], 'person')

    def test_biometric_detect_all_pdf(self):
        count = self.detector.biometric_detect_all("../mockdata/test_document.pdf")
        self.assertGreaterEqual(count, 0) 

    def test_biometric_detect_all_docx(self):
        count = self.detector.biometric_detect_all("../mockdata/test_document.docx")
        self.assertGreaterEqual(count, 0)

    def test_biometric_detect_all_xlsx(self):
        count = self.detector.biometric_detect_all("../mockdata/test_document.xlsx")
        self.assertGreaterEqual(count, 0) 

if __name__ == "__main__":
    unittest.main()
