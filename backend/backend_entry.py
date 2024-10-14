import queue
import threading
from Document_parser.document_parser import document_parser
from Detection_Engine.detection_engine import detection_engine
import sys
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import json

load_dotenv()
# Create a Supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client("https://oadcyxznbhdrzsutusbh.supabase.co/", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZGN5eHpuYmhkcnpzdXR1c2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4MTAyNDUsImV4cCI6MjA0MTM4NjI0NX0.DLDq7NyjhmEv9V1bRERp2e5XT0-qFdBjWN3BNed6EfY")


file_queue = queue.Queue()
result_holder = queue.Queue()

def document_parser_worker(path):
    parser = document_parser()
    file = parser.process(path)
    file_queue.put(file) 

def detection_engine_worker():
    engine = detection_engine()
    while True:
        file = file_queue.get()
        if file is None:
            break
        result = engine.process(file)
        file_queue.task_done() 
        result_holder.put(result)


class backend_entry:

    @staticmethod
    def mq_process(path):
        parser_thread = threading.Thread(target=document_parser_worker, args=(path,))
        engine_thread = threading.Thread(target=detection_engine_worker)

        parser_thread.start()
        engine_thread.start()

        parser_thread.join() 
        file_queue.put(None)
        engine_thread.join()

        if result_holder.empty():
            return "No result available"

        result = result_holder.get()
        return result
    
    def process(self, path, filename):
        parser = document_parser()
        engine = detection_engine()
        # path = input("File Name:  ")
        file = parser.process(path)
        # result = engine.process(file,path)
        result_new = engine.report_generation(file, path)
        
        # Here we getting the document name dynamically
        document_name = filename
        print(result_new)

        status_score = result_new['score']['Status']
        location = result_new['score']['Location']
        NER_score = result_new['score']['NER']
        personal_score = result_new['score']['Personal']
        financial_score = result_new['score']['Financial']
        Contact_score = result_new['score']['Contact']
        Consent_agreement_score = result_new['score']['Consent Agreement']
        Genetic_score = result_new['score']['Genetic']
        Medical_score = result_new['score']['Medical']
        Ethnic_score = result_new['score']['Ethnic']
        Biometric_score = result_new['score']['Biometric']
        RAG_statement_score = result_new['score']['RAG_Statement']
        lenarts_score = result_new['score']['lenarts']
        total_violations = NER_score + personal_score+ financial_score + Contact_score+Genetic_score + Medical_score + Biometric_score + Ethnic_score


        # Here I am just inserting the data into the supabase database
        data ={
            "document_name": document_name, 
            "total_violations": total_violations,
            "personal_data_violations": personal_score,
            "medical_data_violations": Medical_score,
            "biometric_data_violations": Biometric_score,
            "ethnic_data_violations": Ethnic_score,
            "ner_data_violations": NER_score,
            "genetic_data_violations": Genetic_score,
            "financial_data_violations": financial_score,
            "location_data_violations": location,
            "consent_agreement_data_violations": Consent_agreement_score,
            "status_data": status_score,
            "contact_data_violations": Contact_score,
            "rag_statements_stats": RAG_statement_score,
            "lenarts_data_violations": lenarts_score,

        }

        # Here I am sending the data to supabase as soon as the report is generated
        try:
            response = supabase.table('violations_reports').insert(data).execute()
            # print("Report successfully saved to the database", response)
            # return response
        except Exception as e:
            print("An error occured while saving the report to the database", e)

        return result_new

if __name__ == "__main__":
    
    if len(sys.argv) != 2:
        print("Usage: python backend_entry.py <path_to_file>")
        sys.exit(1)

    path = sys.argv[1]
    backend_entry = backend_entry()
    result = backend_entry.process(path)
    print(result)
    # try:
    #     backend_entry = backend_entry() 
    #     # res = backend_entry.process("C:/Users/Mervyn Rangasamy/Documents/2024/COS 301/Capstone/Repo/GDPR-data-noncompliance-detector/backend/mockdata/NCE1.pdf")
    #     res = backend_entry.process("C:/Users/Mervyn Rangasamy/Documents/2024/COS 301/Capstone/Repo/GDPR-data-noncompliance-detector/backend/mockdata/docxWimages.docx")

    #     print(res)
    # except SystemExit as e:
    #     print("An error occurred: ", e)
    #     sys.exit(1)

