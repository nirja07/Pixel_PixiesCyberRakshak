# engine/severityengine.py
import re
from typing import Tuple, List, Dict

class SeverityEngine:
    
    @staticmethod
    def detect_money_amount(text: str) -> int:
        """Detect monetary amounts in text"""
        # Handle Indian number formats (1,00,000 or 100000)
        text = text.replace(',', '')
        amounts = re.findall(r'₹?\s*(\d+)', text)
        if amounts:
            return max([int(a) for a in amounts])
        return 0
    
    @staticmethod
    def detect_urgency(text: str) -> int:
        """Detect urgency based on keywords"""
        urgency_score = 0
        urgency_keywords = {
            'urgent': 2,
            'immediate': 2,
            'asap': 2,
            'emergency': 3,
            'critical': 3,
            'now': 1,
            'quick': 1,
            'fast': 1
        }
        
        text_lower = text.lower()
        for word, score in urgency_keywords.items():
            if word in text_lower:
                urgency_score += score
        
        return min(urgency_score, 5)  # Cap at 5
    
    @staticmethod
    def detect_sensitivity(text: str) -> int:
        """Detect sensitivity of incident"""
        sensitivity_score = 0
        sensitivity_keywords = {
            'child': 5,
            'minor': 4,
            'teen': 3,
            'private': 2,
            'intimate': 3,
            'photo': 2,
            'video': 2,
            'blackmail': 4,
            'extortion': 4,
            'threat': 3,
            'life': 4
        }
        
        text_lower = text.lower()
        for word, score in sensitivity_keywords.items():
            if word in text_lower:
                sensitivity_score += score
        
        return min(sensitivity_score, 10)  # Cap at 10
    
    @staticmethod
    def calculate(user_input: str, matched_laws: List[Dict]) -> Tuple[str, int]:
        """
        Calculate severity with enhanced factors
        """
        # Base score from laws
        base_score = sum([law["law"].get("severity_weight", 5) for law in matched_laws])
        
        # Financial impact
        money = SeverityEngine.detect_money_amount(user_input)
        if money > 1000000:  # > 10 lakh
            base_score += 8
        elif money > 500000:  # > 5 lakh
            base_score += 6
        elif money > 100000:  # > 1 lakh
            base_score += 4
        elif money > 50000:   # > 50k
            base_score += 3
        elif money > 10000:   # > 10k
            base_score += 2
        elif money > 0:
            base_score += 1
        
        # Urgency factors
        base_score += SeverityEngine.detect_urgency(user_input)
        
        # Sensitivity factors
        base_score += SeverityEngine.detect_sensitivity(user_input)
        
        # Multiple laws involved (complex cases)
        law_count = len(matched_laws)
        if law_count >= 3:
            base_score += 3
        elif law_count >= 2:
            base_score += 1
        
        # Map to severity levels with more granular thresholds
        if base_score >= 40:
            return "CRITICAL", base_score
        elif base_score >= 30:
            return "HIGH", base_score
        elif base_score >= 20:
            return "MEDIUM", base_score
        elif base_score >= 10:
            return "LOW", base_score
        else:
            return "MINOR", base_score