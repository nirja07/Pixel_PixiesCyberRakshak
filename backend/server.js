// server.js
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(cors()); // Allow your frontend to call this server

// Store your NewsAPI key from .env
const API_KEY = process.env.NEWS_API_KEY;
if (!API_KEY) {
  console.error("ERROR: NEWS_API_KEY not found in .env");
  process.exit(1);
}

// Endpoint to fetch cybercrime/cybersecurity news
app.get("/api/news", async (req, res) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        '"cybercrime" OR "cyber security" OR "hacking" OR "data breach" OR "malware" OR "ransomware" OR "phishing"'
      )}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${API_KEY}`
    );

    res.json(response.data); // Send JSON to frontend
  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// Start server
const PORT = 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));