import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
class SemanticEngine:
    def __init__(self, dataset_path):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.dataset_path = dataset_path
        self.laws = []
        self.index = None
        self.embeddings = None
        self._load_and_build()
    def _load_dataset(self):
        with open(self.dataset_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data["laws_master"]
    def _build_index(self):
        corpus = []
        for law in self.laws:
            text = (
                law["section_title"] + " " +
                law["full_description"] + " " +
                " ".join(law.get("legal_ingredients", []))
            )
            corpus.append(text)

        self.embeddings = self.model.encode(corpus)
        dimension = self.embeddings.shape[1]

        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(np.array(self.embeddings))
    def _load_and_build(self):
        self.laws = self._load_dataset()
        self._build_index()

    def search(self, user_input, top_k=5):
        from engine.incident_classifier import IncidentClassifier
        category = IncidentClassifier.classify(user_input)
        query_embedding = self.model.encode([user_input])
        distances, indices = self.index.search(query_embedding, top_k)
        matched_laws = []
        user_lower = user_input.lower()
        for i, idx in enumerate(indices[0]):
            law = self.laws[idx]
            similarity_score = 1 / (1 + distances[0][i])
            boost = 0
            if category == "FINANCIAL_FRAUD":
                if law["section_number"] in ["66C", "66D", "420"]:
                    boost += 0.35
            if category == "CYBER_EXTORTION":
                if law["section_number"] in ["66E", "67"]:
                    boost += 0.35
            if category == "ACCOUNT_HACK":
                if law["section_number"] in ["43", "66"]:
                    boost += 0.3
            if category == "CYBER_HARASSMENT":
                if law["section_number"] in ["66E", "67"]:
                    boost += 0.3
            if "otp" in user_lower and law["section_number"] == "66C":
                boost += 0.25
            if "qr" in user_lower and law["section_number"] == "66D":
                boost += 0.25
            final_score = similarity_score + boost
            if law["act_name"] in ["CERT-In Directions 2022"]:
                continue
            if similarity_score < 0.25:
                final_score -= 0.2
            matched_laws.append({
                "law": law,
                "confidence": round(float(final_score), 3)
            })
        matched_laws = sorted(matched_laws, key=lambda x: x["confidence"], reverse=True)

        return matched_laws[:5]
