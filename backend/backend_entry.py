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
supabase: Client = create_client(url, key)


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
        # print(result)

        # Here we getting the document name dynamically
        document_name = filename
        # result_json = json.loads(result_new)
        print(result_new)

        print("This is the file name of the uploaded document", document_name)
        status_score = result_new['score']['Status']
        print("Status", status_score)
        location = result_new['score']['Location']
        print("Location", location)
        NER_score = result_new['score']['NER']
        print("NER", NER_score)
        personal_score = result_new['score']['Personal']
        print("Personal data", personal_score)
        financial_score = result_new['score']['Financial']
        print("Financial data", financial_score)
        Contact_score = result_new['score']['Contact']
        print("Contact data", Contact_score)
        Consent_agreement_score = result_new['score']['Consent Agreement']
        print("Consent data", Consent_agreement_score)
        Genetic_score = result_new['score']['Genetic']
        print("Genetic data", Genetic_score)
        Medical_score = result_new['score']['Medical']
        print("Medical data", Medical_score)
        Ethnic_score = result_new['score']['Ethnic']
        print("Ethnic data",Ethnic_score)
        Biometric_score = result_new['score']['Biometric']
        print("Biometric data",Biometric_score)
        total_violations = personal_score + Medical_score + Biometric_score + Ethnic_score
        print("Total violations", total_violations)

        # Here I am just inserting the data into the supabase database
        data ={
            "document_name": document_name, #This is mock data needs to be properly fetched from upload component
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
            "contact_data_violations": Contact_score
        }

        try:
            response = supabase.table('violations_reports').insert(data).execute()
            print("Report successfully saved to the database", response)
            # return response
        except Exception as e:
            print("An error occured while saving the report to the database", e)


        return result_new #This is the json object I want to be saved to the supabase database

if __name__ == "__main__":

    try:
        backend_entry = backend_entry() 
        res = backend_entry.process("C:/Users/User/Documents/Academics/2024/S2/COS 301 SOFTWARE ENGINEERING/Demo 4/GDPR-data-noncompliance-detector/backend/mockdata/NCEX1.xlsx")
        
        # res = backend_entry.process("C:/Users/Mervyn Rangasamy/Documents/2024/COS 301/Capstone/Repo/GDPR-data-noncompliance-detector/backend/mockdata/docxWimages.docx")

        # print(res)
    except SystemExit as e:
        print("An error occurred: ", e)
        sys.exit(1)