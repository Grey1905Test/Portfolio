"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { aboutData, AboutSection } from '@/lib/aboutData';
import MatrixRainEffect from '../effects/MatrixRainEffect';
import FloatingParticles from '../effects/FloatingParticles';
import { SpinningPlanetDisplay } from '../3d/SpinningPlanetDisplay';

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function SectionBlock({ section }: { section: AboutSection }) {
  return (
    <div className="min-w-0 flex-shrink-0">
      <h3 className="text-white/90 text-sm font-bold tracking-wider font-orbitron mb-1.5 border-b border-white/20 pb-1">
        {section.title}
      </h3>
      {section.type === 'text' && (
        <p className="text-white/80 text-xs leading-snug">
          {section.content as string}
        </p>
      )}
      {section.type === 'list' && (
        <ul className="space-y-0.5">
          {(section.content as string[]).map((item, i) => (
            <li key={i} className="text-white/75 text-[11px] leading-tight flex gap-1.5">
              <span className="text-white/50 flex-shrink-0">›</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {section.type === 'grid' && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {section.content.map((item, i) => (
            <div key={i} className="border border-white/20 bg-white/5 px-2 py-1 rounded">
              <div className="text-white/50 text-[10px] tracking-wider uppercase">{item.label}</div>
              <div className="text-white/85 text-[11px] leading-tight">{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AboutOverlay({ isOpen, onClose }: AboutOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 h-screen grid grid-cols-1 md:grid-cols-[1fr_minmax(320px,50%)]"
        >
          {/* Left column */}
          <div className="relative min-h-screen h-full w-full min-w-0 overflow-hidden">
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
            <SpinningPlanetDisplay
              key="about-planet"
              modelPath="/models/planet3.glb"
              theme="white"
              scale={2}
              rotationSpeed={0.002}
              embedded
            />
          </div>

          {/* Right column: single page, no scroll */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative h-screen w-full min-w-0 bg-black/95 border-l-2 border-white shadow-2xl font-mono flex flex-col overflow-hidden"
            style={{
              maxHeight: '100vh',
              boxShadow: '0 0 50px rgba(255, 255, 255, 0.2), inset 0 0 100px rgba(255, 255, 255, 0.02)',
            }}
          >
            {/* Header */}
            <div className="border-b-2 border-white bg-white/5 px-4 py-3 flex-shrink-0">
              <div className="flex items-center justify-between text-white text-xs tracking-widest">
                <span>ABOUT_MODULE.EXE</span>
                <span>PERSONAL_DATA</span>
              </div>
            </div>

            {/* Content: all sections in one view, fixed height, no scroll */}
            <div
              className="flex-1 min-h-0 flex flex-col gap-4 p-4 overflow-hidden"
              style={{ height: 'calc(100vh - 120px)' }}
            >
              {aboutData.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                  className="flex-1 min-h-0 flex flex-col border border-white/20 bg-white/5 rounded-lg p-3 overflow-hidden"
                >
                  <SectionBlock section={section} />
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-white/30 text-white/60 text-xs text-center tracking-widest bg-black/95 py-3">
              RECORD :: PERSONAL_DATA :: TIMESTAMP_2026.02.23
            </div>

            <style jsx>{`
              @keyframes gridPulse {
                0%, 100% { opacity: 0.05; }
                50% { opacity: 0.15; }
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
