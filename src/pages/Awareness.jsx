import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

function Awareness() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [news, setNews] = useState([]);

  // Simulated data – in production, you'd fetch from an API
  useEffect(() => {
    // Mock data
    setStats({
      totalCases: 52460,
      dailyAverage: 144,
      topState: "Maharashtra",
      growthRate: 15.4,
      financialLoss: "₹1,240 Cr",
      categories: [
        { name: "Online Fraud", count: 18750, percentage: 35.7 },
        { name: "Identity Theft", count: 12340, percentage: 23.5 },
        { name: "Cyber Stalking", count: 9870, percentage: 18.8 },
        { name: "Phishing", count: 7650, percentage: 14.6 },
        { name: "Ransomware", count: 3850, percentage: 7.4 }
      ]
    });

    setNews([
      {
        id: 1,
        title: "Ransomware attacks rise 45% in Q1 2024",
        source: "CERT-In",
        date: "2 days ago",
        url: "#"
      },
      {
        id: 2,
        title: "New phishing campaign targeting banking customers",
        source: "Indian Cyber Crime Coordination Centre",
        date: "5 days ago",
        url: "#"
      },
      {
        id: 3,
        title: "Aadhaar-enabled payment frauds on the rise",
        source: "Ministry of Home Affairs",
        date: "1 week ago",
        url: "#"
      },
      {
        id: 4,
        title: "Social media scams: How to stay safe",
        source: "Cyber Dost",
        date: "2 weeks ago",
        url: "#"
      }
    ]);
  }, []);

  const categories = [
    {
      id: "online-fraud",
      title: "Online Financial Fraud",
      description: "UPI scams, credit card fraud, phishing emails, fake shopping websites.",
      icon: "💰",
      tips: [
        "Never share OTP or bank details",
        "Use secure websites (https://)",
        "Enable transaction alerts",
        "Verify before clicking links"
      ]
    },
    {
      id: "identity-theft",
      title: "Identity Theft",
      description: "Aadhaar misuse, fake social profiles, impersonation for fraud.",
      icon: "🆔",
      tips: [
        "Do not share documents online",
        "Use virtual IDs for Aadhaar",
        "Check credit reports regularly",
        "Report fake profiles immediately"
      ]
    },
    {
      id: "cyber-stalking",
      title: "Cyber Stalking & Harassment",
      description: "Online stalking, doxxing, revenge porn, trolling.",
      icon: "👁️",
      tips: [
        "Adjust privacy settings",
        "Block and report harassers",
        "Save evidence (screenshots)",
        "Inform trusted contacts"
      ]
    },
    {
      id: "ransomware",
      title: "Ransomware & Malware",
      description: "Ransomware attacks, virus infections, data kidnapping.",
      icon: "🦠",
      tips: [
        "Regularly backup data",
        "Use updated antivirus",
        "Don't download from untrusted sources",
        "Be cautious with email attachments"
      ]
    },
    {
      id: "social-media",
      title: "Social Media Crimes",
      description: "Fake profiles, morphed images, defamation, cyber bullying.",
      icon: "📱",
      tips: [
        "Report fake profiles",
        "Use strong passwords",
        "Enable two-factor authentication",
        "Think before you post"
      ]
    },
    {
      id: "data-breach",
      title: "Data Breach",
      description: "Leak of personal data from companies, dark web trading.",
      icon: "🔓",
      tips: [
        "Use unique passwords per site",
        "Monitor accounts for unusual activity",
        "Check haveibeenpwned.com",
        "Opt for data deletion rights"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-blue-200">
              <span className="text-4xl">🌐</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Cyber Crime Awareness
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed about the latest cyber threats and learn how to protect yourself in the digital world.
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-2xl">
                    📊
                  </div>
                  <span className="text-sm text-gray-500">NCRB 2024</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.totalCases.toLocaleString()}</h3>
                <p className="text-gray-600">Total Cases (YTD)</p>
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <span>↑ {stats.growthRate}% from last year</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 text-2xl">
                    ⚡
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.dailyAverage}</h3>
                <p className="text-gray-600">Daily Average Incidents</p>
                <p className="mt-2 text-sm text-gray-500">approx. 1 every 10 minutes</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 text-2xl">
                    🏛️
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.topState}</h3>
                <p className="text-gray-600">Most Affected State</p>
                <p className="mt-2 text-sm text-gray-500">followed by Karnataka, Delhi</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-2xl">
                    💰
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.financialLoss}</h3>
                <p className="text-gray-600">Financial Loss (YTD)</p>
                <p className="mt-2 text-sm text-gray-500">avg. ₹24,000 per case</p>
              </div>
            </div>
          )}

          {/* Category Distribution */}
          {stats && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Cyber Crime Categories</h2>
              <div className="space-y-4">
                {stats.categories.map((cat, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="text-gray-600 font-medium">{cat.count.toLocaleString()} cases</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2.5 rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-sm text-gray-500 mt-1">{cat.percentage}% of total</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("prevention")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "prevention"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Prevention Tips
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "news"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Latest News
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "resources"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Resources
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Cyber Crime Landscape in India</h2>
                <p className="text-gray-600 leading-relaxed">
                  India has witnessed a sharp rise in cyber crimes over the past few years, driven by increased digital adoption and sophisticated attack techniques. According to the National Crime Records Bureau (NCRB), over 50,000 cases were registered in 2023, with financial frauds accounting for nearly 40% of all incidents.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The COVID-19 pandemic accelerated the shift to online services, creating new opportunities for cybercriminals. Work-from-home setups, online banking, and e-commerce have become prime targets. Ransomware attacks on critical infrastructure and data breaches of major corporations have also made headlines.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The most common types of cyber crimes reported include:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Phishing and spoofed websites targeting bank customers</li>
                  <li>Identity theft using Aadhaar and PAN details</li>
                  <li>Cyber stalking and harassment on social media</li>
                  <li>Ransomware attacks on businesses and individuals</li>
                  <li>Online sextortion and blackmail</li>
                  <li>Fake customer care numbers and refund scams</li>
                </ul>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Did you know?</strong> The Cyber Crime Helpline 1930 has received over 1.5 lakh calls in 2024, helping victims block fraudulent transactions worth ₹100+ crore.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "prevention" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Protect Yourself</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {categories.map((cat, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-3xl">{cat.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-800">{cat.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{cat.description}</p>
                      <ul className="space-y-2">
                        {cat.tips.map((tip, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <span className="text-green-500 mr-2">✓</span>
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">🛡️ General Safety Checklist</h3>
                  <ul className="grid md:grid-cols-2 gap-2 text-sm">
                    <li className="flex items-center"><span className="mr-2">•</span> Use strong, unique passwords</li>
                    <li className="flex items-center"><span className="mr-2">•</span> Enable 2-factor authentication</li>
                    <li className="flex items-center"><span className="mr-2">•</span> Keep software updated</li>
                    <li className="flex items-center"><span className="mr-2">•</span> Be cautious of unsolicited calls/emails</li>
                    <li className="flex items-center"><span className="mr-2">•</span> Use antivirus and firewall</li>
                    <li className="flex items-center"><span className="mr-2">•</span> Regularly backup data</li>
                    <li className="flex items-center"><span className="mr-2">•</span> Verify website URLs before paying</li>
                    <li className="flex items-center"><span className="mr-2">•</span> Report incidents immediately</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "news" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Cyber Crime News</h2>
                <div className="space-y-4">
                  {news.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      className="block p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.source} • {item.date}</p>
                        </div>
                        <span className="text-blue-600">→</span>
                      </div>
                    </a>
                  ))}
                </div>
                <p className="text-center text-gray-500 text-sm">For official updates, visit <a href="https://cybercrime.gov.in" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">cybercrime.gov.in</a></p>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Helpful Resources</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <span className="text-xl mr-2">📞</span> Helplines
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Cyber Crime Helpline:</strong> 1930</li>
                      <li><strong>Police Emergency:</strong> 112</li>
                      <li><strong>Women Helpline:</strong> 181</li>
                      <li><strong>Child Helpline:</strong> 1098</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <span className="text-xl mr-2">🌐</span> Websites
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><a href="https://cybercrime.gov.in" className="text-blue-600 hover:underline" target="_blank">cybercrime.gov.in</a> - File complaint</li>
                      <li><a href="https://cert-in.org.in" className="text-blue-600 hover:underline" target="_blank">cert-in.org.in</a> - Security alerts</li>
                      <li><a href="https://i4c.mha.gov.in" className="text-blue-600 hover:underline" target="_blank">I4C portal</a> - Indian Cyber Crime Coordination Centre</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 md:col-span-2">
                    <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                      <span className="text-xl mr-2">📱</span> Mobile Apps
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="font-medium">Cyber Dost</p>
                        <p className="text-sm text-gray-600">Awareness app by MHA</p>
                      </div>
                      <div>
                        <p className="font-medium">mAadhaar</p>
                        <p className="text-sm text-gray-600">Secure Aadhaar management</p>
                      </div>
                      <div>
                        <p className="font-medium">UMANG</p>
                        <p className="text-sm text-gray-600">Government services</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Awareness;