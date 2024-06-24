import threading
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend_entry import backend_entry
import os
from flask import  request, jsonify
import json

app = FastAPI()
report_analysis = None

endpoint = backend_entry()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/file-upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"uploads/{file.filename}"
    

    with open(file_location, "wb") as f:
        f.write(await file.read())

    result = endpoint.process(file_location)
    os.remove(file_location)


    return JSONResponse(content = {"filename": file.filename, "result": result})

class FilePath(BaseModel):
    path: str

@app.post("/new-file")
async def new_file(file_path: FilePath):
    result = endpoint.process(file_path.path)
    return result
    # return {"status": "success", "path": file_path.path}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)