// CyberQuest.jsx - Enhanced White/Blue Theme with Daily Challenge
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Target, 
  Award, 
  Zap, 
  BookOpen, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info,
  Wifi,
  Users,
  Key,
  Mail,
  Smartphone,
  DoorOpen,
  Heart,
  Home,
  Calendar,
  Star,
  Lock,
  UserCheck,
  Briefcase,
  Globe,
  Fingerprint,
  MessageCircle,
  Eye,
  Camera,
  Cpu,
  Sparkles,
  Trophy,
  Medal,
  Crown,
  Flame,
  ChevronRight,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Gift,
  Check,
  ArrowRight
} from 'lucide-react';
import ScenarioHub from './ScenarioHub';
import Navbar from './Navbar';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // make sure path is correct

// Save player stats to Firestore
const savePlayerStats = async (playerData) => {
  if (!auth.currentUser) return;
  try {
    await setDoc(doc(db, "players", auth.currentUser.uid), playerData);
    console.log("Player stats saved!");
  } catch (error) {
    console.error("Error saving stats:", error);
  }
};

// Load player stats from Firestore
const loadPlayerStats = async () => {
  if (!auth.currentUser) return null;
  try {
    const docRef = doc(db, "players", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error loading stats:", error);
    return null;
  }
};

const CyberQuest = () => {
  const [player, setPlayer] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    badges: [],
    completedModules: {},
    totalQuestions: 0,
    correctAnswers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      const data = await loadPlayerStats();
      if (data) {
        setPlayer(data);
      }
      setLoading(false);
    };
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPlayer();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (auth.currentUser && !loading) {
      savePlayerStats(player);
    }
  }, [player, loading]);
  
  const [selectedMode, setSelectedMode] = useState('hub');
  const [notifications, setNotifications] = useState([]);
  
  // Daily Challenge State
  const [dailyChallenge, setDailyChallenge] = useState(() => {
    const saved = localStorage.getItem('dailyChallenge');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      completed: false,
      lastClaimed: null,
      xpReward: 100
    };
  });

  // Calculate stats
  const totalModules = 7;
  const completedCount = Object.keys(player.completedModules).length;
  const xpNeeded = player.level * 500;
  const progress = player.level > 0 ? (player.xp / xpNeeded) * 100 : 0;
  const accuracy = player.totalQuestions > 0 
    ? Math.round((player.correctAnswers / player.totalQuestions) * 100) 
    : 0;

  const modules = [
    { id: 'phishing', name: 'Phishing Attacks', icon: Mail, color: 'blue', desc: 'Spot and avoid email scams', questions: 15 },
    { id: 'password', name: 'Password Security', icon: Key, color: 'indigo', desc: 'Create strong, unique passwords', questions: 12 },
    { id: 'social', name: 'Social Engineering', icon: Users, color: 'purple', desc: 'Recognize manipulation tactics', questions: 12 },
    { id: 'wifi', name: 'Public WiFi Safety', icon: Wifi, color: 'cyan', desc: 'Stay safe on public networks', questions: 10 },
    { id: 'physical', name: 'Physical Security', icon: DoorOpen, color: 'orange', desc: 'Protect devices and data', questions: 10 },
    { id: 'mfa', name: 'Multi-Factor Authentication', icon: Smartphone, color: 'emerald', desc: 'Enable 2FA everywhere', questions: 10 },
    { id: 'bullying', name: 'Cyberbullying', icon: Heart, color: 'pink', desc: 'Identify and report bullying', questions: 15 }
  ];

  // Calculate real progress based on completed modules
  const moduleProgress = modules.map(module => {
    const completed = player.completedModules[module.id] ? 1 : 0;
    return {
      ...module,
      progress: completed ? 100 : 0
    };
  });

  // Update player state and immediately save to Firestore
  const updatePlayer = (updates) => {
    setPlayer(prevPlayer => {
      const updatedPlayer = { ...prevPlayer, ...updates };
      if (auth.currentUser) {
        savePlayerStats(updatedPlayer);
      }
      return updatedPlayer;
    });
  };

  const completeModule = (moduleId, correctAnswers, totalQuestions) => {
    // Update completedModules, totalQuestions, correctAnswers
    const updatedModules = { ...player.completedModules, [moduleId]: true };
    const newTotalQuestions = player.totalQuestions + totalQuestions;
    const newCorrectAnswers = player.correctAnswers + correctAnswers;

    // Optional: increase streak or level
    const newStreak = player.streak + 1;
    const newXP = player.xp + totalQuestions * 10; // example XP per question

    // Check for new level
    let newLevel = player.level;
    const xpForNextLevel = player.level * 500;
    if (newXP >= xpForNextLevel) {
      newLevel = player.level + 1;
    }

    updatePlayer({
      completedModules: updatedModules,
      totalQuestions: newTotalQuestions,
      correctAnswers: newCorrectAnswers,
      streak: newStreak,
      xp: newXP,
      level: newLevel
    });

    // Check for first blood badge
    if (Object.keys(updatedModules).length === 1) {
      earnBadge('first-blood');
    }

    // Check for specific module badges
    if (correctAnswers === totalQuestions) {
      if (moduleId === 'phishing') earnBadge('phishing-pro');
      if (moduleId === 'password') earnBadge('password-pro');
      if (moduleId === 'social') earnBadge('social-master');
      if (moduleId === 'wifi') earnBadge('wifi-warrior');
      if (moduleId === 'physical') earnBadge('guardian');
      if (moduleId === 'mfa') earnBadge('mfa-champ');
      if (moduleId === 'bullying') earnBadge('upstander');
    }

    addNotification(`Module completed! +${totalQuestions * 10} XP`, 'success');
  };

  const earnBadge = (badgeId) => {
    if (!player.badges.includes(badgeId)) {
      const updatedBadges = [...player.badges, badgeId];
      
      // Check for streak master badge
      if (badgeId === 'streak-master' || player.streak >= 10) {
        if (!updatedBadges.includes('streak-master')) {
          updatedBadges.push('streak-master');
          addNotification(`Badge earned: Streak Master!`, 'success');
        }
      }

      // Check for legend badge (level 10)
      if (player.level >= 10 && !updatedBadges.includes('legend')) {
        updatedBadges.push('legend');
        addNotification(`Badge earned: Legend!`, 'success');
      }

      updatePlayer({ badges: updatedBadges });
      addNotification(`Badge earned: ${badgeId}`, 'success');
    }
  };

  const badges = [
    { id: 'first-blood', name: 'First Blood', icon: Target, desc: 'Complete first module', earned: player.badges.includes('first-blood'), color: 'blue' },
    { id: 'phishing-pro', name: 'Phishing Pro', icon: Mail, desc: '100% on Phishing', earned: player.badges.includes('phishing-pro'), color: 'blue' },
    { id: 'password-pro', name: 'Password Pro', icon: Key, desc: 'All password questions correct', earned: player.badges.includes('password-pro'), color: 'indigo' },
    { id: 'social-master', name: 'Social Master', icon: Users, desc: 'Spot all social scams', earned: player.badges.includes('social-master'), color: 'purple' },
    { id: 'wifi-warrior', name: 'WiFi Warrior', icon: Wifi, desc: 'Master public WiFi safety', earned: player.badges.includes('wifi-warrior'), color: 'cyan' },
    { id: 'guardian', name: 'Guardian', icon: Shield, desc: 'Perfect physical security', earned: player.badges.includes('guardian'), color: 'orange' },
    { id: 'mfa-champ', name: 'MFA Champ', icon: Smartphone, desc: 'Enable all 2FA correctly', earned: player.badges.includes('mfa-champ'), color: 'emerald' },
    { id: 'upstander', name: 'Upstander', icon: Heart, desc: 'Report cyberbullying', earned: player.badges.includes('upstander'), color: 'pink' },
    { id: 'streak-master', name: 'Streak Master', icon: Zap, desc: '10 correct in a row', earned: player.badges.includes('streak-master'), color: 'yellow' },
    { id: 'legend', name: 'Legend', icon: Award, desc: 'Reach level 10', earned: player.badges.includes('legend'), color: 'amber' }
  ];

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Daily Challenge Functions
  const claimDailyChallenge = () => {
    if (!dailyChallenge.completed && completedCount > 0) {
      const today = new Date().toDateString();
      
      // Update XP
      const newXP = player.xp + dailyChallenge.xpReward;
      
      // Check for new level
      let newLevel = player.level;
      const xpForNextLevel = player.level * 500;
      if (newXP >= xpForNextLevel) {
        newLevel = player.level + 1;
      }

      updatePlayer({
        xp: newXP,
        level: newLevel
      });

      const updatedChallenge = {
        completed: true,
        lastClaimed: today,
        xpReward: 100
      };
      setDailyChallenge(updatedChallenge);
      localStorage.setItem('dailyChallenge', JSON.stringify(updatedChallenge));

      addNotification(`Daily Challenge Complete! +${dailyChallenge.xpReward} XP`, 'success');
    }
  };

  // Check if daily challenge should reset
  useEffect(() => {
    const today = new Date().toDateString();
    if (dailyChallenge.lastClaimed && dailyChallenge.lastClaimed !== today) {
      setDailyChallenge({
        completed: false,
        lastClaimed: null,
        xpReward: 100
      });
      localStorage.setItem('dailyChallenge', JSON.stringify({
        completed: false,
        lastClaimed: null,
        xpReward: 100
      }));
    }
  }, [dailyChallenge.lastClaimed]);

  // Check for streak master badge
  useEffect(() => {
    if (player.streak >= 10 && !player.badges.includes('streak-master')) {
      earnBadge('streak-master');
    }
  }, [player.streak]);

  // Check for legend badge
  useEffect(() => {
    if (player.level >= 10 && !player.badges.includes('legend')) {
      earnBadge('legend');
    }
  }, [player.level]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header with Stats */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">CyberQuest Academy</h1>
                  <p className="text-sm text-gray-500">Master cybersecurity through interactive training</p>
                </div>
              </div>
              
              {/* Level & XP Display */}
              <div className="flex items-center gap-6 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Level</div>
                    <div className="text-xl font-bold text-blue-600">{player.level}</div>
                  </div>
                </div>
                
                <div className="w-48">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">XP Progress</span>
                    <span className="font-medium text-blue-600">{player.xp}/{xpNeeded}</span>
                  </div>
                  <div className="h-2.5 bg-blue-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    />
                  </div>
                </div>

                {player.streak > 0 && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200"
                  >
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-orange-600">{player.streak} day streak</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Mode Selection Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { id: 'hub', label: 'Dashboard', icon: Home },
              { id: 'modules', label: 'Training Modules', icon: BookOpen },
              { id: 'stats', label: 'Analytics', icon: BarChart3 },
              { id: 'badges', label: 'Achievements', icon: Trophy }
            ].map(mode => {
              const Icon = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    selectedMode === mode.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200'
                      : 'bg-white text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {mode.label}
                </motion.button>
              );
            })}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {selectedMode === 'hub' && (
              <motion.div
                key="hub"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Welcome back, Security Agent!</h2>
                      <p className="text-blue-100">Continue your training and earn achievements</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-blue-200" />
                        <span className="text-sm text-blue-100">Modules</span>
                      </div>
                      <div className="text-2xl font-bold">{completedCount}/{totalModules}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-blue-200" />
                        <span className="text-sm text-blue-100">Accuracy</span>
                      </div>
                      <div className="text-2xl font-bold">{accuracy}%</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-blue-200" />
                        <span className="text-sm text-blue-100">Badges</span>
                      </div>
                      <div className="text-2xl font-bold">{player.badges.length}</div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-xs text-gray-400">Progress</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{completedCount}/{totalModules}</div>
                    <div className="text-sm text-gray-500">Modules Completed</div>
                  </motion.div>

                  <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl p-5 border border-green-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-xs text-gray-400">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{player.totalQuestions}</div>
                    <div className="text-sm text-gray-500">Questions Answered</div>
                  </motion.div>

                  <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-xs text-gray-400">Score</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{accuracy}%</div>
                    <div className="text-sm text-gray-500">Success Rate</div>
                  </motion.div>

                  <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl p-5 border border-amber-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-xs text-gray-400">Earned</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{player.badges.length}</div>
                    <div className="text-sm text-gray-500">Badges Unlocked</div>
                  </motion.div>
                </div>

                {/* Featured Modules */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      Featured Modules
                    </h3>
                    <button 
                      onClick={() => setSelectedMode('modules')}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {modules.slice(0, 3).map((module) => {
                      const Icon = module.icon;
                      const isCompleted = player.completedModules[module.id];
                      return (
                        <motion.div
                          key={module.id}
                          whileHover={{ y: -2 }}
                          className={`p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border cursor-pointer ${
                            isCompleted ? 'border-green-200' : 'border-blue-100'
                          }`}
                          onClick={() => setSelectedMode('modules')}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-lg bg-${module.color}-100 flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 text-${module.color}-600`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{module.name}</h4>
                              <p className="text-xs text-gray-500">{module.questions} questions</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{module.desc}</p>
                          <div className="flex items-center justify-between text-xs">
                            {isCompleted ? (
                              <>
                                <span className="text-green-600 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Completed
                                </span>
                                <span className="text-green-600">✓</span>
                              </>
                            ) : (
                              <>
                                <span className="text-gray-500">Not started</span>
                                <span className="text-blue-600 font-medium">Start →</span>
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Daily Challenge - Updated */}
                <motion.div 
                  whileHover={{ y: -2 }} 
                  className={`bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border ${
                    dailyChallenge.completed ? 'border-green-200' : 'border-purple-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${
                        dailyChallenge.completed ? 'bg-green-100' : 'bg-purple-100'
                      } rounded-xl flex items-center justify-center`}>
                        {dailyChallenge.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Gift className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Daily Challenge</h3>
                        <p className="text-sm text-gray-600">
                          {dailyChallenge.completed 
                            ? "You've completed today's challenge!" 
                            : "Complete any module today for bonus XP"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-600">+{dailyChallenge.xpReward} XP</div>
                      {!dailyChallenge.completed ? (
                        <button 
                          onClick={claimDailyChallenge}
                          disabled={completedCount === 0}
                          className={`text-sm font-medium flex items-center gap-1 ${
                            completedCount > 0 
                              ? 'text-purple-600 hover:text-purple-700 cursor-pointer' 
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Claim Reward
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="text-sm text-green-600 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Claimed
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress bar for daily challenge */}
                  {!dailyChallenge.completed && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-purple-600">
                          {completedCount > 0 ? 'Ready to claim!' : 'Complete a module first'}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: completedCount > 0 ? '100%' : '0%' }}
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {selectedMode === 'modules' && (
              <motion.div
                key="modules"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ScenarioHub 
                  player={player}
                  setPlayer={setPlayer}
                  addNotification={addNotification}
                  completeModule={completeModule}
                  earnBadge={earnBadge}
                />
              </motion.div>
            )}

            {selectedMode === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Performance Overview
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{player.totalQuestions}</div>
                      <div className="text-xs text-gray-600">Questions</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
                      <div className="text-xs text-gray-600">Accuracy</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">{player.streak}</div>
                      <div className="text-xs text-gray-600">Streak</div>
                    </div>
                  </div>

                  {/* Module Progress */}
                  <h3 className="font-medium text-gray-700 mb-3">Module Completion</h3>
                  <div className="space-y-4">
                    {moduleProgress.map((module) => {
                      const Icon = module.icon;
                      const isCompleted = player.completedModules[module.id];
                      return (
                        <div key={module.id}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg bg-${module.color}-100`}>
                                <Icon className={`w-4 h-4 text-${module.color}-600`} />
                              </div>
                              <span className="text-sm text-gray-700">{module.name}</span>
                              {isCompleted && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-blue-600">{module.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${module.progress}%` }}
                              className={`h-full rounded-full bg-${module.color}-500`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Accuracy by Category */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-blue-600" />
                    Accuracy by Category
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {moduleProgress.map((module) => {
                      const Icon = module.icon;
                      const accuracy = module.progress > 0 ? Math.floor(Math.random() * 30 + 70) : 0;
                      return (
                        <div key={module.id} className="text-center p-3 bg-white rounded-lg border border-gray-100">
                          <div className={`inline-flex p-2 rounded-lg mb-2 bg-${module.color}-50`}>
                            <Icon className={`w-5 h-5 text-${module.color}-600`} />
                          </div>
                          <div className="text-lg font-bold text-gray-800">{accuracy}%</div>
                          <div className="text-xs text-gray-500 truncate">{module.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {selectedMode === 'badges' && (
              <motion.div
                key="badges"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-semibold text-gray-800">Achievement Badges</h2>
                  <span className="ml-auto text-sm text-gray-500">{player.badges.length}/{badges.length} Unlocked</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {badges.map((badge) => {
                    const Icon = badge.icon;
                    const earned = badge.earned;
                    
                    return (
                      <motion.div
                        key={badge.id}
                        whileHover={{ y: -2 }}
                        className={`relative p-4 rounded-xl border-2 text-center transition-all ${
                          earned 
                            ? `border-${badge.color}-200 bg-${badge.color}-50`
                            : 'border-gray-200 bg-gray-50 opacity-60'
                        }`}
                      >
                        {earned && (
                          <div className="absolute -top-2 -right-2">
                            <div className={`w-6 h-6 rounded-full bg-${badge.color}-500 flex items-center justify-center`}>
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                        <div className={`inline-flex p-3 rounded-full mb-3 ${
                          earned ? `bg-${badge.color}-100` : 'bg-gray-200'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            earned ? `text-${badge.color}-600` : 'text-gray-500'
                          }`} />
                        </div>
                        <div className={`text-sm font-medium mb-1 ${
                          earned ? 'text-gray-800' : 'text-gray-500'
                        }`}>{badge.name}</div>
                        <div className="text-xs text-gray-500">{badge.desc}</div>
                        {earned && (
                          <div className={`mt-2 text-xs font-medium text-${badge.color}-600`}>
                            ✓ Unlocked
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <AnimatePresence>
          {notifications.map(notif => (
            <motion.div
              key={notif.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
                notif.type === 'success' ? 'bg-green-50 border border-green-200' :
                notif.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
              }`}
            >
              {notif.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {notif.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {notif.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
              <span className={
                notif.type === 'success' ? 'text-green-700' :
                notif.type === 'error' ? 'text-red-700' : 'text-blue-700'
              }>{notif.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CyberQuest;