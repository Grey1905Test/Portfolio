"use client";

import { motion } from 'framer-motion';

export default function WhiteHUDCorners() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Top Left Corner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 left-6 text-white/80 font-mono text-xs space-y-1"
      >
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="tracking-wider">PROFILE_ACCESS</span>
        </div>
        <div className="text-white/50 pl-4">ID: SURYA_SUNDAR</div>
        <div className="text-white/50 pl-4">STATUS: ACTIVE</div>
      </motion.div>

      {/* Top Right Corner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 right-6 text-white/80 font-mono text-xs text-right space-y-1"
      >
        <div className="flex gap-2 items-center justify-end">
          <span className="tracking-wider">LOCATION</span>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
        <div className="text-white/50">PHOENIX, AZ</div>
        <div className="text-white/50">COORDS: 33.4484°N</div>
      </motion.div>

      {/* Bottom Left Corner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-6 left-6 text-white/80 font-mono text-xs space-y-1"
      >
        <div className="text-white/50">MODULE: ABOUT</div>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="tracking-wider">PERSONAL_DATA</span>
        </div>
      </motion.div>

      {/* Bottom Right Corner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-6 right-6 text-white/80 font-mono text-xs text-right space-y-1"
      >
        <div className="text-white/50">SYSTEM_TIME</div>
        <div className="flex gap-2 items-center justify-end">
          <span className="tracking-wider">2026.02.11</span>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </motion.div>

      {/* Corner Brackets */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/40"></div>
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/40"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/40"></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/40"></div>
    </div>
  );
}