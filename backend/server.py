import sqlite3
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"]
)

class KeyModel(BaseModel):
    api_key: str

CURRENT_API_KEY = None

@app.get("/")
def read_root():
    return {"status": "running"}

@app.post("/api/set_key")
async def set_api_key(data: KeyModel):
    global CURRENT_API_KEY

    if not data.api_key.startswith("sk-"):
        raise HTTPException(status_code=400, detail="Invalid API key format.")
    
    CURRENT_API_KEY = data.api_key

    return {"status": "success", "message": "Key saved in backend temporary storage"}