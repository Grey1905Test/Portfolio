"use client";

export function CyanScanlinesOverlay() {
  return (
    <>
      {/* Scanlines effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15) 0px,
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          )`,
          animation: 'scanline 8s linear infinite',
        }}
      />

      {/* Vignette effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />

      {/* Cyan glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0, 255, 255, 0.1)',
        }}
      />
    </>
  );
}