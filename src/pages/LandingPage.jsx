// src/pages/LandingPage.jsx
import { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  ArrowRight, 
  ChevronDown,
  Sparkles,
  Zap,
  Globe2,
  Lock,
  Users,
  Award,
  TrendingUp,
  Clock,
  MessageSquare,
  FileText,
  Scale,
  BarChart3,
  Newspaper,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Menu,
  X,
  Play,
  Pause,
  CheckCircle,
  Target,
  Rocket,
  Cpu,
  Network,
  Brain,
  Fingerprint,
  BellRing,
  ShieldAlert,
  Star,
  Landmark
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    complaints: 0,
    protection: 0,
    satisfaction: 0
  });
  const [typingText, setTypingText] = useState('');
  const [showNotification, setShowNotification] = useState(true);
  
  const fullText = "AI-Powered Cyber Law Assistant";

  // Mouse move parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typing animation
  useEffect(() => {
    if (typingText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypingText(fullText.slice(0, typingText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [typingText]);

  // Auto-hide notification
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  // Scroll animation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'features', 'how-it-works', 'solutions'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Counter animation
  useEffect(() => {
    const targets = {
      users: 50000,
      complaints: 15000,
      protection: 99.9,
      satisfaction: 98
    };

    const duration = 2000;
    const steps = 60;
    const increment = {};
    
    Object.keys(targets).forEach(key => {
      increment[key] = targets[key] / steps;
    });

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps) {
        setCounts(prev => ({
          users: Math.min(Math.round(prev.users + increment.users), targets.users),
          complaints: Math.min(Math.round(prev.complaints + increment.complaints), targets.complaints),
          protection: Math.min(Number((prev.protection + increment.protection).toFixed(1)), targets.protection),
          satisfaction: Math.min(Math.round(prev.satisfaction + increment.satisfaction), targets.satisfaction)
        }));
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Live Notification */}
      <div className={`fixed top-24 right-4 z-50 transition-all duration-500 transform ${
        showNotification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="bg-white rounded-lg shadow-2xl border-l-4 border-green-500 p-4 flex items-start space-x-3 max-w-sm">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <BellRing className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">New threat detected!</p>
            <p className="text-xs text-gray-500 mt-1">12 users protected in last 5 mins</p>
          </div>
          <button 
            onClick={() => setShowNotification(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  CyberRakshak
                </span>
                <span className="block text-xs text-gray-500">
                  {typingText}<span className="animate-pulse">|</span>
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'How It Works', 'Solutions'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className={`text-sm font-medium transition-all relative group ${
                    activeSection === item.toLowerCase().replace(' ', '-') 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 ${
                    activeSection === item.toLowerCase().replace(' ', '-') ? 'w-full' : ''
                  }`}></span>
                </button>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-200 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2 px-4 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2 px-4 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('solutions')}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2 px-4 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Solutions
                </button>
                <div className="pt-2 flex flex-col space-y-2 px-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2 text-center border border-gray-200 rounded-lg hover:border-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl text-sm font-medium text-center hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-cyan-50"></div>
          
          {/* Parallax Shapes */}
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
            }}
          ></div>
          <div 
            className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            style={{
              transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            style={{
              transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * -0.4}px)`
            }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-bounce" style={{ animationDuration: '3s' }}>
            <Cpu className="w-8 h-8 text-blue-400/30" />
          </div>
          <div className="absolute top-3/4 right-1/4 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <Network className="w-12 h-12 text-cyan-400/30" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}>
            <Brain className="w-10 h-10 text-purple-400/30" />
          </div>
          <div className="absolute top-1/2 right-1/3 animate-spin" style={{ animationDuration: '10s' }}>
            <Fingerprint className="w-8 h-8 text-green-400/30" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-100 shadow-lg mb-8">
            <Sparkles className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              India's First AI-Powered Cyber Law Assistant
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Protect Your Digital
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Rights with AI
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Experience the future of cyber law assistance. Get instant legal guidance, 
            file complaints, and protect yourself from cyber threats with our 
            <span className="text-blue-600 font-semibold mx-2">
              AI-powered platform
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/signup"
              className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-2xl hover:shadow-blue-200 transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="group bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-full text-lg font-medium hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center space-x-3 border border-gray-200"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-blue-600" />
              ) : (
                <Play className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              )}
              <span>{isPlaying ? 'Pause Demo' : 'Watch Demo'}</span>
            </button> */}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Active Users', value: counts.users, icon: Users, suffix: '+' },
              { label: 'Complaints Filed', value: counts.complaints, icon: FileText, suffix: '+' },
              { label: 'Protection Rate', value: counts.protection, icon: Shield, suffix: '%' },
              { label: 'Satisfaction', value: counts.satisfaction, icon: Star, suffix: '%' }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`transform transition-all duration-300 ${
                  hoveredFeature === index ? 'scale-110' : ''
                }`}>
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 transition-colors ${
                    hoveredFeature === index ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => scrollToSection('features')}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 group"
        >
          <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors animate-bounce" />
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools to protect yourself in the digital world
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "AI LegalBot",
                description: "24/7 AI-powered legal assistance with natural language processing",
                link: "/legalbot",
                color: "from-blue-500 to-blue-600",
                stats: "98% accuracy"
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Complaint Generator",
                description: "Auto-generate cyber complaints in minutes with smart templates",
                link: "/complaintgen",
                color: "from-cyan-500 to-cyan-600",
                stats: "5min avg"
              },
              {
                icon: <Globe2 className="w-8 h-8" />,
                title: "Community Intel",
                description: "Real-time threat intelligence from 50k+ community members",
                link: "/community",
                color: "from-purple-500 to-purple-600",
                stats: "Live feed"
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Risk Engine",
                description: "AI-powered risk assessment with predictive analytics",
                link: "/riskengine",
                color: "from-orange-500 to-orange-600",
                stats: "99.9% accurate"
              },
              {
                icon: <Newspaper className="w-8 h-8" />,
                title: "Cyber News",
                description: "Stay updated with real-time cyber law developments",
                link: "/news",
                color: "from-red-500 to-red-600",
                stats: "24/7 updates"
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Awareness Hub",
                description: "Interactive educational resources for cyber safety",
                link: "/awareness",
                color: "from-green-500 to-green-600",
                stats: "100+ modules"
              },
              {
                icon: <Landmark className="w-8 h-8" />,
                title: "Bank Crack",
                description: "Master secure banking practices and financial protection",
                link: "/bankfraudtools",
                color: "from-amber-500 to-yellow-500",
                stats: "8 scenarios",
              }
            ].map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Badge */}
                {feature.badge && (
                  <span className="absolute top-4 left-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse z-10">
                    {feature.badge}
                  </span>
                )}
                
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-all duration-300`}>
                  {feature.icon}
                </div>

                {/* Stats badge */}
                <div className="absolute top-4 right-4 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  {feature.stats}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                
                {/* Arrow */}
                <span className="text-blue-600 font-medium flex items-center space-x-2 group-hover:space-x-3 transition-all">
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-cyan-100 px-4 py-2 rounded-full mb-4">
              <Rocket className="w-4 h-4 text-cyan-600" />
              <span className="text-sm font-medium text-cyan-600">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Get Protected in 3 Steps
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start your journey to digital safety today
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up for free in under 2 minutes",
                icon: <Users className="w-12 h-12" />,
                color: "from-blue-500 to-cyan-500",
                link: "/signup",
                features: ["Free forever", "No credit card", "Instant access"]
              },
              {
                step: "02",
                title: "Describe Your Issue",
                description: "Tell us about your cyber law concern",
                icon: <MessageSquare className="w-12 h-12" />,
                color: "from-cyan-500 to-purple-500",
                link: "/legalbot",
                features: ["AI analysis", "Smart suggestions", "Legal insights"]
              },
              {
                step: "03",
                title: "Get Solutions",
                description: "Receive AI-powered guidance instantly",
                icon: <Zap className="w-12 h-12" />,
                color: "from-purple-500 to-pink-500",
                link: "/analyze",
                features: ["Instant response", "Actionable steps", "24/7 support"]
              }
            ].map((item, index) => (
              <div
                key={index}
                className="relative text-center group"
              >
                {/* Step Number */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    {item.step}
                  </div>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 mt-6 relative overflow-hidden">
                  {/* Background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Icon */}
                  <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-all duration-300`}>
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{item.description}</p>

                  {/* Feature list */}
                  <ul className="space-y-2 mb-6 text-left">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Link
                    to={item.link}
                    className="inline-flex items-center text-blue-600 font-medium group/btn"
                  >
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Comprehensive Protection
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored solutions for every cyber security need
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "For Individuals",
                description: "Protect your personal data and digital identity",
                icon: <Shield className="w-8 h-8" />,
                features: ["Personal data protection", "Identity theft prevention", "Cyber crime reporting", "Legal guidance"],
                color: "from-blue-500 to-cyan-500",
                link: "/signup"
              },
              {
                title: "For Businesses",
                description: "Enterprise-grade security for your organization",
                icon: <Network className="w-8 h-8" />,
                features: ["Compliance management", "Employee training", "Risk assessment", "Incident response"],
                color: "from-purple-500 to-pink-500",
                link: "/business"
              }
            ].map((solution, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${solution.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-all duration-300`}>
                  {solution.icon}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {solution.title}
                </h3>
                <p className="text-gray-600 mb-6">{solution.description}</p>

                {/* Features list */}
                <ul className="space-y-3 mb-8">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={solution.link}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 group/btn"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Secure Your Digital Life?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join 50,000+ users who trust CyberRakshak for their cyber law needs
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="group bg-white text-blue-600 px-10 py-5 rounded-full text-lg font-medium hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <span>Get Started Free</span>
              <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            
            <Link
              to="/legalbot"
              className="group border-2 border-white text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-white/10 transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <span>Try Demo</span>
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {['ISO Certified', '256-bit Encryption', 'GDPR Compliant', 'Made in India'].map((badge, i) => (
              <div key={i} className="flex items-center space-x-2 text-sm text-white/80">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold">CyberRakshak</span>
              </div>
              <p className="text-gray-400 text-sm">
                India's premier AI-powered cyber law assistant, protecting digital rights since 2024.
              </p>
              <div className="flex space-x-4 pt-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/legalbot" className="hover:text-white transition-colors">LegalBot</Link></li>
                <li><Link to="/complaintgen" className="hover:text-white transition-colors">ComplaintGen</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Community Intel</Link></li>
                <li><Link to="/riskengine" className="hover:text-white transition-colors">Risk Engine</Link></li>
                <li><Link to="/news" className="hover:text-white transition-colors">Cyber News</Link></li>
                <li><Link to="/bank-crack" className="hover:text-white transition-colors">Bank Crack</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">Stay updated with the latest in cyber law</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-r-lg hover:shadow-lg transition-all">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 CyberRakshak. All rights reserved. Made in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;