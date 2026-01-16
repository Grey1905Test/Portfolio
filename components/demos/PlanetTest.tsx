"use client";

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Planet() {
  const planetRef = useRef<THREE.Group>(null);
  
  // Load the GLB model
  const { scene } = useGLTF('/models/planet1.glb');
  
  // Make it rotate
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={planetRef}>
      <primitive object={scene} scale={2} />
    </group>
  );
}

export default function PlanetTest() {
  return (
    <div className="w-full h-screen bg-black">
      <div className="absolute top-4 left-4 z-10 text-white">
        <h2 className="text-2xl font-bold mb-2">Planet Test</h2>
        <p className="text-sm text-gray-300">Testing the Sketchfab model</p>
        <p className="text-xs text-gray-400 mt-2">Use mouse to rotate view</p>
      </div>
      
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Suspense fallback={null}>
          <Planet />
          <Environment preset="sunset" />
        </Suspense>
        
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
}