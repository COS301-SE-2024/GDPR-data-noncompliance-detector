from datetime import datetime
import codecs
class storage_and_submission:
    def __init__(self):
        now = datetime.now()
        self.timestamp_str = now.strftime("%Y%m%d_%H%M%S")
        self.filename = f'{self.timestamp_str}_o.txt'

    import codecs

    def codec_handler(self, filename):
        with codecs.open(filename, 'r', encoding='ISO-8859-1') as f:
            content = f.read()

        with codecs.open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

    def submit(self, text):
        # with open(self.filename, 'w') as f:
        #     f.write(text)
        
        # result = text.encode('ISO-8859-1')

        return text