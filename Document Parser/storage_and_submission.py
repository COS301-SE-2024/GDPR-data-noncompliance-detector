from datetime import datetime

class storage_and_submission:
    def __init__(self):
        now = datetime.now()
        self.timestamp_str = now.strftime("%Y%m%d_%H%M%S")
        self.filename = f'{self.timestamp_str}_o.txt'

    def submit(self, text):
        with open(self.filename, 'w') as f:
            f.write(text)
        return self.filename