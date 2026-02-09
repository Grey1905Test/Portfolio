"use client";

export function CyanHUDCorners() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Top Left Corner */}
      <div className="absolute top-4 left-4 w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-cyan-400"></div>
        <div className="absolute top-0 left-0 w-0.5 h-full bg-cyan-400"></div>
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
      </div>

      {/* Top Right Corner */}
      <div className="absolute top-4 right-4 w-20 h-20">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-cyan-400"></div>
        <div className="absolute top-0 right-0 w-0.5 h-full bg-cyan-400"></div>
        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
      </div>

      {/* Bottom Left Corner */}
      <div className="absolute bottom-4 left-4 w-20 h-20">
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-0.5 h-full bg-cyan-400"></div>
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-4 right-4 w-20 h-20">
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-0.5 h-full bg-cyan-400"></div>
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
      </div>

      {/* Top Terminal Info */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 font-mono text-cyan-400 text-xs tracking-wider">
        <div className="flex gap-8 items-center">
          <span className="opacity-60">SESSION_ID: PRJ_#040216</span>
          <span className="opacity-60">|</span>
          <span className="opacity-60">SYSTEM_STATUS: ACTIVE</span>
          <span className="opacity-60">|</span>
          <span className="animate-pulse">● LIVE</span>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-cyan-400 text-xs tracking-wider">
        <div className="flex gap-8 items-center">
          <span className="opacity-60">CODE_QUALITY: VERIFIED</span>
          <span className="opacity-60">|</span>
          <span className="opacity-60">BUILD_STATUS: SUCCESS</span>
          <span className="opacity-60">|</span>
          <span className="opacity-60">DEPLOYMENT: ████████░░</span>
        </div>
      </div>
    </div>
  );
}