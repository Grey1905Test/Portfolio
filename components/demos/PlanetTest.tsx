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
  setShowAboutOverlay(false);
  setShowContactOverlay(false);

    const planet = planets[index];
    
    // Check if ref is initialized and has worldPosition
    if (!planet.ref.current || !planet.ref.current.userData.worldPosition) {
      return;
    }
    
    const planetPos = planet.ref.current.userData.worldPosition;

    // Check which planet
    const isAboutPlanet = index === 1;
    const isExperiencePlanet = index === 3;
    const isProjectsPlanet = index === 2;
    const isContactPlanet = index === 4;

    setTargetPlanet({
      position: planetPos.clone(),
      radius: planet.radius,
    });

    // Freeze planets and show overlay
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

      {/* Ultra Fancy Return Button - Bottom Left */}
      {(showExperienceOverlay || showProjectsOverlay || showAboutOverlay || showContactOverlay) && (
        <motion.div
          initial={{ opacity: 0, y: 100, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: 100, rotate: -10 }}
          className="fixed bottom-6 left-6 z-50"
        >
          <motion.button
            onClick={handleBackToSolarSystem}
            whileHover={{ 
              scale: 1.1, 
              rotate: [0, -2, 2, 0],
              boxShadow: showExperienceOverlay
                ? '0 0 40px rgba(251, 146, 60, 0.6), 0 0 80px rgba(251, 146, 60, 0.3)'
                : showProjectsOverlay
                ? '0 0 40px rgba(34, 197, 94, 0.6), 0 0 80px rgba(34, 197, 94, 0.3)'
                : showContactOverlay
                ? '0 0 40px rgba(244, 114, 182, 0.6), 0 0 80px rgba(244, 114, 182, 0.3)'
                : '0 0 40px rgba(255, 255, 255, 0.6), 0 0 80px rgba(255, 255, 255, 0.3)'
            }}
            whileTap={{ scale: 0.9 }}
            className={`group relative overflow-hidden backdrop-blur-xl ${
              showExperienceOverlay
                ? 'bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-orange-600/20 border-2 border-orange-400/50 text-orange-200'
                : showProjectsOverlay
                ? 'bg-gradient-to-br from-green-500/20 via-green-400/10 to-green-600/20 border-2 border-green-400/50 text-green-200'
                : showContactOverlay
                ? 'bg-gradient-to-br from-pink-500/20 via-pink-400/10 to-pink-600/20 border-2 border-pink-400/50 text-pink-200'
                : 'bg-gradient-to-br from-white/20 via-white/10 to-white/20 border-2 border-white/50 text-white'
            } rounded-2xl p-6 font-mono font-bold tracking-wider transition-all duration-500 shadow-2xl`}
            style={{
              boxShadow: showExperienceOverlay
                ? '0 0 30px rgba(251, 146, 60, 0.4), inset 0 0 30px rgba(251, 146, 60, 0.1), 0 20px 40px rgba(0, 0, 0, 0.3)'
                : showProjectsOverlay
                ? '0 0 30px rgba(34, 197, 94, 0.4), inset 0 0 30px rgba(34, 197, 94, 0.1), 0 20px 40px rgba(0, 0, 0, 0.3)'
                : showContactOverlay
                ? '0 0 30px rgba(244, 114, 182, 0.4), inset 0 0 30px rgba(244, 114, 182, 0.1), 0 20px 40px rgba(0, 0, 0, 0.3)'
                : '0 0 30px rgba(255, 255, 255, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Animated Corner Accents */}
            <div className={`absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 ${
              showExperienceOverlay ? 'border-orange-300' :
              showProjectsOverlay ? 'border-green-300' :
              showContactOverlay ? 'border-pink-300' : 'border-white'
            }`}>
              <motion.div
                className={`absolute -top-1 -left-1 w-2 h-2 rounded-full ${
                  showExperienceOverlay ? 'bg-orange-400' :
                  showProjectsOverlay ? 'bg-green-400' :
                  showContactOverlay ? 'bg-pink-400' : 'bg-white'
                }`}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
            <div className={`absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 ${
              showExperienceOverlay ? 'border-orange-300' :
              showProjectsOverlay ? 'border-green-300' :
              showContactOverlay ? 'border-pink-300' : 'border-white'
            }`}>
              <motion.div
                className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                  showExperienceOverlay ? 'bg-orange-400' :
                  showProjectsOverlay ? 'bg-green-400' :
                  showContactOverlay ? 'bg-pink-400' : 'bg-white'
                }`}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              />
            </div>
            <div className={`absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 ${
              showExperienceOverlay ? 'border-orange-300' :
              showProjectsOverlay ? 'border-green-300' :
              showContactOverlay ? 'border-pink-300' : 'border-white'
            }`}>
              <motion.div
                className={`absolute -bottom-1 -left-1 w-2 h-2 rounded-full ${
                  showExperienceOverlay ? 'bg-orange-400' :
                  showProjectsOverlay ? 'bg-green-400' :
                  showContactOverlay ? 'bg-pink-400' : 'bg-white'
                }`}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
              />
            </div>
            <div className={`absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 ${
              showExperienceOverlay ? 'border-orange-300' :
              showProjectsOverlay ? 'border-green-300' :
              showContactOverlay ? 'border-pink-300' : 'border-white'
            }`}>
              <motion.div
                className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${
                  showExperienceOverlay ? 'bg-orange-400' :
                  showProjectsOverlay ? 'bg-green-400' :
                  showContactOverlay ? 'bg-pink-400' : 'bg-white'
                }`}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1.5 }}
              />
            </div>

            {/* Rotating Background Pattern */}
            <motion.div
              className={`absolute inset-0 rounded-2xl opacity-20 ${
                showExperienceOverlay ? 'bg-gradient-conic from-orange-400 via-orange-500 to-orange-400' :
                showProjectsOverlay ? 'bg-gradient-conic from-green-400 via-green-500 to-green-400' :
                showContactOverlay ? 'bg-gradient-conic from-pink-400 via-pink-500 to-pink-400' :
                'bg-gradient-conic from-white via-gray-200 to-white'
              }`}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            />

            {/* Pulsing Inner Glow */}
            <motion.div
              className={`absolute inset-2 rounded-xl ${
                showExperienceOverlay ? 'bg-orange-400/10' :
                showProjectsOverlay ? 'bg-green-400/10' :
                showContactOverlay ? 'bg-pink-400/10' : 'bg-white/10'
              }`}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />

            {/* Button Content */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                animate={{ 
                  x: [-3, 3, -3],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-2xl"
              >
                ←
              </motion.div>
              <div className="text-center">
                <div className="text-xs opacity-80">SYSTEM</div>
                <div className="text-sm font-black">RETURN</div>
              </div>
            </div>

            {/* Hover Particle Effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${
                  showExperienceOverlay ? 'rgba(251, 146, 60, 0.3)' :
                  showProjectsOverlay ? 'rgba(34, 197, 94, 0.3)' :
                  showContactOverlay ? 'rgba(244, 114, 182, 0.3)' : 'rgba(255, 255, 255, 0.3)'
                } 0%, transparent 70%)`
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
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