"use client";

export function HUDCorners() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Top Left Corner */}
      <div className="absolute top-4 left-4 w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-orange-500"></div>
        <div className="absolute top-0 left-0 w-0.5 h-full bg-orange-500"></div>
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-orange-500"></div>
      </div>

      {/* Top Right Corner */}
      <div className="absolute top-4 right-4 w-20 h-20">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-orange-500"></div>
        <div className="absolute top-0 right-0 w-0.5 h-full bg-orange-500"></div>
        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-orange-500"></div>
      </div>

      {/* Bottom Left Corner */}
      <div className="absolute bottom-4 left-4 w-20 h-20">
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>
        <div className="absolute bottom-0 left-0 w-0.5 h-full bg-orange-500"></div>
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-orange-500"></div>
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-4 right-4 w-20 h-20">
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-orange-500"></div>
        <div className="absolute bottom-0 right-0 w-0.5 h-full bg-orange-500"></div>
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-orange-500"></div>
      </div>

      {/* Top Terminal Info */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 font-mono text-orange-500 text-xs tracking-wider">
        <div className="flex gap-8 items-center">
          <span className="opacity-60">SESSION_ID: EXP_#040215</span>
          <span className="opacity-60">|</span>
          <span className="opacity-60">COORDINATES: 20.05°N, 18.78°E</span>
          <span className="opacity-60">|</span>
          <span className="animate-pulse">● RECORDING</span>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-orange-500 text-xs tracking-wider">
        <div className="flex gap-8 items-center">
          <span className="opacity-60">TERRAIN_SCAN: COMPLETE</span>
          <span className="opacity-60">|</span>
          <span className="opacity-60">DATA_INTEGRITY: 99.9%</span>
          <span className="opacity-60">|</span>
          <span className="opacity-60">SIGNAL_STRENGTH: ████████░░</span>
        </div>
      </div>
    </div>
  );
}