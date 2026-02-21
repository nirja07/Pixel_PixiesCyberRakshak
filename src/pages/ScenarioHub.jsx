// ScenarioHub.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Comprehensive modules with multiple questions each
const modules = [
  {
    id: 1,
    category: "Phishing Attacks",
    icon: "🎣",
    color: "from-red-500 to-orange-500",
    description: "Learn to spot fake emails, messages, and websites",
    totalQuestions: 15,
    questions: [
      {
        id: 1,
        question: "You receive an email from 'support@paypal-support.net' saying your account is limited. What's suspicious?",
        options: [
          { text: "The sender domain", correct: true, feedback: "✅ Correct! PayPal uses 'paypal.com', not 'paypal-support.net'", xp: 10 },
          { text: "The urgency message", correct: false, feedback: "❌ Urgency is common, but the domain is the real red flag", xp: -5 },
          { text: "The PayPal logo", correct: false, feedback: "❌ Logos can be copied easily", xp: -5 },
          { text: "The time of day", correct: false, feedback: "❌ Time doesn't indicate phishing", xp: -5 }
        ],
        explanation: "Always check the actual sender email address, not just the display name."
      },
      {
        id: 2,
        question: "An email claims you've won $1,000,000 and asks for your bank details to transfer the money. What should you do?",
        options: [
          { text: "Provide bank details", correct: false, feedback: "❌ Never share bank details with strangers!", xp: -15 },
          { text: "Delete and ignore", correct: true, feedback: "✅ Smart! It's a classic advance-fee scam", xp: 10 },
          { text: "Reply asking for more info", correct: false, feedback: "❌ Engaging confirms your email is active", xp: -5 },
          { text: "Forward to cyber crime", correct: true, feedback: "🏆 Excellent! Reporting helps stop scammers", xp: 15 }
        ],
        explanation: "If it sounds too good to be true, it probably is. Never send money or details to claim prizes."
      },
      {
        id: 3,
        question: "You hover over a link in an email and see 'http://192.168.1.1/paypal-login'. What is this?",
        options: [
          { text: "A secure PayPal link", correct: false, feedback: "❌ IP addresses are suspicious!", xp: -10 },
          { text: "An internal network address", correct: true, feedback: "✅ Correct! 192.168.x.x is local network", xp: 12 },
          { text: "A encrypted connection", correct: false, feedback: "❌ No HTTPS and IP address is red flag", xp: -5 },
          { text: "PayPal's backup server", correct: false, feedback: "❌ PayPal doesn't use IP addresses like this", xp: -5 }
        ],
        explanation: "Legitimate companies use domain names, not IP addresses. 192.168.x.x is a private network address."
      },
      {
        id: 4,
        question: "You get a text from 'your bank' with a verification code you didn't request. What's happening?",
        options: [
          { text: "Someone trying to hack you", correct: true, feedback: "✅ Exactly! Someone triggered a password reset", xp: 15 },
          { text: "Bank testing security", correct: false, feedback: "❌ Banks don't test this way", xp: -5 },
          { text: "System glitch", correct: false, feedback: "❌ Possible but unlikely", xp: 0 },
          { text: "Reply STOP to unsubscribe", correct: false, feedback: "❌ Never reply to suspicious texts", xp: -10 }
        ],
        explanation: "If you get an OTP you didn't request, someone is trying to access your account. Don't share it!"
      },
      {
        id: 5,
        question: "Email subject: 'URGENT: Your account will be closed in 24 hours'. What's the goal of this tactic?",
        options: [
          { text: "Create panic and rush", correct: true, feedback: "✅ Correct! Urgency stops critical thinking", xp: 12 },
          { text: "Help you secure account", correct: false, feedback: "❌ Real companies give more notice", xp: -5 },
          { text: "Update their records", correct: false, feedback: "❌ They wouldn't threaten closure", xp: -5 },
          { text: "Test email delivery", correct: false, feedback: "❌ No, this is manipulation", xp: -10 }
        ],
        explanation: "Phishers create urgency so you act without thinking. Legitimate companies give reasonable deadlines."
      },
      {
        id: 6,
        question: "The email greeting says 'Dear Customer' instead of your name. What does this suggest?",
        options: [
          { text: "Mass phishing email", correct: true, feedback: "✅ Correct! Personalized emails are harder to fake", xp: 10 },
          { text: "Professional format", correct: false, feedback: "❌ Real companies use your name", xp: -5 },
          { text: "Automated system", correct: false, feedback: "❌ Even automated emails use names", xp: 0 },
          { text: "Nothing suspicious", correct: false, feedback: "❌ This is actually a red flag", xp: -10 }
        ],
        explanation: "Legitimate companies usually address you by name. 'Dear Customer' often indicates mass phishing."
      },
      {
        id: 7,
        question: "You receive an invoice for a product you didn't buy with a phone number to dispute. What's the scam?",
        options: [
          { text: "Call and get charged", correct: true, feedback: "✅ Correct! Number is premium rate", xp: 15 },
          { text: "They'll refund you", correct: false, feedback: "❌ No, they want you to call", xp: -5 },
          { text: "Wrong email address", correct: false, feedback: "❌ It's intentional", xp: -5 },
          { text: "Free product sample", correct: false, feedback: "❌ No such thing", xp: -10 }
        ],
        explanation: "Fake invoices trick you into calling premium-rate numbers or sharing personal info for 'refunds'."
      },
      {
        id: 8,
        question: "What is 'spear phishing'?",
        options: [
          { text: "Targeted attack on specific person", correct: true, feedback: "✅ Correct! Personalized using your info", xp: 15 },
          { text: "Fishing with a spear", correct: false, feedback: "❌ Wrong kind of fishing!", xp: -10 },
          { text: "Mass email campaign", correct: false, feedback: "❌ That's regular phishing", xp: -5 },
          { text: "Virus attack", correct: false, feedback: "❌ It's a social engineering method", xp: -5 }
        ],
        explanation: "Spear phishing targets specific individuals using personal information to seem legitimate."
      },
      {
        id: 9,
        question: "Email has poor grammar and spelling mistakes. What does this indicate?",
        options: [
          { text: "Likely phishing", correct: true, feedback: "✅ Yes! Many scams come from non-native speakers", xp: 10 },
          { text: "Rushed legitimate email", correct: false, feedback: "❌ Possible but unlikely with companies", xp: 0 },
          { text: "Mobile autocorrect", correct: false, feedback: "❌ Too many mistakes for autocorrect", xp: -5 },
          { text: "Professional writing", correct: false, feedback: "❌ Definitely not professional", xp: -10 }
        ],
        explanation: "While not always true, poor grammar and spelling are common in phishing emails."
      },
      {
        id: 10,
        question: "What's the safest action if an email asks you to verify account details?",
        options: [
          { text: "Open new browser and visit official site", correct: true, feedback: "✅ Perfect! Never click email links", xp: 15 },
          { text: "Click the link in email", correct: false, feedback: "❌ Links can be malicious", xp: -15 },
          { text: "Reply with details", correct: false, feedback: "❌ Never email sensitive info", xp: -15 },
          { text: "Call number in email", correct: false, feedback: "❌ Number could be fake", xp: -10 }
        ],
        explanation: "Always type the official website address yourself or use bookmarks. Never use links or numbers from emails."
      }
    ]
  },
  {
    id: 2,
    category: "Password Security",
    icon: "🔐",
    color: "from-blue-500 to-cyan-500",
    description: "Master the art of creating and managing strong passwords",
    totalQuestions: 12,
    questions: [
      {
        id: 1,
        question: "Which of these is the strongest password?",
        options: [
          { text: "P@ssw0rd123", correct: false, feedback: "❌ Common pattern, easily guessed", xp: -10 },
          { text: "MyDogMax2024", correct: false, feedback: "❌ Contains personal info, easily found", xp: -5 },
          { text: "Purple-Monkey-Dishwasher-789!", correct: true, feedback: "✅ Excellent! Long passphrase with variety", xp: 15 },
          { text: "admin123", correct: false, feedback: "❌ Extremely weak, first to be tried", xp: -15 }
        ],
        explanation: "Long passphrases with random words, numbers, and symbols are hardest to crack."
      },
      {
        id: 2,
        question: "How often should you change your passwords?",
        options: [
          { text: "Every 30 days", correct: false, feedback: "❌ Too frequent leads to weak passwords", xp: 0 },
          { text: "Only when compromised", correct: true, feedback: "✅ Correct! Strong passwords don't need frequent changes", xp: 12 },
          { text: "Every 90 days", correct: false, feedback: "⚠️ Old guideline, no longer recommended", xp: 5 },
          { text: "Once a year", correct: false, feedback: "❌ Too long if compromised", xp: -5 }
        ],
        explanation: "Modern guidelines suggest changing passwords only when compromised, if you use strong unique passwords."
      },
      {
        id: 3,
        question: "What is a password manager?",
        options: [
          { text: "Tool to store encrypted passwords", correct: true, feedback: "✅ Correct! Stores and generates strong passwords", xp: 12 },
          { text: "A notebook for passwords", correct: false, feedback: "❌ Physical, not a manager", xp: -10 },
          { text: "Browser autofill only", correct: false, feedback: "❌ Browser storage is less secure", xp: 0 },
          { text: "Password guessing tool", correct: false, feedback: "❌ That's a hacking tool", xp: -15 }
        ],
        explanation: "Password managers securely store all your passwords encrypted and can generate strong random passwords."
      },
      {
        id: 4,
        question: "Why shouldn't you reuse passwords across sites?",
        options: [
          { text: "One breach compromises all", correct: true, feedback: "✅ Exactly! Credential stuffing attacks", xp: 15 },
          { text: "Harder to remember", correct: false, feedback: "⚠️ True but not main reason", xp: 0 },
          { text: "Sites might compare", correct: false, feedback: "❌ Sites don't share passwords", xp: -5 },
          { text: "It's against rules", correct: false, feedback: "❌ Not the primary reason", xp: -5 }
        ],
        explanation: "If one site gets hacked and you reuse that password, hackers try it on all major platforms."
      },
      {
        id: 5,
        question: "What makes a password 'strong'?",
        options: [
          { text: "Length and complexity", correct: true, feedback: "✅ Correct! 12+ chars with variety", xp: 12 },
          { text: "Birthday and name", correct: false, feedback: "❌ Personal info is easily found", xp: -10 },
          { text: "Common words only", correct: false, feedback: "❌ Dictionary attacks crack these", xp: -10 },
          { text: "All numbers", correct: false, feedback: "❌ Numerical only is very weak", xp: -15 }
        ],
        explanation: "Strong passwords are long (12+ characters) and include uppercase, lowercase, numbers, and symbols."
      },
      {
        id: 6,
        question: "What is two-factor authentication (2FA)?",
        options: [
          { text: "Second layer of security", correct: true, feedback: "✅ Correct! Something you know + have", xp: 12 },
          { text: "Two passwords", correct: false, feedback: "❌ That's just two of same type", xp: -10 },
          { text: "Double encryption", correct: false, feedback: "❌ Not the same", xp: -5 },
          { text: "Security questions", correct: false, feedback: "❌ Those are weak backup", xp: -5 }
        ],
        explanation: "2FA requires two different types of verification (password + phone/app/token)."
      },
      {
        id: 7,
        question: "Which 2FA method is most secure?",
        options: [
          { text: "Authenticator app", correct: true, feedback: "✅ Best! App-based TOTP is very secure", xp: 15 },
          { text: "SMS code", correct: false, feedback: "❌ SMS can be intercepted via SIM swap", xp: -5 },
          { text: "Email code", correct: false, feedback: "❌ If email hacked, 2FA bypassed", xp: -10 },
          { text: "Security questions", correct: false, feedback: "❌ Info can be found online", xp: -15 }
        ],
        explanation: "Authenticator apps (Google Authenticator, Authy) are most secure as they're not transmitted."
      },
      {
        id: 8,
        question: "Your password manager master password should be:",
        options: [
          { text: "Long and memorable", correct: true, feedback: "✅ Correct! Memorize this one password", xp: 12 },
          { text: "Written on sticky note", correct: false, feedback: "❌ Physical security risk", xp: -15 },
          { text: "Same as email password", correct: false, feedback: "❌ Never reuse master password!", xp: -15 },
          { text: "Short and simple", correct: false, feedback: "❌ Master password must be strong", xp: -10 }
        ],
        explanation: "Your master password should be strong but memorable since you can't reset it without losing access."
      },
      {
        id: 9,
        question: "What is credential stuffing?",
        options: [
          { text: "Using leaked passwords on other sites", correct: true, feedback: "✅ Correct! Automated attacks with stolen credentials", xp: 15 },
          { text: "Filling forms with fake data", correct: false, feedback: "❌ That's form spam", xp: -5 },
          { text: "Password cracking software", correct: false, feedback: "❌ Different type of attack", xp: 0 },
          { text: "Saving passwords in browser", correct: false, feedback: "❌ That's autofill", xp: -10 }
        ],
        explanation: "Hackers take leaked passwords from one breach and try them on other sites automatically."
      },
      {
        id: 10,
        question: "How long would it take to crack 'Tr0ub4dor&3'?",
        options: [
          { text: "About 3 days", correct: true, feedback: "✅ Correct! Common substitutions are predictable", xp: 12 },
          { text: "Centuries", correct: false, feedback: "❌ Too optimistic, pattern is common", xp: -5 },
          { text: "Instantly", correct: false, feedback: "❌ Not that weak, but still weak", xp: 0 },
          { text: "1 year", correct: false, feedback: "❌ Less than that with modern hardware", xp: -5 }
        ],
        explanation: "Common substitutions (a→4, o→0, e→3) are well-known to password crackers."
      }
    ]
  },
  {
    id: 3,
    category: "Social Engineering",
    icon: "🎭",
    color: "from-purple-500 to-pink-500",
    description: "Recognize and resist manipulation tactics",
    totalQuestions: 12,
    questions: [
      {
        id: 1,
        question: "Someone calls claiming to be from 'Microsoft Support' about a virus on your computer. What do you do?",
        options: [
          { text: "Let them remote access", correct: false, feedback: "❌ Never give strangers access!", xp: -20 },
          { text: "Hang up immediately", correct: true, feedback: "✅ Correct! Microsoft doesn't call randomly", xp: 15 },
          { text: "Ask for employee ID", correct: false, feedback: "⚠️ They'll fake an ID, just hang up", xp: 0 },
          { text: "Buy their software", correct: false, feedback: "❌ It's malware disguised as security", xp: -20 }
        ],
        explanation: "Tech support scams are common. Legitimate companies never make unsolicited calls about problems."
      },
      {
        id: 2,
        question: "A colleague you've never met asks for your login to 'test a system'. What's the risk?",
        options: [
          { text: "Insider threat", correct: true, feedback: "✅ Correct! Never share credentials", xp: 15 },
          { text: "They're new", correct: false, feedback: "❌ New employees should follow proper channels", xp: -5 },
          { text: "IT requested help", correct: false, feedback: "❌ IT never asks for passwords", xp: -10 },
          { text: "System testing", correct: false, feedback: "❌ Testing uses test accounts", xp: -5 }
        ],
        explanation: "Never share credentials. Legitimate requests come through proper channels with official accounts."
      },
      {
        id: 3,
        question: "You find a USB stick in the parking lot labeled 'Executive Salaries'. What do you do?",
        options: [
          { text: "Plug in to check", correct: false, feedback: "❌ Could be BadUSB malware!", xp: -20 },
          { text: "Give to IT security", correct: true, feedback: "✅ Perfect! Let experts handle it", xp: 15 },
          { text: "Throw in trash", correct: false, feedback: "⚠️ Someone else might find it", xp: 0 },
          { text: "Keep as spare", correct: false, feedback: "❌ Never use unknown USBs", xp: -15 }
        ],
        explanation: "Attackers leave malware-infected USBs hoping curiosity will get the better of someone."
      },
      {
        id: 4,
        question: "Someone impersonates a vendor and asks you to change bank details for payments. What's the scam?",
        options: [
          { text: "Payment redirection fraud", correct: true, feedback: "✅ Correct! They want payments sent to them", xp: 18 },
          { text: "Phishing for info", correct: false, feedback: "⚠️ Partially, but main goal is money", xp: 5 },
          { text: "Testing processes", correct: false, feedback: "❌ No, it's fraud", xp: -10 },
          { text: "New account setup", correct: false, feedback: "❌ Verify through known channels first", xp: 0 }
        ],
        explanation: "Always verify payment detail changes through known phone numbers, not email or new contacts."
      },
      {
        id: 5,
        question: "What is 'pretexting' in social engineering?",
        options: [
          { text: "Creating fake scenario to get info", correct: true, feedback: "✅ Correct! Inventing a story to trick you", xp: 15 },
          { text: "Email phishing", correct: false, feedback: "❌ That's a different tactic", xp: -5 },
          { text: "Password guessing", correct: false, feedback: "❌ Technical attack, not social", xp: -10 },
          { text: "Fake website", correct: false, feedback: "❌ That's phishing infrastructure", xp: -5 }
        ],
        explanation: "Pretexting involves creating a fabricated scenario to steal personal information."
      },
      {
        id: 6,
        question: "You get a call from 'HR' asking for your SSN to update records. What's suspicious?",
        options: [
          { text: "HR should already have it", correct: true, feedback: "✅ Correct! They wouldn't ask for what they have", xp: 12 },
          { text: "Caller's voice", correct: false, feedback: "❌ Not reliable indicator", xp: 0 },
          { text: "Time of call", correct: false, feedback: "❌ Could be any time", xp: -5 },
          { text: "Phone number", correct: false, feedback: "❌ Numbers can be spoofed", xp: 5 }
        ],
        explanation: "Legitimate HR departments already have your sensitive info and won't ask for it over phone."
      },
      {
        id: 7,
        question: "What is 'baiting' in security terms?",
        options: [
          { text: "Offering something tempting to trap you", correct: true, feedback: "✅ Correct! Like free movies with malware", xp: 15 },
          { text: "Fishing with worms", correct: false, feedback: "❌ Wrong kind of bait", xp: -10 },
          { text: "Email attachments", correct: false, feedback: "❌ That's phishing", xp: -5 },
          { text: "Fake websites", correct: false, feedback: "❌ That's pharming", xp: -5 }
        ],
        explanation: "Baiting offers something enticing (free music, movies) that actually contains malware."
      },
      {
        id: 8,
        question: "Someone you met online asks for money for an 'emergency'. You've never met in person. What's this?",
        options: [
          { text: "Romance scam", correct: true, feedback: "✅ Classic romance scam tactic", xp: 15 },
          { text: "Genuine emergency", correct: false, feedback: "❌ Too convenient, too soon", xp: -15 },
          { text: "Loan request", correct: false, feedback: "❌ Never lend to online strangers", xp: -10 },
          { text: "Trust exercise", correct: false, feedback: "❌ No, it's fraud", xp: -15 }
        ],
        explanation: "Romance scammers build fake relationships then invent emergencies to ask for money."
      },
      {
        id: 9,
        question: "What should you verify when contacted unexpectedly?",
        options: [
          { text: "All of these", correct: true, feedback: "✅ Correct! Verify through official channels", xp: 18 },
          { text: "Caller's identity", correct: false, feedback: "⚠️ Need more than just identity", xp: 5 },
          { text: "Request legitimacy", correct: false, feedback: "⚠️ Part of verification", xp: 5 },
          { text: "Through official numbers", correct: false, feedback: "⚠️ Important but not complete", xp: 5 }
        ],
        explanation: "Always verify unexpected contacts through official channels you find yourself, not what they provide."
      },
      {
        id: 10,
        question: "A 'CEO' emails you urgently asking to buy gift cards. What's happening?",
        options: [
          { text: "Whaling attack", correct: true, feedback: "✅ Correct! Targeting executives", xp: 15 },
          { text: "CEO needs gifts", correct: false, feedback: "❌ Execs don't ask this way", xp: -15 },
          { text: "Company policy", correct: false, feedback: "❌ Not standard procedure", xp: -10 },
          { text: "Testing you", correct: false, feedback: "❌ Unlikely, always verify", xp: 0 }
        ],
        explanation: "Whaling targets senior executives with fake urgent requests, often for gift cards or transfers."
      }
    ]
  },
  {
    id: 4,
    category: "Public WiFi Safety",
    icon: "📡",
    color: "from-green-500 to-teal-500",
    description: "Stay secure on unsecured networks",
    totalQuestions: 10,
    questions: [
      {
        id: 1,
        question: "You're at a coffee shop and need to check bank balance. What's safest?",
        options: [
          { text: "Use public WiFi directly", correct: false, feedback: "❌ Others can see your traffic", xp: -15 },
          { text: "Use mobile hotspot", correct: true, feedback: "✅ Best! Cellular data is more secure", xp: 15 },
          { text: "Ask for password", correct: false, feedback: "⚠️ Still public network", xp: 0 },
          { text: "Use no password site", correct: false, feedback: "❌ Banking always needs security", xp: -10 }
        ],
        explanation: "Mobile hotspots use cellular encryption. Public WiFi can be intercepted by anyone nearby."
      },
      {
        id: 2,
        question: "What does a VPN do on public WiFi?",
        options: [
          { text: "Encrypts all traffic", correct: true, feedback: "✅ Correct! Creates secure tunnel", xp: 15 },
          { text: "Speeds up connection", correct: false, feedback: "❌ May actually slow slightly", xp: -5 },
          { text: "Blocks all websites", correct: false, feedback: "❌ No, it routes traffic", xp: -10 },
          { text: "Shows your location", correct: false, feedback: "❌ It hides your location", xp: -5 }
        ],
        explanation: "VPN encrypts everything between you and the VPN server, protecting from local network snooping."
      },
      {
        id: 3,
        question: "You see two WiFi networks: 'Starbucks' and 'Starbucks-Free-WiFi'. Which is likely malicious?",
        options: [
          { text: "Starbucks-Free-WiFi", correct: true, feedback: "✅ Correct! Evil twin attack", xp: 18 },
          { text: "Starbucks", correct: false, feedback: "❌ This is probably the real one", xp: -5 },
          { text: "Both are safe", correct: false, feedback: "❌ One is fake", xp: -15 },
          { text: "Neither is safe", correct: false, feedback: "⚠️ True but one is trap", xp: 0 }
        ],
        explanation: "Attackers set up 'evil twin' networks with similar names to intercept your data."
      },
      {
        id: 4,
        question: "What information can be seen on unencrypted public WiFi?",
        options: [
          { text: "All of these", correct: true, feedback: "✅ Correct! Everything is visible", xp: 18 },
          { text: "Websites visited", correct: false, feedback: "⚠️ Yes, but more too", xp: 5 },
          { text: "Passwords (if no HTTPS)", correct: false, feedback: "⚠️ Yes, unencrypted traffic", xp: 5 },
          { text: "Emails sent", correct: false, feedback: "⚠️ If no encryption", xp: 5 }
        ],
        explanation: "On open WiFi, hackers can see all unencrypted traffic including sites, messages, and passwords."
      },
      {
        id: 5,
        question: "What does HTTPS provide?",
        options: [
          { text: "Encryption between you and site", correct: true, feedback: "✅ Correct! Secures the connection", xp: 12 },
          { text: "Virus protection", correct: false, feedback: "❌ No, that's antivirus", xp: -10 },
          { text: "Faster browsing", correct: false, feedback: "❌ Slightly slower due to encryption", xp: -5 },
          { text: "WiFi password", correct: false, feedback: "❌ Not related", xp: -15 }
        ],
        explanation: "HTTPS encrypts data between your browser and the website, protecting from local eavesdropping."
      },
      {
        id: 6,
        question: "Should you use public WiFi for online banking?",
        options: [
          { text: "Never, use cellular data", correct: true, feedback: "✅ Correct! Too risky", xp: 15 },
          { text: "Only with VPN", correct: false, feedback: "⚠️ Better but still risky", xp: 5 },
          { text: "Yes, if HTTPS", correct: false, feedback: "❌ HTTPS alone isn't enough", xp: -10 },
          { text: "Sometimes", correct: false, feedback: "❌ Never worth the risk", xp: -15 }
        ],
        explanation: "Banking on public WiFi risks man-in-the-middle attacks. Use cellular data or wait."
      },
      {
        id: 7,
        question: "What is a 'man-in-the-middle' attack?",
        options: [
          { text: "Attacker intercepts your traffic", correct: true, feedback: "✅ Correct! They sit between you and site", xp: 15 },
          { text: "Physical attack", correct: false, feedback: "❌ Digital attack", xp: -10 },
          { text: "Virus infection", correct: false, feedback: "❌ Different type", xp: -5 },
          { text: "Password theft", correct: false, feedback: "❌ Result of attack", xp: 0 }
        ],
        explanation: "MITM attacks intercept communication, allowing attackers to see and modify data."
      },
      {
        id: 8,
        question: "What should you disable when on public WiFi?",
        options: [
          { text: "File sharing", correct: true, feedback: "✅ Correct! Prevent local access", xp: 12 },
          { text: "WiFi itself", correct: false, feedback: "❌ Then you can't connect", xp: -5 },
          { text: "Browser", correct: false, feedback: "❌ Need to use internet", xp: -10 },
          { text: "Screen brightness", correct: false, feedback: "❌ Not security related", xp: -15 }
        ],
        explanation: "Disable file sharing and network discovery to prevent others on the network accessing your device."
      },
      {
        id: 9,
        question: "Is a password-protected public WiFi safe?",
        options: [
          { text: "No, password is public", correct: true, feedback: "✅ Correct! Everyone has same password", xp: 12 },
          { text: "Yes, password protects", correct: false, feedback: "❌ Password is shared with everyone", xp: -10 },
          { text: "Somewhat safe", correct: false, feedback: "❌ Not really, all traffic visible", xp: 0 },
          { text: "Depends on password", correct: false, feedback: "❌ Password strength doesn't matter", xp: -5 }
        ],
        explanation: "Password-protected public WiFi still exposes your traffic to everyone else on the network."
      },
      {
        id: 10,
        question: "What's the first thing to do when connecting to public WiFi?",
        options: [
          { text: "Turn on firewall", correct: true, feedback: "✅ Good! Also disable sharing", xp: 12 },
          { text: "Check email", correct: false, feedback: "❌ Do security first", xp: -10 },
          { text: "Login to bank", correct: false, feedback: "❌ Never on public WiFi", xp: -15 },
          { text: "Update software", correct: false, feedback: "❌ Do before traveling", xp: 0 }
        ],
        explanation: "Ensure firewall is on, file sharing off, and ideally use VPN before any online activity."
      }
    ]
  },
  {
    id: 5,
    category: "Physical Security",
    icon: "🚪",
    color: "from-yellow-500 to-orange-500",
    description: "Protect assets in the physical world",
    totalQuestions: 10,
    questions: [
      {
        id: 1,
        question: "Someone follows you through a secure door without badging. What do you do?",
        options: [
          { text: "Politely ask for badge", correct: true, feedback: "✅ Correct! Challenge politely", xp: 15 },
          { text: "Hold door open", correct: false, feedback: "❌ Never tailgate!", xp: -15 },
          { text: "Ignore and walk fast", correct: false, feedback: "❌ Security is everyone's job", xp: -10 },
          { text: "Report to security", correct: true, feedback: "🏆 Excellent! Report incidents", xp: 18 }
        ],
        explanation: "Always challenge tailgaters politely. Real employees understand security protocols."
      },
      {
        id: 2,
        question: "You find a confidential document in the printer. What should you do?",
        options: [
          { text: "Shred it securely", correct: true, feedback: "✅ Correct! Proper disposal", xp: 12 },
          { text: "Read and leave", correct: false, feedback: "❌ Security breach!", xp: -15 },
          { text: "Post on desk", correct: false, feedback: "❌ Still exposed", xp: -10 },
          { text: "Give to anyone", correct: false, feedback: "❌ Return to owner or shred", xp: -10 }
        ],
        explanation: "Sensitive documents should be shredded or returned to owner immediately."
      },
      {
        id: 3,
        question: "What is a 'clean desk' policy?",
        options: [
          { text: "No sensitive papers left out", correct: true, feedback: "✅ Correct! Clear desk at end of day", xp: 12 },
          { text: "Clean your desk weekly", correct: false, feedback: "❌ About security, not cleaning", xp: -5 },
          { text: "No food at desk", correct: false, feedback: "❌ Hygiene, not security", xp: -10 },
          { text: "Organized files", correct: false, feedback: "❌ Organization ≠ security", xp: 0 }
        ],
        explanation: "Clean desk policy means no sensitive information visible when you're away from your desk."
      },
      {
        id: 4,
        question: "Should you wear your ID badge outside the office?",
        options: [
          { text: "No, hide it", correct: true, feedback: "✅ Correct! Don't advertise workplace", xp: 15 },
          { text: "Yes, show proudly", correct: false, feedback: "❌ Attracts bad actors", xp: -15 },
          { text: "Only if required", correct: false, feedback: "❌ Better to hide", xp: 0 },
          { text: "Reverse side out", correct: false, feedback: "❌ Still visible", xp: -5 }
        ],
        explanation: "Wearing badges outside identifies you as a target for social engineering or theft."
      },
      {
        id: 5,
        question: "What's the risk of discussing work in public places?",
        options: [
          { text: "Eavesdropping", correct: true, feedback: "✅ Correct! Someone might overhear", xp: 12 },
          { text: "Disturbing others", correct: false, feedback: "❌ Rude but not security", xp: 0 },
          { text: "Nothing, it's public", correct: false, feedback: "❌ Big security risk!", xp: -15 },
          { text: "Bad manners", correct: false, feedback: "❌ Security > manners", xp: -5 }
        ],
        explanation: "Competitors or attackers might overhear sensitive information in cafes, trains, etc."
      },
      {
        id: 6,
        question: "Someone without ID asks you to let them into server room for 'emergency'. What do you do?",
        options: [
          { text: "Deny and report", correct: true, feedback: "✅ Correct! Never bypass security", xp: 18 },
          { text: "Let them in", correct: false, feedback: "❌ Could be attacker!", xp: -20 },
          { text: "Call supervisor", correct: true, feedback: "✅ Good! Verify first", xp: 15 },
          { text: "Ask colleague", correct: false, feedback: "⚠️ Still bypassing protocol", xp: 0 }
        ],
        explanation: "Emergencies don't bypass security. Always follow proper verification procedures."
      },
      {
        id: 7,
        question: "What's the safest way to dispose of old hard drives?",
        options: [
          { text: "Physical destruction", correct: true, feedback: "✅ Correct! Drill or shred", xp: 15 },
          { text: "Delete files", correct: false, feedback: "❌ Files can be recovered", xp: -15 },
          { text: "Format drive", correct: false, feedback: "❌ Also recoverable", xp: -10 },
          { text: "Throw in trash", correct: false, feedback: "❌ Data remains accessible", xp: -20 }
        ],
        explanation: "Physical destruction or specialized degaussing is the only way to ensure data can't be recovered."
      },
      {
        id: 8,
        question: "You see someone suspicious taking photos of the building. What do you do?",
        options: [
          { text: "Report to security", correct: true, feedback: "✅ Correct! Let experts handle", xp: 15 },
          { text: "Confront them", correct: false, feedback: "❌ Potentially dangerous", xp: -5 },
          { text: "Take their photo", correct: false, feedback: "❌ Escalates situation", xp: -10 },
          { text: "Ignore it", correct: false, feedback: "❌ Could be reconnaissance", xp: -15 }
        ],
        explanation: "Report suspicious activity to security rather than confronting potentially dangerous individuals."
      },
      {
        id: 9,
        question: "What should you do with your laptop at airports?",
        options: [
          { text: "Keep with you always", correct: true, feedback: "✅ Correct! Never check or leave", xp: 12 },
          { text: "Check with luggage", correct: false, feedback: "❌ Risk of theft/damage", xp: -15 },
          { text: "Leave at charging station", correct: false, feedback: "❌ Unattended devices get stolen", xp: -15 },
          { text: "Ask stranger to watch", correct: false, feedback: "❌ Never trust strangers", xp: -20 }
        ],
        explanation: "Always keep devices with you. Airport charging stations are also risks for 'juice jacking'."
      },
      {
        id: 10,
        question: "What is 'shoulder surfing'?",
        options: [
          { text: "Looking at your screen", correct: true, feedback: "✅ Correct! Someone reading over shoulder", xp: 12 },
          { text: "Internet surfing", correct: false, feedback: "❌ Different kind of surfing", xp: -10 },
          { text: "Physical attack", correct: false, feedback: "❌ Observation attack", xp: 0 },
          { text: "WiFi hacking", correct: false, feedback: "❌ Different technique", xp: -5 }
        ],
        explanation: "Shoulder surfing is looking at your screen or keyboard to steal information in public."
      }
    ]
  },
  {
    id: 6,
    category: "Multi-Factor Authentication",
    icon: "📱",
    color: "from-indigo-500 to-purple-500",
    description: "Master the art of second-factor security",
    totalQuestions: 10,
    questions: [
      {
        id: 1,
        question: "What does MFA protect against even if password is stolen?",
        options: [
          { text: "Unauthorized access", correct: true, feedback: "✅ Correct! Need second factor", xp: 15 },
          { text: "Viruses", correct: false, feedback: "❌ MFA doesn't stop malware", xp: -5 },
          { text: "Data theft", correct: false, feedback: "⚠️ Helps but not primary", xp: 0 },
          { text: "Everything", correct: false, feedback: "❌ No single solution", xp: -10 }
        ],
        explanation: "MFA adds a second layer so stolen passwords alone aren't enough for access."
      },
      {
        id: 2,
        question: "Which is an example of 'something you have'?",
        options: [
          { text: "Phone with authenticator", correct: true, feedback: "✅ Correct! Physical possession", xp: 12 },
          { text: "Password", correct: false, feedback: "❌ That's something you know", xp: -5 },
          { text: "PIN number", correct: false, feedback: "❌ Also something you know", xp: -5 },
          { text: "Birth date", correct: false, feedback: "❌ Personal info, not possession", xp: -10 }
        ],
        explanation: "Something you have includes phones, hardware tokens, or smart cards."
      },
      {
        id: 3,
        question: "What is 'something you are' in MFA?",
        options: [
          { text: "Biometrics", correct: true, feedback: "✅ Correct! Fingerprint, face, iris", xp: 12 },
          { text: "Your name", correct: false, feedback: "❌ That's identification", xp: -10 },
          { text: "Your location", correct: false, feedback: "❌ That's contextual", xp: -5 },
          { text: "Your job title", correct: false, feedback: "❌ Not authentication factor", xp: -10 }
        ],
        explanation: "Biometrics use unique physical characteristics to verify identity."
      },
      {
        id: 4,
        question: "Why is SMS less secure than authenticator apps?",
        options: [
          { text: "SIM swapping possible", correct: true, feedback: "✅ Correct! SIM can be stolen", xp: 15 },
          { text: "Texts are slow", correct: false, feedback: "❌ Speed isn't security", xp: -5 },
          { text: "Phones break", correct: false, feedback: "❌ That's reliability", xp: -5 },
          { text: "Cost money", correct: false, feedback: "❌ Cost ≠ security", xp: -10 }
        ],
        explanation: "SMS can be intercepted via SIM swapping or SS7 protocol vulnerabilities."
      },
      {
        id: 5,
        question: "What are backup codes for?",
        options: [
          { text: "Access if phone lost", correct: true, feedback: "✅ Correct! One-time use backups", xp: 12 },
          { text: "Extra passwords", correct: false, feedback: "❌ Not for regular use", xp: -5 },
          { text: "Sharing with family", correct: false, feedback: "❌ Never share!", xp: -15 },
          { text: "Testing system", correct: false, feedback: "❌ Emergency access only", xp: -5 }
        ],
        explanation: "Backup codes are one-time use codes to access your account if you lose your MFA device."
      },
      {
        id: 6,
        question: "How often should you use MFA?",
        options: [
          { text: "Every time possible", correct: true, feedback: "✅ Correct! Enable everywhere", xp: 15 },
          { text: "Only for banking", correct: false, feedback: "❌ Use for all important accounts", xp: -10 },
          { text: "Once a month", correct: false, feedback: "❌ Not how MFA works", xp: -15 },
          { text: "When prompted", correct: false, feedback: "❌ Enable proactively", xp: 0 }
        ],
        explanation: "Enable MFA on every account that supports it for maximum protection."
      },
      {
        id: 7,
        question: "What is a hardware security key?",
        options: [
          { text: "Physical USB/NFC device", correct: true, feedback: "✅ Correct! Like YubiKey", xp: 15 },
          { text: "Encrypted hard drive", correct: false, feedback: "❌ Different device", xp: -5 },
          { text: "Special keyboard", correct: false, feedback: "❌ Not for authentication", xp: -10 },
          { text: "Security camera", correct: false, feedback: "❌ Physical security, not MFA", xp: -10 }
        ],
        explanation: "Hardware security keys are physical devices that provide the most secure form of MFA."
      },
      {
        id: 8,
        question: "You get an MFA prompt you didn't request. What should you do?",
        options: [
          { text: "Deny and change password", correct: true, feedback: "✅ Correct! Someone has your password", xp: 18 },
          { text: "Approve to stop", correct: false, feedback: "❌ That gives them access!", xp: -20 },
          { text: "Ignore it", correct: false, feedback: "❌ Take action, change password", xp: -10 },
          { text: "Call the number", correct: false, feedback: "❌ Could be scam", xp: -5 }
        ],
        explanation: "Unexpected MFA prompts mean someone has your password. Deny and change password immediately."
      },
      {
        id: 9,
        question: "What's better: MFA app on same phone as email?",
        options: [
          { text: "No, use separate device", correct: true, feedback: "✅ Correct! Separation is more secure", xp: 15 },
          { text: "Yes, convenient", correct: false, feedback: "❌ Convenience ≠ security", xp: -5 },
          { text: "Doesn't matter", correct: false, feedback: "❌ It does matter", xp: -10 },
          { text: "Phone is always safe", correct: false, feedback: "❌ Phones get compromised", xp: -10 }
        ],
        explanation: "If your phone is compromised, having both email and MFA on it means both factors are lost."
      },
      {
        id: 10,
        question: "What is 'push bombing' or 'MFA fatigue'?",
        options: [
          { text: "Spamming with MFA requests", correct: true, feedback: "✅ Correct! Hope you approve accidentally", xp: 15 },
          { text: "Too many MFA setups", correct: false, feedback: "❌ Attack technique", xp: -5 },
          { text: "Battery drain attack", correct: false, feedback: "❌ Different attack", xp: -10 },
          { text: "MFA server down", correct: false, feedback: "❌ Availability issue", xp: -5 }
        ],
        explanation: "Attackers send many MFA requests hoping you'll approve one to stop notifications."
      }
    ]
  }
];

const ScenarioHub = ({ player, setPlayer, addNotification }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [moduleProgress, setModuleProgress] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', ...new Set(modules.map(m => m.category))];

  const filteredModules = modules.filter(m => 
    filter === 'all' || m.category === filter
  );

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowResult(true);
    
    // Update player stats
    const newXP = player.xp + option.xp;
    const newTotalQuestions = player.totalQuestions + 1;
    const newCorrectAnswers = option.correct ? player.correctAnswers + 1 : player.correctAnswers;
    let newLevel = player.level;
    let newStreak = option.correct ? player.streak + 1 : 0;
    
    // Level up logic
    if (newXP >= player.level * 500) {
      newLevel = player.level + 1;
      addNotification(`🎉 LEVEL UP! You're now level ${newLevel}`, 'success');
    }

    // Update module progress
    const updatedProgress = { ...moduleProgress };
    if (!updatedProgress[selectedModule.id]) {
      updatedProgress[selectedModule.id] = { completed: 0, total: selectedModule.questions.length };
    }
    
    if (!player.completedModules[`${selectedModule.id}-q${selectedModule.questions[currentQuestion].id}`]) {
      updatedProgress[selectedModule.id].completed += 1;
    }

    setModuleProgress(updatedProgress);

    // Check for badges
    const newBadges = [...player.badges];
    
    // First correct answer
    if (option.correct && player.correctAnswers === 0) {
      newBadges.push({ id: 'first-blood', name: 'First Blood', icon: '🎯' });
      addNotification('🏆 Badge Unlocked: First Blood', 'success');
    }

    // Perfect module
    if (updatedProgress[selectedModule.id]?.completed === selectedModule.questions.length) {
      newBadges.push({ id: `perfect-${selectedModule.id}`, name: `${selectedModule.category} Master`, icon: '🏆' });
      addNotification(`🏆 Badge Unlocked: ${selectedModule.category} Master`, 'success');
    }

    // Streak achievements
    if (newStreak === 5) {
      newBadges.push({ id: 'streak-5', name: 'On Fire!', icon: '🔥' });
      addNotification('🏆 Badge Unlocked: On Fire! (5 streak)', 'success');
    }
    if (newStreak === 10) {
      newBadges.push({ id: 'streak-10', name: 'Unstoppable', icon: '⚡' });
      addNotification('🏆 Badge Unlocked: Unstoppable (10 streak)', 'success');
    }

    setPlayer({
      ...player,
      xp: newXP,
      level: newLevel,
      streak: newStreak,
      badges: newBadges,
      totalQuestions: newTotalQuestions,
      correctAnswers: newCorrectAnswers,
      completedModules: {
        ...player.completedModules,
        [`${selectedModule.id}-q${selectedModule.questions[currentQuestion].id}`]: option.correct
      }
    });

    // Show feedback
    addNotification(option.feedback, option.correct ? 'success' : 'error');
  };

  const handleNext = () => {
    if (currentQuestion + 1 < selectedModule.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResult(false);
      setSelectedOption(null);
    } else {
      // Module complete
      addNotification(`🎉 Module Complete! +100 Bonus XP`, 'success');
      setPlayer({
        ...player,
        xp: player.xp + 100
      });
      setSelectedModule(null);
      setCurrentQuestion(0);
      setShowResult(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">TRAINING MODULES</h2>
          <p className="text-sm text-gray-400">Complete modules to earn XP and badges</p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 md:w-64 px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-gray-800">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Module Selection or Question View */}
      {!selectedModule ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map(module => {
            const progress = moduleProgress[module.id]?.completed || 0;
            const total = module.questions.length;
            const percent = (progress / total) * 100;
            
            return (
              <motion.div
                key={module.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedModule(module)}
                className="bg-white-800/50 backdrop-blur rounded-xl p-4 border-2 border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`text-3xl bg-gradient-to-br ${module.color} p-3 rounded-lg`}>
                    {module.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-600">{module.category}</h3>
                    <p className="text-xs text-gray-400 mt-1">{module.description}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cyan-400">{progress}/{total} questions</span>
                    <span className="text-gray-400">{Math.round(percent)}%</span>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Question View */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-cyan-500/30"
        >
          {/* Module Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedModule(null);
                  setCurrentQuestion(0);
                  setShowResult(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                ← Back
              </button>
              <div className={`text-2xl bg-gradient-to-br ${selectedModule.color} p-2 rounded-lg`}>
                {selectedModule.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedModule.category}</h3>
                <p className="text-sm text-cyan-400">
                  Question {currentQuestion + 1} of {selectedModule.questions.length}
                </p>
              </div>
            </div>
            
            {/* Progress Circle */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-gray-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 * (1 - (currentQuestion + 1) / selectedModule.questions.length)}
                  className="text-cyan-400"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {currentQuestion + 1}/{selectedModule.questions.length}
              </span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6 p-6 bg-gray-700/30 rounded-lg border border-gray-600">
            <p className="text-lg text-white">{selectedModule.questions[currentQuestion].question}</p>
          </div>

          {/* Options */}
          {!showResult ? (
            <div className="space-y-3">
              {selectedModule.questions[currentQuestion].options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleOptionClick(option)}
                  className="w-full text-left p-4 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600 hover:border-cyan-400 rounded-lg transition"
                >
                  <span className="text-gray-300">{option.text}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            /* Result */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className={`p-4 rounded-lg ${
                selectedOption.correct 
                  ? 'bg-green-500/20 border border-green-500' 
                  : 'bg-red-500/20 border border-red-500'
              }`}>
                <p className="text-white font-medium mb-2">{selectedOption.feedback}</p>
                <p className="text-gray-300 text-sm">{selectedModule.questions[currentQuestion].explanation}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-cyan-400">XP Gained: {selectedOption.xp}</span>
                  {selectedOption.correct && (
                    <span className="ml-3 text-green-400">✓ Correct!</span>
                  )}
                </div>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition"
                >
                  {currentQuestion + 1 === selectedModule.questions.length ? 'Complete Module' : 'Next Question →'}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ScenarioHub;