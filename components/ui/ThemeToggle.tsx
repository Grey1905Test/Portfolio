"use client";

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-xl border-2 transition-all duration-300 backdrop-blur-md group"
      style={{
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(139, 92, 246, 0.5)',
        background: theme === 'dark' 
          ? 'rgba(0, 0, 0, 0.3)' 
          : 'rgba(255, 255, 255, 0.3)',
        boxShadow: theme === 'dark'
          ? '0 0 20px rgba(255, 255, 255, 0.1)'
          : '0 0 20px rgba(139, 92, 246, 0.3)',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-yellow-300 group-hover:text-yellow-400 transition-colors" />
        ) : (
          <Moon className="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
        )}
      </motion.div>
    </motion.button>
  );
}
