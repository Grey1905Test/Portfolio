"use client";

import { motion } from 'framer-motion';

interface TimelineNavbarProps {
  onNavigate: (index: number) => void;
  activeSection: number;
  overlayOpen?: boolean;
}

export default function TimelineNavbar({ onNavigate, activeSection, overlayOpen = false }: TimelineNavbarProps) {
  const sections = ['Home', 'About', 'Projects', 'Experience', 'Contact'];

  if (overlayOpen) return null;
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

  return (
    <div className="fixed top-35 left-0 right-0 z-50 flex justify-center w-full px-10">
      {/* Futuristic Transparent Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl py-4 px-12 max-w-7xl w-full flex flex-col items-center"
        style={{
          background: 'transparent',
          border: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
        }}
      >
        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-20 w-full">
          {sections.map((section, index) => {
            const isActive = activeSection === index;
            
            return (
              <motion.button
                key={section}
                onClick={() => index !== activeSection && onNavigate(index)}
                className={`relative py-3 px-10 rounded-xl font-mono text-sm font-bold tracking-widest uppercase transition-all duration-500 ${
                  isActive 
                    ? 'text-white shadow-lg' 
                    : 'text-white/70 hover:text-white'
                }`}
                whileHover={{ scale: 1.08, rotateX: 5 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  textShadow: isActive ? '0 0 20px rgba(255, 255, 255, 0.8)' : 'none'
                }}
              >
                {/* Active indicator with glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-xl border border-white/60"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
                      boxShadow: '0 0 30px rgba(255, 255, 255, 0.25), inset 0 0 30px rgba(255, 255, 255, 0.08)'
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Button content */}
                <span className="relative z-10">{section}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Scanning line effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)'
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        />
      </motion.nav>
    </div>
  );
}