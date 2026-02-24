"use client";

import { useEffect, useRef } from 'react';

interface MessageParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  life: number;
  maxLife: number;
  size: number;
}

interface MessageParticlesProps {
  color?: string;
  opacity?: number;
}

export default function MessageParticles({ 
  color = 'rgba(255, 105, 180, 0.7)', 
  opacity = 0.4 
}: MessageParticlesProps) {
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

    const particles: MessageParticle[] = [];
    const maxParticles = 40;
    const chars = '01@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    let animationId: number;

    const createParticle = () => {
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;

      switch (side) {
        case 0: // Top
          x = Math.random() * canvas.width;
          y = -20;
          vx = (Math.random() - 0.5) * 2;
          vy = Math.random() * 2 + 0.5;
          break;
        case 1: // Right
          x = canvas.width + 20;
          y = Math.random() * canvas.height;
          vx = -(Math.random() * 2 + 0.5);
          vy = (Math.random() - 0.5) * 2;
          break;
        case 2: // Bottom
          x = Math.random() * canvas.width;
          y = canvas.height + 20;
          vx = (Math.random() - 0.5) * 2;
          vy = -(Math.random() * 2 + 0.5);
          break;
        default: // Left
          x = -20;
          y = Math.random() * canvas.height;
          vx = Math.random() * 2 + 0.5;
          vy = (Math.random() - 0.5) * 2;
      }

      return {
        x,
        y,
        vx,
        vy,
        char: chars[Math.floor(Math.random() * chars.length)],
        life: 0,
        maxLife: Math.random() * 200 + 100,
        size: Math.random() * 12 + 8
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new particles
      if (particles.length < maxParticles && Math.random() < 0.08) {
        particles.push(createParticle());
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Calculate alpha based on life
        const lifeFactor = 1 - (particle.life / particle.maxLife);
        const alpha = Math.max(0, lifeFactor);

        // Draw particle character
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.font = `${particle.size}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(particle.char, particle.x, particle.y);

        // Draw connection lines to nearby particles
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const distance = Math.sqrt(
              (particle.x - otherParticle.x) ** 2 + 
              (particle.y - otherParticle.y) ** 2
            );
            
            if (distance < 80) {
              const connectionAlpha = alpha * (1 - distance / 80) * 0.3;
              ctx.strokeStyle = color;
              ctx.globalAlpha = connectionAlpha;
              ctx.lineWidth = 1;
              
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });

        // Remove particles that are off-screen or dead
        if (particle.life >= particle.maxLife || 
            particle.x < -50 || particle.x > canvas.width + 50 ||
            particle.y < -50 || particle.y > canvas.height + 50) {
          particles.splice(i, 1);
        }
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