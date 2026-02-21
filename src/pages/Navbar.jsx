import React, { useState, useEffect } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-white/80 backdrop-blur-sm py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <a href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                <span className="text-white text-2xl">🛡️</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                CyberLex AI
              </span>
              <span className="text-xs text-gray-500 tracking-wider">
                Indian Cyber Law Assistant
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="/legalbot" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
            >
              LegalBot
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            
            <a 
              href="/complaintgen" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
            >
              ComplaintGen
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            
            <a 
              href="/community-intel" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
            >
              Community Intel
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            
            <a 
              href="/riskengine" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
            >
              Risk Engine
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/awareness" className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium relative group">
    Awareness
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
  </a>
            <a 
              href="/analyze" 
              className="ml-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all hover:scale-105 font-medium flex items-center space-x-2"
            >
              <span>Analyze Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 animate-fadeIn">
            <div className="flex flex-col space-y-2">
              <a 
                href="/" 
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              
              <a 
                href="/legalbot" 
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center justify-between"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>LegalBot</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">AI Legal</span>
              </a>
              
              <a 
                href="/complaintgen" 
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center justify-between"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>ComplaintGen</span>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Generator</span>
              </a>
              
              <a 
                href="/community-intel" 
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center justify-between"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Community Intel</span>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">Insights</span>
              </a>
              
              <a 
                href="/risk-engine" 
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center justify-between"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Risk Engine</span>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Analysis</span>
              </a>
              <a href="/awareness" className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium">Awareness</a>
              <div className="pt-2 mt-2 border-t border-gray-100">
                <a 
                  href="/analyze" 
                  className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-center font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Analyze Now
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;