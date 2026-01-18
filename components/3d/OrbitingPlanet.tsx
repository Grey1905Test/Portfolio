"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitingPlanetProps {
  modelPath: string;
  orbitRadius: number;
  orbitSpeed: number;
  planetSize: number;
  startAngle: number;
  tilt: number;
  planetRef: React.RefObject<THREE.Group>;
}

export function OrbitingPlanet({
  modelPath,
  orbitRadius,
  orbitSpeed,
  planetSize,
  startAngle,
  tilt,
  planetRef,
}: OrbitingPlanetProps) {
  const localPlanetRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  const initialized = useRef(false);

  useFrame(() => {
    if (orbitRef.current && !initialized.current) {
      orbitRef.current.rotation.y = startAngle;
      initialized.current = true;
    }

    if (orbitRef.current) {
      orbitRef.current.rotation.y += orbitSpeed;
    }

    if (localPlanetRef.current) {
      localPlanetRef.current.rotation.y += 0.002;

      // Update world position - FIX: Only update position, not entire object
      if (planetRef.current && localPlanetRef.current.parent) {
        const worldPos = new THREE.Vector3();
        localPlanetRef.current.getWorldPosition(worldPos);
        
        // Store position without affecting the group structure
        planetRef.current.userData.worldPosition = worldPos;
      }
    }
  });

  return (
    <group ref={tiltGroupRef} rotation={[tilt, 0, 0]}>
      <group ref={orbitRef}>
        <group position={[orbitRadius, 0, 0]} ref={localPlanetRef}>
          <group ref={planetRef}>
            <primitive object={scene.clone()} scale={planetSize} />
            <pointLight intensity={0.3} distance={8} color="#FFFFFF" />
          </group>
        </group>
      </group>
    </group>
  );
}