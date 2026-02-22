import React, { useState, useEffect } from "react";
import {
  Shield,
  Menu,
  X,
  ArrowRight,
  Home,
  Scale,
  FileText,
  Globe,
  BarChart3,
  Zap,
  BookOpen,
  Newspaper,
  LogOut,
  User
} from "lucide-react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Listen to auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white/80 backdrop-blur-sm py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <a href="/homepage" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-md shadow-blue-200 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                CyberRakshak
              </span>
              <span className="text-[10px] text-gray-500 tracking-wider leading-tight">
                Indian Cyber Law Assistant
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <a
              href="/legalbot"
              className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium relative group whitespace-nowrap"
            >
              LegalBot
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>

            <a
              href="/complaintgen"
              className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium relative group whitespace-nowrap"
            >
              ComplaintGen
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>

            <a href="/community" className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium relative group whitespace-nowrap">
              Community Intel
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            
            <a 
              href="/riskengine" 
              className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium relative group whitespace-nowrap"
            >
              Risk Engine
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>

            {/* News Tab */}
            <a 
              href="/news" 
              className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium relative group flex items-center whitespace-nowrap"
            >
              <Newspaper className="w-3.5 h-3.5 mr-1" />
              News
              <span className="absolute -top-1 -right-1 px-1 py-0.5 bg-red-500 text-white text-[8px] rounded-full animate-pulse">
                NEW
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            
            <a 
              href="/bankfraudtools" 
              className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium relative group whitespace-nowrap"
            >
              Bank Fraud Tool
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="/awareness" 
              className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium relative group whitespace-nowrap"
            >
              Awareness
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            
           <a 
              href="/learnmore" 
              className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium relative group whitespace-nowrap"
            >
              LearnMore
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
             <a 
              href="/" 
              className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium relative group whitespace-nowrap"
            >
              BankFraud
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>

            {/* User Menu - Desktop */}
            {user ? (
              <div className="flex items-center ml-2 pl-2 border-l border-gray-200">
                <div className="flex items-center mr-2">
                  <User className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-xs text-gray-600 max-w-[100px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all font-medium"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center ml-2 space-x-2">
                <a
                  href="/login"
                  className="px-4 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 py-2 border-t border-gray-200 animate-fadeIn">
            <div className="flex flex-col space-y-1">
              {/* User Info - Mobile */}
              {user && (
                <div className="px-3 py-2 bg-blue-50 rounded-lg mb-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium truncate">{user.email}</span>
                  </div>
                </div>
              )}

              <a 
                href="/" 
                className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4 mr-2 text-blue-600" />
                Home
              </a>

              <a
                href="/legalbot"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center justify-between"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Scale className="w-4 h-4 mr-2 text-blue-600" />
                  <span>LegalBot</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">AI</span>
              </a>

              <a
                href="/complaintgen"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center justify-between"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-green-600" />
                  <span>ComplaintGen</span>
                </div>
                <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">Gen</span>
              </a>

              <a
                href="/community"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center justify-between"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-purple-600" />
                  <span>Community Intel</span>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">Intel</span>
              </a>

              <a
                href="/riskengine"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center justify-between"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-orange-600" />
                  <span>Risk Engine</span>
                </div>
                <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">Risk</span>
              </a>

              {/* News Tab in Mobile Menu */}
              <a
                href="/news"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center justify-between"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Newspaper className="w-4 h-4 mr-2 text-red-600" />
                  <span>News</span>
                </div>
                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full animate-pulse">New</span>
              </a>

              
              
              <a 
                href="/awareness" 
                className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                Awareness
              </a>
              
              <div className="pt-1 mt-1">
                <a 
                  href="/analyze" 
                  className="block px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-medium flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Zap className="w-4 h-4 mr-1.5" />
                  Analyze Now
                </a>
              </div>

              {/* Auth Links - Mobile */}
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center border-t border-gray-100 pt-3"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              ) : (
                <div className="flex flex-col space-y-2 mt-2 pt-2 border-t border-gray-100">
                  <a
                    href="/login"
                    className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium text-center hover:bg-blue-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;