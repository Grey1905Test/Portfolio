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

interface ExperienceFillEffectProps {
  color?: string;
  opacity?: number;
}

export default function ExperienceFillEffect({
  color = 'rgba(255, 107, 53, 0.7)',
  opacity = 0.35,
}: ExperienceFillEffectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (!wrapper) return;
      const { width, height } = wrapper.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(wrapper);

    const packets: DataPacket[] = [];
    const maxPackets = 8;

    let animationId: number;

    const createPacket = () => {
      const side = Math.floor(Math.random() * 4);
      const w = canvas.width;
      const h = canvas.height;
      let x: number, y: number, targetX: number, targetY: number;

      switch (side) {
        case 0:
          x = Math.random() * w;
          y = 0;
          targetX = Math.random() * w;
          targetY = h;
          break;
        case 1:
          x = w;
          y = Math.random() * h;
          targetX = 0;
          targetY = Math.random() * h;
          break;
        case 2:
          x = Math.random() * w;
          y = h;
          targetX = Math.random() * w;
          targetY = 0;
          break;
        default:
          x = 0;
          y = Math.random() * h;
          targetX = w;
          targetY = Math.random() * h;
      }

      return {
        x,
        y,
        targetX,
        targetY,
        speed: 0.8 + Math.random() * 1.2,
        life: 0,
        maxLife: 150 + Math.random() * 80,
      };
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w <= 0 || h <= 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      if (packets.length < maxPackets && Math.random() < 0.04) {
        packets.push(createPacket());
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        const packet = packets[i];
        const dx = packet.targetX - packet.x;
        const dy = packet.targetY - packet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
          packet.x += (dx / distance) * packet.speed;
          packet.y += (dy / distance) * packet.speed;
        }

        packet.life++;
        const lifeFactor = 1 - packet.life / packet.maxLife;
        const alpha = Math.max(0, lifeFactor);

        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha * 0.25;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(packet.x - dx * 0.05, packet.y - dy * 0.05);
        ctx.lineTo(packet.x, packet.y);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(packet.x, packet.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        if (packet.life >= packet.maxLife || distance < 1) {
          packets.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, [color]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden rounded">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity }}
      />
    </div>
  );
}
