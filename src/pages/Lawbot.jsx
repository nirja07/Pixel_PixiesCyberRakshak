import React, { useState, useRef, useEffect } from "react";
import { 
  Scale, 
  MessageSquare, 
  Send, 
  AlertCircle, 
  User, 
  Bot,
  ExternalLink,
  FileText,
  Phone,
  HelpCircle,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import Navbar from "./Navbar";
function LawBot() {
  const [messages, setMessages] = useState([
    { 
      id: 1,
      type: "bot", 
      content: "Namaste! I'm your AI legal assistant for Indian Cyber Laws. Please describe your cyber incident, and I'll provide relevant guidance under the IT Act 2000 and IPC.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestedQuestions = [
    "Someone hacked my email account",
    "I received a phishing email from my bank",
    "Fake social media profile using my photos",
    "Lost money in online investment scam",
    "Someone is blackmailing me online"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { 
      id: messages.length + 1,
      type: "user", 
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: text })
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: data.answer || "I've analyzed your case. Based on the Information Technology Act, 2000, this appears to be a cyber crime. Please visit your nearest cyber cell or file a complaint at cybercrime.gov.in",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { 
          id: messages.length + 2,
          type: "bot", 
          content: "I'm having trouble connecting to the server. Please ensure the backend is running at http://127.0.0.1:8000",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
    <div className="pt-24 pb-16">
      {/* Main Chat Container */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6 bg-gray-50" id="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-6 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 mr-3 shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] rounded-2xl px-5 py-4 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-none shadow-md'
                      : message.isError
                      ? 'bg-red-50 border border-red-200 text-gray-800 rounded-bl-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {message.isError && (
                    <div className="flex items-center mb-2 text-red-600">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Connection Error</span>
                    </div>
                  )}
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className={`flex items-center text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {message.timestamp}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-center flex-shrink-0 ml-3 shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center mr-3 shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                    <span className="text-base text-gray-600">Analyzing under IT Act...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-6 py-5 bg-white border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <HelpCircle className="w-4 h-4 mr-2 text-blue-500" />
                Try asking about:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition-all border border-blue-200 hover:border-blue-300 hover:shadow-md flex items-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your cyber incident here..."
                  className="w-full px-5 py-4 pr-12 text-base border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  disabled={loading}
                />
                {input.trim() && !loading && (
                  <button
                    onClick={() => sendMessage()}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className={`px-8 py-4 rounded-xl font-semibold text-base transition-all flex items-center ${
                  input.trim() && !loading
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:scale-105 hover:shadow-blue-200'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5 mr-2" />
                Send
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />
                  Quick actions:
                </span>
                <button 
                  onClick={() => window.open('https://cybercrime.gov.in', '_blank')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center group"
                >
                  <FileText className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                  File Complaint
                  <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={() => window.location.href = '/complaint'}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center group"
                >
                  <FileText className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                  Generate Complaint
                  <ChevronRight className="w-3 h-3 ml-1" />
                </button>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="w-4 h-4 mr-1 text-green-500" />
                Helpline: 
                <span className="font-medium text-gray-700 ml-1">1930</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" />
            <p className="text-xs text-gray-600">
              This AI assistant provides information based on Indian Cyber Laws. For official legal advice, consult a qualified lawyer.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
      </div>
    </div>
  );
}

export default LawBot;