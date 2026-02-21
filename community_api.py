import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore
import smtplib
from email.mime.text import MIMEText
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 Initialize Firebase with service account key
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# ------------------------
# Twilio Setup (from env)
# ------------------------
account_sid = os.getenv("TWILIO_ACCOUNT_SID", "AC707231945a4ca563dbe770dec1a5341c")
auth_token = os.getenv("TWILIO_AUTH_TOKEN", "fc2bb9c7cdc6f1d7799ac0ed5c6e3cdf")
twilio_client = Client(account_sid, auth_token)

def send_whatsapp_alert(title):
    try:
        message = twilio_client.messages.create(
            from_='whatsapp:+14155238886',  # Twilio sandbox number
            to='whatsapp:+919324892042',   # Your verified number
            body=f"⚠ Scam Alert!\n\n{title} has been reported 3 times."
        )
        print("WhatsApp sent:", message.sid)
    except Exception as e:
        print("WhatsApp failed:", e)

# ------------------------
# Email Function
# ------------------------
def send_email_alert(title):
    sender = "radhasprojects@gmail.com"
    password =  "bxin ojvg taqr hdfc"
    msg = MIMEText(f"⚠ Scam Alert!\n\n{title} has been reported multiple times.")
    msg["Subject"] = "CyberRakshak Scam Alert"
    msg["From"] = sender
    msg["To"] = sender

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender, password)
            server.send_message(msg)
        print("Email sent successfully")
    except Exception as e:
        print("Email failed:", e)

# ------------------------
# Request Model (UPDATED)
# ------------------------
class ScamReport(BaseModel):
    description: str
    category: str = "Other"   # New field, defaults to "Other"
    location: str = ""         # New field, defaults to empty string

# ------------------------
# Helper Functions
# ------------------------
def extract_keywords(text):
    stopwords = ["the","is","a","an","and","to","of","from","for","with"]
    words = text.lower().split()
    return [w for w in words if w not in stopwords and len(w) > 2]

def similarity(arr1, arr2):
    common = set(arr1) & set(arr2)
    return len(common) / max(len(arr1), len(arr2), 1)

# ------------------------
# Routes
# ------------------------

@app.post("/report")
def report_scam(report: ScamReport):
    scams_ref = db.collection("scams")
    docs = scams_ref.stream()

    keywords = extract_keywords(report.description)

    for doc in docs:
        scam = doc.to_dict()
        score = similarity(keywords, scam["keywords"])

        if score > 0.4:
            # Similar scam found – increment count
            new_count = scam["count"] + 1
            scams_ref.document(doc.id).update({"count": new_count})

            # Alert if threshold reached
            if new_count == 3:
                send_email_alert(scam["title"])
                send_whatsapp_alert(scam["title"])

            return {"message": "Reported successfully"}

    # No similar scam found – create new document with category, location, timestamp
    scams_ref.add({
        "title": report.description[:60],
        "keywords": keywords,
        "count": 1,
        "category": report.category,
        "location": report.location,
        "timestamp": firestore.SERVER_TIMESTAMP
    })

    return {"message": "Reported successfully"}

@app.get("/leaderboard")
def get_leaderboard():
    scams_ref = db.collection("scams")
    # Order by count descending, then optionally by timestamp
    docs = scams_ref.order_by("count", direction=firestore.Query.DESCENDING).stream()
    # Return each doc with its id and data
    leaderboard = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        # Convert timestamp to string if needed (optional)
        if "timestamp" in data and data["timestamp"]:
            data["timestamp"] = data["timestamp"].isoformat()
        leaderboard.append(data)
    return leaderboard