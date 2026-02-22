import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { 
  Scale, 
  FileText, 
  Globe, 
  BarChart3, 
  BookOpen, 
  FileCheck, 
  Gavel, 
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Target,
  Clock,
  ChevronRight,
  MapPin,
  Activity,
  CheckCircle,
  ArrowRight,
  Users,
  Download,
  Search,
  Bell,
  Award,
  Newspaper,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Brain,
  Lock,
  Fingerprint,
  Smartphone,
  Wifi,
  Heart,
  Mail,
  Key,
  RefreshCw,  // Add this line
  Database,
  XCircle
} from "lucide-react";

function HomePage() {
  const [selectedState, setSelectedState] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [animatedStats, setAnimatedStats] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const statsRef = useRef(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedStats(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Threat map data
  const threatStates = [
    { name: "Maharashtra", incidents: 12450, severity: "high", growth: "+12%", coordinates: "19.7515° N, 75.7139° E", trend: "up" },
    { name: "Karnataka", incidents: 9870, severity: "high", growth: "+8%", coordinates: "15.3173° N, 75.7139° E", trend: "up" },
    { name: "Delhi NCR", incidents: 8760, severity: "high", growth: "+15%", coordinates: "28.7041° N, 77.1025° E", trend: "up" },
    { name: "Telangana", incidents: 6540, severity: "medium", growth: "+5%", coordinates: "17.1232° N, 79.2083° E", trend: "stable" },
    { name: "Tamil Nadu", incidents: 5430, severity: "medium", growth: "+3%", coordinates: "11.1271° N, 78.6569° E", trend: "stable" },
    { name: "West Bengal", incidents: 4320, severity: "medium", growth: "-2%", coordinates: "22.9868° N, 87.8550° E", trend: "down" },
    { name: "Uttar Pradesh", incidents: 3980, severity: "low", growth: "+1%", coordinates: "26.8467° N, 80.9462° E", trend: "stable" },
    { name: "Gujarat", incidents: 3210, severity: "low", growth: "-5%", coordinates: "22.2587° N, 71.1924° E", trend: "down" },
  ];

  // All Features
  const allFeatures = [
    {
      icon: Scale,
      title: "LegalBot",
      description: "AI-powered legal assistant for instant cyber law guidance",
      link: "/legalbot",
      color: "from-blue-600 to-indigo-600",
      stats: "98% Accuracy",
      features: ["IT Act 2000", "IPC Sections", "Case References", "Real-time Updates", "Multi-language Support"]
    },
    {
      icon: FileText,
      title: "ComplaintGen",
      description: "Generate formatted cyber complaints for police and cyber cells",
      link: "/complaintgen",
      color: "from-emerald-600 to-teal-600",
      stats: "10K+ Generated",
      features: ["Auto-formatting", "Legal Language", "PDF Export", "Multiple Templates", "Track Status"]
    },
    {
      icon: Globe,
      title: "Community Intel",
      description: "Real-time threat intelligence from community reports",
      link: "/community-intel",
      color: "from-purple-600 to-pink-600",
      stats: "Live Feed",
      features: ["Trend Analysis", "Heat Maps", "Alerts", "Report Scams", "Threat Leaderboard"]
    },
    {
      icon: BarChart3,
      title: "Risk Engine",
      description: "Advanced risk assessment for organizations and individuals",
      link: "/risk-engine",
      color: "from-orange-600 to-red-600",
      stats: "Enterprise Grade",
      features: ["Risk Scoring", "Compliance Check", "Audit Trail", "URL Scanning", "QR Analysis"]
    },
    {
      icon: Newspaper,
      title: "News",
      description: "Latest cybersecurity news and updates",
      link: "/news",
      color: "from-red-600 to-rose-600",
      stats: "24/7 Updates",
      badge: "NEW",
      features: ["Cyber Alerts", "Data Breaches", "Legal Updates", "Expert Analysis", "Daily Digest"]
    },
    {
      icon: Gamepad2,
      title: "Awareness Game",
      description: "Interactive cybersecurity training through gaming",
      link: "/cyberquest",
      color: "from-cyan-600 to-blue-600",
      stats: "Play & Learn",
      features: ["Phishing Quiz", "Password Lab", "Social Engineering", "MFA Training", "Earn Badges"]
    }
  ];

  // Resources
  const resources = [
    {
      title: "IT Act 2000 Complete Guide",
      description: "Comprehensive guide to Information Technology Act with amendments",
      icon: BookOpen,
      readTime: "15 min",
      category: "Legal"
    },
    {
      title: "Cyber Crime Reporting Handbook",
      description: "Step-by-step guide to filing cyber complaints effectively",
      icon: FileCheck,
      readTime: "10 min",
      category: "Guide"
    },
    {
      title: "Latest Cyber Law Judgments",
      description: "Important Supreme Court and High Court judgments on cyber crimes",
      icon: Gavel,
      readTime: "20 min",
      category: "Case Law"
    },
    {
      title: "Data Protection Guidelines",
      description: "Best practices for data protection under Indian laws",
      icon: Shield,
      readTime: "12 min",
      category: "Compliance"
    }
  ];

  // Training Modules Preview
  const trainingModules = [
    { name: "Phishing Attacks", icon: Mail, completed: 65, color: "blue" },
    { name: "Password Security", icon: Key, completed: 40, color: "indigo" },
    { name: "Social Engineering", icon: Users, completed: 25, color: "purple" },
    { name: "Public WiFi Safety", icon: Wifi, completed: 15, color: "cyan" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 overflow-x-hidden">
      <Navbar />

      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Animated gradient orbs */}
        <div 
          className="absolute top-20 -left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        ></div>
        <div 
          className="absolute bottom-20 -right-20 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"
          style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
        ></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Animated badge */}
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-blue-100 animate-slideIn">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <span className="text-sm font-medium text-blue-800">Trusted by 50,000+ users</span>
              </div>

              {/* Main heading with gradient */}
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Your Shield in the
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                  Digital World
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                AI-powered legal assistant specializing in Indian cyber laws. 
                Get instant analysis, generate complaints, and stay ahead of threats.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="/legalbot"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-semibold overflow-hidden shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </a>

                <a
                  href="#features"
                  className="px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
                >
                  Explore Features
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold animate-pulse-slow" style={{ animationDelay: `${i * 200}ms` }}>
                      <Users className="w-4 h-4" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold text-slate-900">10,000+</span>
                  <span className="text-slate-500"> incidents resolved</span>
                </div>
              </div>
            </div>

            {/* Right Column - Dashboard Preview */}
            <div className="relative animate-float-slow">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
                {/* Dashboard header */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-400 ml-2">cyberrak shak.ai/dashboard</span>
                </div>

                {/* Live stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl animate-pulse-slow">
                    <div>
                      <span className="text-sm text-slate-500">Active Threats</span>
                      <div className="text-2xl font-bold text-slate-900">247</div>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <span className="text-sm text-slate-500">Cases Today</span>
                      <div className="text-xl font-bold text-slate-900">1,892</div>
                      <span className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12%
                      </span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <span className="text-sm text-slate-500">Resolved</span>
                      <div className="text-xl font-bold text-slate-900">156</div>
                      <span className="text-xs text-blue-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Today
                      </span>
                    </div>
                  </div>

                  {/* Mini threat map */}
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-700">Live Threat Map</span>
                      <span className="text-xs text-blue-600 flex items-center">
                        <Activity className="w-3 h-3 mr-1" />
                        Updated now
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {['Mumbai', 'Delhi', 'Bangalore', 'Chennai'].map((city, i) => (
                        <div key={i} className="text-center">
                          <div className={`h-2 w-full rounded-full mb-1 ${
                            i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : i === 2 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <span className="text-xs text-slate-500">{city}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Features Section */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Complete Ecosystem</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-4 mb-6">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-slate-600">
              Eight powerful tools designed to protect you in the digital space
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <a
                  key={index}
                  href={feature.link}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden animate-fadeInUp border border-gray-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      {feature.badge && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                          {feature.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors flex items-center">
                      {feature.title}
                      <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    
                    <p className="text-slate-600 mb-4 text-sm">
                      {feature.description}
                    </p>

                    {/* Features list - show first 3 */}
                    <div className="space-y-1.5 mb-4">
                      {feature.features.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center text-xs text-slate-500">
                          <CheckCircle className="w-3 h-3 text-blue-500 mr-1.5 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                      {feature.features.length > 3 && (
                        <div className="text-xs text-blue-600 mt-1">+{feature.features.length - 3} more</div>
                      )}
                    </div>

                    {/* Stats badge */}
                    <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                      {feature.stats}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
{/* PhishGuard Extension Section */}
<section className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
  <div className="relative max-w-7xl mx-auto px-6">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left Column - Info */}
      <div className="space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="text-sm font-medium text-blue-700">Free Browser Extension</span>
        </div>

        {/* Title */}
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
          Introducing{' '}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            PhishGuard
          </span>
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 leading-relaxed">
          Automatically scans every website you visit and tells you whether it's safe, suspicious, or dangerous — before you enter any personal information.
        </p>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-2">
          {[
            "Real-time scanning", 
            "Silent operation", 
            "SSL check", 
            "Domain analysis", 
            "Phishing detection", 
            "Malware protection"
          ].map((feature, i) => (
            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200">
              {feature}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <a
            href="/phishguard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 hover:scale-105"
          >
            <Zap className="w-5 h-5 mr-2" />
            Add PhishGuard to Browser
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
          <p className="text-gray-400 text-xs mt-2">Free • Chrome • Firefox • Edge • Brave</p>
        </div>
      </div>

      {/* Right Column - Simple Preview Card */}
      <div className="relative flex justify-center">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-[300px]">
          {/* Browser Chrome */}
          <div className="bg-gray-100 px-4 py-3 flex items-center border-b border-gray-200">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex-1 mx-3 bg-white border border-gray-200 rounded-md px-3 py-1.5 flex items-center text-xs">
              <Lock className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
              <span className="text-gray-600 font-medium truncate">testphp.vulnweb.com</span>
            </div>
            <Shield className="w-5 h-5 text-blue-600" />
          </div>

          {/* Extension Preview - Simple Version */}
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-gray-800">PHISHGUARD</span>
              </div>
              <span className="text-xs text-gray-500">v1.0</span>
            </div>

            {/* URL with Score */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 truncate">testphp.vulnweb.com</span>
                <span className="text-sm font-bold text-orange-600">42/100</span>
              </div>
              <div className="flex items-center text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                <span className="font-medium">SUSPICIOUS</span>
                <span className="ml-1 text-orange-600">— Do not enter sensitive info</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="text-center">
                <div className="text-[10px] text-gray-500">HTTPS</div>
                <div className="text-xs font-bold text-red-600">None</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-500">FORMS</div>
                <div className="text-xs font-bold text-green-600">0</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-500">LINKS</div>
                <div className="text-xs font-bold text-orange-600">7</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-500">IFRAMES</div>
                <div className="text-xs font-bold text-green-600">0</div>
              </div>
            </div>

            {/* Database Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <Shield className="w-3.5 h-3.5 text-red-500 mr-1.5" />
                  <span>URLhaus Malware</span>
                </div>
                <span className="text-green-600 text-[10px] bg-green-50 px-1.5 py-0.5 rounded">✓ Clean</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <Globe className="w-3.5 h-3.5 text-orange-500 mr-1.5" />
                  <span>OpenPhish</span>
                </div>
                <span className="text-green-600 text-[10px] bg-green-50 px-1.5 py-0.5 rounded">✓ Not found</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <Lock className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                  <span>SSL Certificate</span>
                </div>
                <span className="text-red-600 text-[10px] bg-red-50 px-1.5 py-0.5 rounded">✗ Missing</span>
              </div>
            </div>

            {/* Rescan Button */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                <RefreshCw className="w-3 h-3 mr-1" />
                Rescan
              </button>
            </div>
          </div>
        </div>

        {/* Browser Compatibility */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
          {["Chrome", "Firefox", "Edge", "Brave"].map((browser, i) => (
            <span key={i} className="text-xs text-gray-600">{browser}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
      {/* Training Modules Preview */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Interactive Learning</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">
                Cyber Awareness Game
              </h2>
              <p className="text-lg text-slate-600 mt-2">Learn cybersecurity through fun, interactive challenges</p>
            </div>
            <a 
              href="/cyberquest" 
              className="flex items-center text-blue-600 font-semibold hover:text-blue-700 group"
            >
              Enter Game Hub
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trainingModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-${module.color}-100 flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 text-${module.color}-600`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{module.name}</h4>
                      <p className="text-xs text-gray-500">{module.completed}% complete</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-${module.color}-500`}
                      style={{ width: `${module.completed}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Game Features */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Target, label: "15+ Modules" },
              { icon: Award, label: "10 Badges" },
              { icon: Zap, label: "Daily Streaks" },
              { icon: Brain, label: "Skill-Based" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <item.icon className="w-4 h-4 text-blue-600" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Threat Map Section */}
      <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Map Legend */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Real-time Intelligence</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-4 mb-6">
                  India Cyber Threat Map
                </h2>
                <p className="text-lg text-slate-600">
                  Live visualization of cyber crime incidents across Indian states with severity analysis
                </p>
              </div>

              {/* Severity Legend */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="font-semibold text-slate-900 mb-4">Severity Levels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-slate-700">High Risk</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">3 States</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="text-slate-700">Medium Risk</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">3 States</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-slate-700">Low Risk</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">2 States</span>
                  </div>
                </div>
              </div>

              {/* Selected State Info */}
              {selectedState && (
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white animate-slideIn">
                  <h4 className="text-lg font-semibold mb-2">{selectedState.name}</h4>
                  <div className="text-3xl font-bold mb-1">{selectedState.incidents.toLocaleString()}</div>
                  <p className="text-white/80 mb-4">Reported Incidents</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Growth: {selectedState.growth}</span>
                    <span className={`px-3 py-1 rounded-full flex items-center ${
                      selectedState.trend === 'up' ? 'bg-red-400/30' :
                      selectedState.trend === 'down' ? 'bg-green-400/30' : 'bg-yellow-400/30'
                    }`}>
                      {selectedState.trend === 'up' ? (
                        <><TrendingUp className="w-3 h-3 mr-1" /> Rising</>
                      ) : selectedState.trend === 'down' ? (
                        <><TrendingDown className="w-3 h-3 mr-1" /> Falling</>
                      ) : (
                        <><Minus className="w-3 h-3 mr-1" /> Stable</>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Map Container */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
                <div className="relative aspect-square max-w-2xl mx-auto">
                  {/* India Map SVG with enhanced animations */}
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    {/* Base map */}
                    <rect width="400" height="400" fill="#f1f5f9" rx="8" />
                    
                    {/* State markers with animations */}
                    {threatStates.map((state, index) => {
                      const positions = [
                        { x: 180, y: 120 }, // Maharashtra
                        { x: 220, y: 140 }, // Karnataka
                        { x: 210, y: 80 },  // Delhi NCR
                        { x: 240, y: 160 }, // Telangana
                        { x: 240, y: 200 }, // Tamil Nadu
                        { x: 270, y: 110 }, // West Bengal
                        { x: 230, y: 70 },  // Uttar Pradesh
                        { x: 150, y: 100 }, // Gujarat
                      ];
                      
                      const severityColors = {
                        high: "#ef4444",
                        medium: "#eab308",
                        low: "#22c55e"
                      };
                      
                      return (
                        <g key={index} className="cursor-pointer" onClick={() => setSelectedState(state)}>
                          {/* Pulsing effect */}
                          <circle 
                            cx={positions[index].x} 
                            cy={positions[index].y} 
                            r={state.severity === 'high' ? 20 : state.severity === 'medium' ? 16 : 12}
                            fill="none"
                            stroke={severityColors[state.severity]}
                            strokeWidth="2"
                            className="animate-ping-slow"
                            opacity="0.3"
                          />
                          
                          {/* Main marker */}
                          <circle 
                            cx={positions[index].x} 
                            cy={positions[index].y} 
                            r={state.severity === 'high' ? 12 : state.severity === 'medium' ? 10 : 8}
                            fill={severityColors[state.severity]}
                            className="hover:r-16 transition-all duration-300 filter drop-shadow-lg"
                          />
                          
                          {/* Inner glow */}
                          <circle 
                            cx={positions[index].x} 
                            cy={positions[index].y} 
                            r={state.severity === 'high' ? 6 : state.severity === 'medium' ? 5 : 4}
                            fill="white"
                            className="animate-pulse"
                            opacity="0.8"
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* State List */}
                <div className="mt-8 grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {threatStates.map((state, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedState?.name === state.name 
                          ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200' 
                          : 'hover:bg-slate-50 border-transparent'
                      } border`}
                      onClick={() => setSelectedState(state)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          state.severity === 'high' ? 'bg-red-500' :
                          state.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="font-medium text-slate-700">{state.name}</span>
                      </div>
                      <span className="text-sm text-slate-500">{state.incidents.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Knowledge Base</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-4 mb-6">
              Legal Resources & Guides
            </h2>
            <p className="text-xl text-slate-600">
              Comprehensive information to help you understand cyber laws
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <a
                  key={index}
                  href="#"
                  className="group relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-500 animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                  
                  <div className="relative">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-10 h-10 text-blue-600" />
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {resource.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {resource.readTime}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {resource.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 mb-4">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      Read More
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section with Counters */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Cases Analyzed", icon: BarChart3, suffix: "" },
              { number: "24/7", label: "Availability", icon: Zap, suffix: "" },
              { number: "15+", label: "Cyber Laws", icon: Gavel, suffix: "" },
              { number: "98", label: "Accuracy Rate", icon: Target, suffix: "%" }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center text-white">
                  <div className="flex justify-center mb-3 animate-bounce-slow" style={{ animationDelay: `${index * 200}ms` }}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold mb-2">
                    {animatedStats ? stat.number : "0"}
                    {stat.suffix}
                  </div>
                  <div className="text-white/80 text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-3xl opacity-10"></div>
            
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-16 shadow-2xl">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Protect Yourself?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Get instant legal guidance, generate professional complaints, and test your knowledge with our interactive game
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="/legalbot"
                  className="group px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center">
                    Start Free Analysis
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
                
                <a
                  href="/cyberquest"
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Play Awareness Game
                </a>
              </div>

              {/* Quick links to all features */}
              <div className="mt-12 pt-12 border-t border-white/10">
                <p className="text-white/60 text-sm mb-4">Explore all features:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {allFeatures.map((feature, index) => (
                    <a
                      key={index}
                      href={feature.link}
                      className="text-white/80 hover:text-white text-sm px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center"
                    >
                      <feature.icon className="w-3 h-3 mr-1" />
                      {feature.title}
                      {feature.badge && (
                        <span className="ml-1 px-1 text-[10px] bg-red-500 text-white rounded-full">NEW</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">CyberRakshak</span>
              </div>
              <p className="text-sm text-gray-600">
                Your comprehensive platform for cyber law assistance, threat intelligence, and digital safety.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                {allFeatures.map((feature, index) => (
                  <li key={index}>
                    <a href={feature.link} className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                      <feature.icon className="w-4 h-4 mr-2" />
                      {feature.title}
                      {feature.badge && (
                        <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">NEW</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">IT Act 2000 Guide</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Cyber Crime Handbook</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Legal Judgments</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Data Protection</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Disclaimer</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} CyberRakshak. All rights reserved. Made for digital safety in India.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-2deg); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping-slow {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        .animate-fadeInUp {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default HomePage;