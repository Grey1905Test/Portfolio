"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ProjectItem, projects } from '@/lib/projectsData';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import CircuitNetworkEffect from '../effects/CircuitNetworkEffect';
import DataFlowEffect from '../effects/DataFlowEffect';

interface ProjectsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectsOverlay({ isOpen, onClose }: ProjectsOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const currentProject = projects[currentIndex];

  // Typing effect for project title
  useEffect(() => {
    if (isOpen) {
      setDisplayText('');
      let index = 0;
      const text = currentProject.title.toUpperCase();
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
  }, [currentIndex, isOpen, currentProject.title]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with circuit network effects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-40"
            onClick={onClose}
          >
            {/* Circuit Network Effect */}
            <CircuitNetworkEffect color="rgba(0, 255, 0, 0.5)" opacity={0.4} />
            
            {/* Data Flow Effect */}
            <DataFlowEffect color="rgba(0, 255, 0, 0.7)" opacity={0.3} />
            
            {/* Hexagonal Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.2) 2px, transparent 2px),
                  radial-gradient(circle at 75% 75%, rgba(0, 255, 0, 0.2) 2px, transparent 2px)
                `,
                backgroundSize: '60px 60px',
                animation: 'hexPulse 6s ease-in-out infinite',
              }}
            />
          </motion.div>

{/* Terminal Panel */}
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
  className="group/nav fixed right-0 top-0 h-full w-full md:w-1/2 bg-black/95 border-l-2 border-green-500 shadow-2xl z-50 overflow-y-auto font-mono"
  style={{
    boxShadow: '0 0 50px rgba(0, 255, 0, 0.3), inset 0 0 100px rgba(0, 255, 0, 0.05)',
  }}
>
  {/* Navigation Arrows - Inside panel, show on hover with blur */}
  {/* Left Arrow */}
  <button
    onClick={handlePrevious}
    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 border-2 border-green-500/50 hover:border-green-500 bg-black/60 backdrop-blur-md hover:bg-green-500/20 transition-all opacity-0 group-hover/nav:opacity-100 disabled:opacity-0 z-20"
    disabled={currentIndex === 0}
  >
    <ChevronLeft className="w-6 h-6 text-green-500" />
  </button>

  {/* Right Arrow */}
  <button
    onClick={handleNext}
    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 border-2 border-green-500/50 hover:border-green-500 bg-black/60 backdrop-blur-md hover:bg-green-500/20 transition-all opacity-0 group-hover/nav:opacity-100 disabled:opacity-0 z-20"
    disabled={currentIndex === projects.length - 1}
  >
    <ChevronRight className="w-6 h-6 text-green-500" />
  </button>

  {/* Header Terminal Bar */}
  <div className="border-b-2 border-green-500 bg-green-500/5 p-4">
              <div className="flex items-center justify-between text-green-500 text-xs tracking-widest">
                <span>PROJECTS_MODULE.EXE</span>
                <div className="flex gap-2">
                  {projects.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-8 border border-green-500 ${
                        index === currentIndex ? 'bg-green-500' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                <span>ENTRY [{currentIndex + 1}/{projects.length}]</span>
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
                className="p-8 pb-24"
              >
                {/* Project Title with Typing Effect */}
                <div className="mb-8 border-l-4 border-green-500 pl-4">
                  <div className="text-green-500 text-xs tracking-widest mb-2 opacity-60">
                    PROJECT_ID
                  </div>
                  <h2 className="text-4xl font-bold text-green-500 tracking-wider mb-3 font-orbitron">
                    {displayText}
                    <span className="animate-pulse">_</span>
                  </h2>
                  <h3 className="text-xl text-green-400 tracking-wide uppercase">
                    {currentProject.tagline}
                  </h3>
                </div>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="border border-green-500/30 bg-green-500/5 p-3">
                    <div className="text-green-500/60 text-xs mb-1">DURATION</div>
                    <div className="text-green-300 text-sm">{currentProject.duration}</div>
                  </div>
                  <div className="border border-green-500/30 bg-green-500/5 p-3">
                    <div className="text-green-500/60 text-xs mb-1">TYPE</div>
                    <div className="text-green-300 text-sm">{currentProject.type}</div>
                  </div>
                </div>

{/* Links */}
{currentProject.links && (
  <div className="mb-8 flex gap-3">
    {currentProject.links.github && (
      <a
        href={currentProject.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 border border-green-500/50 hover:border-green-500 hover:bg-green-500/10 text-green-400 text-sm transition-all"
      >
        <Github className="w-4 h-4" />
        <span>REPOSITORY</span>
      </a>
    )}
    {currentProject.links.demo && (
      <a
        href={currentProject.links.demo}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 border border-green-500/50 hover:border-green-500 hover:bg-green-500/10 text-green-400 text-sm transition-all"
      >
        <ExternalLink className="w-4 h-4" />
        <span>LIVE_DEMO</span>
      </a>
    )}
  </div>
)}

                {/* Key Metrics */}
                {currentProject.metrics && currentProject.metrics.length > 0 && (
                  <div className="mb-8">
                    <div className="text-green-500 text-sm tracking-widest mb-3 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 animate-pulse"></span>
                      KEY_METRICS.DAT
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {currentProject.metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="border border-green-500/50 bg-gradient-to-br from-green-500/10 to-transparent p-3 hover:border-green-500 transition-all group"
                        >
                          <div className="text-green-300 text-xs font-semibold group-hover:text-green-500 transition-colors">
                            {metric}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-8">
                  <div className="text-green-500 text-sm tracking-widest mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 animate-pulse"></span>
                    PROJECT_OVERVIEW.TXT
                  </div>
                  <div className="space-y-2 border-l-2 border-green-500/30 pl-4">
                    {currentProject.description.map((item, index) => (
                      <div key={index} className="flex gap-3 text-green-100/80 text-sm leading-relaxed hover:text-green-300 transition-colors">
                        <span className="text-green-500 mt-1 flex-shrink-0">[{index + 1}]</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                {currentProject.features && currentProject.features.length > 0 && (
                  <div className="mb-8">
                    <div className="text-green-500 text-sm tracking-widest mb-3 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 animate-pulse"></span>
                      FEATURES.SYS
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {currentProject.features.map((feature, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-green-500/50 pl-3 py-2 text-green-300 text-xs hover:border-green-500 hover:text-green-400 transition-all"
                        >
                          ▸ {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                <div>
                  <div className="text-green-500 text-sm tracking-widest mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 animate-pulse"></span>
                    TECH_STACK.SYS
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 border border-green-500/50 text-green-400 text-xs tracking-wider hover:bg-green-500/20 hover:border-green-500 transition-all cursor-default"
                      >
                        {tech.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                              </motion.div>
            </AnimatePresence>

            {/* Footer Terminal Line - Fixed at panel bottom */}
            <div className="absolute bottom-0 left-0 right-0 pt-4 border-t border-green-500/30 text-green-500/60 text-xs text-center tracking-widest bg-black/95 backdrop-blur-sm py-4">
              RECORD_#{String(currentIndex + 1).padStart(3, '0')} :: VERIFIED :: TIMESTAMP_2026.02.23
            </div>

            {/* CSS Animations */}
            <style jsx>{`
              @keyframes hexPulse {
                0%, 100% { opacity: 0.05; }
                50% { opacity: 0.15; }
              }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}