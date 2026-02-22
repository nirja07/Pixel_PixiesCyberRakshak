import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5002/api/news");
        setNews(response.data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleImageError = (event) => {
    event.target.src = "https://placehold.co/400x200/3b82f6/white?text=No+Image";
    event.target.alt = "No image available";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Latest Cybersecurity News
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest cybersecurity threats, data breaches, and digital safety tips
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">Fetching latest news...</p>
            </div>
          ) : news.length > 0 ? (
            <>
              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article, index) => (
                  <article 
                    key={index} 
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 flex flex-col h-full"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={article.urlToImage || "https://placehold.co/400x200/3b82f6/white?text=Cyber+News"}
                        alt={article.title || "News Image"}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={handleImageError}
                      />
                      {article.source?.name && (
                        <span className="absolute top-3 left-3 bg-blue-600/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {article.source.name}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Date */}
                      {article.publishedAt && (
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <svg className="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(article.publishedAt)}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {article.title || "Untitled Article"}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {article.description
                          ? article.description.length > 150
                            ? article.description.substring(0, 150) + "..."
                            : article.description
                          : "No description available for this article."}
                      </p>

                      {/* Read More Button */}
                      {article.url && (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors group mt-auto"
                        >
                          <span>Read Full Article</span>
                          <svg 
                            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* Stats Footer */}
              <div className="mt-12 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
                <p>Showing {news.length} articles • Data sourced from cybersecurity news providers</p>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-600 text-lg font-medium mb-2">No news articles found</p>
              <p className="text-gray-400 text-sm">Please check back later for updates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;