from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore
import smtplib
from email.mime.text import MIMEText

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 Initialize Firebase
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# ------------------------
# Email Function
# ------------------------

def send_email_alert(title):
    sender = "radhasprojects@gmail.com"
    password = "bxin ojvg taqr hdfc"

    msg = MIMEText(f"⚠ Scam Alert!\n\n{title} has been reported multiple times.")
    msg["Subject"] = "CyberRakshak Scam Alert"
    msg["From"] = sender
    msg["To"] = sender

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, password)
        server.send_message(msg)

# ------------------------
# Model
# ------------------------

class ScamReport(BaseModel):
    description: str

# ------------------------
# Helper Functions
# ------------------------

def extract_keywords(text):
    stopwords = ["the","is","a","an","and","to","of","from","for","with"]
    words = text.lower().split()
    return [w for w in words if w not in stopwords and len(w) > 2]

def similarity(arr1, arr2):
    common = set(arr1) & set(arr2)
    return len(common) / max(len(arr1), len(arr2))

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
            new_count = scam["count"] + 1
            scams_ref.document(doc.id).update({"count": new_count})

            if new_count == 3:
                try:
                    send_email_alert(scam["title"])
                except Exception as e:
                    print("Email failed:", e)

            return {"message": "Reported successfully"}

    # If not found, create new document
    scams_ref.add({
        "title": report.description[:60],
        "keywords": keywords,
        "count": 1
    })

    return {"message": "Reported successfully"}


@app.get("/leaderboard")
def get_leaderboard():
    scams_ref = db.collection("scams")
    docs = scams_ref.order_by("count", direction=firestore.Query.DESCENDING).stream()

    return [doc.to_dict() for doc in docs]