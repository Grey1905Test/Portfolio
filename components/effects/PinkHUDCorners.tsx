"use client";

import { motion } from 'framer-motion';

export default function PinkHUDCorners() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Top Left */}
      <motion.div 
        initial={{ opacity: 0, x: -20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-8 left-8"
      >
        <div className="relative">
          <div className="w-16 h-16 border-l-2 border-t-2 border-pink-400"></div>
          <div className="absolute -top-6 -left-1 text-pink-400 text-xs font-mono tracking-widest">
            CONTACT_SYS
          </div>
          <div className="absolute -bottom-6 -left-1 text-pink-400/60 text-xs font-mono">
            ONLINE
          </div>
        </div>
      </motion.div>

      {/* Top Right */}
      <motion.div 
        initial={{ opacity: 0, x: 20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute top-8 right-8"
      >
        <div className="relative">
          <div className="w-16 h-16 border-r-2 border-t-2 border-pink-400"></div>
          <div className="absolute -top-6 -right-1 text-pink-400 text-xs font-mono tracking-widest text-right">
            COMM_LINK
          </div>
          <div className="absolute -bottom-6 -right-1 text-pink-400/60 text-xs font-mono text-right">
            READY
          </div>
        </div>
      </motion.div>

      {/* Bottom Left */}
      <motion.div 
        initial={{ opacity: 0, x: -20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-8 left-8"
      >
        <div className="relative">
          <div className="w-16 h-16 border-l-2 border-b-2 border-pink-400"></div>
          <div className="absolute -top-6 -left-1 text-pink-400/60 text-xs font-mono">
            PHX_AZ
          </div>
          <div className="absolute -bottom-6 -left-1 text-pink-400 text-xs font-mono tracking-widest">
            LOCATION
          </div>
        </div>
      </motion.div>

      {/* Bottom Right */}
      <motion.div 
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-8 right-8"
      >
        <div className="relative">
          <div className="w-16 h-16 border-r-2 border-b-2 border-pink-400"></div>
          <div className="absolute -top-6 -right-1 text-pink-400/60 text-xs font-mono text-right">
            MST
          </div>
          <div className="absolute -bottom-6 -right-1 text-pink-400 text-xs font-mono tracking-widest text-right">
            TIMEZONE
          </div>
        </div>
      </motion.div>

      {/* Center Status */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="text-center">
          <div className="text-pink-400 text-sm font-mono tracking-widest mb-2">
            CONTACT_MODULE
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <div className="text-pink-400/80 text-xs font-mono">ACTIVE</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}