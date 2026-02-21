import React from 'react';
import RiskAnalyzer from './components/RiskAnalyzer';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { Shield, Activity, AlertTriangle, FileText, Users, Zap, Globe, Lock, Cpu, Eye, Radio, ScanLine } from 'lucide-react';


function App() {
  return (
    <div>
      <RiskAnalyzer />
    </div>
  );
}

export default App;
// const CyberGuardDashboard = () => {
//   const stats = [
//     { value: '12,847', label: 'Threats Detected', icon: AlertTriangle },
//     { value: '3,291', label: 'Reports Filed', icon: FileText },
//     { value: '847', label: 'Active Scans', icon: Activity },
//   ];

//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);
  
//   const springConfig = { damping: 25, stiffness: 150 };
//   const mouseXSpring = useSpring(mouseX, springConfig);
//   const mouseYSpring = useSpring(mouseY, springConfig);

//   React.useEffect(() => {
//     const handleMouseMove = (e) => {
//       mouseX.set(e.clientX - 100);
//       mouseY.set(e.clientY - 100);
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, [mouseX, mouseY]);

//   const Counter = ({ value, label, icon: Icon }) => {
//     const [displayValue, setDisplayValue] = React.useState('0');
//     const numericValue = parseInt(value.replace(',', ''));
    
//     React.useEffect(() => {
//       const controls = animate(0, numericValue, {
//         duration: 2.5,
//         ease: "easeOut",
//         onUpdate: (latest) => {
//           setDisplayValue(Math.round(latest).toLocaleString());
//         }
//       });
//       return controls.stop;
//     }, [numericValue]);

//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         whileHover={{ scale: 1.05, y: -5 }}
//         className="relative group"
//       >
//         {/* Glow effect with rgb(3, 252, 252) */}
//         <motion.div
//           animate={{
//             boxShadow: [
//               "0 0 20px rgba(3, 252, 252, 0)",
//               "0 0 40px rgba(3, 252, 252, 0.3)",
//               "0 0 20px rgba(3, 252, 252, 0)",
//             ]
//           }}
//           transition={{ duration: 2, repeat: Infinity }}
//           className="absolute inset-0 rounded-xl"
//         />
//         <div className="relative bg-black/60 backdrop-blur-md border border-[rgb(3,252,252)]/30 rounded-xl p-6 shadow-xl overflow-hidden">
//           <motion.div
//             animate={{
//               background: [
//                 "radial-gradient(circle at 30% 30%, rgba(3, 252, 252, 0.1) 0%, transparent 70%)",
//                 "radial-gradient(circle at 70% 70%, rgba(3, 252, 252, 0.1) 0%, transparent 70%)",
//                 "radial-gradient(circle at 30% 70%, rgba(3, 252, 252, 0.1) 0%, transparent 70%)",
//                 "radial-gradient(circle at 70% 30%, rgba(3, 252, 252, 0.1) 0%, transparent 70%)",
//               ]
//             }}
//             transition={{ duration: 5, repeat: Infinity }}
//             className="absolute inset-0"
//           />
//           <Icon className="w-8 h-8 text-[rgb(3,252,252)] mb-3 filter drop-shadow-[0_0_8px_rgb(3,252,252)]" />
//           <motion.div 
//             className="text-4xl font-bold text-white mb-2 text-glow"
//             key={displayValue}
//             initial={{ scale: 0.5 }}
//             animate={{ scale: 1 }}
//             style={{ textShadow: '0 0 10px rgb(3,252,252)' }}
//           >
//             {displayValue}
//           </motion.div>
//           <div className="text-sm uppercase tracking-wider text-[rgb(3,252,252)]/90">{label}</div>
//         </div>
//       </motion.div>
//     );
//   };

// return (
//   <div className="relative min-h-screen bg-cover bg-center bg-no-repeat font-['Share_Tech_Mono',_'Courier_New',_monospace] overflow-hidden"
//          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
      
//       {/* Animated gradient overlay with rgb(3, 252, 252) */}
//       <motion.div 
//         animate={{
//           background: [
//             "radial-gradient(circle at 20% 20%, rgba(3, 252, 252, 0.2) 0%, transparent 50%)",
//             "radial-gradient(circle at 80% 80%, rgba(3, 252, 252, 0.2) 0%, transparent 50%)",
//             "radial-gradient(circle at 20% 80%, rgba(3, 252, 252, 0.2) 0%, transparent 50%)",
//             "radial-gradient(circle at 80% 20%, rgba(3, 252, 252, 0.2) 0%, transparent 50%)",
//           ]
//         }}
//         transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
//         className="absolute inset-0"
//       />
      
//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black/80"></div>
      
//       {/* Animated grid lines with rgb(3, 252, 252) */}
//       <svg className="absolute inset-0 w-full h-full opacity-30">
//         <defs>
//           <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
//             <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(3, 252, 252)" strokeWidth="0.3">
//               <animate attributeName="stroke-opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
//             </path>
//           </pattern>
//         </defs>
//         <rect width="100%" height="100%" fill="url(#grid)" />
//       </svg>

//       {/* Floating orbs with rgb(3, 252, 252) */}
//       <motion.div
//         animate={{
//           y: [0, -30, 0],
//           x: [0, 15, 0],
//           scale: [1, 1.2, 1],
//           opacity: [0.1, 0.2, 0.1]
//         }}
//         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
//         className="absolute top-20 left-20 w-96 h-96 bg-[rgb(3,252,252)]/10 rounded-full blur-3xl"
//       />
//       <motion.div
//         animate={{
//           y: [0, 30, 0],
//           x: [0, -15, 0],
//           scale: [1, 1.3, 1],
//           opacity: [0.1, 0.2, 0.1]
//         }}
//         transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
//         className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-[rgb(3,252,252)]/10 rounded-full blur-3xl"
//       />

//       {/* Scanning line animation */}
//       <motion.div
//         animate={{
//           y: ['-100%', '100%']
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//           ease: "linear"
//         }}
//         className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-[rgb(3,252,252)]/10 to-transparent pointer-events-none"
//       />

//       {/* Mouse follower glow with rgb(3, 252, 252) */}
//       <motion.div
//         className="pointer-events-none fixed w-72 h-72 bg-[rgb(3,252,252)]/10 rounded-full blur-3xl z-0"
//         style={{
//           left: mouseXSpring,
//           top: mouseYSpring,
//         }}
//       />
      
//       {/* Main content */}
//       <div className="relative z-10 flex flex-col min-h-screen text-gray-200">
        
//         {/* Header / Navigation */}
//         <motion.header 
//           initial={{ y: -100, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="flex items-center justify-between px-8 py-4 border-b border-[rgb(3,252,252)]/30 bg-black/60 backdrop-blur-md"
//         >
//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="flex items-center space-x-2"
//           >
//             <Shield className="w-8 h-8 text-[rgb(3,252,252)] filter drop-shadow-[0_0_10px_rgb(3,252,252)]" />
//             <div className="text-2xl font-bold" style={{ textShadow: '0 0 10px rgb(3,252,252)' }}>
//               <span className="text-white">CYBER</span>
//               <span className="text-[rgb(3,252,252)]">RAKSHAK</span>
//             </div>
//           </motion.div>
          
//           <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
//             {['Threat Scanner', 'Legal AI', 'Complaint Gen', 'Community Intel'].map((item, index) => (
//               <motion.a
//                 key={item}
//                 href="#"
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 whileHover={{ scale: 1.1 }}
//                 className="text-gray-300 hover:text-[rgb(3,252,252)] transition-colors relative group"
//                 style={{ textShadow: '0 0 5px currentColor' }}
//               >
//                 {item}
//                 <motion.span 
//                   className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[rgb(3,252,252)] group-hover:w-full"
//                   transition={{ duration: 0.2 }}
//                 />
//               </motion.a>
//             ))}
//           </nav>
          
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="relative px-5 py-2 rounded-md text-sm font-semibold overflow-hidden group"
//             style={{
//               background: 'transparent',
//               border: '1px solid rgb(3, 252, 252)',
//               boxShadow: '0 0 15px rgba(3, 252, 252, 0.3)',
//               color: 'rgb(3, 252, 252)',
//               textShadow: '0 0 8px rgb(3, 252, 252)'
//             }}
//           >
//             <span className="relative z-10">Launch App</span>
//             <motion.div
//               animate={{
//                 x: ['-100%', '100%'],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "linear",
//               }}
//               className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgb(3,252,252)]/30 to-transparent"
//             />
//           </motion.button>
//         </motion.header>

//         {/* System Status Bar */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="bg-black/70 border-b border-[rgb(3,252,252)]/30 py-2 px-8 text-xs font-mono tracking-wider flex items-center justify-between"
//         >
//           <motion.span 
//             animate={{ opacity: [1, 0.5, 1] }}
//             transition={{ duration: 2, repeat: Infinity }}
//             className="text-[rgb(3,252,252)] flex items-center"
//             style={{ textShadow: '0 0 8px rgb(3,252,252)' }}
//           >
//             <span className="w-2 h-2 bg-[rgb(3,252,252)] rounded-full animate-pulse mr-2 shadow-[0_0_10px_rgb(3,252,252)]"></span>
//             SYSTEM ONLINE — THREAT DETECTION ACTIVE
//           </motion.span>
//           <span className="text-[rgb(3,252,252)]/80 flex items-center gap-2">
//             <Lock className="w-3 h-3" />
//             v2.4.1 • Secure Connection
//           </span>
//         </motion.div>

//         {/* Main Hero Section */}
//         <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
//           <div className="max-w-5xl w-full">
//             {/* Badge */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.5 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5 }}
//               whileHover={{ scale: 1.05 }}
//               className="inline-flex items-center bg-black/50 border border-[rgb(3,252,252)]/50 rounded-full px-4 py-1 text-xs font-semibold mb-6 backdrop-blur-sm"
//               style={{
//                 color: 'rgb(3, 252, 252)',
//                 textShadow: '0 0 8px rgb(3, 252, 252)',
//                 boxShadow: '0 0 15px rgba(3, 252, 252, 0.3)'
//               }}
//             >
//               <Zap className="w-3 h-3 mr-1 animate-pulse" />
//               AI-POWERED CYBER DEFENSE
//             </motion.div>
            
//             {/* Main Heading */}
//             <motion.h1 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7, delay: 0.2 }}
//               className="text-5xl md:text-7xl font-bold mb-6"
//             >
//               <span className="text-white">Cyber Defense</span>{' '}
//               <motion.span
//                 animate={{
//                   textShadow: [
//                     "0 0 20px rgb(3, 252, 252)",
//                     "0 0 40px rgb(3, 252, 252)",
//                     "0 0 20px rgb(3, 252, 252)",
//                   ]
//                 }}
//                 transition={{ duration: 2, repeat: Infinity }}
//                 className="text-[rgb(3,252,252)]"
//               >
//                 Intelligence
//               </motion.span>
//             </motion.h1>
            
//             {/* Description */}
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7, delay: 0.3 }}
//               className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8"
//               style={{ textShadow: '0 0 5px rgba(3, 252, 252, 0.3)' }}
//             >
//               Detect scams. Analyze threats. Generate complaints. Powered by AI with legal intelligence mapped to the IT Act & IPC.
//             </motion.p>
            
//             {/* CTA Buttons */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7, delay: 0.4 }}
//               className="flex flex-col sm:flex-row gap-4 justify-center"
//             >
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="group relative px-8 py-4 rounded-lg font-bold text-lg overflow-hidden"
//                 style={{
//                   background: 'transparent',
//                   border: '2px solid rgb(3, 252, 252)',
//                   boxShadow: '0 0 20px rgba(3, 252, 252, 0.5)',
//                   color: 'rgb(3, 252, 252)',
//                   textShadow: '0 0 10px rgb(3, 252, 252)'
//                 }}
//               >
//                 <span className="relative z-10 flex items-center">
//                   <ScanLine className="w-5 h-5 mr-2" />
//                   Scan for Threats
//                 </span>
//                 <motion.div
//                   animate={{
//                     rotate: [0, 360],
//                   }}
//                   transition={{
//                     duration: 3,
//                     repeat: Infinity,
//                     ease: "linear",
//                   }}
//                   className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgb(3,252,252)]/20 to-transparent"
//                 />
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="group relative px-8 py-4 rounded-lg font-bold text-lg overflow-hidden"
//                 style={{
//                   background: 'transparent',
//                   border: '2px solid rgb(3, 252, 252)',
//                   boxShadow: '0 0 20px rgba(3, 252, 252, 0.5)',
//                   color: 'rgb(3, 252, 252)',
//                   textShadow: '0 0 10px rgb(3, 252, 252)'
//                 }}
//               >
//                 <span className="relative z-10 flex items-center">
//                   <Radio className="w-5 h-5 mr-2" />
//                   Report Incident
//                 </span>
//                 <motion.div
//                   animate={{
//                     scale: [1, 1.2, 1],
//                     opacity: [0.1, 0.3, 0.1],
//                   }}
//                   transition={{
//                     duration: 2,
//                     repeat: Infinity,
//                   }}
//                   className="absolute inset-0 bg-[rgb(3,252,252)]/10 blur-xl"
//                 />
//               </motion.button>
//             </motion.div>

//             {/* Stats Section */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto w-full">
//               {stats.map((stat, index) => (
//                 <Counter key={index} {...stat} />
//               ))}
//             </div>

//             {/* Animated scan lines */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1 }}
//               className="mt-12 flex justify-center space-x-6"
//             >
//               {[Eye, Radio, Cpu].map((Icon, index) => (
//                 <motion.div
//                   key={index}
//                   animate={{
//                     scale: [1, 1.2, 1],
//                     opacity: [0.5, 1, 0.5],
//                   }}
//                   transition={{
//                     duration: 2,
//                     delay: index * 0.3,
//                     repeat: Infinity,
//                   }}
//                 >
//                   <Icon className="w-5 h-5 text-[rgb(3,252,252)]" style={{ filter: 'drop-shadow(0 0 8px rgb(3, 252, 252))' }} />
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </main>

//         {/* Footer */}
//         <motion.footer
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.8 }}
//           className="text-center text-xs py-4 border-t border-[rgb(3,252,252)]/30 bg-black/50"
//         >
//           <motion.span
//             animate={{ opacity: [0.5, 1, 0.5] }}
//             transition={{ duration: 3, repeat: Infinity }}
//             className="text-[rgb(3,252,252)]/70"
//             style={{ textShadow: '0 0 5px rgb(3,252,252)' }}
//           >
//             © 2025 CyberGuard — Advanced Threat Intelligence Platform
//           </motion.span>
//         </motion.footer>
//       </div>

//       {/* Add custom font import in head */}
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        
//         .text-glow {
//           text-shadow: 0 0 10px rgb(3, 252, 252);
//         }
        
//         ::selection {
//           background: rgb(3, 252, 252);
//           color: black;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CyberGuardDashboard;
