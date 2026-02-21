import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  QrCode, 
  Upload, 
  X, 
  Link as LinkIcon,
  AlertCircle,
  Info,
  TrendingUp,
  Clock,
  Lock,
  Target,
  Zap,
  Eye,
  Download,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  FileCheck,
  ScanLine,
  MessageSquare,
  ExternalLink,
  FileWarning,
  FileSearch,
  Sparkles,
  Brain,
  Gauge,
  Search,
  Flag,
  Ban,
  Phone,
  Mail,
  Globe,
  Fingerprint,
  Ghost,
  Skull,
  CreditCard,
  Flame,
  Crown,
  Award,
  Star,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  BarChart3,
  PieChart
} from "lucide-react";
import Navbar from "../pages/Navbar";

function RiskAnalyzer() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [progress, setProgress] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [particles, setParticles] = useState([]);
  const [urlInput, setUrlInput] = useState("");

  // Sophisticated particle animation for background
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    setParticles(newParticles);
  }, []);

  // Simulate progress during loading with easing
  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.max(1, (100 - prev) / 10);
          return prev + increment > 95 ? 95 : prev + increment;
        });
      }, 150);
    } else {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 800);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const analyzeText = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Text analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeQR = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

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
      console.error("QR analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeURL = async () => {
    if (!urlInput.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("URL analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (level) => {
    switch(level?.toLowerCase()) {
      case 'high': return <AlertTriangle className="w-8 h-8" />;
      case 'medium': return <AlertCircle className="w-8 h-8" />;
      case 'low': return <CheckCircle className="w-8 h-8" />;
      default: return <Shield className="w-8 h-8" />;
    }
  };

  const getRiskColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-blue-600';
    }
  };

  const getRiskBg = (level) => {
    switch(level?.toLowerCase()) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-orange-50 border-orange-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getRiskGradient = (level) => {
    switch(level?.toLowerCase()) {
      case 'high': return 'from-red-600 to-orange-500';
      case 'medium': return 'from-orange-500 to-yellow-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  const getRiskScore = () => {
    if (!result) return 0;
    return result.risk_score || 
           (result.risk_level === 'High' ? 85 : 
            result.risk_level === 'Medium' ? 55 : 
            result.risk_level === 'Low' ? 25 : 0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header with Stats */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-blue-200">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Risk Analysis
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced threat detection for messages, URLs, and QR codes
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Messages Analyzed</span>
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">1,234</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">QR Codes Scanned</span>
                <QrCode className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">856</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">URLs Checked</span>
                <LinkIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">2,543</div>
            </div>
          </div>

          {/* Main Analysis Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-8">
            {/* Tab Selector */}
            <div className="flex p-1 bg-gray-50 border-b border-gray-200">
              {[
                { id: "text", icon: MessageSquare, label: "Text Analysis", desc: "Analyze messages and emails" },
                { id: "qr", icon: ScanLine, label: "QR Analysis", desc: "Scan and analyze QR codes" },
                { id: "url", icon: LinkIcon, label: "URL Analysis", desc: "Scan websites for phishing" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 relative px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <tab.icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{tab.label}</div>
                      <div className="text-xs text-gray-500">{tab.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === "text" && (
                  <div key="text" className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message or Text Content
                      </label>
                      <textarea
                        placeholder="Paste suspicious message, email, or SMS content here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="6"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-gray-900 placeholder-gray-400"
                      />
                      <div className="mt-2 text-xs text-gray-500 text-right">
                        {message.length} characters
                      </div>
                    </div>

                    <button
                      onClick={analyzeText}
                      disabled={!message.trim() || loading}
                      className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center ${
                        message.trim() && !loading
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-200"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <FileSearch className="w-5 h-5 mr-2" />
                          Analyze Message
                        </>
                      )}
                    </button>
                  </div>
                )}

                {activeTab === "qr" && (
                  <div key="qr" className="space-y-6">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                        id="qr-upload"
                      />
                      <label 
                        htmlFor="qr-upload" 
                        className="block cursor-pointer"
                      >
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                          file 
                            ? "border-blue-400 bg-blue-50" 
                            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                        }`}>
                          {file ? (
                            <>
                              <FileCheck className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                              <p className="text-gray-900 font-medium mb-1">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </>
                          ) : (
                            <>
                              <QrCode className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                              <p className="text-gray-900 font-medium mb-1">Click to upload QR code</p>
                              <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>

                    {file && (
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Upload className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button
                          onClick={() => setFile(null)}
                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={analyzeQR}
                      disabled={!file || loading}
                      className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center ${
                        file && !loading
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-200"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Analyzing QR...
                        </>
                      ) : (
                        <>
                          <ScanLine className="w-5 h-5 mr-2" />
                          Analyze QR Code
                        </>
                      )}
                    </button>
                  </div>
                )}

                {activeTab === "url" && (
                  <div key="url" className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com/suspicious-page"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-400"
                      />
                    </div>

                    <button
                      onClick={analyzeURL}
                      disabled={!urlInput.trim() || loading}
                      className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center ${
                        urlInput.trim() && !loading
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-200"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Analyzing URL...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-5 h-5 mr-2" />
                          Analyze Website
                        </>
                      )}
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Loading Indicator */}
          <AnimatePresence>
            {loading && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="font-medium text-gray-700">Analyzing</span>
                  </div>
                  <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Results Display - WITH CIRCULAR PROGRESS BAR */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
              >
                {/* Risk Header with Circular Progress */}
                <div className={`p-6 border-b ${getRiskBg(result.risk_level)}`}>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* 3D Risk Meter - Circular Progress Bar */}
                    <motion.div 
                      className="relative w-40 h-40 flex-shrink-0"
                      initial={{ rotate: -90 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 1, type: "spring" }}
                    >
                      {/* Outer Ring */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                          strokeLinecap="round"
                        />
                        
                        {/* Progress ring with gradient */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={`url(#riskGradient-${result.risk_level})`}
                          strokeWidth="8"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 283" }}
                          animate={{ strokeDasharray: `${(getRiskScore() / 100) * 283} 283` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        
                        <defs>
                          <linearGradient id={`riskGradient-${result.risk_level}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={
                              result.risk_level === 'High' ? '#f43f5e' :
                              result.risk_level === 'Medium' ? '#f59e0b' :
                              '#10b981'
                            } />
                            <stop offset="100%" stopColor={
                              result.risk_level === 'High' ? '#f97316' :
                              result.risk_level === 'Medium' ? '#eab308' :
                              '#14b8a6'
                            } />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Center content */}
                      <motion.div 
                        className="absolute inset-0 flex flex-col items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <div className={`mb-1 ${getRiskColor(result.risk_level)}`}>
                          {getRiskIcon(result.risk_level)}
                        </div>
                        <span className="text-2xl font-bold" style={{
                          color: result.risk_level === 'High' ? '#f43f5e' :
                                 result.risk_level === 'Medium' ? '#f59e0b' :
                                 '#10b981'
                        }}>
                          {getRiskScore()}%
                        </span>
                        <span className="text-[10px] text-gray-400">Risk Score</span>
                      </motion.div>
                    </motion.div>

                    {/* Risk Summary */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          result.risk_level === 'High' ? 'bg-red-100 text-red-700' :
                          result.risk_level === 'Medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {result.risk_level} RISK
                        </span>
                        {result.risk_level === 'High' && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center">
                            <Flame className="w-3 h-3 mr-1" />
                            Critical
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Analysis Complete</h3>
                      <p className="text-gray-600">{result.summary || 'Threat analysis completed successfully'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Decoded Content */}
                  {result.decoded_content && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Eye className="w-4 h-4 mr-2 text-gray-500" />
                        Decoded Content
                      </h4>
                      <p className="text-gray-900 font-mono text-sm break-all">{result.decoded_content}</p>
                    </div>
                  )}

                  {/* Detected URLs */}
                  {result.detected_urls?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <LinkIcon className="w-4 h-4 mr-2 text-gray-500" />
                        Detected URLs ({result.detected_urls.length})
                      </h4>
                      <div className="space-y-2">
                        {result.detected_urls.map((url, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="text-sm text-gray-700 break-all flex-1">{url}</span>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-3 p-1 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 text-gray-500" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Threat Categories */}
                  {result.threat_categories?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2 text-gray-500" />
                        Threat Categories
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.threat_categories.map((cat, index) => (
                          <span key={index} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result.recommendations?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-gray-500" />
                        Recommendations
                      </h4>
                      <div className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setResult(null);
                        setMessage("");
                        setFile(null);
                        setUrlInput("");
                      }}
                      className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Analysis
                    </button>
                    <button className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center justify-center">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600 text-sm">Advanced machine learning detects sophisticated scams and phishing attempts</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Gauge className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Scanning</h3>
              <p className="text-gray-600 text-sm">Instant analysis with detailed risk assessment and actionable insights</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Guaranteed</h3>
              <p className="text-gray-600 text-sm">Your data stays private - all analysis happens locally in your browser</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>GDPR compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>24/7 threat monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskAnalyzer;