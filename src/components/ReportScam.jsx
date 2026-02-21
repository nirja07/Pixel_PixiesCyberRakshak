import { useState } from "react";

function ReportScam() {
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!description.trim()) return alert("Enter description");

    await fetch("http://127.0.0.1:8001/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description })
    });

    alert("Scam reported!");
    setDescription("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Report a Scam</h2>
      <textarea
        rows="4"
        style={{ width: "100%" }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default ReportScam;