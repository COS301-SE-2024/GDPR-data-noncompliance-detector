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
    text = record['description']
    to_string = str(text)
    first_parse = to_string
    second_parse = tokenizer(first_parse, padding='max_length',truncation=True,max_length=512)

    label = 0

    if record['class'] == 1:
        label += 1
    elif record['class'] == 2:
        label += 2
    elif record['class'] == 3:
        label += 3
    elif record['class'] == 4:
        label += 4
    elif record['class'] == 5:
        label += 5

    second_parse['class'] = label
    second_parse['description'] = first_parse

    return second_parse

def test_train(processed):
    df = pd.DataFrame(processed)
    train = df
    return train

def tokenize_function(examples):
    return tokenizer(examples['description'], padding='max_length', truncation=True, max_length=512)

def prep_sets(train):
    train_prep = Dataset(pa.Table.from_pandas(train))

    tokenized_train = train_prep.map(tokenize_function, batched=True)

    tokenized_train = tokenized_train.map(lambda examples: {'labels': examples['labels']}, batched=True)
    tokenized_train.set_format(type='torch', columns=['input_ids', 'attention_mask', 'labels'])

    return tokenized_train

def model_creation():
    model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=6)
    return model

def train_and_eval(model, train_dataset, tokenizer):
    training_args = TrainingArguments(output_dir='./results', evaluation_strategy='no', learning_rate=2e-5,
                                      per_device_train_batch_size=2, num_train_epochs=3, weight_decay=0.01)

    trainer = Trainer(model=model, args=training_args, train_dataset=train_dataset, tokenizer=tokenizer)
    trainer.train()
    # print(trainer.evaluate())

def save_model(model, tokenizer):
    model.save_pretrained('./trained_model')
    tokenizer.save_pretrained('./trained_model')

if __name__ == '__main__':

    print("Reading data: ")
    df = pd.read_csv('model_data.csv')

    first_list = []
    print("Processing records: ")
    for i in range(len(df[:113])):
        first_list.append(process_record(df.iloc[i]))

    print("Splitting data: ")
    train_ = test_train(first_list)

    print("Preprocessing: ")
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    p_train = prep_sets(train_)

    print("Creating model: ")
    x_m = model_creation()

    print("Training model: ")
    train_and_eval(x_m, p_train, tokenizer)

    save_model(x_m, tokenizer)