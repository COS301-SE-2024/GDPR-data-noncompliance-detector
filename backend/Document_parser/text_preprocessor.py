import nltk
import bleach
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from nltk.data import find as nltk_find
from nltk import download 

def ensure_nltk_resources():
    resources = ['punkt', 'stopwords']
    for resource in resources:
        try:
            nltk_find(f'tokenizers/{resource}')
            nltk_find(f'corpora/{resource}')
        except LookupError:
            download(resource)


class text_preprocessor:

    def __init__(self):
        ensure_nltk_resources()
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
    
    def process(self, path):
        output = nltk.sent_tokenize(path)
        lemmatized_strings = ' '.join(output)
        sanitized_lemmatized = bleach.clean(lemmatized_strings)

        return sanitized_lemmatized



