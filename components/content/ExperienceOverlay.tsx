"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ExperienceItem, experiences } from '@/lib/experienceData';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import IndustrialGridEffect from '../effects/IndustrialGridEffect';
import TechScanEffect from '../effects/TechScanEffect';
import { SpinningPlanetDisplay } from '../3d/SpinningPlanetDisplay';

interface ExperienceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExperienceOverlay({ isOpen, onClose }: ExperienceOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const currentExperience = experiences[currentIndex];

  // Typing effect for company name
  useEffect(() => {
    if (isOpen) {
      setDisplayText('');
      let index = 0;
      const text = currentExperience.company.toUpperCase();
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isOpen, currentExperience.company]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % experiences.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + experiences.length) % experiences.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 h-screen grid grid-cols-1 md:grid-cols-[1fr_minmax(320px,50%)]"
        >
          {/* Left column: backdrop + planet (min-h-screen/min-w-0 so it has size on first paint) */}
          <div className="relative min-h-screen h-full w-full min-w-0 overflow-hidden">
            <div className="absolute inset-0 bg-black">
              <IndustrialGridEffect color="rgba(255, 107, 53, 0.4)" opacity={0.3} />
              <TechScanEffect color="rgba(255, 107, 53, 0.6)" opacity={0.4} />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 20px,
                    rgba(255, 107, 53, 0.2) 20px,
                    rgba(255, 107, 53, 0.2) 40px
                  )`,
                  animation: 'warningStripes 8s linear infinite',
                }}
              />
            </div>
            <SpinningPlanetDisplay
              key="experience-planet"
              modelPath="/models/planet5.glb"
              theme="orange"
              scale={2}
              rotationSpeed={0.0015}
              embedded
            />
          </div>

          {/* Right column: Terminal Panel (sidebar) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="group/nav relative h-screen w-full min-w-0 bg-black/95 border-l-2 border-orange-500 shadow-2xl font-mono flex flex-col"
            style={{
              overflow: 'hidden',
              maxHeight: '100vh',
              boxShadow: '0 0 50px rgba(255, 107, 53, 0.3), inset 0 0 100px rgba(255, 107, 53, 0.05)',
            }}
          >
            {/* Navigation Arrows - Inside panel, show on hover with blur */}
            {/* Left Arrow */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 border-2 border-orange-500/50 hover:border-orange-500 bg-black/60 backdrop-blur-md hover:bg-orange-500/20 transition-all opacity-0 group-hover/nav:opacity-100 disabled:opacity-0 z-20"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6 text-orange-500" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 border-2 border-orange-500/50 hover:border-orange-500 bg-black/60 backdrop-blur-md hover:bg-orange-500/20 transition-all opacity-0 group-hover/nav:opacity-100 disabled:opacity-0 z-20"
              disabled={currentIndex === experiences.length - 1}
            >
              <ChevronRight className="w-6 h-6 text-orange-500" />
            </button>

            {/* Header Terminal Bar */}
            <div className="border-b-2 border-orange-500 bg-orange-500/5 p-4">
              <div className="flex items-center justify-between text-orange-500 text-xs tracking-widest">
                <span>EXPERIENCE_MODULE.EXE</span>
                <div className="flex gap-2">
                  {experiences.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-8 border border-orange-500 ${
                        index === currentIndex ? 'bg-orange-500' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                <span>ENTRY [{currentIndex + 1}/{experiences.length}]</span>
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
                {/* Company Name with Typing Effect */}
                <div className="mb-8 border-l-4 border-orange-500 pl-4">
                  <div className="text-orange-500 text-xs tracking-widest mb-2 opacity-60">
                    ORGANIZATION_ID
                  </div>
                  <h2 className="text-4xl font-bold text-orange-500 tracking-wider mb-3 font-orbitron">
                    {displayText}
                    <span className="animate-pulse">_</span>
                  </h2>
                  <h3 className="text-xl text-orange-400 tracking-wide uppercase">
                    {currentExperience.role}
                  </h3>
                </div>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="border border-orange-500/30 bg-orange-500/5 p-3">
                    <div className="text-orange-500/60 text-xs mb-1">LOCATION</div>
                    <div className="text-orange-300 text-sm">{currentExperience.location}</div>
                  </div>
                  <div className="border border-orange-500/30 bg-orange-500/5 p-3">
                    <div className="text-orange-500/60 text-xs mb-1">DURATION</div>
                    <div className="text-orange-300 text-sm">{currentExperience.duration}</div>
                  </div>
                  <div className="border border-orange-500/30 bg-orange-500/5 p-3">
                    <div className="text-orange-500/60 text-xs mb-1">TYPE</div>
                    <div className="text-orange-300 text-sm">{currentExperience.type}</div>
                  </div>
                </div>

                {/* Key Metrics */}
                {currentExperience.metrics && currentExperience.metrics.length > 0 && (
                  <div className="mb-8">
                    <div className="text-orange-500 text-sm tracking-widest mb-3 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-orange-500 animate-pulse"></span>
                      KEY_METRICS.DAT
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {currentExperience.metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="border border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-transparent p-3 hover:border-orange-500 transition-all group"
                        >
                          <div className="text-orange-300 text-xs font-semibold group-hover:text-orange-500 transition-colors">
                            {metric}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-8">
                  <div className="text-orange-500 text-sm tracking-widest mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-orange-500 animate-pulse"></span>
                    OPERATIONS_LOG.TXT
                  </div>
                  <div className="space-y-2 border-l-2 border-orange-500/30 pl-4">
                    {currentExperience.description.map((item, index) => (
                      <div key={index} className="flex gap-3 text-orange-100/80 text-sm leading-relaxed hover:text-orange-200 transition-colors">
                        <span className="text-orange-500 mt-1 flex-shrink-0">[{index + 1}]</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <div className="text-orange-500 text-sm tracking-widest mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-orange-500 animate-pulse"></span>
                    TECH_STACK.SYS
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentExperience.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 border border-orange-500/50 text-orange-400 text-xs tracking-wider hover:bg-orange-500/20 hover:border-orange-500 transition-all cursor-default"
                      >
                        {tech.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Footer Terminal Line - Fixed at panel bottom */}
            <div className="absolute bottom-0 left-0 right-0 pt-4 border-t border-orange-500/30 text-orange-500/60 text-xs text-center tracking-widest bg-black/95 backdrop-blur-sm py-4">
              RECORD_#{String(currentIndex + 1).padStart(3, '0')} :: VERIFIED :: TIMESTAMP_2026.02.23
            </div>

            {/* CSS Animations */}
            <style jsx>{`
              @keyframes warningStripes {
                0% { transform: translateX(-40px); }
                100% { transform: translateX(0); }
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}