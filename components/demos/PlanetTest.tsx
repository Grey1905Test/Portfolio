"use client";

import { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import TimelineNavbar from '../ui/TimelineNavbar';
import { CentralPlanet } from '../3d/CentralPlanet';
import { OrbitingPlanet } from '../3d/OrbitingPlanet';
import { OrbitRing } from '../3d/OrbitRing';
import { CameraController } from '../3d/CameraController';
import { generatePlanetConfigs } from '@/lib/planetConfig';
import ExperienceOverlay from '../content/ExperienceOverlay';
import ProjectsOverlay from '../content/ProjectsOverlay';
import { ScanlinesOverlay } from '../effects/ScanlinesOverlay';
import { HUDCorners } from '../effects/HUDCorners';
import { GreenScanlinesOverlay } from '../effects/GreenScanlinesOverlay';
import { GreenHUDCorners } from '../effects/GreenHUDCorners';

export default function PlanetTest() {
  const [activeSection, setActiveSection] = useState(0);
  const [targetPlanet, setTargetPlanet] = useState<{ 
    position: THREE.Vector3; 
    radius: number;
  } | null>(null);
  const [showExperienceOverlay, setShowExperienceOverlay] = useState(false);
  const [showProjectsOverlay, setShowProjectsOverlay] = useState(false);
  const [freezePlanets, setFreezePlanets] = useState(false);

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
  setShowExperienceOverlay(false);
  setShowProjectsOverlay(false);

    const planet = planets[index];
    
    // Check if ref is initialized and has worldPosition
    if (!planet.ref.current || !planet.ref.current.userData.worldPosition) {
      return;
    }
    
    const planetPos = planet.ref.current.userData.worldPosition;

    // Check which planet
    const isExperiencePlanet = index === 3;
    const isProjectsPlanet = index === 2;

    setTargetPlanet({
      position: planetPos.clone(),
      radius: planet.radius,
    });

    // Freeze planets and show overlay
    if (isExperiencePlanet) {
      setTimeout(() => {
        setFreezePlanets(true);
        setShowExperienceOverlay(true);
      }, 1500);
    } else if (isProjectsPlanet) {
      setTimeout(() => {
        setFreezePlanets(true);
        setShowProjectsOverlay(true);
      }, 1500);
    }
  };

  const handleCloseOverlay = () => {
    setShowExperienceOverlay(false);
  };

  const handleCloseProjectsOverlay = () => {
    setShowProjectsOverlay(false);
  };

const handleBackToSolarSystem = () => {
  setShowExperienceOverlay(false);
  setShowProjectsOverlay(false);
  setFreezePlanets(false);
  setTargetPlanet(null);
  setActiveSection(0);
};

  return (
    <>
      <TimelineNavbar onNavigate={handleNavigate} activeSection={activeSection} />

      {/* Scanlines and HUD - Only show when viewing experience */}
      {showExperienceOverlay && (
        <>
          <ScanlinesOverlay />
          <HUDCorners />
        </>
      )}

{/* Scanlines and HUD - Only show when viewing projects */}
{showProjectsOverlay && (
  <>
    <GreenScanlinesOverlay />
    <GreenHUDCorners />
  </>
)}

      {/* Back Button - Shows when viewing experience or projects */}
      {(showExperienceOverlay || showProjectsOverlay) && (
        <button
          onClick={handleBackToSolarSystem}
          className={`fixed bottom-8 left-8 z-50 px-6 py-3 border-2 ${showExperienceOverlay ? 'border-orange-500 text-orange-500 hover:bg-orange-500/20 hover:shadow-orange-500/50' : 'border-green-500 text-green-500 hover:bg-green-500/20 hover:shadow-green-500/50'} bg-black/80 font-mono font-semibold tracking-wider transition-all hover:shadow-lg`}
        >
          ← RETURN_TO_SYSTEM
        </button>
      )}

      {/* Experience Content Overlay */}
      <ExperienceOverlay 
        isOpen={showExperienceOverlay}
        onClose={handleCloseOverlay} 
      />

      {/* Projects Content Overlay */}
      <ProjectsOverlay 
        isOpen={showProjectsOverlay}
        onClose={handleCloseProjectsOverlay} 
      />

      <div className="w-full h-screen bg-black">
        <Canvas camera={{ position: [0, 15, 20], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <Stars radius={150} depth={50} count={8000} factor={4} saturation={0} fade speed={0.5} />

          <CameraController autoRotate={targetPlanet === null} targetPlanet={targetPlanet} />

          <Suspense fallback={null}>
            <CentralPlanet freeze={freezePlanets} />

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
                freeze={freezePlanets}
              />
            ))}

            <Environment preset="night" />
          </Suspense>

          <OrbitControls 
            enableZoom={true} 
            enablePan={true} 
            minDistance={8} 
            maxDistance={50} 
            enableRotate={!freezePlanets}
          />
        </Canvas>
      </div>
    </>
  );
}