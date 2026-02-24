"use client";

import { useEffect, useRef } from 'react';

interface TechScanEffectProps {
  color?: string;
  opacity?: number;
}

export default function TechScanEffect({ 
  color = 'rgba(255, 107, 53, 0.8)', 
  opacity = 0.6 
}: TechScanEffectProps) {
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
    let scanY = 0;
    let scanDirection = 1;
    const scanSpeed = 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Moving scan line
      const gradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.3, color);
      gradient.addColorStop(0.7, color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 50, canvas.width, 100);

      // Update scan position
      scanY += scanSpeed * scanDirection;
      if (scanY > canvas.height + 50) {
        scanY = -50;
      }

      // Add random tech glitches
      if (Math.random() < 0.02) {
        const glitchX = Math.random() * canvas.width;
        const glitchY = Math.random() * canvas.height;
        const glitchWidth = Math.random() * 200 + 50;
        const glitchHeight = Math.random() * 5 + 2;

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(glitchX, glitchY, glitchWidth, glitchHeight);
        ctx.globalAlpha = 1;
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