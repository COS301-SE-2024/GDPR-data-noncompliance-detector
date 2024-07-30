from transformers import AutoTokenizer
from sklearn.model_selection import train_test_split
from transformers import BertTokenizer,BertForSequenceClassification, TrainingArguments, Trainer, LongformerConfig, LongformerModel, LongformerTokenizer
import pandas as pd
import pyarrow as pa 
from datasets import Dataset
# tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

configuration = LongformerConfig()
# model = LongformerModel(configuration)
# configuration = model.config

def process_record(record):
    text = record['text']
    to_string = str(text)
    first_parse = ' '.join(to_string.split())
    second_parse = tokenizer(first_parse, padding='max_length',truncation=True,max_length=512)

    label = 0

    if record['class'] == 'positive':
        label += 1

    second_parse['class'] = label
    second_parse['text'] = first_parse

    return second_parse

def test_train(processed):
    df = pd.DataFrame(processed)

    train, valid = train_test_split(df, test_size = 0.1, random_state = 2024)

    return train, valid

def tokenize_function(examples):
    return tokenizer(examples['text'], padding='max_length', truncation=True, max_length=128)

def prep_sets(train, valid):
    train_prep = Dataset(pa.Table.from_pandas(train))
    valid_prep = Dataset(pa.Table.from_pandas(valid))

    tokenized_train = train_prep.map(tokenize_function,batched=True)
    tokenized_valid = valid_prep.map(tokenize_function,batched=True)

    tokenized_train = tokenized_train.map(lambda examples: {'labels': examples['class']}, batched=True)
    tokenized_train.set_format(type='torch', columns=['input_ids', 'attention_mask', 'labels'])
                     
    tokenized_valid = tokenized_valid.map(lambda examples: {'labels': examples['class']}, batched=True)
    tokenized_valid.set_format(type='torch', columns=['input_ids', 'attention_mask', 'labels'])

    return tokenized_train,tokenized_valid

def model_creation():
    model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=2)
    return model

def train_and_eval(model, train_second_parse, validator, tokenizer):
    training_args = TrainingArguments(output_dir='./results',evaluation_strategy='epoch',learning_rate=2e-5,per_device_train_batch_size=16,per_device_eval_batch_size=16,num_train_epochs=5,weight_decay=0.01,)

    trainer = Trainer(model=model, args=training_args, train_dataset = train_second_parse, eval_dataset = validator, tokenizer=tokenizer)

    trainer.train()
    print(trainer.evaluate())

def save_model(model, tokenizer):
    model.save_pretrained('./trained_model')
    tokenizer.save_pretrained('./trained_model')


if __name__ == '__main__':
    # a = ({'text':'I hereby consent to the use of my personal data','class':'positive'})
    # print(process_record(a))
    print("Reading data: ")
    df = pd.read_csv('C:/Users/Mervyn Rangasamy/Documents/2024/COS 301/Capstone/Repo/GDPR-data-noncompliance-detector/backend/Model_data/gdpr_consent_dataset.csv')

    # print(df.head())

    first_list = []

    print("Processing records: ")
    for i in range(len(df[:2000])):
        first_list.append(process_record(df.iloc[i]))

    # print(first_list[0])

    print("Splitting data: ")
    train_, valid_ = test_train(first_list)

    print("Preprocessing: ")
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    p_train, p_valid = prep_sets(train_,valid_)

    print("Creating model: ")
    x_m = model_creation()


    print("/033[95mTraining model: /033[0m")
    # tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    train_and_eval(x_m,p_train,p_valid,tokenizer) 

    save_model(x_m,tokenizer)