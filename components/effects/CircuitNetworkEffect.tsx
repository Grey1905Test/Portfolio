"use client";

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

interface CircuitNetworkEffectProps {
  color?: string;
  opacity?: number;
}

export default function CircuitNetworkEffect({ 
  color = 'rgba(0, 255, 0, 0.6)', 
  opacity = 0.3 
}: CircuitNetworkEffectProps) {
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

    const nodes: Node[] = [];
    const nodeCount = 25;
    const maxDistance = 150;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: []
      });
    }

    let animationId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update node positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });

      // Draw connections
      ctx.strokeStyle = color;
      nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const distance = Math.sqrt((node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2);
            if (distance < maxDistance) {
              const alpha = (1 - distance / maxDistance) * 0.5;
              ctx.globalAlpha = alpha;
              ctx.lineWidth = 1;
              
              // Animated pulse effect
              const pulse = Math.sin(time * 0.02 + distance * 0.01) * 0.5 + 0.5;
              ctx.globalAlpha = alpha * pulse;
              
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.stroke();
            }
          }
        });
      });

      // Draw nodes
      ctx.fillStyle = color;
      nodes.forEach(node => {
        const pulse = Math.sin(time * 0.03 + node.x * 0.01) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw circuit-like squares around some nodes
        if (Math.sin(time * 0.01 + node.y * 0.01) > 0.7) {
          ctx.strokeStyle = color;
          ctx.globalAlpha = pulse * 0.8;
          ctx.lineWidth = 1;
          ctx.strokeRect(node.x - 6, node.y - 6, 12, 12);
        }
      });

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