class IncidentClassifier:
    @staticmethod
    def classify(text):
        text = text.lower()

        if any(word in text for word in ["qr", "upi", "bank", "refund", "otp", "transaction"]):
            return "FINANCIAL_FRAUD"

        if any(word in text for word in ["blackmail", "threat", "leak", "extortion"]):
            return "CYBER_EXTORTION"

        if any(word in text for word in ["hacked", "password", "account access"]):
            return "ACCOUNT_HACK"

        if any(word in text for word in ["stalking", "harassment", "abusive"]):
            return "CYBER_HARASSMENT"

        return "GENERAL"