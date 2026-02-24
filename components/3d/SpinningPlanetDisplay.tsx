"use client";

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface RotatingPlanetModelProps {
  modelPath: string;
  scale?: number;
  rotationSpeed?: number;
}

function TestSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#00ff00" />
    </mesh>
  );
}

function RotatingPlanetModel({ modelPath, scale = 2, rotationSpeed = 0.008 }: RotatingPlanetModelProps) {
  const planetRef = useRef<THREE.Group>(null);
  const { scene, error } = useGLTF(modelPath);

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed;
    }
  });

  // Fallback sphere if model fails to load
  if (error) {
    return (
      <group ref={planetRef}>
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={planetRef}>
      <primitive object={scene.clone()} scale={scale} />
    </group>
  );
}

interface SpinningPlanetDisplayProps {
  modelPath: string;
  theme: 'white' | 'orange' | 'green' | 'pink';
  scale?: number;
  rotationSpeed?: number;
}

const themeColors = {
  white: {
    ambient: '#FFFFFF',
    directional1: '#FFFFFF',
    directional2: '#E0E0E0',
    point: '#F0F0F0'
  },
  orange: {
    ambient: '#FF6B35',
    directional1: '#FF6B35',
    directional2: '#FF8855',
    point: '#FFA500'
  },
  green: {
    ambient: '#00FF00',
    directional1: '#00FF00',
    directional2: '#00CC00',
    point: '#00FF88'
  },
  pink: {
    ambient: '#FF69B4',
    directional1: '#FF69B4',
    directional2: '#FF1493',
    point: '#FFB6C1'
  }
};

export function SpinningPlanetDisplay({ 
  modelPath, 
  theme, 
  scale = 2, 
  rotationSpeed = 0.008 
}: SpinningPlanetDisplayProps) {
  const colors = themeColors[theme];

  // Preload the model
  useGLTF.preload(modelPath);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.8 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.3 }}
      className="fixed left-[33%] top-[53%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] z-50 pointer-events-none"
    >
      <Canvas 
        camera={{ position: [0, 0, 4.5], fov: 45 }}
      >
        {/* Much brighter lighting */}
        <ambientLight intensity={2.0} color={colors.ambient} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={3.0} 
          color={colors.directional1} 
        />
        <directionalLight 
          position={[-5, -5, -5]} 
          intensity={2.0} 
          color={colors.directional2} 
        />
        <pointLight 
          position={[0, 0, 10]} 
          intensity={2.5} 
          color={colors.point} 
        />
        <pointLight 
          position={[10, 0, 0]} 
          intensity={2.0} 
          color={colors.point} 
        />
        <pointLight 
          position={[-10, 0, 0]} 
          intensity={2.0} 
          color={colors.point} 
        />
        
        <Suspense fallback={<TestSphere />}>
          <RotatingPlanetModel 
            modelPath={modelPath} 
            scale={1.0} 
            rotationSpeed={rotationSpeed} 
          />
        </Suspense>
      </Canvas>

      {/* Subtle glow effect matching theme */}
      <div 
        className="absolute inset-0 rounded-full opacity-20 blur-2xl"
        style={{
          background: `radial-gradient(circle, ${colors.ambient}40 0%, transparent 70%)`
        }}
      />
    </motion.div>
  );
}