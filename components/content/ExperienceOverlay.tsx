"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { experiences } from '@/lib/experienceData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import IndustrialGridEffect from '../effects/IndustrialGridEffect';
import TechScanEffect from '../effects/TechScanEffect';
import { SpinningPlanetDisplay } from '../3d/SpinningPlanetDisplay';

interface ExperienceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedMetric({ value, trigger }: { value: string; trigger: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const numMatch = value.match(/([\d.]+)/);
    if (!numMatch) { setDisplay(value); return; }

    const target = parseFloat(numMatch[1]);
    const isDecimal = numMatch[1].includes('.');
    const prefix = value.slice(0, value.indexOf(numMatch[1]));
    const suffix = value.slice(value.indexOf(numMatch[1]) + numMatch[1].length);
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay(`${prefix}${isDecimal ? current.toFixed(1) : Math.floor(current)}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, trigger]);

  return <span>{display}</span>;
}

// ─── Typewriter Log Entry ─────────────────────────────────────────────────────
function TypewriterEntry({ text, index, trigger }: { text: string; index: number; trigger: number }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    const delay = index * 400;
    const timeout = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
          i++;
        } else {
          clearInterval(iv);
        }
      }, 16);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, index, trigger]);

  return (
    <div className="flex gap-3 text-orange-100/80 text-sm leading-relaxed">
      <span className="text-orange-500 mt-1 flex-shrink-0">[{index + 1}]</span>
      <span>
        {displayed}
        {displayed.length < text.length && (
          <span className="text-orange-400 animate-pulse">▋</span>
        )}
      </span>
    </div>
  );
}

// ─── ETL Pipeline Visualization (Datanimbus) ───────────────────────────────────
function PipelineViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 400, h: 160 });
  const [packets, setPackets] = useState<{ id: number; edge: number; progress: number; type: 'data' | 'snapshot' | 'error' }[]>([]);
  const [snapshotPulse, setSnapshotPulse] = useState(false);
  const packetId = useRef(0);

  const NODES = [
    { id: 'api', label: 'REST APIs', sub: 'paginated', x: 6, y: 50 },
    { id: 's3', label: 'AWS S3', sub: 'raw storage', x: 24, y: 50 },
    { id: 'spark', label: 'PYSPARK', sub: '20+ nodes', x: 46, y: 50 },
    { id: 'delta', label: 'DELTA LAKE', sub: 'Unity Catalog', x: 68, y: 22 },
    { id: 'mongo', label: 'MONGODB', sub: 'SSH tunnel', x: 68, y: 78 },
    { id: 'snap', label: 'SNAPSHOTS', sub: '7-day retain', x: 88, y: 22 },
    { id: 'pricing', label: 'PRICING', sub: '373k+ records', x: 88, y: 78 },
  ];

  const EDGES = [
    { from: 'api', to: 's3', idx: 0 },
    { from: 's3', to: 'spark', idx: 1 },
    { from: 'spark', to: 'delta', idx: 2 },
    { from: 'spark', to: 'mongo', idx: 3 },
    { from: 'delta', to: 'snap', idx: 4 },
    { from: 'mongo', to: 'pricing', idx: 5 },
  ];

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: height });
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const edgeIdx = Math.floor(Math.random() * EDGES.length);
      const rand = Math.random();
      const type = rand > 0.92 ? 'error' : rand > 0.75 ? 'snapshot' : 'data';
      setPackets((prev) => [
        ...prev.slice(-28),
        { id: packetId.current++, edge: edgeIdx, progress: 0, type },
      ]);
    }, 280);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnapshotPulse(true);
      setTimeout(() => setSnapshotPulse(false), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      setPackets((prev) =>
        prev.map((p) => ({ ...p, progress: p.progress + 0.013 })).filter((p) => p.progress < 1)
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { w, h } = dims;
  const NW = Math.max(w * 0.1, 58);
  const NH = 30;

  function getPos(id: string) {
    const n = NODES.find((n) => n.id === id)!;
    return { x: (n.x / 100) * w, y: (n.y / 100) * h };
  }

  function packetColor(type: string) {
    if (type === 'error') return { fill: 'rgba(255,80,80,0.95)', glow: 'rgba(255,80,80,0.2)' };
    if (type === 'snapshot') return { fill: 'rgba(120,200,255,0.95)', glow: 'rgba(120,200,255,0.2)' };
    return { fill: 'rgba(255,210,120,0.95)', glow: 'rgba(255,107,53,0.2)' };
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="pg2">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="snapglow">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {EDGES.map((edge, i) => {
          const a = getPos(edge.from);
          const b = getPos(edge.to);
          return (
            <line
              key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="rgba(255,107,53,0.25)"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
          );
        })}

        {packets.map((p) => {
          const edge = EDGES[p.edge];
          const a = getPos(edge.from);
          const b = getPos(edge.to);
          const px = a.x + (b.x - a.x) * p.progress;
          const py = a.y + (b.y - a.y) * p.progress;
          const { fill, glow } = packetColor(p.type);
          return (
            <g key={p.id} filter="url(#pg2)">
              <circle cx={px} cy={py} r={3.5} fill={fill} />
              <circle cx={px} cy={py} r={7} fill={glow} />
            </g>
          );
        })}

        {NODES.map((node) => {
          const { x, y } = getPos(node.id);
          const isSnap = node.id === 'snap';
          const glowing = isSnap && snapshotPulse;
          return (
            <g key={node.id} filter={glowing ? 'url(#snapglow)' : 'url(#pg2)'}>
              <rect
                x={x - NW / 2}
                y={y - NH / 2}
                width={NW}
                height={NH}
                rx={3}
                fill={glowing ? 'rgba(120,200,255,0.15)' : 'rgba(255,107,53,0.07)'}
                stroke={glowing ? 'rgba(120,200,255,0.9)' : 'rgba(255,107,53,0.65)'}
                strokeWidth={glowing ? 2 : 1.5}
                style={{ transition: 'all 0.3s' }}
              />
              <text x={x} y={y - 5} textAnchor="middle" fill={glowing ? 'rgba(120,200,255,1)' : 'rgba(255,150,80,1)'} fontSize={8} fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">
                {node.label}
              </text>
              <text x={x} y={y + 7} textAnchor="middle" fill="rgba(255,107,53,0.45)" fontSize={6.5} fontFamily="monospace">
                {node.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── API Network Visualization (QuicHub: payment gateways → central hub) ─────
function ApiNetworkViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 400, h: 160 });
  const [pulses, setPulses] = useState<{ id: number; node: number; progress: number; success: boolean }[]>([]);
  const pulseId = useRef(0);

  const OUTER_NODES = [
    { label: 'STRIPE', angle: 0 },
    { label: 'RAZORPAY', angle: 60 },
    { label: 'SHIPPING1', angle: 120 },
    { label: 'SHIPPING2', angle: 180 },
    { label: 'SHIPPING3', angle: 240 },
    { label: 'AUTH', angle: 300 },
  ];

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: height });
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nodeIdx = Math.floor(Math.random() * OUTER_NODES.length);
      const success = Math.random() > 0.08;
      setPulses((prev) => [
        ...prev.slice(-30),
        { id: pulseId.current++, node: nodeIdx, progress: 0, success },
      ]);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      setPulses((prev) =>
        prev.map((p) => ({ ...p, progress: p.progress + 0.018 })).filter((p) => p.progress < 1)
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { w, h } = dims;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.36;
  const nodeW = Math.max(w * 0.13, 58);
  const nodeH = 26;

  return (
    <div ref={containerRef} className="absolute inset-0">
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="ag">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,107,53,0.3)" />
            <stop offset="100%" stopColor="rgba(255,107,53,0.05)" />
          </radialGradient>
        </defs>
        {OUTER_NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + Math.cos(rad) * radius;
          const ny = cy + Math.sin(rad) * radius;
          return (
            <line
              key={i}
              x1={cx} y1={cy} x2={nx} y2={ny}
              stroke="rgba(255,107,53,0.2)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          );
        })}
        {pulses.map((p) => {
          const rad = (OUTER_NODES[p.node].angle * Math.PI) / 180;
          const nx = cx + Math.cos(rad) * radius;
          const ny = cy + Math.sin(rad) * radius;
          const t = p.progress < 0.5 ? p.progress * 2 : (1 - p.progress) * 2;
          const px = cx + (nx - cx) * t;
          const py = cy + (ny - cy) * t;
          const color = p.success ? 'rgba(100,255,180,0.95)' : 'rgba(255,80,80,0.95)';
          const glowColor = p.success ? 'rgba(100,255,180,0.2)' : 'rgba(255,80,80,0.2)';
          return (
            <g key={p.id} filter="url(#ag)">
              <circle cx={px} cy={py} r={3} fill={color} />
              <circle cx={px} cy={py} r={6} fill={glowColor} />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={28} fill="url(#hubGrad)" stroke="rgba(255,107,53,0.8)" strokeWidth="2" filter="url(#ag)" />
        <text x={cx} y={cy - 5} textAnchor="middle" fill="rgba(255,150,80,1)" fontSize={8} fontFamily="monospace" fontWeight="bold" letterSpacing="1">API</text>
        <text x={cx} y={cy + 7} textAnchor="middle" fill="rgba(255,150,80,1)" fontSize={8} fontFamily="monospace" fontWeight="bold" letterSpacing="1">HUB</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fill="rgba(255,107,53,0.5)" fontSize={6.5} fontFamily="monospace">10k+ tx/mo</text>
        {OUTER_NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + Math.cos(rad) * radius;
          const ny = cy + Math.sin(rad) * radius;
          return (
            <g key={i} filter="url(#ag)">
              <rect
                x={nx - nodeW / 2} y={ny - nodeH / 2}
                width={nodeW} height={nodeH}
                rx={2}
                fill="rgba(255,107,53,0.07)"
                stroke="rgba(255,107,53,0.55)"
                strokeWidth="1.2"
              />
              <text x={nx} y={ny + 4} textAnchor="middle" fill="rgba(255,150,80,0.9)" fontSize={7.5} fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Cache + WebSocket Monitor (DataPhi: real-time metrics) ───────────────────
const WS_EVENTS = [
  'CONTRACT_UPDATED', 'USER_JOINED', 'DOC_SYNCED',
  'CACHE_HIT', 'TOKEN_REFRESHED', 'QUERY_CACHED',
  'SESSION_START', 'REDIS_FLUSH', 'JWT_VERIFIED',
];

function CacheMonitorViz() {
  const [cacheHits, setCacheHits] = useState<{ id: number; hit: boolean; col: number }[]>([]);
  const [responseTime, setResponseTime] = useState(187);
  const [activeUsers, setActiveUsers] = useState(847);
  const [wsEvents, setWsEvents] = useState<{ id: number; label: string }[]>([]);
  const hitId = useRef(0);
  const wsId = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const hit = Math.random() > 0.35;
      const col = Math.floor(Math.random() * 12);
      setCacheHits((prev) => [...prev.slice(-60), { id: hitId.current++, hit, col }]);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setResponseTime((prev) => Math.max(60, Math.min(199, prev + (Math.random() - 0.5) * 20)));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) => Math.max(800, Math.min(1000, prev + Math.floor((Math.random() - 0.5) * 15))));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const label = WS_EVENTS[Math.floor(Math.random() * WS_EVENTS.length)];
      setWsEvents((prev) => [...prev.slice(-5), { id: wsId.current++, label }]);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const hitColor = (hit: boolean) => (hit ? 'rgba(100,220,160,0.85)' : 'rgba(255,80,80,0.7)');

  return (
    <div className="absolute inset-0 p-3 pt-6 flex gap-3 font-mono">
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-orange-500/50 text-[8px] tracking-widest mb-1">REDIS_CACHE.GRID</div>
        <div className="flex-1 grid grid-cols-12 gap-[2px] content-start">
          {cacheHits.slice(-48).map((h) => (
            <div
              key={h.id}
              className="w-full aspect-square rounded-[1px] transition-colors duration-200"
              style={{ backgroundColor: hitColor(h.hit), boxShadow: `0 0 3px ${hitColor(h.hit)}` }}
            />
          ))}
        </div>
        <div className="flex gap-3 mt-1">
          <span className="text-[8px] flex items-center gap-1" style={{ color: 'rgba(100,220,160,0.85)' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" /> HIT
          </span>
          <span className="text-[8px] flex items-center gap-1 text-red-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" /> MISS
          </span>
        </div>
      </div>
      <div className="w-[48%] flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="border border-orange-500/30 bg-orange-500/5 p-1.5">
            <div className="text-orange-500/50 text-[7px] tracking-widest">RESPONSE</div>
            <div className="text-green-400 text-sm font-bold tabular-nums">{Math.round(responseTime)}ms</div>
          </div>
          <div className="border border-orange-500/30 bg-orange-500/5 p-1.5">
            <div className="text-orange-500/50 text-[7px] tracking-widest">ACTIVE</div>
            <div className="text-orange-300 text-sm font-bold tabular-nums">{activeUsers}</div>
          </div>
          <div className="border border-orange-500/30 bg-orange-500/5 p-1.5 col-span-2">
            <div className="text-orange-500/50 text-[7px] tracking-widest mb-0.5">CACHE HIT RATE</div>
            <div className="w-full h-1.5 bg-orange-500/10 rounded-full overflow-hidden">
              <div className="h-full bg-green-400/70 rounded-full" style={{ width: '65%' }} />
            </div>
            <div className="text-green-400 text-[9px] mt-0.5">65% — 35% DB BYPASS</div>
          </div>
        </div>
        <div className="flex-1 border border-orange-500/20 bg-black/30 p-1.5 overflow-hidden">
          <div className="text-orange-500/40 text-[7px] tracking-widest mb-1">WS_EVENT.LOG</div>
          <div className="space-y-0.5">
            {wsEvents.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1 - i * 0.15, x: 0 }}
                className="text-[7.5px] flex items-center gap-1"
                style={{ color: `rgba(255,150,80,${0.9 - i * 0.15})` }}
              >
                <span className="text-green-400/70">›</span>
                {e.label}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExperienceOverlay({ isOpen, onClose }: ExperienceOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [animTrigger, setAnimTrigger] = useState(0);
  const currentExperience = experiences[currentIndex];

  useEffect(() => {
    if (isOpen) {
      setDisplayText('');
      setAnimTrigger(t => t + 1);
      let i = 0;
      const text = currentExperience.company.toUpperCase();
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayText(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isOpen, currentExperience.company]);

  const handleNext = () => setCurrentIndex(prev => (prev + 1) % experiences.length);
  const handlePrevious = () => setCurrentIndex(prev => (prev - 1 + experiences.length) % experiences.length);

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
              <IndustrialGridEffect color="rgba(255, 107, 53, 0.4)" opacity={0.3} />
              <TechScanEffect color="rgba(255, 107, 53, 0.6)" opacity={0.4} />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255, 107, 53, 0.2) 20px, rgba(255, 107, 53, 0.2) 40px)`,
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

          {/* Right column: Terminal Panel */}
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
            {/* Nav Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 border-2 border-orange-500/50 hover:border-orange-500 bg-black/60 backdrop-blur-md hover:bg-orange-500/20 transition-all opacity-0 group-hover/nav:opacity-100 disabled:opacity-0 z-20"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6 text-orange-500" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 border-2 border-orange-500/50 hover:border-orange-500 bg-black/60 backdrop-blur-md hover:bg-orange-500/20 transition-all opacity-0 group-hover/nav:opacity-100 disabled:opacity-0 z-20"
              disabled={currentIndex === experiences.length - 1}
            >
              <ChevronRight className="w-6 h-6 text-orange-500" />
            </button>

            {/* Header */}
            <div className="border-b-2 border-orange-500 bg-orange-500/5 p-4">
              <div className="flex items-center justify-between text-orange-500 text-xs tracking-widest">
                <span>EXPERIENCE_MODULE.EXE</span>
                <div className="flex gap-2">
                  {experiences.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-8 border border-orange-500 transition-all duration-300 ${index === currentIndex ? 'bg-orange-500' : 'bg-transparent'}`}
                    />
                  ))}
                </div>
                <span>ENTRY [{currentIndex + 1}/{experiences.length}]</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 pt-20 pb-24 flex flex-col min-h-0"
                style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}
              >
                {/* Company Name */}
                <div className="mb-8 border-l-4 border-orange-500 pl-4">
                  <div className="text-orange-500 text-xs tracking-widest mb-2 opacity-60">ORGANIZATION_ID</div>
                  <h2 className="text-4xl font-bold text-orange-500 tracking-wider mb-3 font-orbitron">
                    {displayText}<span className="animate-pulse">_</span>
                  </h2>
                  <h3 className="text-xl text-orange-400 tracking-wide uppercase">{currentExperience.role}</h3>
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'LOCATION', value: currentExperience.location },
                    { label: 'DURATION', value: currentExperience.duration },
                    { label: 'TYPE',     value: currentExperience.type     },
                  ].map(({ label, value }) => (
                    <div key={label} className="border border-orange-500/30 bg-orange-500/5 p-3">
                      <div className="text-orange-500/60 text-xs mb-1">{label}</div>
                      <div className="text-orange-300 text-sm">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Key Metrics — animated counters */}
                {currentExperience.metrics && currentExperience.metrics.length > 0 && (
                  <div className="mb-8">
                    <div className="text-orange-500 text-sm tracking-widest mb-3 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-orange-500 animate-pulse" />
                      KEY_METRICS.DAT
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {currentExperience.metrics.map((metric, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-transparent p-3 hover:border-orange-500 transition-all group"
                        >
                          <div className="text-orange-300 text-xs font-semibold group-hover:text-orange-500 transition-colors tabular-nums">
                            <AnimatedMetric value={metric} trigger={animTrigger} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Operations Log — typewriter */}
                <div className="mb-8">
                  <div className="text-orange-500 text-sm tracking-widest mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-orange-500 animate-pulse" />
                    OPERATIONS_LOG.TXT
                  </div>
                  <div className="space-y-3 border-l-2 border-orange-500/30 pl-4">
                    {currentExperience.description.map((item, index) => (
                      <TypewriterEntry key={index} text={item} index={index} trigger={animTrigger} />
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <div className="text-orange-500 text-sm tracking-widest mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-orange-500 animate-pulse" />
                    TECH_STACK.SYS
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentExperience.technologies.map((tech, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-3 py-1 border border-orange-500/50 text-orange-400 text-xs tracking-wider hover:bg-orange-500/20 hover:border-orange-500 transition-all cursor-default"
                      >
                        {tech.toUpperCase()}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Entry-specific visualization */}
                {currentIndex === 0 && (
                  <div className="flex-1 min-h-[180px] mt-2 relative border border-orange-500/20 bg-black/40 overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-500/60" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-500/60" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-500/60" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-500/60" />
                    <div className="absolute top-2 left-3 text-orange-500/40 text-[9px] tracking-widest font-mono z-10">
                      PIPELINE_TOPOLOGY.VIZ
                    </div>
                    <div className="absolute top-2 right-3 flex items-center gap-3 z-10">
                      <span className="text-[8px] font-mono flex items-center gap-1 text-yellow-300/60">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-300/60" /> DATA
                      </span>
                      <span className="text-[8px] font-mono flex items-center gap-1 text-blue-300/60">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-300/60" /> SNAPSHOT
                      </span>
                      <span className="text-[8px] font-mono flex items-center gap-1 text-red-400/60">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400/60" /> ERROR
                      </span>
                    </div>
                    <div className="absolute inset-0 pt-5 pb-5 px-1">
                      <PipelineViz />
                    </div>
                    <div className="absolute bottom-2 left-3 text-orange-500/50 text-[9px] tracking-widest font-mono flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                      DATA_STREAM.ACTIVE
                    </div>
                    <div className="absolute bottom-2 right-3 text-orange-500/30 text-[9px] tracking-widest font-mono">
                      500GB+ DAILY
                    </div>
                  </div>
                )}
                {currentIndex === 1 && (
                  <div className="flex-1 min-h-[180px] mt-2 relative border border-orange-500/20 bg-black/40 overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-500/60" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-500/60" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-500/60" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-500/60" />
                    <div className="absolute top-2 left-3 text-orange-500/40 text-[9px] tracking-widest font-mono">
                      API_NETWORK.VIZ
                    </div>
                    <div className="absolute inset-0 pt-5 pb-2 px-2">
                      <ApiNetworkViz />
                    </div>
                    <div className="absolute bottom-2 left-3 text-orange-500/50 text-[9px] tracking-widest font-mono flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      TX_STREAM.ACTIVE
                    </div>
                    <div className="absolute bottom-2 right-3 text-orange-500/30 text-[9px] tracking-widest font-mono">
                      99.5% UPTIME
                    </div>
                  </div>
                )}
                {currentIndex === 2 && (
                  <div className="flex-1 min-h-[180px] mt-2 relative border border-orange-500/20 bg-black/40 overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-500/60" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-500/60" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-500/60" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-500/60" />
                    <div className="absolute top-2 left-3 text-orange-500/40 text-[9px] tracking-widest font-mono z-10">
                      REALTIME_MONITOR.VIZ
                    </div>
                    <CacheMonitorViz />
                    <div className="absolute bottom-2 left-3 text-orange-500/50 text-[9px] tracking-widest font-mono flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      WS_SYNC.ACTIVE
                    </div>
                    <div className="absolute bottom-2 right-3 text-orange-500/30 text-[9px] tracking-widest font-mono">
                      SUB-200MS
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-orange-500/30 text-orange-500/60 text-xs text-center tracking-widest bg-black/95 backdrop-blur-sm py-4">
              RECORD_#{String(currentIndex + 1).padStart(3, '0')} :: VERIFIED :: TIMESTAMP_2026.02.23
            </div>

            <style jsx>{`
              @keyframes warningStripes {
                0%   { transform: translateX(-40px); }
                100% { transform: translateX(0); }
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}