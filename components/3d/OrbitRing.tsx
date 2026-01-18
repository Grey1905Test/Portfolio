"use client";

import * as THREE from 'three';

interface OrbitRingProps {
  radius: number;
  tilt: number;
}

export function OrbitRing({ radius, tilt }: OrbitRingProps) {
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