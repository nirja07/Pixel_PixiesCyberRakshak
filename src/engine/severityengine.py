import re

class SeverityEngine:

    @staticmethod
    def detect_money_amount(text):
        amounts = re.findall(r'\d+', text)
        if amounts:
            return max([int(a) for a in amounts])
        return 0

    @staticmethod
    def calculate(user_input, matched_laws):
        base_score = sum([law["law"].get("severity_weight", 0) for law in matched_laws])

        money = SeverityEngine.detect_money_amount(user_input)
        if money > 50000:
            base_score += 3
        elif money > 10000:
            base_score += 2

        if any(word in user_input.lower() for word in ["threat", "blackmail", "child"]):
            base_score += 3

        if base_score >= 30:
            return "CRITICAL", base_score
        elif base_score >= 20:
            return "HIGH", base_score
        elif base_score >= 10:
            return "MEDIUM", base_score
        else:
            return "LOW", base_score