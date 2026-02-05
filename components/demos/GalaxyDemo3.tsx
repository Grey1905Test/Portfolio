"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Planet({ angle, distance, size, color, label }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const x = Math.cos(angle) * distance;
  const z = Math.sin(angle) * distance;

  return (
    <group position={[x, 0, z]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.4}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
        <pointLight intensity={0.8} distance={15} color={color} />
      </mesh>
    </group>
  );
}

function CentralHub() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial 
        color="#FFD700"
        emissive="#FFD700"
        emissiveIntensity={1.5}
        roughness={0.2}
        metalness={1}
      />
      <pointLight intensity={3} distance={30} />
    </mesh>
  );
}

export default function GalaxyDemo3() {
  const planets = [
    { label: 'Home', color: '#4A90E2', angle: 0 },
    { label: 'Projects', color: '#E74C3C', angle: (Math.PI * 2) / 5 },
    { label: 'Experience', color: '#9B59B6', angle: (Math.PI * 2 * 2) / 5 },
    { label: 'Skills', color: '#1ABC9C', angle: (Math.PI * 2 * 3) / 5 },
    { label: 'Contact', color: '#F39C12', angle: (Math.PI * 2 * 4) / 5 },
  ];

  return (
    <div className="w-full h-screen bg-black">
      <div className="absolute top-4 left-4 z-10 text-white">
        <h2 className="text-2xl font-bold mb-2">Demo 3: Space Station Hub</h2>
        <p className="text-sm text-gray-300">Planets arranged in a circle around you</p>
        <p className="text-xs text-gray-400 mt-2">Use mouse to rotate view</p>
      </div>
      <Canvas camera={{ position: [0, 15, 25], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <CentralHub />
        
        {planets.map((planet, index) => (
          <Planet
            key={index}
            angle={planet.angle}
            distance={12}
            size={2}
            color={planet.color}
            label={planet.label}
          />
        ))}
        
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
}