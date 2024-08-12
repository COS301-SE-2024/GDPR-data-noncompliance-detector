from celery_app import app
from Document_parser.document_parser import document_parser
from Detection_Engine.detection_engine import detection_engine

@app.task
def parse_document(path):
    parser = document_parser()
    return parser.process(path)

@app.task
def detect_engine(file):
    engine = detection_engine()
    return engine.process(file)
