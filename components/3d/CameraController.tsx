"use client";

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  autoRotate: boolean;
  targetPlanet: { position: THREE.Vector3; radius: number } | null;
}

export function CameraController({ autoRotate, targetPlanet }: CameraControllerProps) {
  const { camera } = useThree();

  useFrame(() => {
    if (targetPlanet) {
      // Zoom to planet smoothly
      const planetPos = targetPlanet.position;
      const distance = targetPlanet.radius + 8;
      const angle = Math.atan2(planetPos.z, planetPos.x);
      
      const targetPos = new THREE.Vector3(
        planetPos.x + Math.cos(angle) * distance,
        planetPos.y + 5,
        planetPos.z + Math.sin(angle) * distance
      );

      camera.position.lerp(targetPos, 0.03);
      
      // Look at planet
      const lookTarget = planetPos.clone();
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(10).add(camera.position);
      currentLookAt.lerp(lookTarget, 0.03);
      camera.lookAt(currentLookAt);
      
    } else if (autoRotate) {
      // Auto-rotate when not navigating
      const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
      const currentAngle = Math.atan2(camera.position.z, camera.position.x);
      const newAngle = currentAngle - 0.0002;

      camera.position.x = Math.cos(newAngle) * radius;
      camera.position.z = Math.sin(newAngle) * radius;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}