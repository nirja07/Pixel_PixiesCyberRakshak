import { useEffect, useState } from "react";

function Leaderboard() {
  const [scams, setScams] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/leaderboard")
      .then(res => res.json())
      .then(data => setScams(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚨 Most Reported Scams</h2>
      {scams.map((scam, index) => (
        <div key={index}>
          #{index + 1} - {scam.title} ({scam.count} reports)
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;