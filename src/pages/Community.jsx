import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { 
  AlertCircle, 
  Flag, 
  MapPin, 
  Filter, 
  Loader, 
  Trophy, 
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Calendar,
  Shield,
  Award,
  Medal,
  Crown,
  Star,
  ChevronRight,
  BarChart3,
  PieChart,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  HelpCircle,
  Globe,
  Mail,
  CreditCard,
  Fingerprint,
  Ghost,
  Skull,
  Flame
} from "lucide-react";

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

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case "Phishing": return <Mail className="w-4 h-4" />;
      case "Online Fraud": return <CreditCard className="w-4 h-4" />;
      case "Identity Theft": return <Fingerprint className="w-4 h-4" />;
      case "Cyber Stalking": return <Ghost className="w-4 h-4" />;
      case "Ransomware": return <Skull className="w-4 h-4" />;
      case "Social Media Scam": return <Globe className="w-4 h-4" />;
      case "Bank Fraud": return <CreditCard className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Filter leaderboard by category (client-side for now)
  const filteredLeaderboard = leaderboardData.filter((item) => {
    if (filterCategory === "all") return true;
    return item.category === filterCategory; // You'll need to store category in backend
  });

  // Calculate total reports
  const totalReports = leaderboardData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with enhanced design */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-blue-200/50">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Community <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text">Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Report scams you've encountered and see what others are reporting to protect the community.
            </p>
            
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Reports</span>
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">{totalReports}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Categories</span>
                  <PieChart className="w-4 h-4 text-cyan-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">{categories.length}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Scams</span>
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">{leaderboardData.length}</div>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs - Fixed side by side */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setActiveTab("report")}
                className={`px-8 py-3 rounded-xl font-medium text-sm flex items-center transition-all ${
                  activeTab === "report"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Flag className="w-4 h-4 mr-2" />
                Report a Scam
              </button>
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`px-8 py-3 rounded-xl font-medium text-sm flex items-center transition-all ${
                  activeTab === "leaderboard"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </button>
            </div>
          </div>

          {/* Tab Content with enhanced styling */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {activeTab === "report" && (
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmitReport} className="space-y-6 max-w-2xl mx-auto">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Report a Scam</h2>
                      <p className="text-sm text-gray-500">Help protect others by reporting suspicious activities</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Scam Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none bg-white"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows="4"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="Describe the scam in detail. Include information about how you were contacted, what methods were used, and any other relevant details..."
                    />
                  </div>

                  {/* Location (optional) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Location (optional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="City, state, or region"
                      />
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800 mb-1">Reporting Guidelines</h4>
                        <p className="text-sm text-blue-700">
                          Your report will be reviewed and added to the leaderboard to warn the community. 
                          Please provide accurate information to help protect others.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-200 hover:scale-[1.02]"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Submit Report
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "leaderboard" && (
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Most Reported Scams</h2>
                      <p className="text-sm text-gray-500">Track what scams are affecting the community</p>
                    </div>
                  </div>

                  {/* Category Filter with enhanced styling */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="pl-9 pr-8 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none bg-white"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Date filter tabs */}
                <div className="flex space-x-2 mb-6">
                  {["all", "week", "month"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setFilterDate(period)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filterDate === period
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {period === "all" ? "All Time" : period === "week" ? "This Week" : "This Month"}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
                      <Loader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                  </div>
                ) : filteredLeaderboard.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg font-medium">No reports yet</p>
                    <p className="text-gray-400 text-sm mt-1">Be the first to report a scam!</p>
                    <button
                      onClick={() => setActiveTab("report")}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all inline-flex items-center"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Report a Scam
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Top 3 Podium - Enhanced with fixed positioning */}
                    {filteredLeaderboard.length >= 3 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* 2nd Place */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 relative overflow-hidden order-2 md:order-1">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gray-200 opacity-20 rounded-bl-full"></div>
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full mb-3">
                              <Medal className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{filteredLeaderboard[1].count}</div>
                            <h3 className="font-semibold text-gray-900 mb-2">{filteredLeaderboard[1].title}</h3>
                            <div className="flex items-center justify-center space-x-2">
                              <span className="px-2 py-1 bg-gray-200 rounded-full text-xs text-gray-700 flex items-center">
                                {getCategoryIcon(filteredLeaderboard[1].category)}
                                <span className="ml-1">{filteredLeaderboard[1].category}</span>
                              </span>
                            </div>
                            <div className="mt-4">
                              <span className="text-xs text-gray-400">2nd Place</span>
                            </div>
                          </div>
                        </div>

                        {/* 1st Place - Fixed overlapping issue */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-300 relative overflow-hidden transform md:scale-110 z-10 order-1 md:order-2">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 opacity-20 rounded-bl-full"></div>
                          <div className="absolute top-2 right-2">
                            <Crown className="w-8 h-8 text-blue-400 opacity-40" />
                          </div>
                          <div className="text-center relative">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-3 shadow-lg shadow-blue-200">
                              <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-4xl font-bold text-gray-900 mb-1">{filteredLeaderboard[0].count}</div>
                            <h3 className="font-lg font-bold text-gray-900 mb-2">{filteredLeaderboard[0].title}</h3>
                            <div className="flex items-center justify-center space-x-2 mb-4">
                              <span className="px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-700 flex items-center">
                                {getCategoryIcon(filteredLeaderboard[0].category)}
                                <span className="ml-1">{filteredLeaderboard[0].category}</span>
                              </span>
                              <span className="px-2 py-1 bg-red-100 rounded-full text-xs text-red-700 flex items-center">
                                <Flame className="w-3 h-3 mr-1" />
                                Trending
                              </span>
                            </div>
                            <div className="bg-blue-600 text-white text-xs font-semibold py-1 px-3 rounded-full inline-block">
                              #1 TOP THREAT
                            </div>
                          </div>
                        </div>

                        {/* 3rd Place */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 relative overflow-hidden order-3">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200 opacity-20 rounded-bl-full"></div>
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                              <Award className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{filteredLeaderboard[2].count}</div>
                            <h3 className="font-semibold text-gray-900 mb-2">{filteredLeaderboard[2].title}</h3>
                            <div className="flex items-center justify-center space-x-2">
                              <span className="px-2 py-1 bg-orange-100 rounded-full text-xs text-orange-700 flex items-center">
                                {getCategoryIcon(filteredLeaderboard[2].category)}
                                <span className="ml-1">{filteredLeaderboard[2].category}</span>
                              </span>
                            </div>
                            <div className="mt-4">
                              <span className="text-xs text-gray-400">3rd Place</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Leaderboard List - Enhanced */}
                    {filteredLeaderboard.slice(3).map((item, index) => (
                      <div
                        key={index}
                        className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-gray-300 w-8 text-right">
                            #{index + 4}
                          </span>
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600`}>
                              {getCategoryIcon(item.category)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{item.title}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {filterDate === "all" ? "All time" : filterDate === "week" ? "This week" : "This month"}
                                </span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-500 flex items-center">
                                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                                  +{Math.floor(Math.random() * 30)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {item.count}
                          </span>
                       
                        </div>
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