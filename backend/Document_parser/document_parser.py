# import os
import sys
from validator import validator
from text_extractor import text_extractor
from storage_and_submission import storage_and_submission


class document_parser:
    def __init__(self, file_path):
        self.file_path = file_path
        self.validator = validator()
        self.text_extractor = text_extractor()
        self.storage_and_submission = storage_and_submission()

    def process(self):
        try:
            extension = self.validator.process_file(self.file_path)
            text = self.text_extractor.extract_text_multi(self.file_path, extension)
            output = self.storage_and_submission.submit(text)
        except SystemExit as e:
            print("An error occurred: ", e)
            sys.exit(1)
        
        return output