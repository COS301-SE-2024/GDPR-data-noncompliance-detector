import threading
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
import os
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend_entry import backend_entry
import os
from flask import  request, jsonify
from typing import List

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
        file_path_ = file_path.path
        result = endpoint.process(file_path_)
        return result
        # return {"status": "success", "path": file_path.path}

@app.get("/reports", response_model=List[str])
def list_files():
    print("-----------------------------------------------------------------------------")
    try:
        reports_dir = os.path.abspath('./backend/Reports')
        files = os.listdir(reports_dir)
        print("Files")
        print(files)
        return files
    except FileNotFoundError:
        return []

@app.get("/read-report")
def get_file_content(path: str):
    try:
        with open(path, 'r') as file:
            content = file.read()
        return {"content": content}
    except FileNotFoundError:
        raise HTTPException(status_code=404 , detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)