from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from engine.semanticengine import SemanticEngine
from engine.severityengine import SeverityEngine
from engine.responsebuilder import ResponseBuilder

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "lawdata.json")

engine = SemanticEngine(DATASET_PATH)


class IncidentRequest(BaseModel):
    incident: str


@app.post("/analyze")
def analyze_incident(request: IncidentRequest):
    matched_laws = engine.search(request.incident, top_k=5)

    severity_label, severity_score = SeverityEngine.calculate(
        request.incident,
        matched_laws
    )

    response = ResponseBuilder.build(
        request.incident,
        matched_laws,
        severity_label,
        severity_score
    )

    return response