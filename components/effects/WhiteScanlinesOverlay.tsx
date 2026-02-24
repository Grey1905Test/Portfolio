"use client";

export default function WhiteScanlinesOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {/* Scanlines */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.8) 2px, rgba(255, 255, 255, 0.8) 4px)',
          animation: 'scanline 8s linear infinite',
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />

      {/* Subtle white glow */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(255, 255, 255, 0.1) 100%)',
        }}
      />

      <style jsx>{`
        @keyframes scanline {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }
      `}</style>
    </div>
  );
}