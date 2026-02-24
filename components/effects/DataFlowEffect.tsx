"use client";

import { useEffect, useRef } from 'react';

interface DataPacket {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  life: number;
  maxLife: number;
}

interface DataFlowEffectProps {
  color?: string;
  opacity?: number;
}

export default function DataFlowEffect({ 
  color = 'rgba(0, 255, 0, 0.8)', 
  opacity = 0.4 
}: DataFlowEffectProps) {
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

    const packets: DataPacket[] = [];
    const maxPackets = 15;

    let animationId: number;

    const createPacket = () => {
      const side = Math.floor(Math.random() * 4);
      let x, y, targetX, targetY;

      switch (side) {
        case 0: // Top
          x = Math.random() * canvas.width;
          y = 0;
          targetX = Math.random() * canvas.width;
          targetY = canvas.height;
          break;
        case 1: // Right
          x = canvas.width;
          y = Math.random() * canvas.height;
          targetX = 0;
          targetY = Math.random() * canvas.height;
          break;
        case 2: // Bottom
          x = Math.random() * canvas.width;
          y = canvas.height;
          targetX = Math.random() * canvas.width;
          targetY = 0;
          break;
        default: // Left
          x = 0;
          y = Math.random() * canvas.height;
          targetX = canvas.width;
          targetY = Math.random() * canvas.height;
      }

      return {
        x,
        y,
        targetX,
        targetY,
        speed: Math.random() * 2 + 1,
        life: 0,
        maxLife: 200 + Math.random() * 100
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new packets
      if (packets.length < maxPackets && Math.random() < 0.05) {
        packets.push(createPacket());
      }

      // Update and draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const packet = packets[i];
        
        // Move towards target
        const dx = packet.targetX - packet.x;
        const dy = packet.targetY - packet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1) {
          packet.x += (dx / distance) * packet.speed;
          packet.y += (dy / distance) * packet.speed;
        }

        packet.life++;

        // Calculate alpha based on life
        const lifeFactor = 1 - (packet.life / packet.maxLife);
        const alpha = Math.max(0, lifeFactor);

        // Draw packet trail
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha * 0.3;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(packet.x - dx * 0.1, packet.y - dy * 0.1);
        ctx.lineTo(packet.x, packet.y);
        ctx.stroke();

        // Draw packet
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(packet.x, packet.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw data bits around packet
        for (let j = 0; j < 3; j++) {
          const angle = (packet.life * 0.1) + (j * Math.PI * 2 / 3);
          const bitX = packet.x + Math.cos(angle) * 8;
          const bitY = packet.y + Math.sin(angle) * 8;
          
          ctx.globalAlpha = alpha * 0.6;
          ctx.fillRect(bitX - 1, bitY - 1, 2, 2);
        }

        // Remove dead packets
        if (packet.life >= packet.maxLife || distance < 1) {
          packets.splice(i, 1);
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