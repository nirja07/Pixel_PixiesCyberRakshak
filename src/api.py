from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engine.semanticengine import SemanticEngine
from google import genai
from dotenv import load_dotenv
import os
import re

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

client = genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI(
    title="Indian Cyber Law Bot (Hybrid + Gemini 3 Flash)"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "dataset", "lawdata.json")

semantic_engine = SemanticEngine(dataset_path=DATA_PATH)

class ChatRequest(BaseModel):
    query: str

@app.get("/")
def home():
    return {"message": "Cyber Law Bot API Running 🚀"}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        matches = semantic_engine.search(request.query, top_k=3)

        context = ""
        for match in matches:
            law = match["law"]
            context += f"""
Act: {law['act_name']}
Section: {law['section_number']}
Title: {law['section_title']}
Description: {law['full_description']}
"""

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=f"""
You are an expert in Indian Cyber Law.

Use the provided legal context only if relevant.

User Query:
{request.query}

Relevant Laws:
{context}

Instructions:
- Answer ONLY what the user has asked.
- Do NOT automatically provide all legal details.
- If the user asks about punishment, explain punishment only.
- If the user asks about prevention, explain preventive measures only.
- If the user asks for complaint procedure, explain filing process only.
- Keep answers concise and focused.
- Do not generate unnecessary structured sections unless explicitly requested.
- Do not generate unnecessary structured sections unless explicitly requested.
- IMPORTANT: Use PLAIN TEXT only. Do NOT use any markdown formatting like **bold** or *italic*.
"""
        )

        return {
            "answer": response.text
        }

    except Exception as e:
        print("Gemini ERROR:", str(e))
        return {
            "answer": f"Internal AI Error: {str(e)}"
        }