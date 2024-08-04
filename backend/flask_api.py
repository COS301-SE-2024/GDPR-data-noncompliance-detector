import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel
from backend_entry import backend_entry
from typing import List

app = Flask(__name__)
CORS(app)

endpoint = backend_entry()

@app.route("/file-upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_location = os.path.join("uploads", file.filename)
    file.save(file_location)

    result = endpoint.process(file_location)
    os.remove(file_location)

    return jsonify({"filename": file.filename, "result": result})

class FilePath(BaseModel):
    path: str

@app.route("/new-file", methods=["POST"])
def new_file():
    data = request.get_json()
    file_path_ = data.get('path')
    result = endpoint.process(file_path_)
    return jsonify(result)

@app.route("/reports", methods=["GET"])
def list_files():
    try:
        reports_dir = os.path.abspath('../backend/Reports')

        files = os.listdir(reports_dir)
        return jsonify(files)
    except FileNotFoundError:
        return jsonify([])

@app.route("/read-report", methods=["GET"])
def get_file_content():
    path = request.args.get('path')
    try:
        with open(path, 'r') as file:
            content = file.read()
        return jsonify({"content": content})
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)