"use client";

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Orbit ring component with tilt
function OrbitRing({ radius, tilt }: { radius: number; tilt: number }) {
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group rotation={[tilt, 0, 0]}>
      <line geometry={lineGeometry}>
        <lineBasicMaterial color="#FFFFFF" transparent opacity={0.4} />
      </line>
    </group>
  );
}

// Camera rotation component
function CameraController() {
  const { camera } = useThree();
  
  useFrame(() => {
    // Rotate camera very slowly in clockwise direction
    const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
    const currentAngle = Math.atan2(camera.position.z, camera.position.x);
    const newAngle = currentAngle - 0.0002; // Much slower rotation
    
    camera.position.x = Math.cos(newAngle) * radius;
    camera.position.z = Math.sin(newAngle) * radius;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Central lava planet (sun)
function CentralPlanet() {
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

// Orbiting planet component with tilt
function OrbitingPlanet({
  modelPath,
  orbitRadius,
  orbitSpeed,
  planetSize,
  label,
  startAngle,
  tilt
}: {
  modelPath: string;
  orbitRadius: number;
  orbitSpeed: number;
  planetSize: number;
  label: string;
  startAngle: number;
  tilt: number;
}) {
  const planetRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  const initialized = useRef(false);
  
  useFrame((state) => {
    // Set initial rotation only once
    if (orbitRef.current && !initialized.current) {
      orbitRef.current.rotation.y = startAngle;
      initialized.current = true;
    }
    
    if (orbitRef.current) {
      // Orbit around the center (revolution)
      orbitRef.current.rotation.y += orbitSpeed;
    }
    if (planetRef.current) {
      // Rotate the planet on its own axis
      planetRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={tiltGroupRef} rotation={[tilt, 0, 0]}>
      <group ref={orbitRef}>
        <group position={[orbitRadius, 0, 0]} ref={planetRef}>
          <primitive object={scene.clone()} scale={planetSize} />
          <pointLight intensity={0.3} distance={8} color="#FFFFFF" />
        </group>
      </group>
    </group>
  );
}

export default function PlanetTest() {
  // Use useMemo to generate random values only once
  const planets = useMemo(() => [
    {
      model: '/models/planet2.glb',
      radius: 8,
      speed: 0.0008,
      size: 1,
      label: 'Home',
      startAngle: Math.random() * Math.PI * 2,
      tilt: (Math.random() - 0.5) * 0.3
    },
    {
      model: '/models/planet3.glb',
      radius: 12,
      speed: 0.0006,
      size: 1.2,
      label: 'About',
      startAngle: Math.random() * Math.PI * 2,
      tilt: (Math.random() - 0.5) * 0.3
    },
    {
      model: '/models/planet4.glb',
      radius: 16,
      speed: 0.0005,
      size: 1.1,
      label: 'Projects',
      startAngle: Math.random() * Math.PI * 2,
      tilt: (Math.random() - 0.5) * 0.3
    },
    {
      model: '/models/planet5.glb',
      radius: 20,
      speed: 0.0004,
      size: 1.3,
      label: 'Experience',
      startAngle: Math.random() * Math.PI * 2,
      tilt: (Math.random() - 0.5) * 0.3
    },
    {
      model: '/models/planet6.glb',
      radius: 24,
      speed: 0.0003,
      size: 1,
      label: 'Skills',
      startAngle: Math.random() * Math.PI * 2,
      tilt: (Math.random() - 0.5) * 0.3
    },
  ], []); // Empty dependency array means this only runs once

  return (
    <div className="w-full h-screen bg-black">
      <div className="absolute top-4 left-4 z-10 text-white">
        <h2 className="text-3xl font-bold mb-2">Space Portfolio</h2>
        <p className="text-sm text-gray-300">Explore the solar system</p>
        <p className="text-xs text-gray-400 mt-2">Camera auto-rotates</p>
      </div>
      
      <Canvas camera={{ position: [0, 25, 35], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <Stars radius={150} depth={50} count={8000} factor={4} saturation={0} fade speed={0.5} />
        
        <CameraController />
        
        <Suspense fallback={null}>
          {/* Central lava planet */}
          <CentralPlanet />
          
          {/* Orbit rings with tilt */}
          {planets.map((planet, index) => (
            <OrbitRing key={`ring-${index}`} radius={planet.radius} tilt={planet.tilt} />
          ))}
          
          {/* Orbiting planets with tilt */}
          {planets.map((planet, index) => (
            <OrbitingPlanet
              key={`planet-${index}`}
              modelPath={planet.model}
              orbitRadius={planet.radius}
              orbitSpeed={planet.speed}
              planetSize={planet.size}
              label={planet.label}
              startAngle={planet.startAngle}
              tilt={planet.tilt}
            />
          ))}
          
          <Environment preset="night" />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          minDistance={8}
          maxDistance={50}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
}