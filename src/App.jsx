import React from 'react';
import RiskAnalyzer from './components/RiskAnalyzer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import LawBot from './pages/LawBot';
import ComplaintGen from './pages/ComplaintGen';
import CyberQuest from './pages/CyberQuest';
import Community from './pages/Community';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
   
          <Route path="/" element={<HomePage />} />
          
          <Route path="/chat" element={<LawBot />} />
          <Route path="/legalbot" element={<LawBot />} />
          <Route path="/assistant" element={<LawBot />} />
          <Route path="/riskengine" element={<RiskAnalyzer/>} />
    
          <Route path="/complaint" element={<ComplaintGen />} />
          <Route path="/complaintgen" element={<ComplaintGen />} />
          
          <Route path="/analyze" element={<LawBot />} />
          <Route path="/awareness" element={<CyberQuest/>}/>
          <Route path="/community" element={<Community />} />
         
          <Route path="*" element={
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
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;