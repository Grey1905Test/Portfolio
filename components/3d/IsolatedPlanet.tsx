"use client";

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function RotatingPlanetModel() {
  const planetRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/planet5.glb'); // Experience planet model

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.008; // Rotate continuously
    }
  });

  return (
    <group ref={planetRef}>
      <primitive object={scene.clone()} scale={2} />
    </group>
  );
}

export function IsolatedPlanet() {
  return (
    <div className="fixed left-12 top-1/2 -translate-y-1/2 w-72 h-72 z-30 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        {/* Strong lighting to make planet visible */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#FF6B35" />
        <directionalLight position={[-5, -5, -5]} intensity={1} color="#FF8855" />
        <pointLight position={[0, 0, 10]} intensity={1.5} color="#FFA500" />
        
        <Suspense fallback={null}>
          <RotatingPlanetModel />
        </Suspense>
      </Canvas>
    </div>
  );
}