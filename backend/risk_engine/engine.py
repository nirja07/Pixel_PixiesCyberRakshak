import os
import re
import pickle
import numpy as np
from urllib.parse import urlparse

# ==============================
# Load ML Model + Vectorizer
# ==============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../model/spam_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "../model/vectorizer.pkl")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(VECTORIZER_PATH, "rb") as f:
    vectorizer = pickle.load(f)

# ==============================
# Configuration
# ==============================

SUSPICIOUS_PATTERNS = [
    r"verify.*account",
    r"verify.*device",
    r"update.*kyc",
    r"account.*suspended",
    r"click.*link",
    r"urgent.*action",
    r"confirm.*details",
    r"bank.*alert",
    r"otp.*share",
    r"login.*immediately"
]

SCAM_KEYWORDS = [
    "congrats",
    "congratulations",
    "gift card",
    "promotion",
    "winner",
    "won",
    "selected",
    "randomly picked",
    "$1000",
    "claim now",
    "free reward"
]

SHORTENERS = ["bit.ly", "goo.gl", "tinyurl.com", "t.co", "rb.gy"]

SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".tk", ".ru", ".cn",
    ".work", ".info", ".pw", ".click"
]

BRANDS = ["google", "sbi", "hdfc", "icici", "paytm", "amazon", "flipkart"]

URL_REGEX = r"https?://[^\s]+"


# ==============================
# Helper Functions
# ==============================
def check_scam_keywords(text):
    score = 0
    flags = []

    text_lower = text.lower()

    for word in SCAM_KEYWORDS:
        if word in text_lower:
            score += 8
            flags.append(word)

    return score, flags

def extract_urls(text):
    return re.findall(URL_REGEX, text)


def check_suspicious_patterns(text):
    matches = []
    score = 0
    for pattern in SUSPICIOUS_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            matches.append(pattern)
            score += 10
    return score, matches


def check_url_risk(urls):
    score = 0
    url_flags = []

    for url in urls:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()

        # Shortener detection
        if any(short in domain for short in SHORTENERS):
            score += 20
            url_flags.append("shortened_url")

        # Suspicious TLD detection
        if any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS):
            score += 25
            url_flags.append("suspicious_tld")

        # Long URL (entropy indicator)
        if len(url) > 75:
            score += 10
            url_flags.append("long_url")

    return score, url_flags


def check_brand_mismatch(text, urls):
    score = 0
    flags = []

    text_lower = text.lower()

    for brand in BRANDS:
        if brand in text_lower:
            for url in urls:
                domain = urlparse(url).netloc.lower()
                if brand not in domain:
                    score += 20
                    flags.append(f"{brand}_mismatch")

    return score, flags


def get_risk_level(score):
    if score < 30:
        return "Safe"
    elif score < 60:
        return "Medium"
    else:
        return "High"


# ==============================
# Main Risk Engine
# ==============================

def analyze_text(text):
    if not text or len(text.strip()) == 0:
        return {
            "risk_score": 0,
            "risk_level": "Safe",
            "ml_probability": 0.0,
            "matched_rules": [],
            "detected_urls": []
        }



    # ---------- ML Prediction ----------
    vectorized_text = vectorizer.transform([text])
    ml_prob = model.predict_proba(vectorized_text)[0][1]

    ml_score = ml_prob * 40  # ML weight = 40%

    # ---------- Rule-based detection ----------
    pattern_score, pattern_matches = check_suspicious_patterns(text)

    urls = extract_urls(text)

    url_score, url_flags = check_url_risk(urls)

    brand_score, brand_flags = check_brand_mismatch(text, urls)

    # ---------- Final Weighted Score ----------
    final_score = ml_score + pattern_score + url_score + brand_score

    # Cap score at 100
    final_score = min(100, final_score)

    risk_level = get_risk_level(final_score)

    return {
        "risk_score": round(float(final_score), 2),
        "risk_level": risk_level,
        "ml_probability": round(float(ml_prob), 4),
        "matched_rules": pattern_matches + url_flags + brand_flags,
        "detected_urls": urls
    }