"use client";

import { motion } from 'framer-motion';

export default function PinkScanlinesOverlay() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 pointer-events-none z-20"
    >
      {/* Animated Scanlines */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 105, 180, 0.1) 2px,
            rgba(255, 105, 180, 0.1) 4px
          )`,
          animation: 'scanlines 2s linear infinite',
        }}
      />
      
      {/* Subtle Pink Glow */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 105, 180, 0.2) 0%, transparent 70%)',
        }}
      />
      
      {/* Vignette Effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.8) 100%)',
        }}
      />

      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </motion.div>
  );
}