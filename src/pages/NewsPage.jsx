import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./NewsPage.css";

const NewsPage = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/news");
        setNews(response.data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const handleImageError = (event) => {
    event.target.src = "https://placehold.co/400x200?text=No+Image";
    event.target.alt = "No image available";
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="pt-24 pb-16">
      <h2 className="title">Latest Cybersecurity & Cybercrime News</h2>
      <div className="news-grid">
        {news.length > 0 ? (
          news.map((article, index) => (
            <div key={index} className="news-card">
              <img
                src={article.urlToImage || "https://placehold.co/400x200?text=No+Image"}
                alt={article.title || "News Image"}
                className="news-image"
                onError={handleImageError}
              />
              <h3 className="news-title">{article.title}</h3>
              <p className="news-description">
                {article.description
                  ? article.description.length > 120
                    ? article.description.substring(0, 120) + "..."
                    : article.description
                  : "No description available."}
              </p>
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-link"
                >
                  Read more
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="loading-text">Loading news...</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default NewsPage;