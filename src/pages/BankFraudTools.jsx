import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, limit } from "firebase/firestore";
import {
  Building2,
  AlertTriangle,
  CheckCircle,
  FileText,
  Upload,
  X,
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
  FileSearch,
  Sparkles,
  Brain,
  Gauge,
  Search,
  Flag,
  Ban,
  Phone,
  Mail,
  Globe,
  Fingerprint,
  Ghost,
  Skull,
  CreditCard,
  Flame,
  Crown,
  Award,
  Star,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  BarChart3,
  PieChart,
  Users,
  Landmark,
  Shield,
  Hash,
  Calendar,
  Database,
  DollarSign
} from "lucide-react";

function BankFraudTools() {
  const [activeTab, setActiveTab] = useState("micro");
  const [file, setFile] = useState(null);
  const [parseResult, setParseResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [upiInput, setUpiInput] = useState("");
  const [upiCheckResult, setUpiCheckResult] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [recentReports, setRecentReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    try {
      const q = query(
        collection(db, "fraudulentUPIs"),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setRecentReports(reports);
    } catch (err) {
      console.error("Error fetching recent reports:", err);
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.name.endsWith(".csv")) {
      setFile(uploadedFile);
      parseCSV(uploadedFile);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const parseCSV = (file) => {
    setLoading(true);
    setParseResult(null);
    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      const lines = csvData.split("\n");
      const headers = lines[0].split(",").map(h => h.trim());

      const dateIdx = headers.indexOf("Date");
      const descIdx = headers.indexOf("Description");
      const amountIdx = headers.indexOf("Amount");
      const balanceIdx = headers.indexOf("Balance");

      if (dateIdx === -1 || descIdx === -1 || amountIdx === -1 || balanceIdx === -1) {
        setError("CSV must contain columns: Date, Description, Amount, Balance");
        setLoading(false);
        return;
      }

      const microDebits = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(",");
        if (cols.length < 4) continue;

        const amount = parseFloat(cols[amountIdx]);
        if (isNaN(amount)) continue;

        if (amount < 0 && Math.abs(amount) < 1.0) {
          microDebits.push({
            date: cols[dateIdx].trim(),
            description: cols[descIdx].trim(),
            amount: Math.abs(amount),
            balance: parseFloat(cols[balanceIdx]) || 0
          });
        }
      }

      const grouped = {};
      microDebits.forEach(row => {
        const desc = row.description;
        if (!grouped[desc]) {
          grouped[desc] = { count: 0, total: 0, examples: [] };
        }
        grouped[desc].count += 1;
        grouped[desc].total += row.amount;
        if (grouped[desc].examples.length < 3) {
          grouped[desc].examples.push(row);
        }
      });

      const resultArray = Object.entries(grouped)
        .map(([desc, data]) => ({
          description: desc,
          count: data.count,
          total: data.total.toFixed(3),
          examples: data.examples,
        }))
        .filter(item => item.count >= 3)
        .sort((a, b) => b.count - a.count);

      setParseResult(resultArray);
      setLoading(false);
    };

    reader.onerror = () => {
      setError("Error reading file");
      setLoading(false);
    };

    reader.readAsText(file);
  };

  const checkUpi = async () => {
    if (!upiInput.trim()) {
      setError("Please enter a UPI ID");
      return;
    }
    setLoading(true);
    setUpiCheckResult(null);
    setError("");

    try {
      const normalized = upiInput.trim().toLowerCase();
      const q = query(
        collection(db, "fraudulentUPIs"),
        where("upiId", "==", normalized)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        setUpiCheckResult({
          found: true,
          reason: data.reason,
          reportedAt: data.timestamp?.toDate()
        });
      } else {
        setUpiCheckResult({ found: false });
      }
    } catch (err) {
      console.error("Error checking UPI:", err);
      setError("Failed to check UPI ID. Check Firestore permissions.");
    } finally {
      setLoading(false);
    }
  };

  const reportUpi = async () => {
    if (!upiInput.trim() || !reportReason.trim()) {
      setError("Please enter UPI ID and reason");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const normalized = upiInput.trim().toLowerCase();
      await addDoc(collection(db, "fraudulentUPIs"), {
        upiId: normalized,
        reason: reportReason.trim(),
        timestamp: serverTimestamp(),
      });
      alert("UPI ID reported successfully.");
      setUpiInput("");
      setReportReason("");
      setUpiCheckResult(null);
      fetchRecentReports();
    } catch (err) {
      console.error("Error reporting UPI:", err);
      setError("Failed to report UPI ID. Check Firestore permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-blue-200">
              <Landmark className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Bank Fraud Protection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detect micro‑debits and verify UPI IDs before you pay.
            </p>
          </div>

          {/* Stats Cards (optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Reports in DB</span>
                <Database className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">{recentReports.length}+</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Micro‑debits caught</span>
                <FileText className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">1,234</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">UPI checks today</span>
                <Hash className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">856</div>
            </div>
          </div>

          {/* Tabs */}
          {/* <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setActiveTab("micro")}
                className={`px-6 py-3 rounded-xl font-medium text-sm flex items-center transition-all ${
                  activeTab === "micro"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Micro‑Debit Detector
              </button>
              <button
                onClick={() => setActiveTab("upi")}
                className={`px-6 py-3 rounded-xl font-medium text-sm flex items-center transition-all ${
                  activeTab === "upi"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Shield className="w-4 h-4 mr-2" />
                UPI Fraud Checker
              </button>
            </div>
          </div> */}

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {activeTab === "micro" && (
              <div className="p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileSearch className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Micro‑Transaction Detector</h2>
                    <p className="text-sm text-gray-500">Upload your bank statement (CSV) to find hidden tiny debits (salami slicing).</p>
                  </div>
                </div>

                {/* File Upload Area */}
                <div className="space-y-6">
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label 
                      htmlFor="csv-upload" 
                      className="block cursor-pointer"
                    >
                      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                        file 
                          ? "border-blue-400 bg-blue-50" 
                          : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                      }`}>
                        {file ? (
                          <>
                            <FileCheck className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                            <p className="text-gray-900 font-medium mb-1">{file.name}</p>
                            <p className="text-sm text-gray-500">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-900 font-medium mb-1">Click to upload CSV</p>
                            <p className="text-sm text-gray-500">Required columns: Date, Description, Amount, Balance</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {loading && (
                    <div className="flex justify-center py-8">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                        <FileSearch className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 animate-pulse" />
                      </div>
                    </div>
                  )}

                  {parseResult && parseResult.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        Suspicious Micro‑Debits Found
                      </h3>
                      <div className="space-y-3">
                        {parseResult.map((item, idx) => (
                          <div key={idx} className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center">
                                  <DollarSign className="w-4 h-4 text-red-700" />
                                </div>
                                <span className="font-semibold text-gray-800">{item.description}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium">
                                  {item.count} times
                                </span>
                                <span className="text-red-600 font-bold">₹{item.total}</span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 ml-10">
                              <span className="font-medium">Example dates:</span>{" "}
                              {item.examples.map((ex, i) => ex.date).join(", ")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {parseResult && parseResult.length === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>✅ No suspicious micro‑debits found. Your statement looks clean.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "upi" && (
              <div className="p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">UPI Fraud Checker</h2>
                    <p className="text-sm text-gray-500">Check if a UPI ID has been reported as fraudulent by the community.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter UPI ID
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={upiInput}
                          onChange={(e) => setUpiInput(e.target.value)}
                          placeholder="example@okhdfcbank"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={checkUpi}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Checking...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Check UPI ID
                          </>
                        )}
                      </button>
                    </div>

                    {upiCheckResult && (
                      <div
                        className={`p-5 rounded-xl ${
                          upiCheckResult.found
                            ? "bg-red-50 border border-red-200"
                            : "bg-green-50 border border-green-200"
                        }`}
                      >
                        <div className="flex items-start">
                          {upiCheckResult.found ? (
                            <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            {upiCheckResult.found ? (
                              <>
                                <p className="font-semibold text-red-800">⚠️ This UPI ID has been reported as fraudulent!</p>
                                <p className="text-sm text-gray-700 mt-1">Reason: {upiCheckResult.reason}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Reported on: {upiCheckResult.reportedAt?.toLocaleDateString()}
                                </p>
                              </>
                            ) : (
                              <p className="text-green-800 font-medium">✅ This UPI ID appears safe (no reports found).</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <hr className="my-6 border-gray-200" />

                    {/* Report Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Flag className="w-5 h-5 text-orange-500 mr-2" />
                        Report a fraudulent UPI ID
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reason for report
                        </label>
                        <textarea
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          rows="3"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-400"
                          placeholder="Describe the fraud (e.g., fake payment request, scam)"
                        />
                      </div>
                      <button
                        onClick={reportUpi}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-200 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Reporting...
                          </>
                        ) : (
                          <>
                            <Flag className="w-4 h-4 mr-2" />
                            Report UPI ID
                          </>
                        )}
                      </button>
                    </div>

                    {/* Recently Reported UPI IDs */}
                    {recentReports.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <Clock className="w-5 h-5 text-gray-500 mr-2" />
                          Recently Reported UPI IDs
                        </h3>
                        <div className="space-y-2">
                          {recentReports.map((report) => (
                            <div key={report.id} className="flex flex-wrap items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center space-x-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="font-mono text-sm text-gray-700">{report.upiId}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <p className="text-xs text-gray-500 max-w-xs truncate">{report.reason}</p>
                                <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-200">
                                  {report.timestamp?.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Community verified</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Real‑time updates</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Secure reporting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BankFraudTools;