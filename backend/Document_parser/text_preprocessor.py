import nltk
import bleach
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords 

class text_preprocessor:

    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
    
    def process(self, path):
        output = nltk.sent_tokenize(path)
        lemmatized_strings = ' '.join(output)
        sanitized_lemmatized = bleach.clean(lemmatized_strings)

        return sanitized_lemmatized



