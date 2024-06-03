import unittest
from lang_detection import location_finder


class TestLocationFinder(unittest.TestCase):

    def setUp(self):
        self.finder = location_finder()

    def test_detect_country_english(self):
        result = self.finder.detect_country('../mockdata/polish.txt')
        self.assertIsNotNone(result)
        self.assertTrue(any(lang[0] == 'Polish' for lang in result))

    def test_detect_country_spanish(self):
        result = self.finder.detect_country('../mockdata/dutch.txt')
        self.assertIsNotNone(result)
        self.assertTrue(any(lang[0] == 'Dutch' for lang in result))

    def test_detect_country_french(self):
        result = self.finder.detect_country('../mockdata/german.txt')
        self.assertIsNotNone(result)
        self.assertTrue(any(lang[0] == 'German' for lang in result))

    # This test is expected to fail
    def test_detect_country_invalid_file(self):
        result = self.finder.detect_country('dummy.txt')
        self.assertIsNone(result)


if __name__ == '__main__':
    unittest.main()
