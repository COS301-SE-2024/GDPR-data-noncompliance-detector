from transformers import BertTokenizer

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

if __name__ == '__main__':
    save_path = "./ca_tokenizer"
    tokenizer.save_pretrained(save_path)

