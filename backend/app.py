import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Import analyze_text from engine
from risk_engine.engine import analyze_text
from utils.qr_decoder import decode_qr

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "CyberRakshak Running 🚀"})

@app.route("/analyze-text", methods=["POST"])
def analyze_text_api():
    logger.info("Request received: /analyze-text")
    data = request.get_json()
    
    if not data or "text" not in data:
        logger.warning("No text provided in request body")
        return jsonify({"error": "No text provided"}), 400

    try:
        result = analyze_text(data["text"])
        
        # Ensure risk_color is added for the frontend
        level = result.get("risk_level", "Safe")
        result["risk_color"] = {
            "Safe": "green", 
            "Medium": "orange", 
            "High": "red",
            "Error": "black"
        }.get(level, "black")
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in /analyze-text: {e}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@app.route("/analyze-qr", methods=["POST"])
def analyze_qr_api():
    logger.info("Request received: /analyze-qr")
    if "file" not in request.files:
        logger.warning("No file uploaded in /analyze-qr")
        return jsonify({"error": "No file uploaded"}), 400

    try:
        file = request.files["file"]
        decoded_text = decode_qr(file)
        
        if not decoded_text:
            logger.info("QR Decoder returned no text content.")
            return jsonify({
                "message": "QR code could not be decoded",
                "risk_level": "Safe",
                "risk_color": "green",
                "decoded_content": None
            }), 200

        logger.info(f"QR Decoded: {decoded_text}")
        result = analyze_text(decoded_text)
        result["decoded_content"] = decoded_text
        
        # Add color
        level = result.get("risk_level", "Safe")
        result["risk_color"] = {"Safe": "green", "Medium": "orange", "High": "red"}.get(level, "black")

        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in /analyze-qr: {e}")
        return jsonify({"error": "QR Analysis failed", "details": str(e)}), 500

if __name__ == "__main__":
    logger.info("Starting Flask Server on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)