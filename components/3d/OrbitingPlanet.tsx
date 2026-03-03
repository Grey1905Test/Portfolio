"use client";

import { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetParticleTrail } from './PlanetParticleTrail';

interface OrbitingPlanetProps {
  modelPath: string;
  orbitRadius: number;
  orbitSpeed: number;
  planetSize: number;
  startAngle: number;
  tilt: number;
  planetRef: React.RefObject<THREE.Group>;
  freeze?: boolean;
  onClick?: () => void;
  particleColor?: string;
}

export function OrbitingPlanet({
  modelPath,
  orbitRadius,
  orbitSpeed,
  planetSize,
  startAngle,
  tilt,
  planetRef,
  freeze = false,
  onClick,
  particleColor = '#FFFFFF',
}: OrbitingPlanetProps) {
  const localPlanetRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  const initialized = useRef(false);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (orbitRef.current && !initialized.current) {
      orbitRef.current.rotation.y = startAngle;
      initialized.current = true;
    }

    if (!freeze) {
      if (orbitRef.current) {
        orbitRef.current.rotation.y += orbitSpeed;
      }

      if (localPlanetRef.current) {
        localPlanetRef.current.rotation.y += 0.002;
      }
    }

    // Always update world position
    if (localPlanetRef.current && planetRef.current && localPlanetRef.current.parent) {
      const worldPos = new THREE.Vector3();
      localPlanetRef.current.getWorldPosition(worldPos);
      planetRef.current.userData.worldPosition = worldPos;
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <group ref={tiltGroupRef} rotation={[tilt, 0, 0]}>
      <group ref={orbitRef}>
        <group position={[orbitRadius, 0, 0]} ref={localPlanetRef}>
          <group ref={planetRef}>
            <primitive 
              object={scene.clone()} 
              scale={hovered ? planetSize * 1.1 : planetSize}
              onClick={handleClick}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            />
            <pointLight 
              intensity={hovered ? 0.5 : 0.3} 
              distance={8} 
              color="#FFFFFF" 
            />
            {hovered && (
              <>
                <mesh>
                  <sphereGeometry args={[planetSize * 0.6, 32, 32]} />
                  <meshBasicMaterial 
                    color="#FFFFFF" 
                    transparent 
                    opacity={0.1} 
                    wireframe 
                  />
                </mesh>
                <PlanetParticleTrail isHovered={hovered} color={particleColor} count={80} />
              </>
            )}
          </group>
        </group>
      </group>
    </group>
  );
}