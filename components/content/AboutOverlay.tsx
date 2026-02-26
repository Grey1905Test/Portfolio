"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { aboutData, AboutSection } from '@/lib/aboutData';
import MatrixRainEffect from '../effects/MatrixRainEffect';
import FloatingParticles from '../effects/FloatingParticles';
import { SpinningPlanetDisplay } from '../3d/SpinningPlanetDisplay';
import { useState, useEffect, useRef } from 'react';

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Scramble Text ────────────────────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$>';
function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed(''); setDone(false);
    const t = setTimeout(() => {
      let iteration = 0;
      const total = text.length * 5;
      const iv = setInterval(() => {
        const resolved = Math.floor(iteration / 5);
        setDisplayed(
          text.split('').map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < resolved) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('').slice(0, Math.min(resolved + 3, text.length))
        );
        iteration++;
        if (iteration > total) { setDisplayed(text); setDone(true); clearInterval(iv); }
      }, 30);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);

  return <span>{displayed}{!done && <span className="animate-pulse text-white/60">▋</span>}</span>;
}

// ─── CRT Reveal — about page text animation ───────────────────────────────────
function CRTReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [stage, setStage] = useState<'hidden' | 'scanline' | 'flicker' | 'on'>('hidden');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('scanline'), delay * 1000);
    const t2 = setTimeout(() => setStage('flicker'),  delay * 1000 + 500);
    const t3 = setTimeout(() => setStage('flicker'),  delay * 1000 + 700);
    const t4 = setTimeout(() => setStage('scanline'), delay * 1000 + 800);
    const t5 = setTimeout(() => setStage('on'),       delay * 1000 + 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [delay]);

  const getStyle = (): React.CSSProperties => {
    switch (stage) {
      case 'hidden':   return { opacity: 0, transform: 'scaleY(0.02)', filter: 'brightness(0)' };
      case 'scanline': return { opacity: 1, transform: 'scaleY(1)',    filter: 'brightness(2) blur(1px)' };
      case 'flicker':  return { opacity: 0.3, transform: 'scaleY(1)', filter: 'brightness(3) blur(2px)' };
      case 'on':       return { opacity: 1, transform: 'scaleY(1)',    filter: 'brightness(1) blur(0px)' };
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div
        style={{
          ...getStyle(),
          transition: stage === 'on'
            ? 'opacity 0.3s ease, filter 0.4s ease, transform 0.15s ease'
            : 'opacity 0.1s ease, filter 0.1s ease, transform 0.2s cubic-bezier(0.23,1,0.32,1)',
          transformOrigin: 'center',
        }}
      >
        {children}
      </div>

      {/* Rolling scanline */}
      {(stage === 'scanline' || stage === 'flicker') && (
        <motion.div
          className="absolute left-0 right-0 h-8 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)',
          }}
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      )}

      {/* Horizontal noise lines */}
      {stage === 'flicker' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)',
            animation: 'none',
          }}
        />
      )}
    </div>
  );
}

// ─── Rotating Hobby Viz ───────────────────────────────────────────────────────
const HOBBIES = [
  {
    key: 'soccer',
    label: 'SOCCER',
    sub: 'School & State Level',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const cx = w / 2, cy = h / 2;

      // Pitch outline
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 70, cy - 38, 140, 76);
      // Center line
      ctx.beginPath(); ctx.moveTo(cx, cy - 38); ctx.lineTo(cx, cy + 38); ctx.stroke();
      // Center circle
      ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.stroke();
      // Goal boxes
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.strokeRect(cx - 70, cy - 16, 18, 32);
      ctx.strokeRect(cx + 52, cy - 16, 18, 32);

      // Ball
      const bx = cx + Math.sin(t * 1.4) * 40;
      const by = cy + Math.cos(t * 1.1) * 24;
      ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
      // Ball detail lines
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 0.8;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + t * 2;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + Math.cos(a) * 5, by + Math.sin(a) * 5);
        ctx.stroke();
      }
      // Ball trail
      ctx.beginPath();
      ctx.arc(bx - Math.sin(t * 1.4) * 10, by - Math.cos(t * 1.1) * 6, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fill();

      // Players
      const players = [
        { x: cx - 35, y: cy - 12, team: true },
        { x: cx + 20, y: cy + 10, team: true },
        { x: cx - 12, y: cy + 20, team: true },
        { x: cx + 42, y: cy - 18, team: false },
        { x: cx - 52, y: cy + 6, team: false },
      ];
      players.forEach((p, i) => {
        const ox = Math.sin(t + i * 1.3) * 3;
        const oy = Math.cos(t * 0.9 + i) * 2;
        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, 4, 0, Math.PI * 2);
        ctx.fillStyle = p.team ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
    },
  },
  {
    key: 'guitar',
    label: 'GUITAR',
    sub: 'Indie Rock · The Strokes',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const cx = w / 2, cy = h / 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.sin(t * 0.4) * 0.04);

      // Body
      ctx.beginPath();
      ctx.ellipse(0, 20, 26, 30, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Upper bout
      ctx.beginPath();
      ctx.ellipse(0, -8, 20, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.stroke();

      // Sound hole
      ctx.beginPath();
      ctx.arc(0, 16, 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 16, 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.stroke();

      // Neck
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(-5, -48, 10, 44);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-5, -48, 10, 44);

      // Frets
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(-5, -12 - i * 7);
        ctx.lineTo(5, -12 - i * 7);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Strings — vibrating
      for (let i = 0; i < 6; i++) {
        const sx = -4 + i * 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, -48);
        for (let y = -48; y < 48; y += 3) {
          const amp = i % 2 === 0 ? 1.2 : 0.6;
          ctx.lineTo(sx + Math.sin(y * 0.4 + t * 10 + i) * amp, y);
        }
        ctx.strokeStyle = `rgba(255,255,255,${0.2 + i * 0.06})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Headstock
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(-7, -58, 14, 12);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.strokeRect(-7, -58, 14, 12);

      ctx.restore();

      // Sound waves
      for (let r = 0; r < 3; r++) {
        const radius = 52 + r * 18 + ((t * 25) % 18);
        const alpha = Math.max(0, 0.25 - r * 0.07 - ((t * 0.4) % 0.25));
        ctx.beginPath();
        ctx.arc(cx, cy + 20, radius, -Math.PI * 0.65, -Math.PI * 0.35);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    },
  },
  {
    key: 'fps',
    label: 'FPS GAMES',
    sub: 'Competitive Shooter',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const cx = w / 2, cy = h / 2;

      // Subtle scanlines
      for (let y = 0; y < h; y += 6) {
        ctx.fillStyle = `rgba(255,255,255,0.012)`;
        ctx.fillRect(0, y, w, 1);
      }

      // Crosshair
      const chx = cx + Math.sin(t * 0.6) * 16;
      const chy = cy + Math.cos(t * 0.45) * 10;
      const spread = 5 + Math.abs(Math.sin(t * 2.5)) * 3;

      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(chx, chy - spread - 7); ctx.lineTo(chx, chy - spread); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(chx, chy + spread); ctx.lineTo(chx, chy + spread + 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(chx - spread - 7, chy); ctx.lineTo(chx - spread, chy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(chx + spread, chy); ctx.lineTo(chx + spread + 7, chy); ctx.stroke();
      ctx.beginPath(); ctx.arc(chx, chy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();

      // Outer ring
      ctx.beginPath(); ctx.arc(chx, chy, 14, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.stroke();

      // Enemy silhouettes — simple outlines only
      const enemies = [
        { x: cx - 42, y: cy - 18 },
        { x: cx + 38, y: cy + 12 },
        { x: cx - 10, y: cy + 22 },
      ];
      enemies.forEach(e => {
        // Head
        ctx.beginPath();
        ctx.arc(e.x, e.y - 8, 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Body
        ctx.strokeRect(e.x - 5, e.y - 3, 10, 15);
      });

      // HUD — health bar bottom left
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(10, h - 20, 70, 7);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillRect(10, h - 20, 70 * (0.65 + Math.sin(t * 0.2) * 0.08), 7);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(10, h - 20, 70, 7);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '7px monospace';
      ctx.fillText('HP', 12, h - 14);

      // Ammo bottom right
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.floor(30 - (t * 1.5) % 30)}/90`, w - 10, h - 12);
      ctx.textAlign = 'left';
    },
  },
];

function HobbyViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const tRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setActiveIdx(i => (i + 1) % HOBBIES.length);
        setTransitioning(false);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const designW = 480;
  const designH = 240;

  // HiDPI canvas init + resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset before rescaling
        ctx.scale(dpr, dpr);
      }
    };

    init();
    const ro = new ResizeObserver(init);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tick = () => {
      tRef.current += 0.016;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      const scale = Math.min(w / designW, h / designH);
      const offsetX = (w - designW * scale) / 2;
      const offsetY = (h - designH * scale) / 2;
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      HOBBIES[activeIdx].draw(ctx, designW, designH, tRef.current);
      ctx.restore();
      rafRef.current = requestAnimationFrame(tick);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [activeIdx]);

  const hobby = HOBBIES[activeIdx];

  return (
    <div className="relative w-full h-full flex flex-col gap-2">
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden border border-white/15 bg-white/[0.02]"
        style={{
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.3s ease',
          boxShadow: 'inset 0 0 20px rgba(255,255,255,0.03)',
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/40" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40" />

        <canvas ref={canvasRef} className="absolute inset-0" />

        <div className="absolute top-3 left-4 font-mono pointer-events-none">
          <div className="text-white/30 text-[10px] md:text-xs tracking-widest">INTERESTS_VIZ</div>
          <div className="text-white/70 text-xs md:text-sm font-bold tracking-wider">{hobby.label}</div>
        </div>
        <div className="absolute top-3 right-4 text-white/30 text-[10px] md:text-xs font-mono pointer-events-none">
          {hobby.sub}
        </div>
      </div>

      {/* Selector */}
      <div className="flex items-center justify-center gap-5 md:gap-6">
        {HOBBIES.map((h, i) => (
          <button
            key={h.key}
            onClick={() => {
              setTransitioning(true);
              setTimeout(() => { setActiveIdx(i); setTransitioning(false); }, 300);
            }}
            className="flex items-center gap-2 font-mono text-xs md:text-sm tracking-widest transition-all"
            style={{ color: i === activeIdx ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)' }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full transition-all"
              style={{ backgroundColor: i === activeIdx ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)' }}
            />
            {h.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Section Block ────────────────────────────────────────────────────────────
function SectionBlock({ section, delay }: { section: AboutSection; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="border border-white/15 bg-white/[0.03] p-5 md:p-6 flex flex-col gap-3"
    >
      {/* Title — scramble */}
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-block w-2 h-2 bg-white/60 animate-pulse" />
        <h3 className="text-white text-sm md:text-base font-bold tracking-widest font-orbitron">
          <ScrambleText text={section.title} delay={delay * 1000 + 100} />
        </h3>
      </div>

      {/* Text */}
      {section.type === 'text' && (
        <CRTReveal delay={delay + 0.3}>
          <p className="text-white/75 text-base md:text-lg leading-relaxed">
            {section.content}
          </p>
        </CRTReveal>
      )}

      {/* List */}
      {section.type === 'list' && (
        <ul className="space-y-2">
          {(section.content as string[]).map((item, i) => (
            <CRTReveal key={i} delay={delay + 0.2 + i * 0.2}>
              <li className="text-white/70 text-sm md:text-base leading-relaxed flex gap-2">
                <span className="text-white/35 flex-shrink-0 mt-0.5">›</span>
                <span>
                  <span className="text-white/45 font-bold">{item.split(':')[0]}:</span>
                  <span>{item.split(':').slice(1).join(':')}</span>
                </span>
              </li>
            </CRTReveal>
          ))}
        </ul>
      )}

      {/* Grid */}
      {section.type === 'grid' && (
        <div className="grid grid-cols-2 gap-3">
          {(section.content as Array<{ label: string; value: string }>).map((item, i) => (
            <CRTReveal key={i} delay={delay + 0.15 + i * 0.18}>
              <div className="border border-white/15 bg-white/[0.04] px-4 py-3 hover:border-white/30 hover:bg-white/[0.07] transition-all group">
                <div className="text-white/40 text-xs tracking-widest mb-1">{item.label}</div>
                <div className="text-white/80 text-sm md:text-base leading-snug group-hover:text-white transition-colors">
                  {item.value}
                </div>
              </div>
            </CRTReveal>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AboutOverlay({ isOpen, onClose }: AboutOverlayProps) {
  const whoSection    = aboutData.find(s => s.id === 'who_i_am')!;
  const drivesSection = aboutData.find(s => s.id === 'what_drives_me')!;
  const lifeSection   = aboutData.find(s => s.id === 'beyond_code')!;

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
              <MatrixRainEffect color="rgba(255, 255, 255, 0.1)" opacity={0.3} />
              <FloatingParticles color="rgba(255, 255, 255, 0.4)" count={30} speed={0.3} />
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
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

          {/* Right column */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative h-screen w-full min-w-0 bg-black/95 border-l-2 border-white shadow-2xl font-mono flex flex-col"
            style={{
              maxHeight: '100vh',
              overflow: 'hidden',
              boxShadow: '0 0 50px rgba(255,255,255,0.15), inset 0 0 100px rgba(255,255,255,0.02)',
            }}
          >
            {/* Header */}
            <div className="border-b-2 border-white bg-white/5 px-5 py-4 flex-shrink-0">
              <div className="flex items-center justify-between text-white text-sm md:text-base tracking-widest">
                <span>ABOUT_MODULE.EXE</span>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                  <span>PERSONAL_DATA</span>
                </div>
                <span>SURYA_SUNDAR.LOG</span>
              </div>
            </div>

            {/* Scrollable content — fills viewport, viz grows to use remaining space */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-6 flex flex-col gap-4 md:gap-5">

              {/* WHO I AM */}
              <SectionBlock section={whoSection} delay={0.1} />

              {/* WHAT DRIVES ME */}
              <SectionBlock section={drivesSection} delay={0.25} />

              {/* LIFE BEYOND CODE grid */}
              <SectionBlock section={lifeSection} delay={0.4} />

              {/* Hobby Viz — flex-1 so it fills remaining vertical space */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex flex-col gap-2 flex-1 min-h-[240px]"
              >
                <div className="flex items-center gap-2 px-1">
                  <span className="inline-block w-2 h-2 bg-white/60 animate-pulse" />
                  <span className="text-white/50 text-xs md:text-sm tracking-widest">INTERESTS_VIZ.EXE</span>
                </div>
                <div className="flex-1 min-h-[200px]">
                  <HobbyViz />
                </div>
              </motion.div>

            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-white/20 text-white/40 text-xs text-center tracking-widest bg-black/95 py-4">
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