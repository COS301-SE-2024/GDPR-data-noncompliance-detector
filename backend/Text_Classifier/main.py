from transformers import BertTokenizer, BertForSequenceClassification, pipeline

tokenizer = BertTokenizer.from_pretrained('./trained_model')
model = BertForSequenceClassification.from_pretrained('./trained_model')

#to run the model

classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)

texts = [
    "Configuration saved in ./trained_model\config.json Model weights saved in trained_model pytorch_model.bin tokenizer config file saved in  trained_model tokenizer_config.json Special tokens file saved in trained_model special_tokens_map.json", 
    "",
    "7894894894865163165185947/*7/*7984651655648948749879489462321321321456451321564987845132",
    "Look, Max is very happy in the team, he's got a wonderful group of engineers around him, he's got a great car, he's in the best car on the grid, he's driving in the form of his life."
]

results = classifier(texts)
for i, result in enumerate(results):
    print(f"Text: {texts[i]}")
    print(f"Prediction: {result}\n")

#to train and update the model
# for epoch in range(epochs):
#     model.train()
#     for batch in training_data:
#         optimizer.zero_grad()
#         input_ids = batch['input_ids'].to(device)
#         attention_mask = batch['attention_mask'].to(device)
#         labels = batch['labels'].to(device)
#         outputs = model(input_ids, attention_mask=attention_mask, labels=labels)
#         loss = outputs[0]
#         loss.backward()
#         optimizer.step()

# model.save_pretrained('./trained_model')
# tokenizer.save_pretrained('./trained_model')