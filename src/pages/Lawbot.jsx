// LawBot.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ChevronRight, 
  AlertTriangle,
  Scale,
  FileText,
  HelpCircle,
  MessageSquare,
  Zap,
  Lock,
  Globe,
  Cpu,
  BookOpen,
  Gavel,
  Fingerprint,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

function LawBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: `👋 **Namaste! I'm Cyber Rakshak** 🤖

I'm your AI assistant for **Indian Cyber Laws**. I can help you with:

• 🔍 **Understanding cyber incidents** - phishing, hacking, harassment
• ⚖️ **Legal sections** - IT Act 2000, IPC/BNS, DPDP Act 2023
• 🚨 **Immediate actions** - what to do if you're a victim
• 📋 **Evidence collection** - what to preserve
• 📝 **Reporting procedures** - how to file complaints

**How can I help you today?**`,
      timestamp: new Date(),
      suggested: [
        "I received a phishing SMS",
        "My social media was hacked",
        "What is Section 66C?",
        "How to report cyber crime?"
      ]
    }
  ]);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
    setSessionId(`session_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkConnection = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/health");
      if (response.ok) {
        setConnectionStatus("connected");
        console.log("✅ Connected to backend");
      } else {
        setConnectionStatus("disconnected");
      }
    } catch (error) {
      setConnectionStatus("disconnected");
      console.error("❌ Backend connection failed:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Prepare conversation history
      const conversationHistory = messages
        .filter(msg => msg.id !== 1) // Exclude welcome message
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversation_history: conversationHistory,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        suggested: data.suggested_questions || []
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setSuggestedQuestions(data.suggested_questions || []);

    } catch (error) {
      console.error("Chat error:", error);
      
      let errorContent = "";
      if (!navigator.onLine) {
        errorContent = "📡 **No Internet Connection**\n\nPlease check your internet connection and try again.";
      } else {
        errorContent = `🔌 **Connection Error**\n\nUnable to connect to the backend server. Please ensure:\n\n• Backend is running on http://127.0.0.1:8000\n• Run: \`python api.py\` in your terminal\n• No firewall is blocking the connection`;
      }
      
      const errorMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: errorContent,
        isError: true,
        timestamp: new Date(),
        suggested: [
          "python api.py",
          "Check backend setup",
          "Try again"
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedClick = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const formatMessage = (content) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    const elements = [];
    let inList = false;
    
    lines.forEach((line, index) => {
      // Headers (bold with **)
      if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <h3 key={index} className="text-[rgb(3,252,252)] font-bold text-lg mt-4 first:mt-0 mb-2" style={{ textShadow: '0 0 8px rgb(3,252,252)' }}>
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      }
      // Bullet points
      else if (line.startsWith('•')) {
        elements.push(
          <div key={index} className="flex items-start space-x-2 ml-2 mt-2">
            <ChevronRight className="w-4 h-4 text-[rgb(3,252,252)] mt-0.5 flex-shrink-0" />
            <span className="text-gray-300">{line.substring(1)}</span>
          </div>
        );
      }
      // Numbered lists (1., 2., etc.)
      else if (line.match(/^\d+\./)) {
        elements.push(
          <div key={index} className="flex items-start space-x-2 ml-2 mt-2">
            <span className="text-[rgb(3,252,252)] font-bold min-w-[20px]">{line.substring(0, line.indexOf('.')+1)}</span>
            <span className="text-gray-300">{line.substring(line.indexOf('.')+1)}</span>
          </div>
        );
      }
      // Empty lines
      else if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
      }
      // Regular text
      else {
        // Check for emojis and format accordingly
        const hasEmoji = /[\p{Emoji}]/u.test(line);
        elements.push(
          <p key={index} className={`text-gray-300 ${hasEmoji ? 'text-base' : 'text-sm'} leading-relaxed`}>
            {line}
          </p>
        );
      }
    });
    
    return elements;
  };

  // Quick action buttons
  const quickActions = [
    { icon: "📱", text: "Phishing SMS", query: "I received a fake banking SMS asking for KYC" },
    { icon: "🔓", text: "Account Hacked", query: "My social media account was hacked" },
    { icon: "🏦", text: "Bank Fraud", query: "Someone made unauthorized transactions from my bank account" },
    { icon: "⚖️", text: "Section 66C", query: "What is Section 66C of IT Act?" },
    { icon: "📋", text: "Report Crime", query: "How do I report a cyber crime?" }
  ];

  return (
    <div className="fixed inset-0 bg-cover bg-center bg-no-repeat font-['Share_Tech_Mono'] overflow-hidden"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/85"></div>
      
      {/* Animated background grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(3, 252, 252)" strokeWidth="0.3">
              <animate attributeName="stroke-opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
            </path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Main container */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between px-6 py-3 border-b border-[rgb(3,252,252)]/30 bg-black/60 backdrop-blur-md"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-[rgb(3,252,252)] filter drop-shadow-[0_0_10px_rgb(3,252,252)]" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-[rgb(3,252,252)] rounded-full"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-white">CYBER</span>
                <span className="text-[rgb(3,252,252)]" style={{ textShadow: '0 0 10px rgb(3,252,252)' }}> RAKSHAK</span>
              </h1>
              <p className="text-[10px] text-[rgb(3,252,252)]/70">AI Legal Assistant • Indian Cyber Law</p>
            </div>
          </div>
          
          {/* Connection status */}
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected" ? "bg-green-500" : 
                connectionStatus === "checking" ? "bg-yellow-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-[rgb(3,252,252)]/70 hidden sm:inline">
              {connectionStatus === "connected" ? "Backend Connected" : 
               connectionStatus === "checking" ? "Connecting..." : "Disconnected"}
            </span>
          </div>
        </motion.div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-[rgb(3,252,252)]/30 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-2xl ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${msg.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.role === 'user' 
                          ? 'bg-[rgb(3,252,252)]/20 border border-[rgb(3,252,252)]' 
                          : 'bg-black/60 border border-[rgb(3,252,252)]'
                      }`}
                    >
                      {msg.role === 'user' 
                        ? <User className="w-4 h-4 text-[rgb(3,252,252)]" />
                        : <Bot className="w-4 h-4 text-[rgb(3,252,252)]" />
                      }
                    </motion.div>
                  </div>
                  
                  {/* Message Bubble */}
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className={`relative px-4 py-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-[rgb(3,252,252)]/10 border border-[rgb(3,252,252)]/30'
                        : msg.isError
                          ? 'bg-red-950/30 border border-red-500/30'
                          : 'bg-black/60 border border-[rgb(3,252,252)]/30'
                    } backdrop-blur-sm group`}
                  >
                    {/* Glow effect on hover */}
                    <motion.div
                      animate={{
                        boxShadow: msg.role === 'assistant' && !msg.isError ? [
                          "0 0 10px rgba(3, 252, 252, 0)",
                          "0 0 20px rgba(3, 252, 252, 0.1)",
                          "0 0 10px rgba(3, 252, 252, 0)",
                        ] : "none"
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-lg pointer-events-none"
                    />
                    
                    {/* Message content */}
                    <div className="relative z-10 text-gray-200 whitespace-pre-wrap">
                      {formatMessage(msg.content)}
                    </div>
                    
                    {/* Timestamp */}
                    <div className="text-[10px] mt-2 text-right text-[rgb(3,252,252)]/50">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {/* Suggested questions for assistant messages */}
                    {msg.role === 'assistant' && msg.suggested && msg.suggested.length > 0 && !msg.isError && (
                      <div className="mt-3 pt-2 border-t border-[rgb(3,252,252)]/20">
                        <p className="text-[10px] text-[rgb(3,252,252)]/50 mb-2">Try asking:</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.suggested.map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => handleSuggestedClick(suggestion)}
                              className="text-xs bg-black/40 border border-[rgb(3,252,252)]/30 text-[rgb(3,252,252)] px-2 py-1 rounded hover:border-[rgb(3,252,252)] transition-all"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center space-x-2 bg-black/60 border border-[rgb(3,252,252)]/30 rounded-lg px-4 py-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-[rgb(3,252,252)] rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
                  className="w-2 h-2 bg-[rgb(3,252,252)] rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
                  className="w-2 h-2 bg-[rgb(3,252,252)] rounded-full"
                />
                <span className="text-[rgb(3,252,252)] text-sm ml-2">Analyzing under Indian Cyber Laws...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 overflow-x-auto scrollbar-thin">
          <div className="flex space-x-2">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSuggestedClick(action.query)}
                className="flex items-center space-x-1 text-xs bg-black/40 border border-[rgb(3,252,252)]/30 text-[rgb(3,252,252)] px-3 py-1.5 rounded-full hover:border-[rgb(3,252,252)] hover:shadow-[0_0_15px_rgba(3,252,252,0.3)] transition-all whitespace-nowrap"
              >
                <span>{action.icon}</span>
                <span>{action.text}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-t border-[rgb(3,252,252)]/30 bg-black/60 backdrop-blur-md p-4"
        >
          <div className="relative">
            <textarea
              ref={inputRef}
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your situation or ask about cyber laws..."
              className="w-full bg-black/40 border border-[rgb(3,252,252)]/30 rounded-lg pl-4 pr-12 py-3 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[rgb(3,252,252)] focus:shadow-[0_0_20px_rgba(3,252,252,0.2)] transition-all resize-none"
              style={{ fontFamily: 'inherit' }}
            />
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="absolute right-3 bottom-3 text-[rgb(3,252,252)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Footer with legal disclaimer */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] text-gray-600">
              ⚖️ AI assistant for legal awareness. Not a substitute for professional legal advice.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-[rgb(3,252,252)]/50">
              <Lock className="w-3 h-3" />
              <span>End-to-end encrypted</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        
        * {
          font-family: 'Share Tech Mono', 'Courier New', monospace;
        }
        
        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(3, 252, 252, 0.1);
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(3, 252, 252, 0.3);
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(3, 252, 252, 0.5);
        }
        
        /* Selection color */
        ::selection {
          background: rgb(3, 252, 252);
          color: black;
        }
        
        /* Textarea placeholder */
        textarea::placeholder {
          color: #4a5568;
          font-size: 0.9rem;
        }
        
        /* Smooth animations */
        .message-enter {
          opacity: 0;
          transform: translateY(20px);
        }
        
        .message-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
    </div>
  );
}

export default LawBot;