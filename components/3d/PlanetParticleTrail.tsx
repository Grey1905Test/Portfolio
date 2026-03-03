"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlanetParticleTrailProps {
  isHovered: boolean;
  color: string;
  count?: number;
}

export function PlanetParticleTrail({ isHovered, color, count = 50 }: PlanetParticleTrailProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const particlePositions = useRef<Float32Array>();
  const particleVelocities = useRef<Float32Array>();
  const particleLifetimes = useRef<Float32Array>();

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Initialize particles at origin
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      // Random lifetimes
      lifetimes[i] = Math.random();
    }

    particlePositions.current = positions;
    particleVelocities.current = velocities;
    particleLifetimes.current = lifetimes;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { geometry: geo, material: mat };
  }, [count, color]);

  useFrame((state, delta) => {
    if (!particlesRef.current || !isHovered) return;
    if (!particlePositions.current || !particleVelocities.current || !particleLifetimes.current) return;

    const positions = particlePositions.current;
    const velocities = particleVelocities.current;
    const lifetimes = particleLifetimes.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update lifetime
      lifetimes[i] -= delta * 0.5;

      if (lifetimes[i] <= 0) {
        // Reset particle
        positions[i3] = 0;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = 0;

        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

        lifetimes[i] = 1;
      } else {
        // Update position
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];
      }
    }

    geometry.attributes.position.needsUpdate = true;
  });

  if (!isHovered) return null;

  return <points ref={particlesRef} geometry={geometry} material={material} />;
}
