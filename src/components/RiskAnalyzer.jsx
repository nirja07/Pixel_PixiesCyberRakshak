import React, { useState } from "react";

function RiskAnalyzer() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ======================
  // Analyze Text
  // ======================
  const analyzeText = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  // ======================
  // Analyze QR
  // ======================
  const analyzeQR = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze-qr", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>CyberRakshak Risk Analyzer 🚀</h2>

      {/* TEXT INPUT */}
      <textarea
        placeholder="Paste suspicious message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={styles.textarea}
      />

      <button onClick={analyzeText} style={styles.button}>
        Analyze Text
      </button>

      <hr style={{ margin: "20px 0" }} />

      {/* QR UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={analyzeQR} style={styles.button}>
        Upload & Analyze QR
      </button>

      {loading && <p>Analyzing...</p>}

      {/* RESULT DISPLAY */}
      {result && (
        <div style={{ ...styles.resultBox, borderColor: result.risk_color }}>
          {result.decoded_content && (
            <p>
              <strong>Decoded QR Content:</strong> {result.decoded_content}
            </p>
          )}

          <h3>Risk Score: {result.risk_score} / 100</h3>

          <h4 style={{ color: result.risk_color }}>
            Risk Level: {result.risk_level}
          </h4>

          <p><strong>Recommendation:</strong> {result.recommendation}</p>

          <p><strong>Matched Rules:</strong> {result.matched_rules?.join(", ")}</p>

          <p><strong>URL Indicators:</strong> {result.url_indicators?.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    margin: "10px 5px 0 0",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "20px",
    padding: "15px",
    border: "2px solid",
    borderRadius: "8px",
  },
};

export default RiskAnalyzer;