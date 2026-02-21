import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

function CommunityIntel() {
  const [activeTab, setActiveTab] = useState("report");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  const categories = [
    "Phishing",
    "Online Fraud",
    "Identity Theft",
    "Cyber Stalking",
    "Ransomware",
    "Social Media Scam",
    "Bank Fraud",
    "Other",
  ];

  // Fetch leaderboard from backend
  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8001/leaderboard");
      const data = await res.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []); // Add filters later if needed

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!description.trim() || !category) {
      alert("Please fill in description and category");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8001/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          category,
          location
        }),
      });

      if (!res.ok) throw new Error("Failed to report");

      alert("Scam reported successfully!");
      setDescription("");
      setCategory("");
      setLocation("");
      fetchLeaderboard(); // refresh leaderboard
    } catch (error) {
      console.error("Error reporting scam:", error);
      alert("Failed to report scam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter leaderboard by category (client-side for now)
  const filteredLeaderboard = leaderboardData.filter((item) => {
    if (filterCategory === "all") return true;
    return item.category === filterCategory; // You'll need to store category in backend
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-blue-200">
              <span className="text-4xl">👥</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Community Intelligence
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Report scams you've encountered and see what others are reporting.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab("report")}
              className={`px-6 py-3 font-medium text-sm ${activeTab === "report"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              📢 Report a Scam
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-6 py-3 font-medium text-sm ${activeTab === "leaderboard"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              🏆 Leaderboard
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
            {activeTab === "report" && (
              <form onSubmit={handleSubmitReport} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Report a Scam
                </h2>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scam Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Describe the scam in detail..."
                  />
                </div>

                {/* Location (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="City or area"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:scale-105"
                    }`}
                >
                  {loading ? "Submitting..." : "Submit Report"}
                </button>
              </form>
            )}

            {activeTab === "leaderboard" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Most Reported Scams
                  </h2>

                  {/* Category Filter */}
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredLeaderboard.length === 0 ? (
                  <p className="text-center text-gray-500 py-12">
                    No reports yet. Be the first!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredLeaderboard.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-gray-400 w-8">
                            #{index + 1}
                          </span>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Count: {item.count}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {item.count} reports
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityIntel;