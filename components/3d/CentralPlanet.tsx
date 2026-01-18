"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function CentralPlanet() {
  const planetRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/planet1.glb');

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={planetRef}>
      <primitive object={scene.clone()} scale={3} />
      <pointLight intensity={2} distance={60} color="#FF6B35" />
    </group>
  );
}