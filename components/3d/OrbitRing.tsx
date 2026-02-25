"use client";

import { useMemo } from 'react';
import * as THREE from 'three';

interface OrbitRingProps {
  radius: number;
  tilt: number;
}

export function OrbitRing({ radius, tilt }: OrbitRingProps) {
  const line = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    });
    return new THREE.Line(geometry, material);
  }, [radius]);

  return (
    <group rotation={[tilt, 0, 0]}>
      <primitive object={line} />
    </group>
  );
}