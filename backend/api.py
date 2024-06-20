import threading
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend_entry import backend_entry
import os

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

@app.post("/new-file/")
async def new_file(file_path: FilePath):
    print(f"New file detected: {file_path.path}")
    return {"status": "success", "path": file_path.path}
    
def start_file_watcher(paths, ext):
    from .File_monitor.file_watcher import file_watcher
    file_watcher.start_watcher(paths, ext)

def run_app():
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    fastapi_thread = threading.Thread(target=run_app)
    fastapi_thread.start()

    start_file_watcher("C:/Users/Mervyn Rangasamy/Documents/Receiver", "pdf,docx,xlsx,xls")