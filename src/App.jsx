import React from 'react';
import RiskAnalyzer from './components/RiskAnalyzer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Homepage';
import LawBot from './pages/LawBot';
import ComplaintGen from './pages/ComplaintGen';
import CyberQuest from './pages/CyberQuest';
import NewsPage from './pages/NewsPage';
import Login from './pages/LogIn';
import Signup from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import Community from './pages/Community';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
  {/* Public routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  {/* Protected routes */}
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/news"
    element={
      <ProtectedRoute>
        <NewsPage />
      </ProtectedRoute>
    }
  />
  <Route
            path="/analyze-risk"
            element={
              <ProtectedRoute>
                <RiskAnalyzer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <LawBot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/legalbot"
            element={
              <ProtectedRoute>
                <LawBot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <LawBot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/riskengine"
            element={
              <ProtectedRoute>
                <RiskAnalyzer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaint"
            element={
              <ProtectedRoute>
                <ComplaintGen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaintgen"
            element={
              <ProtectedRoute>
                <ComplaintGen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyze"
            element={
              <ProtectedRoute>
                <LawBot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/awareness"
            element={
              <ProtectedRoute>
                <CyberQuest />
              </ProtectedRoute>
            }
          />
  
 
          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-[rgb(3,252,252)] mb-4">404</h1>
                  <p className="text-white text-xl mb-8">Page not found</p>
                  <a
                    href="/"
                    className="inline-block px-6 py-3 border border-[rgb(3,252,252)] text-[rgb(3,252,252)] rounded-lg hover:bg-[rgb(3,252,252)]/10 transition-all"
                  >
                    Return to Dashboard
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;