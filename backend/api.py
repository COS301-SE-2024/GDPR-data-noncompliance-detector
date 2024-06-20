from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os
from fastapi.middleware.cors import CORSMiddleware
from backend_entry import backend_entry

app = FastAPI()

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

    endpoint.process(file_location)

    return JSONResponse(content = {"filename": file.filename})
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)