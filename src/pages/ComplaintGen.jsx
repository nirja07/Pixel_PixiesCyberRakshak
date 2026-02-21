import React, { useState, useRef } from "react";
import Navbar from "./Navbar";
import jsPDF from "jspdf";
import {
  FileText,
  User,
  AlertTriangle,
  DollarSign,
  Search,
  Download,
  File,
  ExternalLink,
  Paperclip,
  Check,
  X,
  Upload,
  Clock,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Home,
  Building,
  Hash,
  CreditCard,
  Image,
  Shield,
  Eye
} from "lucide-react";

function ComplaintGen() {
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "Indian",
    identityProof: "aadhar",
    identityNumber: "",
    
    // Contact Details
    address: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    
    // Incident Details
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    cyberCell: "",
    complaintNature: "",
    incidentDescription: "",
    financialLoss: "",
    bankName: "",
    accountNumber: "",
    transactionId: "",
    transactionAmount: "",
    transactionDate: "",
    
    // Suspect Details
    suspectKnown: "no",
    suspectName: "",
    suspectAddress: "",
    suspectPhone: "",
    suspectEmail: "",
    suspectSocialMedia: "",
    suspectBankDetails: "",
    
    // Evidence
    evidenceUrls: [],
    witnessPresent: "no",
    witnessName: "",
    witnessContact: "",
    
    // Declaration
    declaration: false
  });

  const [activeSection, setActiveSection] = useState("personal");
  const previewRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      evidenceUrls: [...prev.evidenceUrls, ...files.map(f => f.name)]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.filter((_, i) => i !== index)
    }));
  };

  const generateComplaintText = () => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return `COMPLAINT TO ${formData.cyberCell?.toUpperCase() || 'THE OFFICER IN CHARGE, CYBER CRIME CELL'}

Under Section 154, Code of Criminal Procedure, 1973
& Section 66, Information Technology Act, 2000

Complaint No: CMP/${Math.floor(Math.random() * 10000)}/2024
Date: ${currentDate}

To,
The Officer In-Charge,
${formData.cyberCell || "Cyber Crime Police Station"},
${formData.city || "_________"}, ${formData.state || "_________"} - ${formData.pincode || "______"}

Sub: Complaint regarding ${formData.complaintNature || "cyber crime incident"}

Respected Sir/Madam,

I, ${formData.fullName || "___________________"} (${formData.gender || "_____"}), S/o ${formData.fatherName || "___________________"}, 
residing at ${formData.address || "___________________"}, ${formData.city || "_________"}, ${formData.state || "_________"} - ${formData.pincode || "______"}, 
wish to lodge a complaint regarding a cyber crime incident.

--------------------------------------------------------------------
PERSONAL DETAILS:
--------------------------------------------------------------------
Mobile Number: ${formData.mobile || "___________________"}
Email ID: ${formData.email || "___________________"}
Identity Proof: ${formData.identityProof} (${formData.identityNumber || "___________________"})

--------------------------------------------------------------------
INCIDENT DETAILS:
--------------------------------------------------------------------
Date & Time of Incident: ${formData.incidentDate || "__________"} at ${formData.incidentTime || "__________"}
Place of Incident: ${formData.incidentLocation || "___________________"}
Nature of Complaint: ${formData.complaintNature || "___________________"}

DETAILED DESCRIPTION:
--------------------------------------------------------------------
${formData.incidentDescription || "______________________________________________________________________\n______________________________________________________________________\n______________________________________________________________________"}

${formData.financialLoss ? `
--------------------------------------------------------------------
FINANCIAL LOSS DETAILS:
--------------------------------------------------------------------
Amount Involved: ₹${formData.financialLoss}
Bank Name: ${formData.bankName || "N/A"}
Account Number: ${formData.accountNumber || "N/A"}
Transaction ID: ${formData.transactionId || "N/A"}
Transaction Amount: ₹${formData.transactionAmount || "0"}
Transaction Date: ${formData.transactionDate || "N/A"}
` : ''}

${formData.suspectKnown === 'yes' ? `
--------------------------------------------------------------------
SUSPECT DETAILS:
--------------------------------------------------------------------
Name: ${formData.suspectName || "N/A"}
Address: ${formData.suspectAddress || "N/A"}
Phone: ${formData.suspectPhone || "N/A"}
Email: ${formData.suspectEmail || "N/A"}
Social Media: ${formData.suspectSocialMedia || "N/A"}
Bank Details: ${formData.suspectBankDetails || "N/A"}
` : `
--------------------------------------------------------------------
SUSPECT DETAILS:
--------------------------------------------------------------------
The suspect is not known to the complainant.
`}

--------------------------------------------------------------------
EVIDENCE ATTACHED:
--------------------------------------------------------------------
${formData.evidenceUrls.length > 0 
  ? formData.evidenceUrls.map((url, i) => `${i+1}. ${url}`).join('\n')
  : "1. Evidence will be submitted separately"}

${formData.witnessPresent === 'yes' ? `
--------------------------------------------------------------------
WITNESS DETAILS:
--------------------------------------------------------------------
Name: ${formData.witnessName || "N/A"}
Contact: ${formData.witnessContact || "N/A"}
` : ''}

--------------------------------------------------------------------
APPLICABLE LEGAL SECTIONS:
--------------------------------------------------------------------
${getApplicableSections(formData.complaintNature)}

--------------------------------------------------------------------
DECLARATION:
--------------------------------------------------------------------
I, ${formData.fullName || "___________________"}, do hereby declare that all information provided in this complaint is true and correct to the best of my knowledge and belief. I understand that furnishing false information is punishable under Section 203 of the Indian Penal Code and relevant provisions of the Information Technology Act, 2000.

I request you to take necessary action as per law and register my complaint. I am ready to provide any additional information or evidence required for investigation.

Thanking you,

Yours faithfully,


Signature: ______________________

(${formData.fullName || "Complainant Name"})
Mobile: ${formData.mobile || "___________________"}
Email: ${formData.email || "___________________"}

Date: ${currentDate}
Place: ${formData.city || "_________"}

--------------------------------------------------------------------
ENCLOSURES:
--------------------------------------------------------------------
${formData.evidenceUrls.length > 0 
  ? formData.evidenceUrls.map((url, i) => `${i+1}. ${url}`).join('\n')
  : "1. Relevant documents/evidence will be submitted"}

--------------------------------------------------------------------
FOR OFFICE USE ONLY
--------------------------------------------------------------------
Complaint Received By: __________________
Designation: ___________________________
Date & Time: ___________________________
Complaint Registered As: ________________
Action Initiated: _______________________

--------------------------------------------------------------------
`;
  };

  const getApplicableSections = (nature) => {
    const sections = {
      "Phishing": "• Section 66C IT Act (Identity Theft)\n• Section 66D IT Act (Cheating by personation)\n• Section 419/420 IPC (Cheating & Fraud)",
      "Identity Theft": "• Section 66C IT Act (Identity Theft)\n• Section 419 IPC (Cheating by personation)",
      "Cyber Stalking": "• Section 354D IPC (Stalking)\n• Section 67 IT Act (Publishing obscene information)",
      "Online Fraud": "• Section 420 IPC (Cheating)\n• Section 66D IT Act (Cheating by personation)",
      "Data Theft": "• Section 43 IT Act (Data theft)\n• Section 66 IT Act (Computer related offences)\n• Section 379 IPC (Theft)",
      "Social Media": "• Section 67 IT Act (Publishing obscene material)\n• Section 499/500 IPC (Defamation)",
      "Bank Fraud": "• Section 420 IPC (Cheating)\n• Section 66C IT Act (Identity theft)\n• Section 66D IT Act (Cheating by personation)",
      "Ransomware": "• Section 66F IT Act (Cyber terrorism)\n• Section 384 IPC (Extortion)",
      "default": "• Relevant sections of Information Technology Act, 2000\n• Relevant sections of Indian Penal Code, 1860"
    };
    return sections[nature] || sections.default;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const complaintText = generateComplaintText();
    
    // Split text into lines that fit the page width
    const splitText = doc.splitTextToSize(complaintText, 180);
    
    let y = 20;
    const pageHeight = doc.internal.pageSize.height;
    
    splitText.forEach(line => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 15, y);
      y += 7;
    });
    
    doc.save(`cyber_complaint_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const downloadText = () => {
    const content = generateComplaintText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber_complaint_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const redirectToCyberPortal = () => {
    window.open("https://cybercrime.gov.in/Webform/Crime_AuthoLogin.aspx", '_blank');
  };

  const sections = [
    { id: "personal", name: "Personal Details", icon: User },
    { id: "incident", name: "Incident Details", icon: AlertTriangle },
    { id: "financial", name: "Financial Info", icon: DollarSign },
    { id: "suspect", name: "Suspect & Evidence", icon: Search }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-blue-200">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Cyber Crime Complaint Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fill in the details and generate a professional complaint ready for submission
            </p>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200 h-[800px] overflow-y-auto">
              {/* Section Navigation */}
              <div className="flex space-x-2 mb-6 sticky top-0 bg-white pt-2 pb-4 z-10">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex-1 py-3 px-2 rounded-xl font-medium text-sm transition-all ${
                        activeSection === section.id
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <IconComponent className="w-5 h-5 mb-1" />
                        <span className="text-xs">{section.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Personal Details Section */}
              {activeSection === "personal" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="As per ID proof"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Father's Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Father/Guardian's name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Identity Proof
                      </label>
                      <select
                        name="identityProof"
                        value={formData.identityProof}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      >
                        <option value="aadhar">Aadhar Card</option>
                        <option value="pan">PAN Card</option>
                        <option value="voter">Voter ID</option>
                        <option value="passport">Passport</option>
                        <option value="driving">Driving License</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Identity Number
                      </label>
                      <input
                        type="text"
                        name="identityNumber"
                        value={formData.identityNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Document number"
                      />
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-semibold text-gray-800 mb-4">Contact Details</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Complete address"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              placeholder="City"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State
                            </label>
                            <select
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            >
                              <option value="">Select State</option>
                              <option value="Andhra Pradesh">Andhra Pradesh</option>
                              <option value="Delhi">Delhi</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Telangana">Telangana</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pincode
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="6-digit pincode"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="10-digit mobile number"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Alternate Mobile
                          </label>
                          <input
                            type="tel"
                            name="alternateMobile"
                            value={formData.alternateMobile}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Alternate contact"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email ID <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Incident Details Section */}
              {activeSection === "incident" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Incident Details</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Incident
                        </label>
                        <input
                          type="date"
                          name="incidentDate"
                          value={formData.incidentDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time of Incident
                        </label>
                        <input
                          type="time"
                          name="incidentTime"
                          value={formData.incidentTime}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Incident Location
                      </label>
                      <input
                        type="text"
                        name="incidentLocation"
                        value={formData.incidentLocation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Where did it happen?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cyber Cell / Police Station
                      </label>
                      <input
                        type="text"
                        name="cyberCell"
                        value={formData.cyberCell}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Where you want to file complaint"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nature of Complaint
                      </label>
                      <select
                        name="complaintNature"
                        value={formData.complaintNature}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      >
                        <option value="">Select type of cyber crime</option>
                        <option value="Phishing">Phishing Attack</option>
                        <option value="Identity Theft">Identity Theft</option>
                        <option value="Cyber Stalking">Cyber Stalking / Harassment</option>
                        <option value="Online Fraud">Online Fraud / Scam</option>
                        <option value="Data Theft">Data Theft / Breach</option>
                        <option value="Social Media">Social Media Crime</option>
                        <option value="Bank Fraud">Bank / Financial Fraud</option>
                        <option value="Ransomware">Ransomware Attack</option>
                        <option value="Other">Other Cyber Crime</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Detailed Description
                      </label>
                      <textarea
                        name="incidentDescription"
                        value={formData.incidentDescription}
                        onChange={handleInputChange}
                        rows="6"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Describe the incident in detail including what happened, when, how, and any communications received..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Info Section */}
              {activeSection === "financial" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Financial Loss (₹)
                      </label>
                      <input
                        type="number"
                        name="financialLoss"
                        value={formData.financialLoss}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Amount lost"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Name of bank"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Your account number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Transaction reference"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Transaction Amount
                        </label>
                        <input
                          type="number"
                          name="transactionAmount"
                          value={formData.transactionAmount}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          placeholder="Amount"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Transaction Date
                        </label>
                        <input
                          type="date"
                          name="transactionDate"
                          value={formData.transactionDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suspect & Evidence Section */}
              {activeSection === "suspect" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Suspect & Evidence</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Do you know the suspect?
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="suspectKnown"
                            value="yes"
                            checked={formData.suspectKnown === 'yes'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="suspectKnown"
                            value="no"
                            checked={formData.suspectKnown === 'no'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">No</span>
                        </label>
                      </div>
                    </div>

                    {formData.suspectKnown === 'yes' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Suspect Name
                          </label>
                          <input
                            type="text"
                            name="suspectName"
                            value={formData.suspectName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Name of suspect"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Suspect Phone
                          </label>
                          <input
                            type="tel"
                            name="suspectPhone"
                            value={formData.suspectPhone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Phone number"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Suspect Address
                          </label>
                          <input
                            type="text"
                            name="suspectAddress"
                            value={formData.suspectAddress}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Address if known"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="suspectEmail"
                            value={formData.suspectEmail}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Email address"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Social Media Handle
                          </label>
                          <input
                            type="text"
                            name="suspectSocialMedia"
                            value={formData.suspectSocialMedia}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Instagram, FB, etc."
                          />
                        </div>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Evidence Upload</h3>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="evidence-upload"
                        />
                        <label htmlFor="evidence-upload" className="cursor-pointer">
                          <Paperclip className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-gray-600 mb-1">Click to upload evidence</p>
                          <p className="text-xs text-gray-500">Screenshots, documents, images</p>
                        </label>
                      </div>

                      {formData.evidenceUrls.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                          <ul className="space-y-2">
                            {formData.evidenceUrls.map((file, index) => (
                              <li key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                                <span className="flex items-center">
                                  <File className="w-4 h-4 text-green-500 mr-2" />
                                  {file}
                                </span>
                                <button
                                  onClick={() => removeFile(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Witness Details</h3>
                      
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="witnessPresent"
                            value="yes"
                            checked={formData.witnessPresent === 'yes'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">Witness Present</span>
                        </label>
                      </div>

                      {formData.witnessPresent === 'yes' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Witness Name
                            </label>
                            <input
                              type="text"
                              name="witnessName"
                              value={formData.witnessName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Witness Contact
                            </label>
                            <input
                              type="tel"
                              name="witnessContact"
                              value={formData.witnessContact}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="declaration"
                          checked={formData.declaration}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 mt-1"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          I hereby declare that all information provided is true and correct. I understand that furnishing false information is punishable under law.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Live Preview */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 h-[800px] flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <h2 className="font-semibold">Live Preview</h2>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={downloadPDF}
                      disabled={!formData.declaration}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
                        formData.declaration
                          ? "bg-white text-blue-600 hover:bg-blue-50"
                          : "bg-white/50 text-white/50 cursor-not-allowed"
                      }`}
                    >
                      <File className="w-4 h-4 mr-1" />
                      PDF
                    </button>
                    <button
                      onClick={downloadText}
                      disabled={!formData.declaration}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
                        formData.declaration
                          ? "bg-white text-blue-600 hover:bg-blue-50"
                          : "bg-white/50 text-white/50 cursor-not-allowed"
                      }`}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Text
                    </button>
                    <button
                      onClick={redirectToCyberPortal}
                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Portal
                    </button>
                  </div>
                </div>
              </div>
              
              <div 
                ref={previewRef}
                className="flex-1 p-6 overflow-y-auto font-mono text-sm bg-gray-50 rounded-b-3xl"
              >
                <pre className="whitespace-pre-wrap text-gray-700">
                  {generateComplaintText()}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintGen;