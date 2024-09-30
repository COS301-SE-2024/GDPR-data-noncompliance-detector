import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import os
from huggingface_hub import hf_hub_download

class RAG:

    def __init__(self):
        index_path = hf_hub_download(repo_id="rdhinaz/GDPR-RAG-DB", filename="gdpr_articles_index.faiss")

        # Load FAISS index
        self.index = faiss.read_index(index_path)

        # Download .npy file
        npy_path = hf_hub_download(repo_id="rdhinaz/GDPR-RAG-DB", filename="gdpr_metadata.npy")

        # Load numpy array
        self.metadata = np.load(npy_path, allow_pickle=True).item()  
        # script_dir = os.path.dirname(os.path.abspath(__file__))

        # index_path = os.path.join(script_dir, 'gdpr_articles_index.faiss')
        # metadata_path = os.path.join(script_dir, 'gdpr_metadata.npy')

        # if not os.path.exists(index_path):
        #     raise FileNotFoundError(f"Index file not found: {index_path}")

        # self.index = faiss.read_index(index_path)

        # if not os.path.exists(metadata_path):
        #     raise FileNotFoundError(f"Metadata file not found: {metadata_path}")

        # self.metadata = np.load(metadata_path, allow_pickle=True).item()

        self.statements = self.metadata['statements']
        # self.articles = self.metadata['articles']
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.classifier = pipeline('text-classification',model='rdhinaz/GDPR-RAG')
        # script_dir = os.path.dirname(os.path.abspath(__file__))

        # index_path = os.path.join(script_dir, 'gdpr_articles_index.faiss')
        # metadata_path = os.path.join(script_dir, 'gdpr_metadata.npy')

        # if not os.path.exists(index_path):
        #     raise FileNotFoundError(f"Index file not found: {index_path}")

        # self.index = faiss.read_index(index_path)

        # if not os.path.exists(metadata_path):
        #     raise FileNotFoundError(f"Metadata file not found: {metadata_path}")

        # self.metadata = np.load(metadata_path, allow_pickle=True).item()

        # self.statements = self.metadata['statements']
        # # self.articles = self.metadata['articles']
        # self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        # self.classifier = pipeline('text-classification',model='rdhinaz/GDPR-RAG')

    def query_faiss_db(self, query_texts):
        # Ensure query_texts is a list
        if not isinstance(query_texts, list):
            raise ValueError("query_texts should be a list of strings")

        results = []

        for query_text in query_texts:
            # Encode the query text
            query_vector = self.embedding_model.encode([query_text]).astype('float32')

            k = 1
            distances, indices = self.index.search(query_vector, k)

            for i, idx in enumerate(indices[0]):
                result = {
                    "statement": self.statements[idx],
                    "distance": distances[0][i]
                }
                if result['distance'] <= 1.4765611:
                    results.append(result)

        return results

    def sliding_window(self, text, window_size, overlap):
        tokens = self.classifier.tokenizer.encode(text, truncation=False)
        chunks = []
        for i in range(0, len(tokens), window_size - overlap):
            chunk = tokens[i:i + window_size]
            if len(chunk) < window_size:
                break
            chunks.append(chunk)
        return chunks

    # def predict(self, input_text):
    #     window_size = 128  
    #     overlap = 64       

    #     chunks = self.sliding_window(input_text, window_size, overlap)
    #     labels = []

    #     for chunk in chunks:
    #         truncated_text = self.classifier.tokenizer.decode(chunk, skip_special_tokens=True)
    #         result = self.classifier(truncated_text)
    #         label = result[0]['label']
    #         labels.append(label)

    #     return labels

    def predict(self, input_text):
        
        tokens = self.classifier.tokenizer.encode(input_text, truncation=True, max_length=512)
        truncated_text = self.classifier.tokenizer.decode(tokens, skip_special_tokens=True)
        
        result = self.classifier(truncated_text)
        return result[0]['label']

    def generate(self, results):
        # Extract text from each result and generate label, add label to array, return array
        labels = []
        for result in results:
            text = result["statement"]  # Extract the text from the dictionary
            label_ = self.predict(text)
            labels.append(label_)

        return labels

    def interpret_findings(self, labels):
        #match labels
        label_to_articles = {
            'LABEL_1': '5',
            'LABEL_2': '6',
            'LABEL_3': ['9','9(1)','9(2)(b)','9(2)(g)'],
            'LABEL_4': ['6','7(1)','7(2)','7(3)'],
            'LABEL_5': ['12']
            }

        unique_labels = set()
        count = 0

        for label in labels:
            if label == 'LABEL_4':
                if label not in unique_labels:
                    unique_labels.add(label)
                count += 2
            elif label not in unique_labels:
                unique_labels.add(label)
                count += 1

        articles = []
        for label in label_to_articles:
            if label in labels:
                articles.extend(label_to_articles[label])

        return articles, count

    def process(self, query):
        # print("Querying DB")
        search_res = self.query_faiss_db(query)
        # print(search_res[0]['statement'])
        # print("Done")
        # print("Using Model")
        findings = self.generate(search_res)
        # print(findings)
        # print("Done")
        # print("Interpreting Generation")
        
        output = self.interpret_findings(findings)
        return output

if __name__ == '__main__':
    RAgger = RAG()
    query = ['personal','biometric','no consent agreement']

    #Model Test:

    # print(RAgger.predict("Personal Data was detected, GDPR describes personal data regualtions as : processed lawfully, fairly and in a transparent manner in relation to the data subject ‘lawfulness, fairness and transparency'); collected for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes; further processing for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes shall, in accordance with Article 83(1 not be considered to be incompatible with the initial purposes (‘purpose limitation'); adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed ('data minimisation'); accurate and, where necessary, kept up to date; every reasonable step must be taken to ensure that personal data that are inaccurate, having regard to the purposes for which they are processed, are erased or rectified without delay ('accuracy'); kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed; personal data may be stored for longer periods insofar as the personal data will be processed solely for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes in accordance with Article 89(1) subject to implementation of the appropriate technical and organisational measures required by this Regulation in order to safeguard the rights and freedoms of the data subject ('storage limitation'); processed in a manner that ensures appropriate security of the personal data, including protection against unauthorised or unlawful processing and against accidental loss, destruction or damage, using appropriate technical or organisational measures ('integrity and confidentiality'). "))
    # print(RAgger.predict("Data relating to a subject is present in this document, Processing shall be lawful only if and to the extent that at least one of the following applies: the data subject has given consent to the processing of his or her personal data for one or more specific purposes; processing is necessary for the performance of a contract to which the data subject is party or in order to take steps at the request of the data subject prior to entering into a contract; processing is necessary for compliance with a legal obligation to which the controller is subject; processing is necessary in order to protect the vital interests of the data subject or of another natural person; processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller; processing is necessary for the purposes of the legitimate interests pursued by the controller or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject which require protection of personal data, in particular where the data subject is a child. Point (f) of the first subparagraph shall not apply to processing carried out by public authorities in the performance of their tasks."))
    # print(RAgger.predict("This document does contain instances of Genetic Data, invoking the following restrictions: Processing of personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, and the processing of genetic data, biometric data for the purpose of uniquely identifying a natural person, data concerning health or data concerning a natural person's sex life or sexual orientation shall be prohibited."))
    # print(RAgger.predict("This document does contain instances of Biometric Data, invoking the following restrictions: processing is necessary for the purposes of carrying out the obligations and exercising specific rights of the controller or of the data subject in the field of employment and social security and social protection law in so far as it is authorised by Union or Member State law or a collective agreement pursuant to Member State law providing for appropriate safeguards for the fundamental rights and the interests of the data subject;"))
    # print(RAgger.predict("This document does contain instances of Health Data, invoking the following restrictions: processing is necessary for reasons of substantial public interest, on the basis of Union or Member State law which shall be proportionate to the aim pursued, respect the essence of the right to data protection and provide for suitable and specific measures to safeguard the fundamental rights and the interests of the data subject;"))
    # print(RAgger.predict("This document does contain instances of Data Revealing Racial and Ethnic Origin, invoking the following restrictions: Processing of personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, and the processing of genetic data, biometric data for the purpose of uniquely identifying a natural person, data concerning health or data concerning a natural person's sex life or sexual orientation shall be prohibited."))
    # print(RAgger.predict("This document does not contain consent agreements, causing complications regarding the following: Where processing is based on consent, the controller shall be able to demonstrate that the data subject has consented to processing of his or her personal data."))
    # print(RAgger.predict("This document contains transparency transgessions, which request that: The controller shall facilitate the exercise of data subject rights under Articles 15 to 22. 2In the cases referred to in Article 11(2), the controller shall not refuse to act on the request of the data subject for exercising his or her rights under Articles 15 to 22, unless the controller demonstrates that it is not in a position to identify the data subject."))
    # print(RAgger.predict("This document contains transparency transgessions, which request that: The controller shall provide information on action taken on a request under Articles 15 to 22 to the data subject without undue delay and in any event within one month of receipt of the request. 2That period may be extended by two further months where necessary, taking into account the complexity and number of the requests. 3The controller shall inform the data subject of any such extension within one month of receipt of the request, together with the reasons for the delay. 4Where the data subject makes the request by electronic form means, the information shall be provided by electronic means where possible, unless otherwise requested by the data subject."))


    #Decomposed Test:

    # find = RAgger.query_faiss_db(query)
    # for i in find:
    #     print(i['statement']+'\n')
    # generated_values = RAgger.generate(find)
    # print(RAgger.interpret_findings(generated_values))

    #Complete Test:

    print(RAgger.process(query))
    