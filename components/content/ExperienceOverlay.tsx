"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ExperienceItem, experiences } from '@/lib/experienceData';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

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
        <>
          {/* Backdrop with grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 107, 53, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 107, 53, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
            onClick={onClose}
          />

          {/* Terminal Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-3xl bg-black/95 border-l-2 border-orange-500 shadow-2xl z-50 overflow-y-auto font-mono"
            style={{
              boxShadow: '0 0 50px rgba(255, 107, 53, 0.3), inset 0 0 100px rgba(255, 107, 53, 0.05)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 border border-orange-500/50 hover:border-orange-500 hover:bg-orange-500/10 transition-all z-10 group"
            >
              <X className="w-5 h-5 text-orange-500" />
            </button>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-6 -translate-y-1/2 pointer-events-none z-10">
              <button
                onClick={handlePrevious}
                className="p-3 border-2 border-orange-500/50 hover:border-orange-500 bg-black/80 hover:bg-orange-500/20 transition-all pointer-events-auto disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-5 h-5 text-orange-500" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 border-2 border-orange-500/50 hover:border-orange-500 bg-black/80 hover:bg-orange-500/20 transition-all pointer-events-auto disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={currentIndex === experiences.length - 1}
              >
                <ChevronRight className="w-5 h-5 text-orange-500" />
              </button>
            </div>

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
                className="p-8"
              >
                {/* Company Name with Typing Effect */}
                <div className="mb-6 border-l-4 border-orange-500 pl-4">
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

                {/* Footer Terminal Line */}
                <div className="mt-8 pt-4 border-t border-orange-500/30 text-orange-500/60 text-xs text-center tracking-widest">
                  RECORD_#{String(currentIndex + 1).padStart(3, '0')} :: VERIFIED :: TIMESTAMP_2026.02.05
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}