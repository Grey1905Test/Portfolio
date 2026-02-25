"use client";

import { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
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
import AboutOverlay from '../content/AboutOverlay';
import ContactOverlay from '../content/ContactOverlay';
import WhiteScanlinesOverlay from '../effects/WhiteScanlinesOverlay';
import WhiteHUDCorners from '../effects/WhiteHUDCorners';
import { HUDCorners } from '../effects/HUDCorners';
import { GreenScanlinesOverlay } from '../effects/GreenScanlinesOverlay';
import { GreenHUDCorners } from '../effects/GreenHUDCorners';
import PinkScanlinesOverlay from '../effects/PinkScanlinesOverlay';
import PinkHUDCorners from '../effects/PinkHUDCorners';

export default function PlanetTest() {
  const [activeSection, setActiveSection] = useState(0);
  const [targetPlanet, setTargetPlanet] = useState<{ 
    position: THREE.Vector3; 
    radius: number;
  } | null>(null);
  const [showExperienceOverlay, setShowExperienceOverlay] = useState(false);
  const [showProjectsOverlay, setShowProjectsOverlay] = useState(false);
  const [showAboutOverlay, setShowAboutOverlay] = useState(false);
  const [showContactOverlay, setShowContactOverlay] = useState(false);
  const [freezePlanets, setFreezePlanets] = useState(false);

  // Create refs for each planet (4 orbiting: About, Projects, Experience, Contact; Home has no planet)
  const planetRefs = useMemo(
    () => Array.from({ length: 4 }, () => ({ current: new THREE.Group() })),
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
    setShowAboutOverlay(false);
    setShowContactOverlay(false);

    // Home (index 0) has no orbiting planet — reset to default view
    if (index === 0) {
      setTargetPlanet(null);
      setFreezePlanets(false);
      return;
    }

    // Map nav index to planet index (1→0, 2→1, 3→2, 4→3)
    const planetIndex = index - 1;
    const planet = planets[planetIndex];

    if (!planet.ref.current || !planet.ref.current.userData.worldPosition) {
      return;
    }

    const planetPos = planet.ref.current.userData.worldPosition;

    const isAboutPlanet = index === 1;
    const isProjectsPlanet = index === 2;
    const isExperiencePlanet = index === 3;
    const isContactPlanet = index === 4;

    setTargetPlanet({
      position: planetPos.clone(),
      radius: planet.radius,
    });

    if (isAboutPlanet) {
      setTimeout(() => {
        setFreezePlanets(true);
        setShowAboutOverlay(true);
      }, 1500);
    } else if (isExperiencePlanet) {
      setTimeout(() => {
        setFreezePlanets(true);
        setShowExperienceOverlay(true);
      }, 1500);
    } else if (isProjectsPlanet) {
      setTimeout(() => {
        setFreezePlanets(true);
        setShowProjectsOverlay(true);
      }, 1500);
    } else if (isContactPlanet) {
      setTimeout(() => {
        setFreezePlanets(true);
        setShowContactOverlay(true);
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
    setShowAboutOverlay(false);
    setShowContactOverlay(false);
    setFreezePlanets(false);
    setTargetPlanet(null);
    setActiveSection(0); // Home
  };

  return (
    <>
      <TimelineNavbar
        onNavigate={handleNavigate}
        activeSection={activeSection}
        overlayOpen={showExperienceOverlay || showProjectsOverlay || showAboutOverlay || showContactOverlay}
      />

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

      {/* Scanlines and HUD - Only show when viewing about */}
      {showAboutOverlay && (
        <>
          <WhiteScanlinesOverlay />
          <WhiteHUDCorners />
        </>
      )}

      {/* Scanlines and HUD - Only show when viewing contact */}
      {showContactOverlay && (
        <>
          <PinkScanlinesOverlay />
          <PinkHUDCorners />
        </>
      )}

      {/* Return to system - small, clean, futuristic */}
      {(showExperienceOverlay || showProjectsOverlay || showAboutOverlay || showContactOverlay) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 left-6 z-50"
        >
          <button
            onClick={handleBackToSolarSystem}
            className={`group flex items-center gap-3 rounded-xl border-2 px-6 py-4 font-mono text-base font-semibold tracking-widest uppercase transition-all duration-200 ${
              showExperienceOverlay
                ? 'border-orange-400/50 bg-orange-500/5 text-orange-300 hover:border-orange-400 hover:bg-orange-500/10'
                : showProjectsOverlay
                ? 'border-green-400/50 bg-green-500/5 text-green-300 hover:border-green-400 hover:bg-green-500/10'
                : showContactOverlay
                ? 'border-pink-400/50 bg-pink-500/5 text-pink-300 hover:border-pink-400 hover:bg-pink-500/10'
                : 'border-white/40 bg-white/5 text-white/90 hover:border-white/60 hover:bg-white/10'
            }`}
          >
            <span className="text-xl opacity-80 transition-transform group-hover:-translate-x-0.5">←</span>
            <span>Return</span>
          </button>
        </motion.div>
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

      {/* About Content Overlay */}
      <AboutOverlay
        isOpen={showAboutOverlay}
        onClose={handleBackToSolarSystem}
      />

      {/* Contact Content Overlay */}
      <ContactOverlay
        isOpen={showContactOverlay}
        onClose={handleBackToSolarSystem}
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