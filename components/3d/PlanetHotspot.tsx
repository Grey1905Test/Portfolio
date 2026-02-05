"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlanetHotspotProps {
  position: THREE.Vector3;
  onClick: () => void;
  isActive?: boolean;
}

export function PlanetHotspot({ position, onClick, isActive = false }: PlanetHotspotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.scale.setScalar(scale);
    }

    if (glowRef.current) {
      // Rotating glow
      glowRef.current.rotation.z += 0.01;
    }
  });

return (
  <group position={position} onClick={onClick}>
    {/* Main yellow dot */}
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial 
        color={isActive ? "#FFD700" : "#FFA500"}
        emissive="#FFD700"
        emissiveIntensity={isActive ? 2 : 1}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>

    {/* Outer glow ring */}
    <mesh ref={glowRef}>
      <ringGeometry args={[0.2, 0.3, 32]} />
      <meshBasicMaterial 
        color="#FFD700"
        transparent
        opacity={isActive ? 0.6 : 0.3}
        side={THREE.DoubleSide}
      />
    </mesh>

    {/* Point light for glow effect */}
    <pointLight 
      intensity={isActive ? 2 : 1} 
      distance={3} 
      color="#FFD700" 
    />
  </group>
);
}