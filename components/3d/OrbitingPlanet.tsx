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
  freeze?: boolean;
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