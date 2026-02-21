import os
from engine.semanticengine import SemanticEngine
from engine.severityengine import SeverityEngine
from engine.responsebuilder import ResponseBuilder
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "lawdata.json")

def run_bot(user_input):
    engine = SemanticEngine(DATASET_PATH)

    matched_laws = engine.search(user_input, top_k=5)

    severity_label, severity_score = SeverityEngine.calculate(
        user_input,
        matched_laws
    )

    response = ResponseBuilder.build(
        user_input,
        matched_laws,
        severity_label,
        severity_score
    )

    return response


if __name__ == "__main__":
    print("🔐 Indian Cyber Law AI Bot")
    print("----------------------------------")
    user_input = input("Describe your cyber incident:\n\n")

    result = run_bot(user_input)

    print("\n🧠 Analysis Result:\n")
    print(json.dumps(result, indent=4))