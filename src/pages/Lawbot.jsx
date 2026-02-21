import React, { useState } from "react";

function LawBot() {
  const [incident, setIncident] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeIncident = async () => {
    if (!incident.trim()) {
      setError("Please describe your incident.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ incident }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }
                                        
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Unable to connect to backend.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🔐 Indian Cyber Law AI Assistant</h1>

      <textarea
        rows="5"
        cols="70"
        placeholder="Describe your cyber incident here..."
        value={incident}
        onChange={(e) => setIncident(e.target.value)}
        style={{ padding: "10px", marginTop: "10px" }}
      />

      <br /><br />

      <button onClick={analyzeIncident} style={{ padding: "10px 20px" }}>
        Analyze Incident
      </button>

      {loading && <p>Analyzing your case...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "40px" }}>
          <h2>
            🧠 Severity: {result.Incident_Analysis.Severity_Level}
          </h2>

          <h3>Applicable Laws:</h3>
          <ul>
            {result.Applicable_Laws.map((law, index) => (
              <li key={index}>
                <strong>{law.Act}</strong> — Section {law.Section}
                <br />
                {law.Title}
                <br />
                Confidence: {law.Confidence}
              </li>
            ))}
          </ul>

          <h3>Preventive Measures:</h3>
          <ul>
            {result.Preventive_Measures.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Evidence Required:</h3>
          <ul>
            {result.Evidence_Required.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LawBot;