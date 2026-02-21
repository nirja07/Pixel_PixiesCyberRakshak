import os
from flask import Flask, request, jsonify
from flask_cors import CORS

from risk_engine.engine import analyze_text
from utils.qr_decoder import decode_qr


app = Flask(__name__)
CORS(app)   # Allow frontend access later



@app.route("/")
def home():
    return jsonify({
        "message": "CyberRakshak Risk Engine Running 🚀"
    })


# =========================
# 2️⃣ Analyze Text Endpoint
# =========================

@app.route("/analyze-text", methods=["POST"])
def analyze_text_api():

    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({"error": "Message field required"}), 400

    text = data["message"]

    result = analyze_text(text)

    return jsonify(result)


# =========================
# 3️⃣ Analyze QR Endpoint
# =========================

@app.route("/analyze-qr", methods=["POST"])
def analyze_qr_api():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    decoded_text = decode_qr(file)

    # 🔥 IMPORTANT FIX
    if not decoded_text:
        return jsonify({
            "risk_score": 0,
            "risk_level": "Safe",
            "ml_probability": 0,
            "matched_rules": [],
            "detected_urls": [],
            "decoded_content": None,
            "message": "QR code could not be decoded"
        }), 200

    result = analyze_text(decoded_text)

    # Extra safety
    if result is None:
        return jsonify({"error": "Risk engine failed"}), 500

    result["decoded_content"] = decoded_text

    return jsonify(result)


# =========================
# Run Server
# =========================

if __name__ == "__main__":
    app.run(debug=True)