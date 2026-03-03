"use client";

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

// Default view when the page first loads (matches Canvas initial camera)
const HOME_POSITION = new THREE.Vector3(0, 15, 20);
const HOME_LOOK_AT = new THREE.Vector3(0, 0, 0);
const POSITION_SNAP = 0.1;

interface CameraControllerProps {
  autoRotate: boolean;
  targetPlanet: { position: THREE.Vector3; radius: number } | null;
}

export function CameraController({ autoRotate, targetPlanet }: CameraControllerProps) {
  const { camera } = useThree();
  const zoomProgress = useRef(0);
  const zoomStartTime = useRef(0);
  const isZooming = useRef(false);

  useFrame((state) => {
    if (targetPlanet) {
      // Smooth zoom in with custom easing
      const planetPos = targetPlanet.position;
      const distance = 2.8; // Slightly further for better view
      const angle = Math.atan2(planetPos.z, planetPos.x);

      // Calculate target position
      const targetPos = new THREE.Vector3(
        planetPos.x + Math.cos(angle) * distance,
        planetPos.y + 0.4,
        planetPos.z + Math.sin(angle) * distance
      );

      // Initialize zoom on first frame
      if (!isZooming.current) {
        isZooming.current = true;
        zoomStartTime.current = state.clock.elapsedTime;
        zoomProgress.current = 0;
      }

      // Calculate smooth progress over time (slower: 3 seconds)
      const elapsed = state.clock.elapsedTime - zoomStartTime.current;
      const duration = 3.0; // 3 seconds for zoom in
      zoomProgress.current = Math.min(elapsed / duration, 1);

      // Custom easing: ease-in-out-cubic for ultra smooth motion
      const easeInOutCubic = (t: number): number => {
        return t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const easedProgress = easeInOutCubic(zoomProgress.current);

      // Very smooth lerp based on eased progress
      const dynamicLerp = 0.015 + (easedProgress * 0.035); // Slower lerp

      camera.position.lerp(targetPos, dynamicLerp);

      // Smooth look-at with same easing
      const lookTarget = planetPos.clone();
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(10).add(camera.position);
      currentLookAt.lerp(lookTarget, dynamicLerp);
      camera.lookAt(currentLookAt);

      // Add subtle camera shake at the end for emphasis
      if (zoomProgress.current > 0.9) {
        const shake = (1 - zoomProgress.current) * 0.02;
        camera.position.x += (Math.random() - 0.5) * shake;
        camera.position.y += (Math.random() - 0.5) * shake;
      }
    } else {
      // Reset zoom state
      isZooming.current = false;
      zoomProgress.current = 0;
      
      // Smooth return to home (slower: 2.5 seconds)
      const distToHome = camera.position.distanceTo(HOME_POSITION);
      if (distToHome > POSITION_SNAP) {
        // Slower lerp back to home
        camera.position.lerp(HOME_POSITION, 0.03);
        const currentLookAt = new THREE.Vector3();
        camera.getWorldDirection(currentLookAt);
        currentLookAt.multiplyScalar(10).add(camera.position);
        currentLookAt.lerp(HOME_LOOK_AT, 0.03);
        camera.lookAt(currentLookAt);
      } else if (autoRotate) {
        // At home: gentle orbit around the scene
        const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
        const currentAngle = Math.atan2(camera.position.z, camera.position.x);
        const newAngle = currentAngle - 0.0002;

        camera.position.x = Math.cos(newAngle) * radius;
        camera.position.z = Math.sin(newAngle) * radius;
        camera.lookAt(0, 0, 0);
      }
    }
  });

  return null;
}