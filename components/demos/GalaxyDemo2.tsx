"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function FloatingPlanet({ position, size, color, label }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.3} 
        metalness={0.9}
        emissive={color}
        emissiveIntensity={0.3}
      />
      <pointLight intensity={0.5} distance={10} color={color} />
    </mesh>
  );
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    
    for (let i = 0; i < 3000; i++) {
      const radius = Math.random() * 50 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.0005;
      points.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#4A90E2" transparent opacity={0.6} />
    </points>
  );
}

export default function GalaxyDemo2() {
  return (
    <div className="w-full h-screen bg-black">
      <div className="absolute top-4 left-4 z-10 text-white">
        <h2 className="text-2xl font-bold mb-2">Demo 2: Particle Galaxy</h2>
        <p className="text-sm text-gray-300">Planets float in a particle cloud</p>
        <p className="text-xs text-gray-400 mt-2">Use mouse to rotate view</p>
      </div>
      <Canvas camera={{ position: [0, 0, 40], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ParticleField />
        
        <FloatingPlanet position={[-15, 5, -10]} size={2} color="#4A90E2" label="Home" />
        <FloatingPlanet position={[10, -3, -15]} size={2.5} color="#E74C3C" label="Projects" />
        <FloatingPlanet position={[5, 8, 5]} size={2.2} color="#9B59B6" label="Experience" />
        <FloatingPlanet position={[-8, -5, 8]} size={1.8} color="#1ABC9C" label="Skills" />
        <FloatingPlanet position={[15, 2, 10]} size={2} color="#F39C12" label="Contact" />
        
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
}