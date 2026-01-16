"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Planet({ position, size, color, speed, label }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      const time = state.clock.getElapsedTime() * speed;
      meshRef.current.position.x = position[0] * Math.cos(time);
      meshRef.current.position.z = position[0] * Math.sin(time);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.8} />
      </mesh>
    </group>
  );
}

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial 
        color="#FDB813" 
        emissive="#FDB813" 
        emissiveIntensity={2}
      />
      <pointLight intensity={2} distance={50} />
    </mesh>
  );
}

export default function GalaxyDemo1() {
  return (
    <div className="w-full h-screen bg-black">
      <div className="absolute top-4 left-4 z-10 text-white">
        <h2 className="text-2xl font-bold mb-2">Demo 1: Solar System Style</h2>
        <p className="text-sm text-gray-300">Planets orbit around a central sun</p>
        <p className="text-xs text-gray-400 mt-2">Use mouse to rotate view</p>
      </div>
      <Canvas camera={{ position: [0, 20, 30], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Sun />
        
        <Planet position={[8, 0, 0]} size={0.8} color="#4A90E2" speed={0.3} label="Home" />
        <Planet position={[12, 0, 0]} size={1.2} color="#E74C3C" speed={0.2} label="Projects" />
        <Planet position={[18, 0, 0]} size={1.5} color="#9B59B6" speed={0.15} label="Experience" />
        <Planet position={[24, 0, 0]} size={1.0} color="#1ABC9C" speed={0.1} label="Skills" />
        <Planet position={[30, 0, 0]} size={0.9} color="#F39C12" speed={0.08} label="Contact" />
        
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
}