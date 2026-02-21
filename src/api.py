# api.py - Updated version with OpenAI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import List, Optional
import openai
from dotenv import load_dotenv

from engine.semanticengine import SemanticEngine
from engine.severityengine import SeverityEngine
from engine.responsebuilder import ResponseBuilder

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "lawdata.json")

engine = SemanticEngine(DATASET_PATH)


class IncidentRequest(BaseModel):
    incident: str
    conversation_history: Optional[List[dict]] = []


class Message(BaseModel):
    role: str
    content: str


async def generate_ai_response(user_input, matched_laws, severity, conversation_history=[]):
    """
    Use OpenAI to generate a natural, concise response based on retrieved laws
    """

    laws_context = []
    for item in matched_laws[:3]:
        law = item["law"]
        laws_context.append(f"""
Act: {law['act_name']}
Section: {law['section_number']} - {law['section_title']}
Description: {law['full_description']}
Punishment: {law.get('punishment', 'Not specified')}
Confidence: {item['confidence']}
        """)
    preventive_measures = set()
    evidence_required = set()
    for item in matched_laws:
        for p in item["law"].get("preventive_measures", []):
            preventive_measures.add(p)
        for e in item["law"].get("evidence_required", []):
            evidence_required.add(e)

    system_prompt = """You are Cyber Rakshak, an AI legal assistant specialized in Indian cyber laws (IT Act 2000, IPC/BNS, DPDP Act 2023, CERT-In guidelines).

Your role:
1. Provide CONCISE, conversational responses about cyber incidents
2. Cite relevant sections naturally in conversation
3. Ask clarifying questions when needed
4. Explain legal concepts in simple terms
5. Guide users on next steps (reporting, evidence collection)

Guidelines:
- Keep responses brief and focused (2-3 paragraphs max)
- Don't dump all laws at once - mention the most relevant ones
- Be empathetic but professional
- If unsure, acknowledge limitations
- Always remind users to consult a lawyer for legal advice"""
    
    user_context = f"""
User Query: {user_input}

Severity Level: {severity[0]} (Score: {severity[1]})

Most Relevant Laws Found:
{''.join(laws_context)}

Preventive Measures Available:
{chr(10).join(['• ' + m for m in list(preventive_measures)[:5]])}

Evidence Required:
{chr(10).join(['• ' + e for e in list(evidence_required)[:5]])}

Based on this information, provide a helpful, conversational response to the user. Be concise but thorough. If the query is vague, ask for clarification.
"""
    
    try:

        messages = [{"role": "system", "content": system_prompt}]

        for msg in conversation_history[-6:]: 
            messages.append({"role": msg["role"], "content": msg["content"]})

        messages.append({"role": "user", "content": user_context})
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",  
            messages=messages,
            temperature=0.7,
            max_tokens=500,
            top_p=0.9
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        return generate_template_response(user_input, matched_laws, severity)


def generate_template_response(user_input, matched_laws, severity):
    """Fallback template response if OpenAI is unavailable"""
    
    top_law = matched_laws[0]["law"] if matched_laws else None
    
    response = f"**🔍 Incident Analysis Complete**\n\n"
    response += f"Based on your description, this appears to be a **{severity[0]}** severity incident.\n\n"
    
    if top_law:
        response += f"The most relevant law is **{top_law['act_name']} Section {top_law['section_number']}** - {top_law['section_title']}.\n\n"
        response += f"**What this means:** {top_law['full_description'][:150]}...\n\n"
    
    response += "**Next Steps:**\n"
    response += "1. Preserve all evidence (screenshots, messages, transaction IDs)\n"
    response += "2. File a complaint at cybercrime.gov.in\n"
    response += "3. Visit your nearest police station\n\n"
    response += "Would you like more details about specific laws or reporting procedures?"
    
    return response


@app.post("/analyze")
async def analyze_incident(request: IncidentRequest):

    matched_laws = engine.search(request.incident, top_k=5)

    severity_label, severity_score = SeverityEngine.calculate(
        request.incident,
        matched_laws
    )

    ai_response = await generate_ai_response(
        request.incident,
        matched_laws,
        (severity_label, severity_score),
        request.conversation_history
    )
    structured_response = ResponseBuilder.build(
        request.incident,
        matched_laws,
        severity_label,
        severity_score
    )
    
    return {
        "message": ai_response,
        "structured_data": structured_response, 
        "severity": {
            "level": severity_label,
            "score": severity_score
        }
    }


@app.post("/clarify")
async def ask_clarifying_question(request: IncidentRequest):
    """Endpoint for when the AI needs to ask clarifying questions"""
    
    system_prompt = """You are Cyber Rakshak. The user's query about a cyber incident is vague. 
    Ask 2-3 specific clarifying questions to better understand the situation.
    Questions should help identify: type of fraud, platforms used, financial loss (if any), 
    and evidence available. Be conversational and helpful."""
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"User said: {request.incident}. Ask clarifying questions."}
            ],
            temperature=0.7,
            max_tokens=200
        )
        
        return {"questions": response.choices[0].message.content}
        
    except:
        return {
            "questions": "To help you better, please tell me:\n1. What type of incident occurred (phishing, hacking, harassment)?\n2. Was there any financial loss? If yes, how much?\n3. Do you have any evidence like screenshots or messages?"
        }