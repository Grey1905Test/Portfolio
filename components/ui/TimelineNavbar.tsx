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
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-3xl px-8">
      {/* Clean Transparent Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative backdrop-blur-sm bg-black/5 border border-white/5 rounded-xl py-3 px-6"
      >
        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-6">
          {sections.map((section, index) => {
            const isActive = activeSection === index;
            
            return (
              <motion.button
                key={section}
                onClick={() => onNavigate(index)}
                className={`relative py-2 px-4 rounded-lg font-mono text-sm font-medium tracking-wide uppercase transition-all duration-300 ${
                  isActive 
                    ? 'text-cyan-300' 
                    : 'text-white/60 hover:text-white/90'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-lg bg-cyan-400/20 border border-cyan-400/40"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Button content */}
                <span className="relative z-10">{section}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Simple Progress Indicator */}
        <div className="mt-3 relative h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((activeSection + 1) / sections.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
      </motion.nav>
    </div>
  );
}