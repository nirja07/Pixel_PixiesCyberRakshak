import os
import re
import pickle
import numpy as np
from urllib.parse import urlparse

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

PHISHING_DB_PATH = os.path.join(BASE_DIR, "../data/phishing_urls.txt")

def load_phishing_db():
    if not os.path.exists(PHISHING_DB_PATH):
        return set()

    with open(PHISHING_DB_PATH, "r", encoding="utf-8") as f:
        return set(line.strip().lower() for line in f if line.strip())
PHISHING_URLS = load_phishing_db()
def check_phishing_database(urls):
    score = 0
    flags = []

    for url in urls:
        if url.lower() in PHISHING_URLS:
            score += 60
            flags.append("known_phishing_url")

    return score, flags


SUSPICIOUS_PATTERNS = [
    r"verify.*account",
    r"verify.*identity",
    r"verify.*device",
    r"update.*kyc",
    r"update.*details",
    r"update.*payment",
    r"account.*suspended",
    r"account.*blocked",
    r"account.*locked",
    r"click.*link",
    r"urgent.*action",
    r"immediate.*action",
    r"confirm.*details",
    r"confirm.*identity",
    r"bank.*alert",
    r"security.*alert",
    r"unusual.*activity",
    r"suspicious.*activity",
    r"otp.*share",
    r"otp.*required",
    r"login.*immediately",
    r"reset.*password",
    r"re-?activate.*account",
    r"limited.*time",
    r"last.*warning",
    r"final.*notice",
    r"your.*account.*will.*be.*closed",
    r"failure.*to.*comply",
    r"avoid.*penalty"
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
    "$500",
    "claim now",
    "free reward",
    "free gift",
    "free money",
    "guaranteed",
    "act now",
    "exclusive deal",
    "limited offer",
    "cash prize",
    "lottery",
    "jackpot",
    "bonus",
    "earn money fast",
    "work from home",
    "investment opportunity",
    "double your money",
    "crypto giveaway",
    "airdrop",
    "urgent response",
    "immediate response",
    "confidential",
    "private message"
]

SHORTENERS = [
    "bit.ly",
    "goo.gl",
    "tinyurl.com",
    "t.co",
    "rb.gy",
    "cutt.ly",
    "is.gd",
    "soo.gd",
    "s2r.co",
    "ow.ly",
    "shorturl.at",
    "rebrand.ly",
    "shorte.st",
    "adf.ly"
]

SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".tk", ".ru", ".cn",
    ".work", ".info", ".pw", ".click",
    ".gq", ".ml", ".cf", ".ga",
    ".rest", ".support", ".live",
    ".buzz", ".vip", ".country",
    ".stream", ".download", ".review"
]

BRANDS = [
    "google", "gmail", "youtube",
    "sbi", "hdfc", "icici", "axis", "kotak",
    "paytm", "phonepe", "gpay",
    "amazon", "flipkart", "myntra",
    "netflix", "instagram", "facebook",
    "whatsapp", "telegram",
    "apple", "microsoft",
    "irctc", "uidai", "aadhaar",
    "rbi", "epfo"
]

URL_REGEX = r"https?://[^\s]+"


# ==============================
# Helper Functions
# ==============================

def check_scam_keywords(text):
    
    score = 0
    flags = []
    if text.isupper():
        score += 10
    text_lower = text.lower()
    if text.count("!") > 3:
        score += 5
    if sum(c.isdigit() for c in text) > 10:
        score += 5
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

def generate_recommendations(risk_level, matched_rules, urls):
    recommendations = []

    if risk_level == "High":
        recommendations.append("⚠️ Do NOT click any links in this message.")
        recommendations.append("Avoid sharing OTP, passwords, or personal details.")
        recommendations.append("Report this message to your bank or cyber crime portal.")
    
    elif risk_level == "Medium":
        recommendations.append("Be cautious before clicking links.")
        recommendations.append("Verify the sender through official channels.")
        recommendations.append("Check URL carefully before entering credentials.")
    
    else:
        recommendations.append("Message appears safe, but always stay cautious online.")

    # Specific flag-based suggestions
    if "known_phishing_url" in matched_rules:
        recommendations.append("This URL is found in phishing database.")

    if "shortened_url" in matched_rules:
        recommendations.append("Shortened URLs can hide malicious destinations.")

    if any("mismatch" in rule for rule in matched_rules):
        recommendations.append("Brand name does not match website domain.")

    if urls:
        recommendations.append("Always manually type official website instead of clicking links.")

    return recommendations
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

    db_score, db_flags = check_phishing_database(urls)

    scam_score, scam_flags = check_scam_keywords(text)

    # ---------- Final Weighted Score ----------
    final_score = ml_score + pattern_score + url_score + brand_score + db_score + scam_score

    # Cap score at 100
    final_score = min(100, final_score)

    risk_level = get_risk_level(final_score)


    recommendations = generate_recommendations(risk_level, 
                                           pattern_matches + url_flags + brand_flags + db_flags + scam_flags,
                                           urls)
    print("RECOMMENDATIONS:", recommendations)
    return {
    "risk_score": round(float(final_score), 2),
    "risk_level": risk_level,
    "ml_probability": round(float(ml_prob), 4),
    "matched_rules": pattern_matches + url_flags + brand_flags + db_flags + scam_flags,
    "detected_urls": urls,
    "recommendations": recommendations
    }