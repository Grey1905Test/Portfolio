"use client";

import { motion } from 'framer-motion';

interface TimelineNavbarProps {
  onNavigate: (index: number) => void;
  activeSection: number;
}

export default function TimelineNavbar({ onNavigate, activeSection }: TimelineNavbarProps) {
  const sections = ['Home', 'About', 'Projects', 'Experience', 'Contact'];
  // Get color based on active section
  const getActiveColor = () => {
    switch(activeSection) {
      case 0: return 'text-yellow-400';  // Home
      case 1: return 'text-cyan-400';    // About
      case 2: return 'text-green-400';   // Projects (changed to green)
      case 3: return 'text-orange-400';  // Experience
      case 4: return 'text-purple-400';  // Contact
      default: return 'text-gray-400';
    }
  };

  const getProgressColor = () => {
    switch(activeSection) {
      case 0: return 'from-yellow-500 via-yellow-400 to-yellow-500';
      case 1: return 'from-cyan-500 via-cyan-400 to-cyan-500';
      case 2: return 'from-green-500 via-green-400 to-green-500';   // Projects (changed to green)
      case 3: return 'from-orange-500 via-orange-400 to-orange-500';
      case 4: return 'from-purple-500 via-purple-400 to-purple-500'; // Contact
      default: return 'from-gray-500 via-gray-400 to-gray-500';
    }
  };

  const rocketPosition = (activeSection / (sections.length - 1)) * 100;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-8">
      {/* Futuristic Transparent Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative backdrop-blur-md bg-transparent border border-cyan-400/20 rounded-2xl py-4 px-8 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.03) 0%, rgba(0, 150, 255, 0.03) 50%, rgba(0, 255, 255, 0.03) 100%)',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.1), inset 0 0 40px rgba(0, 255, 255, 0.05)',
        }}
      >
        {/* Futuristic Corner Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/40"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/40"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/40"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/40"></div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-8">
          {sections.map((section, index) => {
            const isActive = activeSection === index;
            
            return (
              <motion.button
                key={section}
                onClick={() => onNavigate(index)}
                className={`relative py-3 px-6 rounded-xl font-mono text-sm font-bold tracking-widest uppercase transition-all duration-500 ${
                  isActive 
                    ? 'text-cyan-300 shadow-lg' 
                    : 'text-white/70 hover:text-cyan-200'
                }`}
                whileHover={{ scale: 1.08, rotateX: 5 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  textShadow: isActive ? '0 0 20px rgba(0, 255, 255, 0.8)' : 'none'
                }}
              >
                {/* Active indicator with glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-xl border border-cyan-400/60"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(0, 150, 255, 0.1) 100%)',
                      boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(0, 255, 255, 0.1)'
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Animated dots for active state */}
                {isActive && (
                  <>
                    <motion.div
                      className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    />
                    <motion.div
                      className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                    />
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 1.5 }}
                    />
                  </>
                )}
                
                {/* Button content */}
                <span className="relative z-10">{section}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Futuristic Progress Indicator */}
        <div className="mt-4 relative h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.8) 0%, rgba(0, 150, 255, 0.8) 50%, rgba(0, 255, 255, 0.8) 100%)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.6)'
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${((activeSection + 1) / sections.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
          
          {/* Animated progress pulse */}
          <motion.div
            className="absolute top-0 h-full w-8 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
              left: `${((activeSection + 1) / sections.length) * 100 - 4}%`
            }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>

        {/* Scanning line effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.1) 50%, transparent 100%)'
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        />
      </motion.nav>
    </div>
  );
}