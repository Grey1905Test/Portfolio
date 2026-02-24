"use client";

import { useEffect, useRef } from 'react';

interface Wave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface CommunicationWavesProps {
  color?: string;
  opacity?: number;
}

export default function CommunicationWaves({ 
  color = 'rgba(255, 105, 180, 0.6)', 
  opacity = 0.3 
}: CommunicationWavesProps) {
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

    const waves: Wave[] = [];
    const maxWaves = 8;

    let animationId: number;

    const createWave = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: Math.random() * 200 + 100,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 2 + 1
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new waves
      if (waves.length < maxWaves && Math.random() < 0.02) {
        waves.push(createWave());
      }

      // Update and draw waves
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        
        wave.radius += wave.speed;
        const progress = wave.radius / wave.maxRadius;
        const alpha = wave.opacity * (1 - progress);

        // Draw multiple concentric circles for wave effect
        for (let j = 0; j < 3; j++) {
          ctx.strokeStyle = color;
          ctx.globalAlpha = alpha * (0.8 - j * 0.2);
          ctx.lineWidth = 2 - j * 0.5;
          
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius - j * 10, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Remove completed waves
        if (wave.radius >= wave.maxRadius) {
          waves.splice(i, 1);
        }
      }

      // Draw signal transmission lines
      if (Math.random() < 0.1) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        const endX = Math.random() * canvas.width;
        const endY = Math.random() * canvas.height;

        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 15]);
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

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