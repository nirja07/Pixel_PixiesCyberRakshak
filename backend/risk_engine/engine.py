import os
import json
import logging
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Initialize Gemini client
api_key = os.getenv("GEMINI_API_KEY")
client = None

if not api_key:
    logger.error("GEMINI_API_KEY not found in .env file!")
else:
    try:
        client = genai.Client(api_key=api_key)
        logger.info("Gemini API client initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize Gemini client: {e}")
        client = None

def analyze_text(text: str):
    global client
    if client is None:
        return {
            "risk_level": "Error",
            "summary": "Gemini client not initialized. Check your API key.",
        }

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",  # ✅ valid model
            contents=(
                f"Analyze the following text for cybersecurity risks like phishing, scams, or malware. "
                f"Return ONLY a JSON object with keys: 'risk_level' (Safe, Medium, High) and 'summary'. "
                
                f"Text: '{text}'"
            ),
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        # Parse JSON output
        analysis = json.loads(response.text)
        return {
            "risk_level": analysis.get("risk_level", "Safe"),
            "summary": analysis.get("summary", "No details provided")
        }

    except Exception as e:
        logger.error(f"Error analyzing text: {e}")
        return {
            "risk_level": "Error",
            "summary": f"API Error: {str(e)}"
        }