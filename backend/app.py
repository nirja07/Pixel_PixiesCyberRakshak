import os
import re
import json
import socket
import logging
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from datetime import datetime, timezone
import whois
import dns.resolver
import anthropic

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

# ─────────────────────────────────────────────
# Anthropic client
# ─────────────────────────────────────────────
client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))


# ════════════════════════════════════════════════════════════
# Existing Routes
# ════════════════════════════════════════════════════════════

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

        level = result.get("risk_level", "Safe")
        result["risk_color"] = {"Safe": "green", "Medium": "orange", "High": "red"}.get(level, "black")

        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in /analyze-qr: {e}")
        return jsonify({"error": "QR Analysis failed", "details": str(e)}), 500


# ════════════════════════════════════════════════════════════
# URL Analysis Helpers
# ════════════════════════════════════════════════════════════

def extract_domain(url: str) -> str:
    match = re.search(r"https?://([^/]+)", url)
    return match.group(1) if match else url


def analyze_url_features(url: str) -> dict:
    """Heuristic URL-level red flag checks."""
    domain = extract_domain(url)
    return {
        "domain": domain,
        "uses_https": url.startswith("https://"),
        "url_length": len(url),
        "num_dots": url.count("."),
        "num_hyphens": domain.count("-"),
        "has_ip_address": bool(re.match(r"https?://\d{1,3}(\.\d{1,3}){3}", url)),
        "has_at_symbol": "@" in url,
        "has_double_slash": "//" in url.replace("https://", "").replace("http://", ""),
        "subdomain_count": len(domain.split(".")) - 2 if domain.count(".") > 1 else 0,
        "suspicious_tld": domain.split(".")[-1] in {
            "tk", "ml", "ga", "cf", "gq", "xyz", "top", "click", "link", "info", "biz"
        },
        "has_redirect_param": any(
            kw in url.lower() for kw in ["redirect=", "url=", "goto=", "next="]
        ),
    }


def scrape_url(url: str) -> dict:
    """Fetch and parse the target page for threat signals."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
    }

    result = {
        "url": url,
        "status_code": None,
        "final_url": url,
        "redirected": False,
        "title": None,
        "meta_description": None,
        "forms": [],
        "password_fields": 0,
        "external_links": [],
        "internal_links": [],
        "scripts": [],
        "suspicious_keywords": [],
        "page_text_snippet": "",
        "error": None,
    }

    SUSPICIOUS_WORDS = [
        "login", "signin", "password", "verify", "account", "secure",
        "update", "confirm", "bank", "paypal", "amazon", "apple", "microsoft",
        "urgent", "suspended", "verify your identity", "click here",
        "limited time", "congratulations", "winner", "prize", "free", "claim now",
    ]

    try:
        resp = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        result["status_code"] = resp.status_code
        result["final_url"] = resp.url
        result["redirected"] = (resp.url != url)

        soup = BeautifulSoup(resp.text, "html.parser")

        if soup.title:
            result["title"] = soup.title.string

        meta = soup.find("meta", attrs={"name": "description"})
        if meta:
            result["meta_description"] = meta.get("content", "")

        domain = extract_domain(url)
        for form in soup.find_all("form"):
            form_info = {
                "action": form.get("action", ""),
                "method": form.get("method", "get").upper(),
                "inputs": [],
            }
            for inp in form.find_all("input"):
                inp_type = inp.get("type", "text").lower()
                if inp_type == "password":
                    result["password_fields"] += 1
                form_info["inputs"].append({"type": inp_type, "name": inp.get("name", "")})
            result["forms"].append(form_info)

        for a in soup.find_all("a", href=True):
            href = a["href"]
            if href.startswith("http"):
                if domain in href:
                    result["internal_links"].append(href)
                else:
                    result["external_links"].append(href)

        for script in soup.find_all("script", src=True):
            result["scripts"].append(script["src"])

        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()
        page_text = soup.get_text(separator=" ", strip=True)
        result["page_text_snippet"] = page_text[:600]

        text_lower = page_text.lower()
        result["suspicious_keywords"] = list({kw for kw in SUSPICIOUS_WORDS if kw in text_lower})

    except requests.exceptions.SSLError:
        result["error"] = "SSL certificate error (untrusted or expired)"
    except requests.exceptions.ConnectionError:
        result["error"] = "Could not connect to the host"
    except requests.exceptions.Timeout:
        result["error"] = "Request timed out"
    except Exception as e:
        result["error"] = str(e)

    return result


def get_whois_info(domain: str) -> dict:
    """WHOIS / registrar lookup."""
    info = {
        "registrar": None,
        "creation_date": None,
        "expiration_date": None,
        "updated_date": None,
        "domain_age_days": None,
        "name_servers": [],
        "status": [],
        "emails": [],
        "org": None,
        "country": None,
        "error": None,
    }

    try:
        w = whois.whois(domain)
        info["registrar"] = w.registrar
        info["org"] = w.org
        info["country"] = w.country
        info["emails"] = list(w.emails) if isinstance(w.emails, list) else ([w.emails] if w.emails else [])
        info["status"] = list(w.status) if isinstance(w.status, list) else ([w.status] if w.status else [])
        info["name_servers"] = [str(ns).lower() for ns in (w.name_servers or [])]

        def first_date(val):
            return val[0] if isinstance(val, list) else val

        creation = first_date(w.creation_date)
        expiration = first_date(w.expiration_date)
        updated = first_date(w.updated_date)

        if creation:
            info["creation_date"] = str(creation)
            if hasattr(creation, "tzinfo") and creation.tzinfo is None:
                creation = creation.replace(tzinfo=timezone.utc)
            info["domain_age_days"] = (datetime.now(timezone.utc) - creation).days

        if expiration:
            info["expiration_date"] = str(expiration)
        if updated:
            info["updated_date"] = str(updated)

    except Exception as e:
        info["error"] = str(e)

    return info


def get_dns_info(domain: str) -> dict:
    """DNS and IP resolution."""
    info = {
        "ip_address": None,
        "mx_records": [],
        "txt_records": [],
        "a_records": [],
        "error": None,
    }

    try:
        a_records = dns.resolver.resolve(domain, "A")
        info["a_records"] = [str(r) for r in a_records]
        info["ip_address"] = info["a_records"][0] if info["a_records"] else None
    except Exception:
        try:
            info["ip_address"] = socket.gethostbyname(domain)
            info["a_records"] = [info["ip_address"]]
        except Exception as e:
            info["error"] = str(e)

    try:
        mx_records = dns.resolver.resolve(domain, "MX")
        info["mx_records"] = [str(r.exchange) for r in mx_records]
    except Exception:
        pass

    try:
        txt_records = dns.resolver.resolve(domain, "TXT")
        info["txt_records"] = [str(r) for r in txt_records][:5]
    except Exception:
        pass

    return info


def assess_risk_with_ai(url_features: dict, scrape_data: dict, whois_data: dict, dns_data: dict) -> dict:
    """Send all gathered intel to Claude for holistic risk scoring."""
    url = url_features.get("domain", "")

    prompt = f"""
You are a cybersecurity expert specializing in phishing and malicious URL detection.
Analyze the following data and provide a thorough risk assessment.

=== URL FEATURES ===
{json.dumps(url_features, indent=2)}

=== WEB SCRAPE RESULTS ===
Final URL (after redirects): {scrape_data.get('final_url')}
Was redirected: {scrape_data.get('redirected')}
HTTP Status: {scrape_data.get('status_code')}
Page Title: {scrape_data.get('title')}
Meta Description: {scrape_data.get('meta_description')}
Password Input Fields Found: {scrape_data.get('password_fields')}
Number of Forms: {len(scrape_data.get('forms', []))}
Form Details: {json.dumps(scrape_data.get('forms', [])[:3], indent=2)}
Suspicious Keywords Found: {scrape_data.get('suspicious_keywords')}
External Links Count: {len(scrape_data.get('external_links', []))}
Page Text Snippet: {scrape_data.get('page_text_snippet', '')[:400]}
Scrape Error (if any): {scrape_data.get('error')}

=== WHOIS / REGISTRAR INFO ===
Registrar: {whois_data.get('registrar')}
Organization: {whois_data.get('org')}
Country: {whois_data.get('country')}
Creation Date: {whois_data.get('creation_date')}
Expiration Date: {whois_data.get('expiration_date')}
Domain Age (days): {whois_data.get('domain_age_days')}
Name Servers: {whois_data.get('name_servers')}

=== DNS / IP INFO ===
IP Address: {dns_data.get('ip_address')}
A Records: {dns_data.get('a_records')}
MX Records: {dns_data.get('mx_records')}

Respond ONLY with a valid JSON object (no markdown, no text outside it):
{{
  "risk_level": "High" | "Medium" | "Low",
  "risk_score": <integer 0-100>,
  "summary": "<2-3 sentence plain-English summary>",
  "threat_indicators": ["<indicator 1>", ...],
  "registrar_info": {{
    "registrar": "<name or Unknown>",
    "org": "<org or Unknown>",
    "country": "<country or Unknown>",
    "creation_date": "<date or Unknown>",
    "expiration_date": "<date or Unknown>",
    "domain_age_days": <number or null>,
    "name_servers": [...]
  }},
  "dns_info": {{
    "ip_address": "<ip or null>",
    "a_records": [...],
    "mx_records": [...]
  }},
  "recommendations": ["<action 1>", ...],
  "detected_urls": ["{url}"]
}}
"""

    try:
        message = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = message.content[0].text.strip()
        raw = re.sub(r"^```[a-z]*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
        return json.loads(raw)

    except Exception as e:
        logger.error(f"AI risk assessment error: {e}")
        return {
            "risk_level": "Unknown",
            "risk_score": 0,
            "summary": f"AI analysis failed: {str(e)}",
            "threat_indicators": [],
            "registrar_info": {},
            "dns_info": {},
            "recommendations": ["Please retry the analysis."],
            "detected_urls": [],
        }


# ════════════════════════════════════════════════════════════
# New Route: /analyze-url
# ════════════════════════════════════════════════════════════

@app.route("/analyze-url", methods=["POST"])
def analyze_url_api():
    logger.info("Request received: /analyze-url")
    data = request.get_json()

    if not data or "url" not in data:
        logger.warning("No URL provided in request body")
        return jsonify({"error": "No URL provided"}), 400

    url = data["url"].strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    domain = extract_domain(url)
    logger.info(f"Analyzing URL: {url} | Domain: {domain}")

    try:
        url_features = analyze_url_features(url)
        scrape_data  = scrape_url(url)
        whois_data   = get_whois_info(domain)
        dns_data     = get_dns_info(domain)

        result = assess_risk_with_ai(url_features, scrape_data, whois_data, dns_data)

        # Add risk_color consistent with other endpoints
        level = result.get("risk_level", "Unknown")
        result["risk_color"] = {
            "Low":  "green",
            "Medium": "orange",
            "High": "red",
        }.get(level, "black")

        # Attach raw technical data for frontend use
        result["raw"] = {
            "url_features": url_features,
            "scrape": {
                "status_code":          scrape_data.get("status_code"),
                "final_url":            scrape_data.get("final_url"),
                "redirected":           scrape_data.get("redirected"),
                "title":                scrape_data.get("title"),
                "password_fields":      scrape_data.get("password_fields"),
                "suspicious_keywords":  scrape_data.get("suspicious_keywords"),
                "forms_count":          len(scrape_data.get("forms", [])),
                "external_links_count": len(scrape_data.get("external_links", [])),
                "error":                scrape_data.get("error"),
            },
        }

        return jsonify(result)

    except Exception as e:
        logger.error(f"Error in /analyze-url: {e}")
        return jsonify({"error": "URL Analysis failed", "details": str(e)}), 500


# ════════════════════════════════════════════════════════════
if __name__ == "__main__":
    logger.info("Starting Flask Server on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
