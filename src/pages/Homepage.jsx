import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    {
      question: "How does the AI legal analysis work?",
      answer: "Our AI analyzes your incident description using advanced NLP algorithms trained on Indian cyber laws, including IT Act 2000, IPC sections, and relevant case laws to provide accurate legal guidance."
    },
    {
      question: "Is my data secure and confidential?",
      answer: "Yes, all communications are encrypted using AES-256 encryption. We don't store your incident descriptions, and all analysis is done in real-time without saving any personal data."
    },
    {
      question: "Which cyber laws does it cover?",
      answer: "The system covers IT Act 2000, Indian Penal Code sections related to cyber crimes, Information Technology Rules, and various cyber crime guidelines issued by Indian courts."
    },
    {
      question: "Can I use this for legal proceedings?",
      answer: "This tool is for informational purposes only. While we strive for accuracy, please consult a qualified lawyer for official legal advice or proceedings."
    }
  ];

  const stats = [
    { number: "50K+", label: "Incidents Analyzed", icon: "📊" },
    { number: "24/7", label: "Availability", icon: "⚡" },
    { number: "99.9%", label: "Accuracy Rate", icon: "🎯" },
    { number: "15+", label: "Cyber Laws Covered", icon: "⚖️" }
  ];

  const features = [
    {
      icon: "🔍",
      title: "Instant Analysis",
      description: "Get immediate legal analysis of your cyber incident with relevant IT Act sections and IPC codes.",
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: "🛡️",
      title: "Evidence Guidance",
      description: "Receive detailed checklist of evidence required for filing cyber complaints and legal proceedings.",
      color: "from-indigo-400 to-blue-400"
    },
    {
      icon: "⚡",
      title: "Preventive Measures",
      description: "Learn step-by-step actions to protect yourself and prevent further cyber threats.",
      color: "from-cyan-400 to-teal-400"
    },
    {
      icon: "📋",
      title: "Legal References",
      description: "Get exact sections and acts applicable to your case with confidence scores.",
      color: "from-blue-400 to-indigo-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                <span className="text-white text-xl">⚖️</span>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                CyberLex AI
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
              <Link 
                to="/analyze" 
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all hover:scale-105"
              >
                Try Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block animate-float">
              <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></span>
                AI-Powered Legal Assistant
              </span>
            </div>
            
            <h1 className="mt-8 text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Your Intelligent Guide to
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Indian Cyber Laws
              </span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              Instantly analyze cyber incidents, understand applicable laws, and get actionable guidance powered by advanced AI.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analyze"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-medium overflow-hidden shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Analyze Your Case
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </Link>
              
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-medium border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all"
              >
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Powerful Features for
              <span className="block text-blue-600">Cyber Legal Analysis</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to understand and act on cyber incidents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
                <div className="relative">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Three simple steps to get your legal analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Describe Incident",
                description: "Write about the cyber incident you've experienced in detail",
                icon: "📝"
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our AI analyzes your case against Indian cyber laws",
                icon: "🤖"
              },
              {
                step: "03",
                title: "Get Guidance",
                description: "Receive applicable laws, evidence checklist, and preventive measures",
                icon: "🎯"
              }
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-3xl transform group-hover:rotate-6 transition-transform shadow-lg">
                    {item.icon}
                  </div>
                  <div className="mt-6">
                    <span className="text-blue-600 font-mono text-sm">{item.step}</span>
                    <h3 className="text-xl font-semibold text-gray-800 mt-2">{item.title}</h3>
                    <p className="text-gray-600 mt-3">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to know about CyberLex AI
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-blue-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-blue-600 transform transition-transform ${
                      activeFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    activeFaq === index ? 'py-4 bg-blue-50/50' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Analyze Your Case?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Get instant legal guidance for your cyber incident
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-medium shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Start Free Analysis
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⚖️</span>
              </div>
              <span className="text-gray-700 font-semibold">CyberLex AI</span>
            </div>
            
            <div className="text-sm text-gray-500">
              © 2024 CyberLex AI. All rights reserved.
            </div>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default HomePage;