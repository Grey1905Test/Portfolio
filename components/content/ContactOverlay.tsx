"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { contactData, ContactSection } from '@/lib/contactData';
import { ChevronLeft, ChevronRight, ExternalLink, Mail, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import CommunicationWaves from '../effects/CommunicationWaves';
import MessageParticles from '../effects/MessageParticles';
import { SpinningPlanetDisplay } from '../3d/SpinningPlanetDisplay';

interface ContactOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactOverlay({ isOpen, onClose }: ContactOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const currentSection = contactData[currentIndex];

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
    setCurrentIndex((prev) => (prev + 1) % contactData.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + contactData.length) % contactData.length);
  };

  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'linkedin':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Spinning Planet Display */}
          <SpinningPlanetDisplay 
            modelPath="/models/planet4.glb"
            theme="pink"
            scale={2.8}
            rotationSpeed={0.002}
          />

          {/* Backdrop with communication effects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
          >
            {/* Communication Waves */}
            <CommunicationWaves color="rgba(255, 105, 180, 0.5)" opacity={0.4} />
            
            {/* Message Particles */}
            <MessageParticles color="rgba(255, 105, 180, 0.6)" opacity={0.3} />
            
            {/* Signal Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-8"
              style={{
                backgroundImage: `
                  radial-gradient(circle at center, rgba(255, 105, 180, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px',
                animation: 'signalPulse 3s ease-in-out infinite',
              }}
            />
          </motion.div>

          {/* Terminal Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="group/nav fixed right-0 top-0 h-screen w-full md:w-2/5 bg-black/95 border-l-2 border-pink-400 shadow-2xl z-50 font-mono"
            style={{ 
              overflow: 'hidden',
              overflowX: 'hidden',
              overflowY: 'hidden',
              maxHeight: '100vh',
              height: '100vh'
            }}
            style={{
              boxShadow: '0 0 50px rgba(255, 105, 180, 0.2), inset 0 0 100px rgba(255, 105, 180, 0.02)',
            }}
          >
            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 border-2 border-pink-400/50 hover:border-pink-400 bg-black/60 backdrop-blur-md hover:bg-pink-400/10 transition-all opacity-0 group-hover/nav:opacity-100 disabled:opacity-0 z-20"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6 text-pink-400" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 border-2 border-pink-400/50 hover:border-pink-400 bg-black/60 backdrop-blur-md hover:bg-pink-400/10 transition-all opacity-0 group-hover/nav:opacity-100 disabled:opacity-0 z-20"
              disabled={currentIndex === contactData.length - 1}
            >
              <ChevronRight className="w-6 h-6 text-pink-400" />
            </button>

            {/* Header Terminal Bar */}
            <div className="border-b-2 border-pink-400 bg-pink-400/5 p-4">
              <div className="flex items-center justify-between text-pink-400 text-xs tracking-widest">
                <span>CONTACT_MODULE.EXE</span>
                <div className="flex gap-2">
                  {contactData.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-8 border border-pink-400 ${
                        index === currentIndex ? 'bg-pink-400' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                <span>SECTION [{currentIndex + 1}/{contactData.length}]</span>
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
                <div className="mb-8 border-l-4 border-pink-400 pl-4">
                  <div className="text-pink-400/60 text-xs tracking-widest mb-2">
                    ACCESSING_FILE
                  </div>
                  <h2 className="text-3xl font-bold text-pink-400 tracking-wider font-orbitron">
                    {displayText}
                    <span className="animate-pulse">_</span>
                  </h2>
                </div>

                {/* Render based on type */}
                {currentSection.type === 'text' && (
                  <div className="border-l-2 border-pink-400/30 pl-6 py-4">
                    <p className="text-pink-100/90 text-base leading-relaxed">
                      {currentSection.content as string}
                    </p>
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
                        className="border border-pink-400/30 bg-pink-400/5 p-4 hover:border-pink-400 hover:bg-pink-400/10 transition-all group cursor-pointer"
                        onClick={() => item.link && window.open(item.link, '_blank')}
                      >
                        <div className="flex items-center gap-2 text-pink-400/60 text-xs mb-2 tracking-widest group-hover:text-pink-400/80 transition-colors">
                          {getIcon(item.label)}
                          {item.label}
                          {item.link && <ExternalLink className="w-3 h-3 ml-auto" />}
                        </div>
                        <div className="text-pink-100 text-sm leading-relaxed group-hover:text-white transition-colors">
                          {item.value}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Footer Terminal Line */}
            <div className="absolute bottom-0 left-0 right-0 pt-4 border-t border-pink-400/30 text-pink-400/60 text-xs text-center tracking-widest bg-black/95 backdrop-blur-sm py-4">
              RECORD_#{String(currentIndex + 1).padStart(3, '0')} :: CONTACT_DATA :: TIMESTAMP_2026.02.23
            </div>

            {/* CSS Animations */}
            <style jsx>{`
              @keyframes signalPulse {
                0%, 100% { opacity: 0.08; }
                50% { opacity: 0.20; }
              }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}