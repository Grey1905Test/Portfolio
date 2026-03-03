"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const BOOT_COMMANDS = [
  { text: '> INITIALIZING NEURAL INTERFACE...', delay: 0 },
  { text: '> LOADING QUANTUM PROCESSORS...', delay: 500 },
  { text: '> ESTABLISHING SECURE CONNECTION...', delay: 1000 },
  { text: '> COMPILING SHADER MATRICES...', delay: 1500 },
  { text: '> RENDERING 3D ENVIRONMENT...', delay: 2000 },
  { text: '> SYNCHRONIZING ORBITAL MECHANICS...', delay: 2500 },
  { text: '> CALIBRATING CAMERA SYSTEMS...', delay: 3000 },
  { text: '> LOADING EXPERIENCE DATABASE...', delay: 3500 },
  { text: '> ACTIVATING PARTICLE SYSTEMS...', delay: 4000 },
  { text: '> SYSTEM ONLINE', delay: 4500 },
];

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    // Progress bar animation - slower
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1.5; // Slower progress
      });
    }, 70); // Slower interval

    // Commands animation
    BOOT_COMMANDS.forEach((cmd, index) => {
      setTimeout(() => {
        setCurrentCommandIndex(index);
      }, cmd.delay);
    });

    // Random glitch effects
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 100);
    }, 2000);

    // Complete loading
    setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        onLoadingComplete();
      }, 800);
    }, 5200); // Slower overall

    return () => {
      clearInterval(progressInterval);
      clearInterval(glitchInterval);
    };
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          {/* Animated grid background */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(white 1px, transparent 1px),
                linear-gradient(90deg, white 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 30s linear infinite',
            }}
          />

          {/* Scanlines */}
          <div 
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)',
            }}
          />

          <div className="relative z-10 w-full max-w-3xl px-8">
            {/* Logo/Title with glitch */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h1 
                className={`text-6xl font-bold text-white font-orbitron mb-3 tracking-widest ${glitchEffect ? 'glitch' : ''}`}
                style={{
                  textShadow: glitchEffect 
                    ? '2px 2px 0 rgba(255,255,255,0.3), -2px -2px 0 rgba(255,255,255,0.3)' 
                    : '0 0 30px rgba(255,255,255,0.5)',
                }}
              >
                PORTFOLIO.SYS
              </motion.h1>
              <motion.div
                className="flex items-center justify-center gap-2 text-white/40 text-sm tracking-[0.3em] font-mono"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="inline-block w-2 h-2 bg-white rounded-full" />
                <span>NEURAL INTERFACE v2.0.26</span>
                <span className="inline-block w-2 h-2 bg-white rounded-full" />
              </motion.div>
            </motion.div>

            {/* Terminal Commands */}
            <div className="bg-black border-2 border-white/20 rounded-none p-8 mb-10 min-h-[280px] font-mono text-sm shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              {BOOT_COMMANDS.slice(0, currentCommandIndex + 1).map((cmd, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-3 flex items-center ${
                    index === BOOT_COMMANDS.length - 1 
                      ? 'text-white font-bold text-base' 
                      : 'text-white/60'
                  }`}
                >
                  <span className="mr-2 text-white/40">{String(index + 1).padStart(2, '0')}</span>
                  <span>{cmd.text}</span>
                  {index === currentCommandIndex && index !== BOOT_COMMANDS.length - 1 && (
                    <motion.span 
                      className="inline-block w-2 h-4 bg-white ml-2"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-mono text-white/50 tracking-widest">
                <span>SYSTEM INITIALIZATION</span>
                <span>{Math.min(progress, 100).toFixed(0)}%</span>
              </div>
              
              <div className="relative h-4 bg-white/5 border-2 border-white/20 overflow-hidden">
                {/* Background grid pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, white 4px, white 6px)',
                  }}
                />
                
                {/* Progress fill */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                  className="relative h-full bg-white"
                  style={{
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  />
                </motion.div>
              </div>

              {/* Status indicators */}
              <div className="flex gap-6 text-xs font-mono text-white/30 justify-center mt-8 tracking-widest">
                <motion.div 
                  className="flex items-center gap-2"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                >
                  <span className="inline-block w-2 h-2 bg-white" />
                  <span>RENDERER</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                  <span className="inline-block w-2 h-2 bg-white" />
                  <span>NEURAL.LINK</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                >
                  <span className="inline-block w-2 h-2 bg-white" />
                  <span>QUANTUM.CORE</span>
                </motion.div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes gridMove {
              0% { transform: translate(0, 0); }
              100% { transform: translate(50px, 50px); }
            }
            .glitch {
              animation: glitch 0.3s ease;
            }
            @keyframes glitch {
              0% { transform: translate(0); }
              20% { transform: translate(-3px, 3px); }
              40% { transform: translate(-3px, -3px); }
              60% { transform: translate(3px, 3px); }
              80% { transform: translate(3px, -3px); }
              100% { transform: translate(0); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
