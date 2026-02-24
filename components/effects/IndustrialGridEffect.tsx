"use client";

import { useEffect, useRef } from 'react';

interface IndustrialGridEffectProps {
  color?: string;
  opacity?: number;
}

export default function IndustrialGridEffect({ 
  color = 'rgba(255, 107, 53, 0.6)', 
  opacity = 0.2 
}: IndustrialGridEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gridSize = 80;
      const pulseSpeed = 0.02;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      // Draw animated grid with pulsing effect
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const distance = Math.sqrt((x - canvas.width/2) ** 2 + (y - canvas.height/2) ** 2);
          const pulse = Math.sin(time * pulseSpeed + distance * 0.01) * 0.5 + 0.5;
          
          ctx.globalAlpha = pulse * 0.3;
          
          // Draw grid lines
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
          
          // Draw corner brackets at intersections
          if (pulse > 0.7) {
            const bracketSize = 8;
            ctx.globalAlpha = pulse;
            ctx.lineWidth = 2;
            
            // Top-left bracket
            ctx.beginPath();
            ctx.moveTo(x - bracketSize, y);
            ctx.lineTo(x, y);
            ctx.lineTo(x, y - bracketSize);
            ctx.stroke();
            
            // Top-right bracket
            ctx.beginPath();
            ctx.moveTo(x + bracketSize, y);
            ctx.lineTo(x, y);
            ctx.lineTo(x, y - bracketSize);
            ctx.stroke();
            
            // Bottom-left bracket
            ctx.beginPath();
            ctx.moveTo(x - bracketSize, y);
            ctx.lineTo(x, y);
            ctx.lineTo(x, y + bracketSize);
            ctx.stroke();
            
            // Bottom-right bracket
            ctx.beginPath();
            ctx.moveTo(x + bracketSize, y);
            ctx.lineTo(x, y);
            ctx.lineTo(x, y + bracketSize);
            ctx.stroke();
            
            ctx.lineWidth = 1;
          }
        }
      }

      time++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity }}
    />
  );
}