# api.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sys
import json
import logging
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Try to import your engine modules with error handling
try:
    from engine.semanticengine import SemanticEngine
    from engine.severityengine import SeverityEngine
    from engine.responsebuilder import ResponseBuilder
    logger.info("✅ Engine modules imported successfully")
except ImportError as e:
    logger.error(f"❌ Failed to import engine modules: {e}")
    logger.error("Make sure you have the engine folder with __init__.py")
    SemanticEngine = None
    SeverityEngine = None
    ResponseBuilder = None

# Initialize FastAPI
app = FastAPI(title="Cyber Rakshak API", description="AI-Powered Indian Cyber Law Assistant")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"  # Allow all for testing
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "lawdata.json")

# Initialize engines with error handling
engine = None
law_data = {"laws_master": []}

if SemanticEngine:
    try:
        # Check if dataset exists
        if os.path.exists(DATASET_PATH):
            engine = SemanticEngine(DATASET_PATH)
            logger.info(f"✅ Semantic Engine initialized successfully")
            
            # Load law data for reference
            with open(DATASET_PATH, 'r', encoding='utf-8') as f:
                law_data = json.load(f)
            logger.info(f"✅ Loaded {len(law_data.get('laws_master', []))} laws")
        else:
            logger.error(f"❌ Dataset not found at: {DATASET_PATH}")
    except Exception as e:
        logger.error(f"❌ Failed to initialize Semantic Engine: {e}")
        engine = None

# Initialize OpenAI client (optional)
try:
    from openai import OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        client = OpenAI(api_key=api_key)
        logger.info("✅ OpenAI client initialized")
    else:
        client = None
        logger.warning("⚠️ OPENAI_API_KEY not found. AI features will use fallback responses.")
except ImportError:
    client = None
    logger.warning("⚠️ OpenAI package not installed. Run: pip install openai")

# Request/Response models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    suggested_questions: Optional[List[str]] = []
    session_id: Optional[str] = None

# Simple fallback responses when engine is not available
def get_fallback_response(message: str) -> str:
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["hi", "hello", "hey", "namaste"]):
        return "👋 Namaste! I'm Cyber Rakshak, your AI assistant for Indian cyber laws. How can I help you today?"
    
    elif "phish" in message_lower:
        return """**Phishing Attack**

Phishing is when scammers pretend to be legitimate organizations to steal your personal information.

**Relevant Laws:**
• IT Act Section 66D - Cheating by personation
• IT Act Section 66C - Identity theft

**What to do immediately:**
1. Don't click any links in suspicious messages
2. Block and report the number
3. Check your bank accounts for unauthorized transactions

Would you like to know more about reporting procedures?"""
    
    elif "hack" in message_lower or "account" in message_lower:
        return """**Account Hacking**

This falls under unauthorized access to computer systems.

**Relevant Laws:**
• IT Act Section 43 - Penalty for unauthorized access
• IT Act Section 66 - Computer related offences

**Immediate Steps:**
1. Change your passwords immediately
2. Enable two-factor authentication
3. Check for any unauthorized changes
4. Review recent account activity

Shall I explain the legal sections in detail?"""
    
    elif "section" in message_lower or "66" in message_lower:
        return """**IT Act Sections**

• **Section 66C** - Identity Theft: Fraudulent use of electronic signature, password, or OTP
• **Section 66D** - Cheating by Personation: Impersonating someone online to cheat
• **Section 43** - Unauthorized access to computer systems
• **Section 67** - Publishing obscene material online

Which section would you like to know more about?"""
    
    else:
        return """I'm here to help with Indian cyber laws. You can ask me about:

• **Specific incidents** - "I received a phishing SMS"
• **Legal sections** - "What is Section 66C?"
• **Reporting crimes** - "How do I file a cyber complaint?"
• **Evidence** - "What proof should I keep?"

What would you like to know?"""

# API Endpoints
@app.get("/")
async def root():
    return {
        "name": "Cyber Rakshak API",
        "version": "1.0.0",
        "status": "running",
        "engine_loaded": engine is not None,
        "openai_configured": client is not None,
        "laws_loaded": len(law_data.get("laws_master", [])) if law_data else 0,
        "endpoints": {
            "/": "GET - This info",
            "/health": "GET - Health check",
            "/chat": "POST - Chat with the assistant",
            "/laws/search": "GET - Search laws"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "engine_loaded": engine is not None,
        "openai_configured": client is not None,
        "laws_loaded": len(law_data.get("laws_master", [])) if law_data else 0,
        "dataset_path_exists": os.path.exists(DATASET_PATH)
    }

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        logger.info(f"💬 Received: {request.message[:50]}...")
        
        # Validate input
        if not request.message or len(request.message.strip()) < 2:
            return ChatResponse(
                message="Please tell me more about what happened or what you'd like to know.",
                suggested_questions=[
                    "I received a phishing SMS",
                    "What is Section 66C?",
                    "How to report cyber crime?"
                ],
                session_id=request.session_id
            )
        
        # If engine is available, use it to get relevant laws
        matched_laws = []
        if engine:
            try:
                matched_laws = engine.search(request.message, top_k=3)
                logger.info(f"✅ Found {len(matched_laws)} matching laws")
            except Exception as e:
                logger.error(f"❌ Engine search error: {e}")
        
        # Generate response (using OpenAI if available, otherwise fallback)
        response_text = get_fallback_response(request.message)
        
        # If we have matched laws, enhance the response
        if matched_laws and len(matched_laws) > 0:
            top_law = matched_laws[0]["law"]
            response_text += f"\n\n**Most Relevant Law:**\n• {top_law['act_name']} Section {top_law['section_number']}\n• {top_law['section_title']}"
        
        # Generate suggested questions
        suggestions = [
            "What evidence should I collect?",
            "How do I report this?",
            "Tell me more about this law",
            "What's the punishment?"
        ]
        
        return ChatResponse(
            message=response_text,
            suggested_questions=suggestions,
            session_id=request.session_id or f"session_{os.urandom(4).hex()}"
        )
        
    except Exception as e:
        logger.error(f"❌ Error in chat endpoint: {str(e)}")
        return ChatResponse(
            message="I'm having trouble processing your request. Please try again.",
            suggested_questions=[
                "What is phishing?",
                "How to report cyber crime?",
                "Know your laws"
            ],
            session_id=request.session_id
        )

@app.get("/laws/search")
async def search_laws(query: str):
    """Simple law search endpoint"""
    if not engine:
        return {"results": [], "error": "Search engine not available"}
    
    try:
        matched_laws = engine.search(query, top_k=5)
        results = []
        for item in matched_laws:
            law = item["law"]
            results.append({
                "act": law["act_name"],
                "section": law["section_number"],
                "title": law["section_title"],
                "description": law["full_description"][:150] + "..." if len(law["full_description"]) > 150 else law["full_description"],
                "confidence": item["confidence"]
            })
        return {"results": results}
    except Exception as e:
        logger.error(f"❌ Search error: {e}")
        return {"results": [], "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    logger.info(f"🚀 Starting server on http://127.0.0.1:{port}")
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=True)