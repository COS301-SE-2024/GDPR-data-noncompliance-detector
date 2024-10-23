import os
import sys

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

def suppress_output():
    """Redirects stdout and stderr to os.devnull to suppress all console output."""
    import sys
    import os

    devnull = open(os.devnull, 'w')

    sys.stdout = devnull
    sys.stderr = devnull

    os.dup2(devnull.fileno(), sys.stdout.fileno())
    os.dup2(devnull.fileno(), sys.stderr.fileno())

suppress_output()

import logging
import sys
import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pydantic import BaseModel
from backend_entry import backend_entry
from typing import List
import threading
from backend.GND_Email_Monitor.main import start_monitors
from backend.File_monitor.file_watcher import start_watcher_thread_downloads
from io import BytesIO
from backend.display.disp import highlight_pdf_violations
import fitz
import time
import json
import pypandoc
from plyer import notification
# import comtypes.client
import json
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from plyer import notification
import threading
import time

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

UPLOAD_FOLDER = os.path.expanduser("~/Documents/GND/uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

REPORTS_FOLDER = os.path.expanduser("~/Documents/GND/teams-upload-data")
os.makedirs(REPORTS_FOLDER, exist_ok=True)

GENERATED_REPORTS_FOLDER = os.path.expanduser("~/Documents/GND/generated-reports")
os.makedirs(GENERATED_REPORTS_FOLDER, exist_ok=True)

endpoint = backend_entry()

encryption_key = os.getenv('SYS VAR x64')

def start_monitors_in_background():
    monitor_thread = threading.Thread(target=start_monitors, daemon=True)
    # monitor_thread.daemon = False
    monitor_thread.start()
    return monitor_thread

def start_download_monitor():
    downloads_thread = threading.Thread(target=start_watcher_thread_downloads,  args=("pdf,xlsx,docx", 1), daemon=True)
    downloads_thread.start()
    return downloads_thread

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS

    except Exception:
        base_path = os.path.abspath(".")
    
    return os.path.join(base_path, relative_path)


def encrypt(data, key):
    json_data = json.dumps(data)
    cipher = AES.new(key.encode('utf-8'), AES.MODE_CBC)
    iv = cipher.iv
    ciphertext = cipher.encrypt(pad(json_data.encode('utf-8'), AES.block_size))
    return base64.b64encode(iv + ciphertext).decode('utf-8')

def decrypt(encrypted_data, key):
    try:
        raw_data = base64.b64decode(encrypted_data)
        
        iv = raw_data[:16]  # AES block size is 16 bytes
        ciphertext = raw_data[16:]

        cipher = AES.new(key.encode('utf-8'), AES.MODE_CBC, iv)
        
        decrypted_data = unpad(cipher.decrypt(ciphertext), AES.block_size)
        
        return json.loads(decrypted_data.decode('utf-8'))
    except (ValueError, KeyError) as e:
        raise ValueError(f"Decryption failed: {str(e)}")


class FilePath(BaseModel):
    path: str

@app.route("/new-file", methods=["POST"])
def new_file():
    data = request.get_json()
    file_path_ = data.get('path')
    print(file_path_)
    # files = [os.path.join(file_path_, f) for f in os.listdir(file_path_) if os.path.isfile(os.path.join(file_path_, f))]

    if not file_path_:
        return jsonify({"error": "No file path provided"}), 400

    if not file_path_:
        return jsonify({"error": "No file path provided"}), 400

    result = endpoint.process(file_path_,os.path.basename(file_path_))
    if result is None:
        return jsonify({"error": "Processing failed"}), 500

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
        
        # files = os.listdir(uploads_data_folder)
        files = [os.path.join(uploads_data_folder, f) for f in os.listdir(uploads_data_folder) if os.path.isfile(os.path.join(uploads_data_folder, f))]
        files.sort(key=os.path.getmtime, reverse=True)
        # file_names = [os.path.basename(f) for f in files]
        file_info = [{"name": os.path.basename(f), "modified": os.path.getmtime(f)} for f in files]

        return jsonify(file_info)
    
    except Exception as e:
        logging.error(f"Error retrieving Outlook reports: {e}")
        return jsonify({"error": str(e)}), 500
    

@app.route("/downloads-results", methods=["GET"])
def downloads_results():
    try:
        downloads_data = os.path.expanduser("~/Documents/GND/downloads-uploads-data")
    
        if not os.path.exists(downloads_data):
            return jsonify({"error": "Directory not found"}), 404
        
        # files = os.listdir(uploads_data_folder)
        files = [os.path.join(downloads_data, f) for f in os.listdir(downloads_data) if os.path.isfile(os.path.join(downloads_data, f))]
        files.sort(key=os.path.getmtime, reverse=True)
        # file_names = [os.path.basename(f) for f in files]
        file_info = [{"name": os.path.basename(f), "modified": os.path.getmtime(f)} for f in files]

        return jsonify(file_info)
    
    except Exception as e:
        logging.error(f"Error retrieving Downloads reports: {e}")
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
        
        logging.error(f"Error reading file: {e}")
        
        return jsonify({"error": str(e)}), 500
    
# @app.route("/read-outlook-results", methods=["POST"])
# def read_outlook_results():
#     try:
#         data = request.get_json()
#         path = data.get('path')
        
#         if not path:
#             return jsonify({"error": "No file path provided"}), 400

#         uploads_data_folder = os.path.expanduser("~/Documents/GND/outlook-uploads-data")
#         file_ = os.path.join(uploads_data_folder, path)
        
#         if not os.path.exists(file_):
#             return jsonify({"error": "File not found"}), 404
        
#         with open(file_, 'r') as file:
#             content = file.read()

#         return jsonify({"content": content})
    
#     except Exception as e:
#         logging.error(f"Error reading Outlook result: {e}")
        
#         return jsonify({"error": str(e)}), 500


    
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
    

@app.route("/read-downloads-results", methods=["POST"])
def read_downloads_results():
    try:
        data = request.get_json()
        path = data.get('path')
        print(path)
        if not path:
            return jsonify({"error": "No file path provided"}), 400

        downloads_data = os.path.expanduser("~/Documents/GND/downloads-uploads-data")
        file_ = os.path.join(downloads_data, path)
        
        if not os.path.exists(file_):
            return jsonify({"error": "File not found"}), 404
        
        with open(file_, 'r') as file:
            content = file.read()
        
        # print(content)
        return jsonify({"content": content})
    
    except Exception as e:
        logging.error(f"Error reading Outlook result: {e}")
        
        return jsonify({"error": str(e)}), 500


@app.route("/get-report", methods=["GET"])
def get_generated_report():
    # try:
    #     reports_folder = resource_path(GENERATED_REPORTS_FOLDER)
    #     files = [os.path.join(reports_folder, f) for f in os.listdir(reports_folder) if os.path.isfile(os.path.join(reports_folder, f))]

    #     if not files:
    #         return jsonify({"error": "No files found"}), 404
    try:
        reports_folder = resource_path(GENERATED_REPORTS_FOLDER)
        files = [os.path.join(reports_folder, f) for f in os.listdir(reports_folder) if os.path.isfile(os.path.join(reports_folder, f))]

        if not files:
            return jsonify({"error": "No files found"}), 404

        most_recent_file = max(files, key=os.path.getmtime)
        if not os.path.exists(most_recent_file):
            return jsonify({"error": "File not found"}), 404
        most_recent_file = max(files, key=os.path.getmtime)
        if not os.path.exists(most_recent_file):
            return jsonify({"error": "File not found"}), 404

        return send_file(most_recent_file, as_attachment=True, download_name="violations_report.pdf")
    
    except Exception as e:
        logging.error(f"Error getting report: {e}")
        
        return jsonify({"error": str(e)}), 500
    
# @app.route("/get-data-folder", methods=["GET"])
# def get_data_folder():
#     GND_OUTLOOK_DATA_FOLDER = os.path.expanduser("~/Documents/GND/outlook-uploads-data")
    
#     return jsonify({"outlook_data_folder": GND_OUTLOOK_DATA_FOLDER})
    #     return send_file(most_recent_file, as_attachment=True, download_name="violations_report.pdf")
    
    # except Exception as e:
    #     logging.error(f"Error getting report: {e}")
        
    #     return jsonify({"error": str(e)}), 500
    
@app.route("/get-data-folder", methods=["GET"])
def get_data_folder():
    GND_OUTLOOK_DATA_FOLDER = os.path.expanduser("~/Documents/GND/outlook-uploads-data")
    
    return jsonify({"outlook_data_folder": GND_OUTLOOK_DATA_FOLDER})


@app.route("/get-data-downloads-folder", methods=["GET"])
def get_data_downloads_folder():
    GND_DOWNLOADS_DATA_FOLDER = os.path.expanduser("~/Documents/GND/downloads-uploads-data")
    
    return jsonify({"outlook_data_folder": GND_DOWNLOADS_DATA_FOLDER})

@app.route("/file-upload-new", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_location)


    # result = endpoint.process(file_location)
    result = endpoint.process(file_location, file.filename)

    try:
        os.remove(file_location)
    except Exception as e:
        logging.error(f"Error deleting file: {e}")

    if result is None:
        return jsonify({"error": "Processing failed"}), 500

    # Encrypt the result
    encrypted_result = encrypt(result, encryption_key)

    return jsonify({"filename": file.filename, "result": encrypted_result})

@app.route("/file-upload-new-monitor", methods=["POST"])
def upload_file_monitor():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_location)

    # Process the file and get the result
    result = endpoint.process(file_location, file.filename)

    try:
        os.remove(file_location)
    except Exception as e:
        logging.error(f"Error deleting file: {e}")

    if result is None:
        return jsonify({"error": "Processing failed"}), 500

    # Encrypt the result
    # encrypted_result = encrypt(result, encryption_key)

    return jsonify({"filename": file.filename, "result": result})


# if __name__ == "__main__":
#     # app.run(host="0.0.0.0", port=8000)
#     # monitor_thread = start_monitors_in_background()

#     try:
#         monitor_thread = start_monitors_in_background()
#         downloads_thread = start_download_monitor()
#         app.run(host="0.0.0.0", port=8000)

#     except KeyboardInterrupt:
#         print("Shutting down Flask API")
    
#     finally:
#         # monitor_thread.join()
#         print("Monitors stopped.")



def show_notification():
    time.sleep(1)
    notification.notify(
        title="GND",
        message="The GND Server has started",
        timeout=10
    )

def run_flask_app():
    app.run(host="0.0.0.0", port=8000)

if __name__ == "__main__":
    try:
        # Start monitors in the background
        monitor_thread = start_monitors_in_background()
        downloads_thread = start_download_monitor()

        flask_thread = threading.Thread(target=run_flask_app)
        flask_thread.start()

        notification_thread = threading.Thread(target=show_notification)
        notification_thread.start()

        flask_thread.join()

    except KeyboardInterrupt:
        print("Shutting down Flask API")

    finally:
        print("Monitors stopped.")

