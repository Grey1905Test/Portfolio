"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { contactData } from '@/lib/contactData';
import { ExternalLink, Mail, Phone, MapPin, Clock, Briefcase } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import CommunicationWaves from '../effects/CommunicationWaves';
import MessageParticles from '../effects/MessageParticles';
import { SpinningPlanetDisplay } from '../3d/SpinningPlanetDisplay';

interface ContactOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Enhanced Satellite Viz ───────────────────────────────────────────────────
function SignalViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 400, h: 160 });
  const [beams, setBeams] = useState<{ id: number; progress: number; toYou: boolean }[]>([]);
  const [satRings, setSatRings] = useState<{ id: number; scale: number; opacity: number }[]>([]);
  const [gndRings, setGndRings] = useState<{ id: number; scale: number; opacity: number }[]>([]);
  const [youRings, setYouRings] = useState<{ id: number; scale: number; opacity: number }[]>([]);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [dataPackets, setDataPackets] = useState<{ id: number; progress: number; lane: number }[]>([]);
  const beamId = useRef(0);
  const ringId = useRef(0);
  const packetId = useRef(0);

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: height });
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Orbit mini satellite
  useEffect(() => {
    let raf: number;
    const tick = () => {
      setOrbitAngle(a => (a + 0.008) % (Math.PI * 2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Signal beams
  useEffect(() => {
    const interval = setInterval(() => {
      const toYou = Math.random() > 0.4;
      setBeams(prev => [...prev.slice(-10), { id: beamId.current++, progress: 0, toYou }]);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Sat rings
  useEffect(() => {
    const interval = setInterval(() => {
      setSatRings(prev => [...prev.slice(-5), { id: ringId.current++, scale: 0, opacity: 1 }]);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  // Ground rings
  useEffect(() => {
    const interval = setInterval(() => {
      setGndRings(prev => [...prev.slice(-4), { id: ringId.current++, scale: 0, opacity: 1 }]);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // You rings
  useEffect(() => {
    const interval = setInterval(() => {
      setYouRings(prev => [...prev.slice(-4), { id: ringId.current++, scale: 0, opacity: 1 }]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Data stream packets ground ↔ you
  useEffect(() => {
    const interval = setInterval(() => {
      const lane = Math.floor(Math.random() * 3);
      setDataPackets(prev => [...prev.slice(-12), { id: packetId.current++, progress: 0, lane }]);
    }, 350);
    return () => clearInterval(interval);
  }, []);

  // Animate all
  useEffect(() => {
    let raf: number;
    const tick = () => {
      setBeams(prev => prev.map(b => ({ ...b, progress: b.progress + 0.018 })).filter(b => b.progress < 1));
      setSatRings(prev => prev.map(r => ({ ...r, scale: r.scale + 0.022, opacity: r.opacity - 0.022 })).filter(r => r.opacity > 0));
      setGndRings(prev => prev.map(r => ({ ...r, scale: r.scale + 0.018, opacity: r.opacity - 0.018 })).filter(r => r.opacity > 0));
      setYouRings(prev => prev.map(r => ({ ...r, scale: r.scale + 0.02, opacity: r.opacity - 0.02 })).filter(r => r.opacity > 0));
      setDataPackets(prev => prev.map(p => ({ ...p, progress: p.progress + 0.022 })).filter(p => p.progress < 1));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { w, h } = dims;
  const satX = w * 0.5;
  const satY = h * 0.2;
  const gndX = w * 0.18;
  const gndY = h * 0.78;
  const youX = w * 0.82;
  const youY = h * 0.78;
  const orbitR = 28;
  const miniX = satX + Math.cos(orbitAngle) * orbitR;
  const miniY = satY + Math.sin(orbitAngle) * orbitR * 0.4;
  const streamLanes = [-5, 0, 5];

  return (
    <div ref={containerRef} className="absolute inset-0">
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="satglow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="beamglow">
            <feGaussianBlur stdDeviation="1.8" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="miniglow">
            <feGaussianBlur stdDeviation="1" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="earthGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(100,200,255,0.3)" />
            <stop offset="100%" stopColor="rgba(100,200,255,0.05)" />
          </radialGradient>
          <radialGradient id="youGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,105,180,0.25)" />
            <stop offset="100%" stopColor="rgba(255,105,180,0.03)" />
          </radialGradient>
        </defs>

        {/* Orbit ellipse */}
        <ellipse cx={satX} cy={satY} rx={orbitR} ry={orbitR * 0.4}
          fill="none" stroke="rgba(255,105,180,0.12)" strokeWidth="1" strokeDasharray="2 4" />

        {/* Static signal lines */}
        <line x1={satX} y1={satY} x2={gndX} y2={gndY} stroke="rgba(100,200,255,0.12)" strokeWidth="1" strokeDasharray="4 6" />
        <line x1={satX} y1={satY} x2={youX} y2={youY} stroke="rgba(255,105,180,0.12)" strokeWidth="1" strokeDasharray="4 6" />

        {/* Ground ↔ You stream lanes */}
        {streamLanes.map((offset, i) => (
          <line key={i}
            x1={gndX + 14} y1={gndY + offset}
            x2={youX - 14} y2={youY + offset}
            stroke="rgba(255,105,180,0.06)" strokeWidth="1" strokeDasharray="2 8" />
        ))}

        {/* Data packets ground ↔ you */}
        {dataPackets.map(p => {
          const laneY = streamLanes[p.lane];
          const goRight = p.id % 2 === 0;
          const sx = goRight ? gndX + 14 : youX - 14;
          const ex = goRight ? youX - 14 : gndX + 14;
          const px = sx + (ex - sx) * p.progress;
          const py = (goRight ? gndY : youY) + laneY;
          const color = goRight ? 'rgba(100,200,255,0.9)' : 'rgba(255,105,180,0.9)';
          const glow  = goRight ? 'rgba(100,200,255,0.2)' : 'rgba(255,105,180,0.2)';
          return (
            <g key={p.id} filter="url(#miniglow)">
              <circle cx={px} cy={py} r={2} fill={color} />
              <circle cx={px} cy={py} r={4} fill={glow} />
            </g>
          );
        })}

        {/* Sat rings */}
        {satRings.map(r => (
          <circle key={r.id} cx={satX} cy={satY} r={14 + r.scale * 28}
            fill="none" stroke={`rgba(255,105,180,${r.opacity * 0.45})`} strokeWidth="1" />
        ))}

        {/* Ground rings */}
        {gndRings.map(r => (
          <circle key={r.id} cx={gndX} cy={gndY} r={10 + r.scale * 20}
            fill="none" stroke={`rgba(100,200,255,${r.opacity * 0.4})`} strokeWidth="1" />
        ))}

        {/* You rings */}
        {youRings.map(r => (
          <circle key={r.id} cx={youX} cy={youY} r={10 + r.scale * 20}
            fill="none" stroke={`rgba(255,105,180,${r.opacity * 0.4})`} strokeWidth="1" />
        ))}

        {/* Signal beams sat → ground/you */}
        {beams.map(b => {
          const tx = b.toYou ? youX : gndX;
          const ty = b.toYou ? youY : gndY;
          const px = satX + (tx - satX) * b.progress;
          const py = satY + (ty - satY) * b.progress;
          const color = b.toYou ? 'rgba(255,105,180,0.95)' : 'rgba(100,200,255,0.95)';
          const glow  = b.toYou ? 'rgba(255,105,180,0.3)'  : 'rgba(100,200,255,0.3)';
          return (
            <g key={b.id} filter="url(#beamglow)">
              <circle cx={px} cy={py} r={3} fill={color} />
              <circle cx={px} cy={py} r={6.5} fill={glow} />
            </g>
          );
        })}

        {/* Orbiting mini satellite */}
        <g filter="url(#miniglow)">
          <rect x={miniX - 4} y={miniY - 2.5} width={8} height={5} rx={1}
            fill="rgba(255,200,100,0.15)" stroke="rgba(255,200,100,0.7)" strokeWidth="1" />
          <rect x={miniX - 8} y={miniY - 1.5} width={3.5} height={3} rx={0.5}
            fill="rgba(255,200,100,0.2)" stroke="rgba(255,200,100,0.5)" strokeWidth="0.5" />
          <rect x={miniX + 4.5} y={miniY - 1.5} width={3.5} height={3} rx={0.5}
            fill="rgba(255,200,100,0.2)" stroke="rgba(255,200,100,0.5)" strokeWidth="0.5" />
          <circle cx={miniX} cy={miniY} r={1} fill="rgba(255,200,100,0.9)">
            <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* ── Main Satellite ── */}
        <g filter="url(#satglow)">
          <rect x={satX - 12} y={satY - 8} width={24} height={16} rx={3}
            fill="rgba(255,105,180,0.12)" stroke="rgba(255,105,180,0.9)" strokeWidth="1.8" />
          <rect x={satX - 28} y={satY - 4} width={14} height={8} rx={1.5}
            fill="rgba(255,105,180,0.18)" stroke="rgba(255,105,180,0.65)" strokeWidth="1" />
          <line x1={satX - 22} y1={satY - 4} x2={satX - 22} y2={satY + 4} stroke="rgba(255,105,180,0.35)" strokeWidth="0.8" />
          <line x1={satX - 25} y1={satY - 4} x2={satX - 25} y2={satY + 4} stroke="rgba(255,105,180,0.35)" strokeWidth="0.8" />
          <rect x={satX + 14} y={satY - 4} width={14} height={8} rx={1.5}
            fill="rgba(255,105,180,0.18)" stroke="rgba(255,105,180,0.65)" strokeWidth="1" />
          <line x1={satX + 19} y1={satY - 4} x2={satX + 19} y2={satY + 4} stroke="rgba(255,105,180,0.35)" strokeWidth="0.8" />
          <line x1={satX + 22} y1={satY - 4} x2={satX + 22} y2={satY + 4} stroke="rgba(255,105,180,0.35)" strokeWidth="0.8" />
          <line x1={satX} y1={satY + 8} x2={satX} y2={satY + 15} stroke="rgba(255,105,180,0.85)" strokeWidth="1.2" />
          <circle cx={satX} cy={satY + 16} r={2} fill="rgba(255,105,180,1)" filter="url(#beamglow)" />
          <circle cx={satX + 7} cy={satY - 4} r={2} fill="rgba(100,255,150,0.95)">
            <animate attributeName="opacity" values="1;0.15;1" dur="1.1s" repeatCount="indefinite" />
          </circle>
          <line x1={satX - 6} y1={satY} x2={satX + 6} y2={satY} stroke="rgba(255,105,180,0.3)" strokeWidth="0.8" />
          <line x1={satX} y1={satY - 4} x2={satX} y2={satY + 4} stroke="rgba(255,105,180,0.3)" strokeWidth="0.8" />
          <text x={satX} y={satY - 13} textAnchor="middle" fill="rgba(255,105,180,0.65)" fontSize={7} fontFamily="monospace" letterSpacing="1">SAT-01</text>
        </g>

        {/* ── Ground Station ── */}
        <g filter="url(#satglow)">
          <circle cx={gndX} cy={gndY} r={18} fill="url(#earthGrad)" />
          <line x1={gndX} y1={gndY + 2} x2={gndX} y2={gndY - 14} stroke="rgba(100,200,255,0.75)" strokeWidth="2" />
          <path d={`M ${gndX - 14} ${gndY - 14} Q ${gndX} ${gndY - 26} ${gndX + 14} ${gndY - 14}`}
            fill="rgba(100,200,255,0.1)" stroke="rgba(100,200,255,0.75)" strokeWidth="1.8" />
          <line x1={gndX} y1={gndY - 14} x2={gndX} y2={gndY - 20} stroke="rgba(100,200,255,0.55)" strokeWidth="1.2" />
          <circle cx={gndX} cy={gndY - 21} r={2} fill="rgba(100,200,255,0.85)" filter="url(#beamglow)" />
          <rect x={gndX - 8} y={gndY + 2} width={16} height={4} rx={1}
            fill="rgba(100,200,255,0.12)" stroke="rgba(100,200,255,0.4)" strokeWidth="1" />
          <text x={gndX} y={gndY + 16} textAnchor="middle" fill="rgba(100,200,255,0.6)" fontSize={7} fontFamily="monospace">GROUND</text>
        </g>

        {/* ── You ── */}
        <g filter="url(#satglow)">
          <circle cx={youX} cy={youY} r={18} fill="url(#youGrad)" />
          <rect x={youX - 16} y={youY - 14} width={32} height={20} rx={3}
            fill="rgba(255,105,180,0.1)" stroke="rgba(255,105,180,0.8)" strokeWidth="1.8" />
          <line x1={youX - 12} y1={youY - 8} x2={youX + 2}  y2={youY - 8} stroke="rgba(255,105,180,0.3)" strokeWidth="0.8" />
          <line x1={youX - 12} y1={youY - 4} x2={youX + 6}  y2={youY - 4} stroke="rgba(255,105,180,0.2)" strokeWidth="0.8" />
          <line x1={youX - 12} y1={youY}     x2={youX - 2}  y2={youY}     stroke="rgba(255,105,180,0.2)" strokeWidth="0.8" />
          <text x={youX} y={youY + 3} textAnchor="middle" fill="rgba(255,105,180,0.95)" fontSize={8} fontFamily="monospace" fontWeight="bold">YOU</text>
          <text x={youX} y={youY + 15} textAnchor="middle" fill="rgba(255,105,180,0.45)" fontSize={6.5} fontFamily="monospace">PHX, AZ</text>
          <circle cx={youX + 13} cy={youY - 11} r={2.5} fill="rgba(100,255,150,0.9)">
            <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}

// ─── Icon helper ──────────────────────────────────────────────────────────────
function getIcon(label: string) {
  switch (label.toLowerCase()) {
    case 'email':    return <Mail className="w-4 h-4" />;
    case 'phone':    return <Phone className="w-4 h-4" />;
    case 'linkedin': return <ExternalLink className="w-4 h-4" />;
    case 'location': return <MapPin className="w-4 h-4" />;
    case 'timezone': return <Clock className="w-4 h-4" />;
    case 'status':   return <Briefcase className="w-4 h-4" />;
    default:         return null;
  }
}

// ─── Scramble effect for title ────────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    const startTimeout = setTimeout(() => {
      let iteration = 0;
      const totalFrames = text.length * 6;
      const iv = setInterval(() => {
        const resolved = Math.floor(iteration / 6);
        const scrambled = text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < resolved) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
        setDisplayed(scrambled.slice(0, Math.min(resolved + 4, text.length)));
        iteration++;
        if (iteration > totalFrames) {
          setDisplayed(text);
          setDone(true);
          clearInterval(iv);
        }
      }, 35);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      {!done && <span className="text-pink-400 animate-pulse">▋</span>}
    </span>
  );
}

// ─── Sweep Reveal — pink theme, used for intro / grid / closing ────────────────
function SweepReveal({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000, duration: 0.15 }}
    >
      <motion.div
        initial={{ filter: 'blur(5px)', y: 4 }}
        animate={{ filter: 'blur(0px)', y: 0 }}
        transition={{ delay: delay / 1000, duration: 0.4, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400/60 to-transparent pointer-events-none"
        initial={{ top: '0%', opacity: 1 }}
        animate={{ top: '110%', opacity: 0 }}
        transition={{ delay: delay / 1000, duration: 0.4, ease: 'easeIn' }}
      />
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ContactOverlay({ isOpen, onClose }: ContactOverlayProps) {
  const textSection    = contactData.find(s => s.id === 'get_in_touch')!;
  const gridSection    = contactData.find(s => s.id === 'contact_info')!;
  const closingSection = contactData.find(s => s.id === 'lets_build')!;
  const gridItems      = gridSection.type === 'grid' ? gridSection.content : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 h-screen grid grid-cols-1 md:grid-cols-[1fr_minmax(380px,55%)]"
        >
          {/* Left column */}
          <div className="relative min-h-screen h-full w-full min-w-0 overflow-hidden">
            <div className="absolute inset-0 bg-black">
              <CommunicationWaves color="rgba(255, 105, 180, 0.5)" opacity={0.4} />
              <MessageParticles color="rgba(255, 105, 180, 0.6)" opacity={0.3} />
              <div
                className="absolute inset-0 opacity-8"
                style={{
                  backgroundImage: `radial-gradient(circle at center, rgba(255, 105, 180, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px',
                  animation: 'signalPulse 3s ease-in-out infinite',
                }}
              />
            </div>
            <SpinningPlanetDisplay
              key="contact-planet"
              modelPath="/models/planet4.glb"
              theme="pink"
              scale={2}
              rotationSpeed={0.002}
              embedded
            />
          </div>

          {/* Right column */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative h-screen w-full min-w-0 bg-black/95 border-l-2 border-pink-400 shadow-2xl font-mono flex flex-col"
            style={{
              overflow: 'hidden',
              maxHeight: '100vh',
              boxShadow: '0 0 50px rgba(255, 105, 180, 0.2), inset 0 0 100px rgba(255, 105, 180, 0.02)',
            }}
          >
            {/* Header */}
            <div className="border-b-2 border-pink-400 bg-pink-400/5 p-5 flex-shrink-0">
              <div className="flex items-center justify-between text-pink-400 text-base tracking-widest">
                <span>CONTACT_MODULE.EXE</span>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                  <span>SIGNAL_OPEN</span>
                </div>
                <span>STATUS [ONLINE]</span>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 min-h-0 overflow-y-auto p-8 flex flex-col gap-6">

              {/* Title — scramble */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="border-l-4 border-pink-400 pl-5 flex-shrink-0"
              >
                <div className="text-pink-400/60 text-base tracking-widest mb-2">ACCESSING_FILE</div>
                <h2 className="text-4xl font-bold text-pink-400 tracking-wider font-orbitron">
                  <ScrambleText text="CONTACT_MODULE" delay={200} />
                </h2>
              </motion.div>

              {/* Intro */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="border-l-2 border-pink-400/30 pl-5 flex-shrink-0"
              >
                <div className="text-pink-400/60 text-base tracking-widest mb-2">GET_IN_TOUCH.EXE</div>
                <SweepReveal delay={400}>
                  <p className="text-pink-100/80 text-lg leading-relaxed">
                    {textSection.type === 'text' ? textSection.content : ''}
                  </p>
                </SweepReveal>
              </motion.div>

              {/* Contact grid */}
              <div className="flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-pink-400 text-base tracking-widest mb-3 flex items-center gap-2"
                >
                  <span className="inline-block w-2 h-2 bg-pink-400 animate-pulse" />
                  CONTACT_CHANNELS.DAT
                </motion.div>
                <div className="grid grid-cols-2 gap-4">
                  {gridItems.map((item, index) => (
                    <SweepReveal key={index} delay={600 + index * 80}>
                      <div
                        className={`border border-pink-400/30 bg-pink-400/5 p-5 transition-all group ${item.link ? 'hover:border-pink-400 hover:bg-pink-400/10 cursor-pointer' : ''}`}
                        onClick={() => item.link && window.open(item.link, '_blank')}
                      >
                        <div className="flex items-center gap-1.5 text-pink-400/60 text-base mb-2 tracking-widest group-hover:text-pink-400/80 transition-colors">
                          {getIcon(item.label)}
                          {item.label}
                          {item.link && <ExternalLink className="w-4 h-4 ml-auto" />}
                        </div>
                        <div className="text-pink-100 text-lg leading-relaxed group-hover:text-white transition-colors break-all">
                          {item.value}
                        </div>
                      </div>
                    </SweepReveal>
                  ))}
                </div>
              </div>

              {/* Closing */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="border-l-2 border-pink-400/30 pl-5 flex-shrink-0"
              >
                <div className="text-pink-400/60 text-base tracking-widest mb-2">LETS_BUILD_SOMETHING.LOG</div>
                <SweepReveal delay={1100}>
                  <p className="text-pink-100/70 text-lg leading-relaxed">
                    {closingSection.type === 'text' ? closingSection.content : ''}
                  </p>
                </SweepReveal>
              </motion.div>

              {/* Satellite viz — fills remaining space */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="flex-1 min-h-[320px] relative border border-pink-400/20 bg-black/40 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-pink-400/60" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-pink-400/60" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-pink-400/60" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-pink-400/60" />

                {/* Scanlines */}
                <div
                  className="absolute inset-0 pointer-events-none z-10 opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,105,180,0.05) 2px, rgba(255,105,180,0.05) 4px)',
                  }}
                />

                <div className="absolute top-3 left-4 text-pink-400/40 text-xs tracking-widest font-mono z-10">
                  SATELLITE_UPLINK.VIZ
                </div>

                <div className="absolute top-3 right-4 flex items-center gap-4 z-10">
                  <span className="text-xs font-mono flex items-center gap-1 text-blue-300/60">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-300/70" /> UPLINK
                  </span>
                  <span className="text-xs font-mono flex items-center gap-1 text-pink-400/60">
                    <span className="inline-block w-2 h-2 rounded-full bg-pink-400/70" /> DOWNLINK
                  </span>
                </div>

                <div className="absolute inset-0 pt-8 pb-8 px-6">
                  <SignalViz />
                </div>

                <div className="absolute bottom-3 left-4 text-pink-400/50 text-xs tracking-widest font-mono flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                  UPLINK.ACTIVE
                </div>
                <div className="absolute bottom-3 right-4 text-pink-400/30 text-xs tracking-widest font-mono">
                  MST UTC-7
                </div>
              </motion.div>

            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-pink-400/30 text-pink-400/60 text-base text-center tracking-widest bg-black/95 backdrop-blur-sm py-4">
              RECORD_#001 :: CONTACT_DATA :: TIMESTAMP_2026.02.23
            </div>

            <style jsx>{`
              @keyframes signalPulse {
                0%, 100% { opacity: 0.08; }
                50% { opacity: 0.20; }
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}