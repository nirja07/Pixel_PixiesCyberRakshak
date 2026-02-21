import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";

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

  // Action cards
  const actionCards = [
    {
      icon: "⚖️",
      title: "LegalBot",
      description: "AI-powered legal assistant for instant cyber law guidance",
      link: "/legalbot",
      color: "from-blue-600 to-indigo-600",
      stats: "98% Accuracy",
      features: ["IT Act 2000", "IPC Sections", "Case References"]
    },
    {
      icon: "📄",
      title: "ComplaintGen",
      description: "Generate formatted cyber complaints for police and cyber cells",
      link: "/complaintgen",
      color: "from-emerald-600 to-teal-600",
      stats: "10K+ Generated",
      features: ["Auto-formatting", "Legal Language", "PDF Export"]
    },
    {
      icon: "🌐",
      title: "Community Intel",
      description: "Real-time threat intelligence from community reports",
      link: "/community-intel",
      color: "from-purple-600 to-pink-600",
      stats: "Live Feed",
      features: ["Trend Analysis", "Heat Maps", "Alerts"]
    },
    {
      icon: "📊",
      title: "Risk Engine",
      description: "Advanced risk assessment for organizations and individuals",
      link: "/risk-engine",
      color: "from-orange-600 to-red-600",
      stats: "Enterprise Grade",
      features: ["Risk Scoring", "Compliance Check", "Audit Trail"]
    }
  ];

  // Resources
  const resources = [
    {
      title: "IT Act 2000 Complete Guide",
      description: "Comprehensive guide to Information Technology Act with amendments",
      icon: "📚",
      readTime: "15 min",
      category: "Legal"
    },
    {
      title: "Cyber Crime Reporting Handbook",
      description: "Step-by-step guide to filing cyber complaints effectively",
      icon: "📝",
      readTime: "10 min",
      category: "Guide"
    },
    {
      title: "Latest Cyber Law Judgments",
      description: "Important Supreme Court and High Court judgments on cyber crimes",
      icon: "⚖️",
      readTime: "20 min",
      category: "Case Law"
    },
    {
      title: "Data Protection Guidelines",
      description: "Best practices for data protection under Indian laws",
      icon: "🔒",
      readTime: "12 min",
      category: "Compliance"
    }
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
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
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
                      {i}
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
                  <span className="text-sm text-slate-400 ml-2">cyberlex.ai/dashboard</span>
                </div>

                {/* Live stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl animate-pulse-slow">
                    <div>
                      <span className="text-sm text-slate-500">Active Threats</span>
                      <div className="text-2xl font-bold text-slate-900">247</div>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚠️</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <span className="text-sm text-slate-500">Cases Today</span>
                      <div className="text-xl font-bold text-slate-900">1,892</div>
                      <span className="text-xs text-green-600">+12%</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <span className="text-sm text-slate-500">Resolved</span>
                      <div className="text-xl font-bold text-slate-900">156</div>
                      <span className="text-xs text-blue-600">Today</span>
                    </div>
                  </div>

                  {/* Mini threat map */}
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-700">Live Threat Map</span>
                      <span className="text-xs text-blue-600">Updated now</span>
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

      {/* Features Section */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Our Solutions</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-4 mb-6">
              Comprehensive Cyber Law Platform
            </h2>
            <p className="text-xl text-slate-600">
              Four powerful tools designed to protect you in the digital space
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {actionCards.map((card, index) => (
              <a
                key={index}
                href={card.link}
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden animate-fadeInUp"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {card.icon}
                    </div>
                    <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                      {card.stats}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Features list */}
                  <div className="space-y-2 mb-6">
                    {card.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-slate-500">
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Arrow link */}
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Access Tool</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Decorative element */}
                <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-r ${card.color} opacity-10 rounded-tl-full group-hover:scale-150 transition-transform duration-500`}></div>
              </a>
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
                    <span className={`px-3 py-1 rounded-full ${
                      selectedState.trend === 'up' ? 'bg-red-400/30' :
                      selectedState.trend === 'down' ? 'bg-green-400/30' : 'bg-yellow-400/30'
                    }`}>
                      {selectedState.trend === 'up' ? '↑ Rising' : selectedState.trend === 'down' ? '↓ Falling' : '→ Stable'}
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
            {resources.map((resource, index) => (
              <a
                key={index}
                href="#"
                className="group relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-500 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                
                <div className="relative">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {resource.icon}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {resource.category}
                    </span>
                    <span className="text-xs text-slate-400">{resource.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 mb-4">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    Read More
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Counters */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Cases Analyzed", icon: "📊", suffix: "" },
              { number: "24/7", label: "Availability", icon: "⚡", suffix: "" },
              { number: "15+", label: "Cyber Laws", icon: "⚖️", suffix: "" },
              { number: "98", label: "Accuracy Rate", icon: "🎯", suffix: "%" }
            ].map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl mb-3 animate-bounce-slow" style={{ animationDelay: `${index * 200}ms` }}>
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold mb-2">
                  {animatedStats ? stat.number : "0"}
                  {stat.suffix}
                </div>
                <div className="text-white/80 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
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
                Get instant legal guidance and generate professional complaints with our AI-powered platform
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="/legalbot"
                  className="group px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center">
                    Start Free Analysis
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </a>
                
                <a
                  href="#resources"
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all"
                >
                  Explore Resources
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

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