# engine/responsebuilder.py
class ResponseBuilder:

    @staticmethod
    def build(user_input, matched_laws, severity_label, severity_score):

        response = {
            "Incident_Analysis": {
                "User_Input": user_input,
                "Severity_Level": severity_label,
                "Severity_Score": severity_score
            },
            "Applicable_Laws": [],
            "Preventive_Measures": set(),
            "Evidence_Required": set()
        }

        for item in matched_laws:
            law = item["law"]
            response["Applicable_Laws"].append({
                "Act": law["act_name"],
                "Section": law["section_number"],
                "Title": law["section_title"],
                "Punishment": law["punishment"],
                "Confidence": item["confidence"]
            })

            for p in law.get("preventive_measures", []):
                response["Preventive_Measures"].add(p)

            for e in law.get("evidence_required", []):
                response["Evidence_Required"].add(e)

        response["Preventive_Measures"] = list(response["Preventive_Measures"])
        response["Evidence_Required"] = list(response["Evidence_Required"])

        return response