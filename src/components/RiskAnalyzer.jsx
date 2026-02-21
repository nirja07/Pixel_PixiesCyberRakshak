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
  FileSearch
} from "lucide-react";

function RiskAnalyzer() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [progress, setProgress] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [particles, setParticles] = useState([]);

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
      case 'high': return 'text-rose-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-emerald-600';
      default: return 'text-blue-600';
    }
  };

  const getRiskGradient = (level) => {
    switch(level?.toLowerCase()) {
      case 'high': return 'from-rose-500 to-orange-500';
      case 'medium': return 'from-amber-500 to-yellow-500';
      case 'low': return 'from-emerald-500 to-teal-500';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-400/10"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size * 4,
              height: particle.size * 4,
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      
      <div className="relative pt-24 pb-16 z-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header with Glass Effect */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center mb-16"
          >
            <motion.div
              animate={floatAnimation}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-2xl opacity-30"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Risk Analysis
              <span className="block text-2xl lg:text-3xl text-blue-600 font-light mt-2">Intelligent Threat Detection</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-500 max-w-2xl mx-auto font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Advanced AI-powered analysis for messages and QR codes
            </motion.p>
          </motion.div>

          {/* Main Analysis Card with Glass Morphism */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              {/* Decorative Header Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"></div>
              
              {/* Tab Selector with Elegant Design */}
              <div className="flex p-2 bg-slate-50/80 border-b border-slate-200/50">
                {[
                  { 
                    id: "text", 
                    icon: MessageSquare, 
                    label: "Text Analysis", 
                    desc: "Analyze messages, emails, SMS" 
                  },
                  { 
                    id: "qr", 
                    icon: ScanLine, 
                    label: "QR Analysis", 
                    desc: "Scan and analyze QR codes" 
                  }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 relative px-6 py-4 rounded-2xl transition-all ${
                      activeTab === tab.id
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setHoveredCard(tab.id)}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabBackground"
                        className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    <div className="relative flex items-center justify-center space-x-3">
                      <tab.icon className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-semibold">{tab.label}</div>
                        <div className="text-xs text-gray-400 font-normal">{tab.desc}</div>
                      </div>
                    </div>

                    {/* Animated underline on hover */}
                    <AnimatePresence>
                      {hoveredCard === tab.id && activeTab !== tab.id && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: "80%", opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-full"
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>

              {/* Content Area with Elegant Transitions */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === "text" ? (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="relative">
                        <motion.label 
                          className="block text-sm font-medium text-gray-600 mb-2 ml-1 flex items-center space-x-2"
                          animate={{ x: message ? 5 : 0 }}
                        >
                          <FileText className="w-4 h-4" />
                          <span>Suspicious Message / Text</span>
                        </motion.label>
                        <div className="relative">
                          <textarea
                            placeholder="Paste suspicious message, email, or SMS content here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="6"
                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all resize-none text-gray-700 placeholder-gray-400"
                          />
                          <motion.div
                            className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full"
                            animate={{ opacity: message ? 1 : 0 }}
                          >
                            {message.length} characters
                          </motion.div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={analyzeText}
                        disabled={!message.trim() || loading}
                        className={`relative w-full py-5 rounded-2xl font-semibold text-white overflow-hidden group ${
                          message.trim() && !loading
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 ${
                          message.trim() && !loading ? "group-hover:scale-105" : ""
                        } transition-transform duration-300`}></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
                        <span className="relative flex items-center justify-center space-x-2">
                          <FileSearch className="w-5 h-5" />
                          <span>{loading ? "Analyzing..." : "Analyze Message"}</span>
                          {!loading && <ArrowRight className="w-4 h-4 opacity-70" />}
                        </span>
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="qr"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <motion.div
                        className="relative group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
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
                          <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                            file 
                              ? "border-blue-400 bg-blue-50/30" 
                              : "border-slate-200 hover:border-blue-300 bg-slate-50/30"
                          }`}>
                            <motion.div
                              animate={!file ? floatAnimation : {}}
                              className="mb-4"
                            >
                              {file ? (
                                <FileCheck className="w-16 h-16 mx-auto text-blue-500" />
                              ) : (
                                <QrCode className="w-16 h-16 mx-auto text-gray-400" />
                              )}
                            </motion.div>
                            <p className="text-gray-700 mb-2 font-medium">
                              {file ? file.name : "Click to upload QR code image"}
                            </p>
                            <p className="text-sm text-gray-400">
                              Supports: JPG, PNG, GIF (Max 10MB)
                            </p>
                          </div>
                        </label>
                      </motion.div>

                      {file && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl"
                        >
                          <div className="flex items-center space-x-3">
                            <Upload className="w-5 h-5 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB • {(file.type)}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setFile(null)}
                            className="w-8 h-8 rounded-full bg-white/50 hover:bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={analyzeQR}
                        disabled={!file || loading}
                        className={`relative w-full py-5 rounded-2xl font-semibold text-white overflow-hidden group ${
                          file && !loading
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 ${
                          file && !loading ? "group-hover:scale-105" : ""
                        } transition-transform duration-300`}></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
                        <span className="relative flex items-center justify-center space-x-2">
                          <ScanLine className="w-5 h-5" />
                          <span>{loading ? "Analyzing QR..." : "Analyze QR Code"}</span>
                          {!loading && <ArrowRight className="w-4 h-4 opacity-70" />}
                        </span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Elegant Loading Indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring" }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute"></div>
                        <div className="w-4 h-4 bg-blue-500 rounded-full relative"></div>
                      </div>
                      <span className="font-medium text-gray-700">AI Analysis in Progress</span>
                    </div>
                    <span className="text-sm font-light text-gray-400">{Math.round(progress)}%</span>
                  </div>
                  
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full"
                      style={{
                        boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-3 text-xs text-gray-400">
                    <span>Analyzing patterns</span>
                    <span>Scanning threats</span>
                    <span>Calculating risk</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sophisticated Results Display */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="relative"
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${getRiskGradient(result.risk_level)} opacity-5 rounded-3xl blur-3xl`}></div>
                
                {/* Main Results Card */}
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                  {/* Decorative Header with Risk Color */}
                  <div className={`h-2 bg-gradient-to-r ${getRiskGradient(result.risk_level)}`}></div>
                  
                  <div className="p-8">
                    {/* Header with Risk Indicator */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                      {/* 3D Risk Meter */}
                      <motion.div 
                        className="relative w-48 h-48"
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
                            strokeWidth="6"
                            strokeLinecap="round"
                          />
                          
                          {/* Progress ring with gradient */}
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={`url(#riskGradient-${result.risk_level})`}
                            strokeWidth="6"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0 283" }}
                            animate={{ strokeDasharray: `${(getRiskScore() / 100) * 283} 283` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                          
                          <defs>
                            <linearGradient id={`riskGradient-${result.risk_level}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" className={`stop-color: ${
                                result.risk_level === 'High' ? '#f43f5e' :
                                result.risk_level === 'Medium' ? '#f59e0b' :
                                '#10b981'
                              }`} />
                              <stop offset="100%" className={`stop-color: ${
                                result.risk_level === 'High' ? '#f97316' :
                                result.risk_level === 'Medium' ? '#eab308' :
                                '#14b8a6'
                              }`} />
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
                          <div className={`mb-2 ${getRiskColor(result.risk_level)}`}>
                            {getRiskIcon(result.risk_level)}
                          </div>
                          <span className="text-3xl font-bold" style={{
                            color: result.risk_level === 'High' ? '#f43f5e' :
                                   result.risk_level === 'Medium' ? '#f59e0b' :
                                   '#10b981'
                          }}>
                            {getRiskScore()}%
                          </span>
                          <span className="text-xs text-gray-400">Risk Score</span>
                        </motion.div>
                      </motion.div>

                      {/* Risk Summary */}
                      <div className="flex-1 text-center md:text-left">
                        <motion.div 
                          className="inline-flex items-center px-5 py-2 rounded-full bg-white shadow-lg border border-slate-100 mb-4"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <span className={`w-3 h-3 rounded-full mr-2 animate-pulse ${
                            result.risk_level === 'High' ? 'bg-rose-500' :
                            result.risk_level === 'Medium' ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`}></span>
                          <span className={`font-semibold ${getRiskColor(result.risk_level)}`}>
                            {result.risk_level} RISK LEVEL
                          </span>
                        </motion.div>
                        
                        <motion.h3 
                          className="text-3xl font-light text-gray-800 mb-3"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          Analysis Complete
                        </motion.h3>
                        
                        {result.summary && (
                          <motion.p 
                            className="text-gray-500 leading-relaxed text-lg"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            {result.summary}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Decoded Content (if QR) */}
                    {result.decoded_content && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100"
                      >
                        <div className="flex items-start space-x-3">
                          <Eye className="w-5 h-5 text-blue-500 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Decoded QR Content</p>
                            <p className="text-gray-800 font-mono text-sm break-all">{result.decoded_content}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Detected URLs with Animation */}
                    {result.detected_urls?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mb-8"
                      >
                        <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                          DETECTED URLS
                        </h4>
                        <div className="space-y-3">
                          {result.detected_urls.map((url, index) => (
                            <motion.div
                              key={index}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                              className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                            >
                              <LinkIcon className="w-5 h-5 text-blue-500 mr-3" />
                              <span className="text-sm text-gray-600 break-all flex-1">{url}</span>
                              <motion.a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                whileHover={{ scale: 1.1 }}
                              >
                                <ExternalLink className="w-4 h-4 text-blue-500" />
                              </motion.a>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Recommendations with Elegant Cards */}
                    {result.recommendations?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                          <span className="w-1 h-1 bg-emerald-500 rounded-full mr-2"></span>
                          RECOMMENDATIONS
                        </h4>
                        <div className="grid gap-3">
                          {result.recommendations.map((rec, index) => (
                            <motion.div
                              key={index}
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              className="flex items-start p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100"
                            >
                              <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{rec}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* New Analysis Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="mt-8 text-center"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setResult(null);
                          setMessage("");
                          setFile(null);
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-medium shadow-lg shadow-blue-200 hover:shadow-xl transition-all inline-flex items-center space-x-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span>Analyze New Item</span>
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Elegant Feature Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {[
              { icon: Target, title: "Precision Analysis", desc: "Advanced AI algorithms detect subtle threats", color: "from-blue-500 to-cyan-500" },
              { icon: Zap, title: "Real-time Processing", desc: "Instant results with detailed insights", color: "from-indigo-500 to-blue-500" },
              { icon: Lock, title: "Privacy First", desc: "Your data never leaves your device", color: "from-purple-500 to-pink-500" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-all shadow-sm hover:shadow-xl">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${
                      index === 0 ? 'text-blue-600' :
                      index === 1 ? 'text-indigo-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default RiskAnalyzer;