from pdfminer.high_level import extract_text

def extract_text_from_pdf(file_path):
    return extract_text(file_path)

path = "NCE1.pdf"
text = extract_text_from_pdf(path)

with open('output.txt', 'w') as f:
    f.write(text)