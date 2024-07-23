import pandas as pd 
import spacy 
import requests 
import sentencepiece as spm
from bs4 import BeautifulSoup
nlp = spacy.load("en_core_web_sm")
pd.set_option("display.max_rows", 5000)


if __name__ == "__main__":
    res = nlp("")
    print(len(res.ents))

    print_this = 0
    for i in res.ents:
        print_this += 1

    print(f"Set up complete : ",print_this)

    nlp.to_disk('Entity_builder')