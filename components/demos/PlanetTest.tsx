"use client";

import { Suspense, useRef, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import TimelineNavbar from '../ui/TimelineNavbar';
import { CentralPlanet } from '../3d/CentralPlanet';
import { OrbitingPlanet } from '../3d/OrbitingPlanet';
import { OrbitRing } from '../3d/OrbitRing';
import { CameraController } from '../3d/CameraController';
import { generatePlanetConfigs } from '@/lib/planetConfig';

export default function PlanetTest() {
  const [activeSection, setActiveSection] = useState(0);
  const [targetPlanet, setTargetPlanet] = useState<{ position: THREE.Vector3; radius: number } | null>(null);

  // Create refs for each planet
  const planetRefs = useMemo(
    () => Array.from({ length: 5 }, () => ({ current: new THREE.Group() })),
    []
  );

  // Generate planet configs once
  const planets = useMemo(() => {
    return generatePlanetConfigs().map((config, index) => ({
      ...config,
      ref: planetRefs[index],
    }));
  }, [planetRefs]);

  const handleNavigate = (index: number) => {
    setActiveSection(index);

    const planet = planets[index];
    
    // Use stored world position from userData
    const planetPos = planet.ref.current.userData.worldPosition || new THREE.Vector3();

    setTargetPlanet({
      position: planetPos.clone(),
      radius: planet.radius,
    });

    // Reset auto-rotate after zoom
    setTimeout(() => {
      setTargetPlanet(null);
    }, 4000);
  };

  return (
    <>
      <TimelineNavbar onNavigate={handleNavigate} activeSection={activeSection} />

      <div className="w-full h-screen bg-black">
        <Canvas camera={{ position: [0, 15, 20], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <Stars radius={150} depth={50} count={8000} factor={4} saturation={0} fade speed={0.5} />

          <CameraController autoRotate={targetPlanet === null} targetPlanet={targetPlanet} />

          <Suspense fallback={null}>
            <CentralPlanet />

            {planets.map((planet, index) => (
              <OrbitRing key={`ring-${index}`} radius={planet.radius} tilt={planet.tilt} />
            ))}

            {planets.map((planet, index) => (
              <OrbitingPlanet
                key={`planet-${index}`}
                modelPath={planet.model}
                orbitRadius={planet.radius}
                orbitSpeed={planet.speed}
                planetSize={planet.size}
                startAngle={planet.startAngle}
                tilt={planet.tilt}
                planetRef={planet.ref}
              />
            ))}

            <Environment preset="night" />
          </Suspense>

          <OrbitControls enableZoom={true} enablePan={true} minDistance={8} maxDistance={50} enableRotate={true} />
        </Canvas>
      </div>
    </>
  );
}