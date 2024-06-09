# import os
import sys
from validator import validator
from text_extractor import text_extractor
from storage_and_submission import storage_and_submission
from text_preprocessor import text_preprocessor

class document_parser:
    def __init__(self):
        self.validator = validator()
        self.text_extractor = text_extractor()
        self.preprocessor = text_preprocessor()
        self.storage_and_submission = storage_and_submission()

    def process(self, file_path):
        try:
            extension = self.validator.process_file(file_path)
            text = self.text_extractor.extract_text_multi(file_path, extension)
            output = self.storage_and_submission.submit(text)
            lemmatized = self.preprocessor.process(output)
        except SystemExit as e:
            print("An error occurred: ", e)
            sys.exit(1)
        
        return lemmatized