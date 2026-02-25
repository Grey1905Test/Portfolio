"use client";

import { useFrame, useThree } from '@react-three/fiber';
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

  useFrame(() => {
    if (targetPlanet) {
      // Zoom in to selected planet
      const planetPos = targetPlanet.position;
      const distance = 2;
      const angle = Math.atan2(planetPos.z, planetPos.x);

      const targetPos = new THREE.Vector3(
        planetPos.x + Math.cos(angle) * distance,
        planetPos.y,
        planetPos.z + Math.sin(angle) * distance
      );

      camera.position.lerp(targetPos, 0.03);

      const lookTarget = planetPos.clone();
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(10).add(camera.position);
      currentLookAt.lerp(lookTarget, 0.03);
      camera.lookAt(currentLookAt);
    } else {
      // No planet selected: return to default view, then auto-rotate
      const distToHome = camera.position.distanceTo(HOME_POSITION);
      if (distToHome > POSITION_SNAP) {
        // Lerp back to initial load position (default view)
        camera.position.lerp(HOME_POSITION, 0.04);
        const currentLookAt = new THREE.Vector3();
        camera.getWorldDirection(currentLookAt);
        currentLookAt.multiplyScalar(10).add(camera.position);
        currentLookAt.lerp(HOME_LOOK_AT, 0.04);
        camera.lookAt(currentLookAt);
      } else if (autoRotate) {
        // At home: gentle orbit around the scene (default view)
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