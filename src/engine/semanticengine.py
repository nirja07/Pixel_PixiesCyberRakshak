# engine/semanticengine.py
import json
import numpy as np
import faiss
import os
import pickle
from sentence_transformers import SentenceTransformer
from rank_bm25 import BM25Okapi
from typing import List, Dict, Any
import re

class SemanticEngine:
    def __init__(self, dataset_path, use_legal_model=True):
        """
        Initialize Semantic Engine with hybrid search capabilities
        
        Args:
            dataset_path: Path to lawdata.json
            use_legal_model: If True, use InLegal-Sbert, else use all-MiniLM
        """
        self.dataset_path = dataset_path
        self.laws = []
        self.faiss_index = None
        self.bm25_index = None
        self.corpus = []
        
        # Use legal-specific model for better accuracy
        model_name = "bhavyagiri/InLegal-Sbert" if use_legal_model else "all-MiniLM-L6-v2"
        print(f"📚 Loading model: {model_name}")
        self.model = SentenceTransformer(model_name)
        
        # Cache for embeddings
        self.cache_path = dataset_path.replace('.json', '_embeddings.pkl')
        
        self._load_and_build()
    
    def _load_dataset(self):
        """Load laws from JSON file"""
        with open(self.dataset_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data["laws_master"]
    
    def _prepare_text(self, law: Dict) -> str:
        """Prepare rich text representation for embedding"""
        parts = [
            law["section_title"],
            law["full_description"],
            " ".join(law.get("legal_ingredients", [])),
            f"Act: {law['act_name']}",
            f"Section: {law['section_number']}"
        ]
        return " ".join(parts)
    
    def _build_index(self):
        """Build hybrid search indices"""
        # Prepare corpus
        self.corpus = [self._prepare_text(law) for law in self.laws]
        
        # Try to load cached embeddings
        if os.path.exists(self.cache_path):
            print("📦 Loading cached embeddings...")
            with open(self.cache_path, 'rb') as f:
                self.embeddings = pickle.load(f)
        else:
            print("🔨 Generating embeddings (this may take a minute)...")
            self.embeddings = self.model.encode(self.corpus, show_progress_bar=True)
            # Cache embeddings
            with open(self.cache_path, 'wb') as f:
                pickle.dump(self.embeddings, f)
        
        # Build FAISS index (IVF for speed, Flat for accuracy)
        dimension = self.embeddings.shape[1]
        
        # Use IVF index for faster search with minimal accuracy loss
        nlist = min(100, len(self.laws) // 10)  # Number of clusters
        quantizer = faiss.IndexFlatIP(dimension)  # Inner product for cosine similarity
        self.faiss_index = faiss.IndexIVFFlat(quantizer, dimension, nlist, faiss.METRIC_INNER_PRODUCT)
        
        # Train and add
        if not self.faiss_index.is_trained:
            self.faiss_index.train(self.embeddings)
        self.faiss_index.add(self.embeddings)
        
        # Build BM25 index
        tokenized_corpus = [self._tokenize(text) for text in self.corpus]
        self.bm25_index = BM25Okapi(tokenized_corpus)
        
        print(f"✅ Index built with {len(self.laws)} laws")
    
    def _tokenize(self, text: str) -> List[str]:
        """Simple tokenizer for BM25"""
        return re.findall(r'\w+', text.lower())
    
    def _load_and_build(self):
        """Load data and build indices"""
        self.laws = self._load_dataset()
        self._build_index()
    
    def search(self, user_input: str, top_k: int = 5) -> List[Dict]:
        """
        Hybrid search combining semantic and keyword matching
        """
        from engine.incident_classifier import IncidentClassifier
        
        # Classify incident type
        category = IncidentClassifier.classify(user_input)
        user_lower = user_input.lower()
        
        # 1. Semantic search (FAISS)
        query_embedding = self.model.encode([user_input])
        # Normalize for cosine similarity
        faiss.normalize_L2(query_embedding)
        
        # Search (nprobe=10 for IVF)
        self.faiss_index.nprobe = min(10, self.faiss_index.nlist)
        semantic_scores, semantic_indices = self.faiss_index.search(query_embedding, top_k * 2)
        
        # 2. Keyword search (BM25)
        tokenized_query = self._tokenize(user_input)
        bm25_scores = self.bm25_index.get_scores(tokenized_query)
        bm25_indices = np.argsort(bm25_scores)[-top_k*2:][::-1]
        
        # 3. Hybrid fusion with weights
        semantic_weight = 0.7
        bm25_weight = 0.3
        
        # Create score dictionary
        combined_scores = {}
        
        # Add semantic scores
        for i, idx in enumerate(semantic_indices[0]):
            if idx not in combined_scores:
                combined_scores[idx] = 0
            # Convert distance to similarity (1 - distance for L2, but we're using IP)
            similarity = float(semantic_scores[0][i])  # IP gives cosine similarity directly
            combined_scores[idx] += similarity * semantic_weight
        
        # Add BM25 scores (normalize to 0-1 range)
        if bm25_scores.max() > 0:
            normalized_bm25 = bm25_scores / bm25_scores.max()
            for idx in bm25_indices:
                if idx not in combined_scores:
                    combined_scores[idx] = 0
                combined_scores[idx] += normalized_bm25[idx] * bm25_weight
        
        # 4. Sort by combined score
        sorted_indices = sorted(combined_scores.keys(), 
                              key=lambda x: combined_scores[x], 
                              reverse=True)[:top_k * 2]
        
        # 5. Apply category boosts
        matched_laws = []
        for idx in sorted_indices:
            law = self.laws[idx]
            base_score = combined_scores.get(idx, 0)
            
            # Apply category-specific boosts
            boost = self._calculate_boost(category, law, user_lower)
            
            # Keyword matching boost
            keyword_boost = self._keyword_match_boost(user_lower, law)
            
            final_score = min(base_score + boost + keyword_boost, 1.0)
            
            # Only include if confidence is reasonable
            if final_score > 0.3:
                matched_laws.append({
                    "law": law,
                    "confidence": round(float(final_score), 3)
                })
        
        # Sort by confidence
        matched_laws = sorted(matched_laws, key=lambda x: x["confidence"], reverse=True)
        
        return matched_laws[:top_k]
    
    def _calculate_boost(self, category: str, law: Dict, user_lower: str) -> float:
        """Calculate category-based boost"""
        boost = 0
        section = law["section_number"]
        
        # Category-specific boosts
        boosts = {
            "FINANCIAL_FRAUD": {"66C": 0.25, "66D": 0.25, "420": 0.20, "318": 0.20, "319": 0.20},
            "CYBER_EXTORTION": {"66E": 0.25, "67": 0.20, "66C": 0.15},
            "ACCOUNT_HACK": {"43": 0.20, "66": 0.20, "66C": 0.25},
            "CYBER_HARASSMENT": {"66E": 0.25, "67": 0.20, "67A": 0.20}
        }
        
        if category in boosts:
            for sec, boost_val in boosts[category].items():
                if sec in section:
                    boost += boost_val
        
        return boost
    
    def _keyword_match_boost(self, user_lower: str, law: Dict) -> float:
        """Boost based on keyword matching in legal ingredients"""
        boost = 0
        keywords = {
            "otp": 0.15,
            "qr": 0.15,
            "password": 0.10,
            "bank": 0.10,
            "upi": 0.10,
            "blackmail": 0.20,
            "threat": 0.15,
            "hacked": 0.15,
            "harass": 0.15,
            "child": 0.25,
            "photo": 0.15,
            "video": 0.15
        }
        
        for keyword, boost_val in keywords.items():
            if keyword in user_lower:
                # Check if keyword appears in legal ingredients
                ingredients = " ".join(law.get("legal_ingredients", [])).lower()
                if keyword in ingredients:
                    boost += boost_val
        
        return min(boost, 0.3)  # Cap at 0.3