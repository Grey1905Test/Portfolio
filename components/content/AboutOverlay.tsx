"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { aboutData, AboutSection } from '@/lib/aboutData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import MatrixRainEffect from '../effects/MatrixRainEffect';
import FloatingParticles from '../effects/FloatingParticles';
import { SpinningPlanetDisplay } from '../3d/SpinningPlanetDisplay';

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutOverlay({ isOpen, onClose }: AboutOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const currentSection = aboutData[currentIndex];

  // Typing effect for section title
  useEffect(() => {
    if (isOpen) {
      setDisplayText('');
      let index = 0;
      const text = currentSection.title;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isOpen, currentSection.title]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % aboutData.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + aboutData.length) % aboutData.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 h-screen grid grid-cols-1 md:grid-cols-[1fr_minmax(320px,40%)]"
        >
          {/* Left column: backdrop + planet (min-h-screen/min-w-0 so it has size on first paint) */}
          <div className="relative min-h-screen h-full w-full min-w-0 overflow-hidden">
            {/* Backdrop with animated effects */}
            <div className="absolute inset-0 bg-black">
              <MatrixRainEffect color="rgba(255, 255, 255, 0.1)" opacity={0.3} />
              <FloatingParticles color="rgba(255, 255, 255, 0.4)" count={30} speed={0.3} />
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '60px 60px',
                  animation: 'gridPulse 4s ease-in-out infinite',
                }}
              />
            </div>
            {/* Planet centered in left column */}
            <SpinningPlanetDisplay
              key="about-planet"
              modelPath="/models/planet3.glb"
              theme="white"
              scale={1.0}
              rotationSpeed={0.002}
              embedded
            />
          </div>

          {/* Right column: Terminal Panel (sidebar) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="group/nav relative h-screen w-full min-w-0 bg-black/95 border-l-2 border-white shadow-2xl font-mono flex flex-col"
            style={{
              overflow: 'hidden',
              maxHeight: '100vh',
              boxShadow: '0 0 50px rgba(255, 255, 255, 0.2), inset 0 0 100px rgba(255, 255, 255, 0.02)',
            }}
          >
            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 border-2 border-white/50 hover:border-white bg-black/60 backdrop-blur-md hover:bg-white/10 transition-all opacity-0 group-hover/nav:opacity-100 disabled:opacity-0 z-20"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 border-2 border-white/50 hover:border-white bg-black/60 backdrop-blur-md hover:bg-white/10 transition-all opacity-0 group-hover/nav:opacity-100 disabled:opacity-0 z-20"
              disabled={currentIndex === aboutData.length - 1}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Header Terminal Bar */}
            <div className="border-b-2 border-white bg-white/5 p-4">
              <div className="flex items-center justify-between text-white text-xs tracking-widest">
                <span>ABOUT_MODULE.EXE</span>
                <div className="flex gap-2">
                  {aboutData.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-8 border border-white ${
                        index === currentIndex ? 'bg-white' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                <span>SECTION [{currentIndex + 1}/{aboutData.length}]</span>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 pt-20 pb-24 max-h-screen"
                style={{ height: 'calc(100vh - 120px)', overflow: 'hidden' }}
              >
                {/* Section Title with Typing Effect */}
                <div className="mb-8 border-l-4 border-white pl-4">
                  <div className="text-white/60 text-xs tracking-widest mb-2">
                    ACCESSING_FILE
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-wider font-orbitron">
                    {displayText}
                    <span className="animate-pulse">_</span>
                  </h2>
                </div>

                {/* Render based on type */}
                {currentSection.type === 'text' && (
                  <div className="border-l-2 border-white/30 pl-6 py-4">
                    <p className="text-white/90 text-base leading-relaxed">
                      {currentSection.content as string}
                    </p>
                  </div>
                )}

                {currentSection.type === 'list' && (
                  <div className="space-y-3">
                    {(currentSection.content as string[]).map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 items-start group"
                      >
                        <span className="text-white/60 font-bold mt-1 flex-shrink-0 group-hover:text-white transition-colors">
                          [{String(index + 1).padStart(2, '0')}]
                        </span>
                        <span className="text-white/80 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {currentSection.type === 'grid' && (
                  <div className="grid grid-cols-1 gap-4">
                    {currentSection.content.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.08 }}
                        className="border border-white/30 bg-white/5 p-4 hover:border-white hover:bg-white/10 transition-all group"
                      >
                        <div className="text-white/60 text-xs mb-2 tracking-widest group-hover:text-white/80 transition-colors">
                          {item.label}
                        </div>
                        <div className="text-white text-sm leading-relaxed">
                          {item.value}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Footer Terminal Line */}
            <div className="absolute bottom-0 left-0 right-0 pt-4 border-t border-white/30 text-white/60 text-xs text-center tracking-widest bg-black/95 backdrop-blur-sm py-4">
              RECORD_#{String(currentIndex + 1).padStart(3, '0')} :: PERSONAL_DATA :: TIMESTAMP_2026.02.23
            </div>

            {/* CSS Animations */}
            <style jsx>{`
              @keyframes gridPulse {
                0%, 100% { opacity: 0.05; }
                50% { opacity: 0.15; }
              }
            `}</style>
            
            <style jsx global>{`
              body {
                overflow: hidden !important;
              }
              * {
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
              }
              *::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
              }
              .group\/nav {
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
              }
              .group\/nav::-webkit-scrollbar {
                display: none !important;
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}