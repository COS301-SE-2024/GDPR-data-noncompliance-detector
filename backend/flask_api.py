import os
import sys
import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pydantic import BaseModel
from backend_entry import backend_entry
from typing import List
import threading
from backend.GND_Email_Monitor.main import start_monitors

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', './uploads')
UPLOAD_FOLDER = os.path.abspath(UPLOAD_FOLDER)

REPORTS_FOLDER = os.getenv('REPORTS_FOLDER', './backend/Reports')
REPORTS_FOLDER = os.path.abspath(REPORTS_FOLDER)

GENERATED_REPORTS_FOLDER = os.getenv('GENERATED_REPORTS_FOLDER', './Generated_Reports')
GENERATED_REPORTS_FOLDER = os.path.abspath(GENERATED_REPORTS_FOLDER)

endpoint = backend_entry()

def start_monitors_in_background():
    monitor_thread = threading.Thread(target=start_monitors, daemon=True)
    # monitor_thread.daemon = False
    monitor_thread.start()
    return monitor_thread

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS

    except Exception:
        base_path = os.path.abspath(".")
    
    return os.path.join(base_path, relative_path)

class FilePath(BaseModel):
    path: str

@app.route("/new-file", methods=["POST"])
def new_file():
    data = request.get_json()
    file_path_ = data.get('path')
    if not file_path_:
        return jsonify({"error": "No file path provided"}), 400

    result = endpoint.process(file_path_)
    if result is None:
        return jsonify({"error": "Processing failed"}), 500

    return jsonify(result)

@app.route("/reports", methods=["GET"])
def list_files():
    try:
        reports_dir = resource_path(REPORTS_FOLDER)
        files = os.listdir(reports_dir)
        return jsonify(files)
    except FileNotFoundError:
        return jsonify([])

@app.route("/outlook-results", methods=["GET"])
def outlook_results():
    try:
        uploads_data_folder = os.path.expanduser("~/Documents/GND/outlook-uploads-data")
    
        if not os.path.exists(uploads_data_folder):
            return jsonify({"error": "Directory not found"}), 404
        
        files = os.listdir(uploads_data_folder)
        return jsonify(files)
    
    except Exception as e:
        logging.error(f"Error retrieving Outlook reports: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/read-report", methods=["POST"])
def get_file_content():
    data = request.get_json()
    path = data.get('path')
    if not path:
        return jsonify({"error": "No file path provided"}), 400

    reports_dir = resource_path(REPORTS_FOLDER)
    file_ = os.path.join(reports_dir, path)

    if not os.path.exists(file_):
        return jsonify({"error": "File not found"}), 404

    try:
        with open(file_, 'r') as file:
            content = file.read()
        
        return jsonify({"content": content})
    
    except Exception as e:
        logging.error(f"Error reading file: {e}")
        
        return jsonify({"error": str(e)}), 500
    
@app.route("/read-outlook-results", methods=["POST"])
def read_outlook_results():
    try:
        data = request.get_json()
        path = data.get('path')
        
        if not path:
            return jsonify({"error": "No file path provided"}), 400

        uploads_data_folder = os.path.expanduser("~/Documents/GND/outlook-uploads-data")
        file_ = os.path.join(uploads_data_folder, path)
        
        if not os.path.exists(file_):
            return jsonify({"error": "File not found"}), 404
        
        with open(file_, 'r') as file:
            content = file.read()

        return jsonify({"content": content})
    
    except Exception as e:
        logging.error(f"Error reading Outlook result: {e}")
        
        return jsonify({"error": str(e)}), 500


@app.route("/get-report", methods=["GET"])
def get_generated_report():
    try:
        reports_folder = resource_path(GENERATED_REPORTS_FOLDER)
        files = [os.path.join(reports_folder, f) for f in os.listdir(reports_folder) if os.path.isfile(os.path.join(reports_folder, f))]

        if not files:
            return jsonify({"error": "No files found"}), 404

        most_recent_file = max(files, key=os.path.getmtime)
        if not os.path.exists(most_recent_file):
            return jsonify({"error": "File not found"}), 404

        return send_file(most_recent_file, as_attachment=True, download_name="violations_report.pdf")
    
    except Exception as e:
        logging.error(f"Error getting report: {e}")
        
        return jsonify({"error": str(e)}), 500
    
@app.route("/get-data-folder", methods=["GET"])
def get_data_folder():
    GND_OUTLOOK_DATA_FOLDER = os.path.expanduser("~/Documents/GND/outlook-uploads-data")
    
    return jsonify({"outlook_data_folder": GND_OUTLOOK_DATA_FOLDER})

@app.route("/file-upload-new", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_location)

    result = endpoint.process(file_location)

    try:
        os.remove(file_location)
    except Exception as e:
        logging.error(f"Error deleting file: {e}")

    if result is None:
        return jsonify({"error": "Processing failed"}), 500

    return jsonify({"filename": file.filename, "result": result})

if __name__ == "__main__":
    # app.run(host="0.0.0.0", port=8000)
    # monitor_thread = start_monitors_in_background()

    try:
        monitor_thread = start_monitors_in_background()
        app.run(host="0.0.0.0", port=8000)

    except KeyboardInterrupt:
        print("Shutting down Flask API")
    
    finally:
        # monitor_thread.join()
        print("Monitors stopped.")