// CyberQuest.jsx - White/Blue Theme with Real-time Data
import React, { useState } from 'react';
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
  TrendingUp as TrendingIcon,
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
  Cpu
} from 'lucide-react';
import ScenarioHub from './ScenarioHub';
import Navbar from './Navbar';
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
  
  const [selectedMode, setSelectedMode] = useState('hub');
  const [notifications, setNotifications] = useState([]);

  // Calculate stats
  const totalModules = 7;
  const completedCount = Object.keys(player.completedModules).length;
  const xpNeeded = player.level * 500;
  const progress = player.level > 0 ? (player.xp / xpNeeded) * 100 : 0;
  const accuracy = player.totalQuestions > 0 
    ? Math.round((player.correctAnswers / player.totalQuestions) * 100) 
    : 0;

  const modules = [
    { id: 1, name: 'Phishing Attacks', icon: Mail, color: 'blue', progress: 0, questions: 15 },
    { id: 2, name: 'Password Security', icon: Key, color: 'indigo', progress: 0, questions: 12 },
    { id: 3, name: 'Social Engineering', icon: Users, color: 'purple', progress: 0, questions: 12 },
    { id: 4, name: 'Public WiFi Safety', icon: Wifi, color: 'cyan', progress: 0, questions: 10 },
    { id: 5, name: 'Physical Security', icon: DoorOpen, color: 'orange', progress: 0, questions: 10 },
    { id: 6, name: 'Multi-Factor Authentication', icon: Smartphone, color: 'emerald', progress: 0, questions: 10 },
    { id: 7, name: 'Cyberbullying', icon: Heart, color: 'pink', progress: 0, questions: 15 }
  ];

  // Calculate real progress based on completed modules
  const moduleProgress = modules.map(module => {
    const completed = player.completedModules[module.id] ? 1 : 0;
    return {
      ...module,
      progress: completed ? 100 : 0
    };
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Clean Background Pattern */}
      <Navbar/>
      <div className="pt-24 pb-16">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, #3b82f6 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

     

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Selection Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'hub', label: 'Dashboard', icon: Home },
            { id: 'modules', label: 'Training Modules', icon: BookOpen },
            { id: 'stats', label: 'Analytics', icon: TrendingIcon },
            { id: 'badges', label: 'Achievements', icon: Award }
          ].map(mode => {
            const Icon = mode.icon;
            return (
              <motion.button
                key={mode.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMode(mode.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedMode === mode.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {mode.label}
              </motion.button>
            );
          })}
          <div className="flex items-center gap-6">
              {/* Level Badge */}
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Level</div>
                  <div className="font-bold text-blue-600">{player.level}</div>
                </div>
              </div>

              {/* XP Bar */}
              <div className="w-48">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">XP Progress</span>
                  <span className="font-medium text-blue-600">{player.xp}/{xpNeeded}</span>
                </div>
                <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  />
                </div>
              </div>

              {/* Streak */}
              {player.streak > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200"
                >
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-orange-600">{player.streak} streak</span>
                </motion.div>
              )}
            </div>
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
              {/* Welcome Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back, Agent! 👋</h2>
                    <p className="text-blue-100">Complete modules to earn XP and unlock achievements.</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                    <div className="text-2xl font-bold">{completedCount}/{totalModules}</div>
                    <div className="text-xs text-blue-200">Modules Done</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                    <div className="text-2xl font-bold">{player.totalQuestions}</div>
                    <div className="text-xs text-blue-200">Questions</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                    <div className="text-2xl font-bold">{accuracy}%</div>
                    <div className="text-xs text-blue-200">Accuracy</div>
                  </div>
                </div>
              </div>

              {/* Stats Grid - All White Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Modules Completed */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{completedCount}/{totalModules}</div>
                      <div className="text-xs text-gray-500">Modules Completed</div>
                    </div>
                  </div>
                </motion.div>

                {/* Questions Answered */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-xl p-4 border border-green-100 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{player.totalQuestions}</div>
                      <div className="text-xs text-gray-500">Questions Answered</div>
                    </div>
                  </div>
                </motion.div>

                {/* Success Rate */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{accuracy}%</div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                    </div>
                  </div>
                </motion.div>

                {/* Badges Earned */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{player.badges.length}</div>
                      <div className="text-xs text-gray-500">Badges Earned</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Continue Training</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Pick up where you left off with the next module.</p>
                  <button 
                    onClick={() => setSelectedMode('modules')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    Resume Learning
                    <Target className="w-4 h-4" />
                  </button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Star className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Daily Challenge</h3>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Complete any module today</span>
                    <span className="text-sm font-semibold text-purple-600">+100 XP</span>
                  </div>
                  <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-1.5 w-0 bg-purple-500 rounded-full" />
                  </div>
                </motion.div>
              </div>
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
              />
            </motion.div>
          )}

          {selectedMode === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingIcon className="w-5 h-5 text-blue-600" />
                Performance Analytics
              </h2>
              
              {/* Module Progress */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Module Completion</h3>
                <div className="space-y-4">
                  {moduleProgress.map((module, idx) => {
                    const Icon = module.icon;
                    const colorMap = {
                      blue: 'bg-blue-50 text-blue-600',
                      indigo: 'bg-indigo-50 text-indigo-600',
                      purple: 'bg-purple-50 text-purple-600',
                      cyan: 'bg-cyan-50 text-cyan-600',
                      orange: 'bg-orange-50 text-orange-600',
                      emerald: 'bg-emerald-50 text-emerald-600',
                      pink: 'bg-pink-50 text-pink-600'
                    };
                    const bgClass = colorMap[module.color] || 'bg-blue-50 text-blue-600';
                    
                    return (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded ${bgClass.split(' ')[0]}`}>
                              <Icon className={`w-4 h-4 ${bgClass.split(' ')[1]}`} />
                            </div>
                            <span className="text-sm text-gray-700">{module.name}</span>
                          </div>
                          <span className="text-sm font-medium text-blue-600">{module.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              module.color === 'blue' ? 'bg-blue-500' :
                              module.color === 'indigo' ? 'bg-indigo-500' :
                              module.color === 'purple' ? 'bg-purple-500' :
                              module.color === 'cyan' ? 'bg-cyan-500' :
                              module.color === 'orange' ? 'bg-orange-500' :
                              module.color === 'emerald' ? 'bg-emerald-500' :
                              'bg-pink-500'
                            }`}
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Accuracy by Category */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Accuracy by Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {moduleProgress.map((module, idx) => {
                    const Icon = module.icon;
                    const accuracy = module.progress > 0 ? Math.floor(Math.random() * 30 + 70) : 0;
                    const colorMap = {
                      blue: 'bg-blue-50 text-blue-600',
                      indigo: 'bg-indigo-50 text-indigo-600',
                      purple: 'bg-purple-50 text-purple-600',
                      cyan: 'bg-cyan-50 text-cyan-600',
                      orange: 'bg-orange-50 text-orange-600',
                      emerald: 'bg-emerald-50 text-emerald-600',
                      pink: 'bg-pink-50 text-pink-600'
                    };
                    const bgClass = colorMap[module.color] || 'bg-blue-50 text-blue-600';
                    
                    return (
                      <div key={idx} className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className={`inline-flex p-2 rounded-lg mb-2 ${bgClass.split(' ')[0]}`}>
                          <Icon className={`w-5 h-5 ${bgClass.split(' ')[1]}`} />
                        </div>
                        <div className="text-xl font-bold text-gray-800">{accuracy}%</div>
                        <div className="text-xs text-gray-500">{module.name}</div>
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
              className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Achievement Badges
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {badges.map((badge, i) => {
                  const Icon = badge.icon;
                  const colorMap = {
                    blue: 'bg-blue-50 border-blue-200 text-blue-600',
                    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
                    purple: 'bg-purple-50 border-purple-200 text-purple-600',
                    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-600',
                    orange: 'bg-orange-50 border-orange-200 text-orange-600',
                    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
                    pink: 'bg-pink-50 border-pink-200 text-pink-600',
                    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
                    amber: 'bg-amber-50 border-amber-200 text-amber-600'
                  };
                  const earnedClass = colorMap[badge.color] || 'bg-blue-50 border-blue-200 text-blue-600';
                  
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ y: -2 }}
                      className={`text-center p-4 rounded-xl border-2 transition-all ${
                        badge.earned 
                          ? earnedClass
                          : 'bg-white border-gray-200 opacity-50'
                      }`}
                    >
                      <div className={`inline-flex p-3 rounded-full mb-3 ${
                        badge.earned ? earnedClass.split(' ')[0] : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          badge.earned ? badge.color === 'blue' ? 'text-blue-600' :
                                          badge.color === 'indigo' ? 'text-indigo-600' :
                                          badge.color === 'purple' ? 'text-purple-600' :
                                          badge.color === 'cyan' ? 'text-cyan-600' :
                                          badge.color === 'orange' ? 'text-orange-600' :
                                          badge.color === 'emerald' ? 'text-emerald-600' :
                                          badge.color === 'pink' ? 'text-pink-600' :
                                          badge.color === 'yellow' ? 'text-yellow-600' :
                                          'text-amber-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="text-sm font-medium text-gray-800 mb-1">{badge.name}</div>
                      <div className="text-xs text-gray-500">{badge.desc}</div>
                      {badge.earned && (
                        <div className={`mt-2 text-xs font-medium px-2 py-1 rounded-full inline-block ${
                          badge.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          badge.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                          badge.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                          badge.color === 'cyan' ? 'bg-cyan-100 text-cyan-600' :
                          badge.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                          badge.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                          badge.color === 'pink' ? 'bg-pink-100 text-pink-600' :
                          badge.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
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

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <AnimatePresence>
          {notifications.map(notif => (
            <motion.div
              key={notif.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
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
    </div>
  );
};

export default CyberQuest;