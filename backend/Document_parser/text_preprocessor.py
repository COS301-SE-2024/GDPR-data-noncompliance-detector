import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords 

class text_preprocessor:

    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
    
    def process(self, path):
        output = nltk.sent_tokenize(path)
        lemmatized_strings = ' '.join(output)

        return lemmatized_strings



