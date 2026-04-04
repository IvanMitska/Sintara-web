import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { damp3 } from 'maath/easing';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { getCameraPosition, getLookAtPosition } from '../../data/cameraPath';

export function ScrollCamera() {
  const { camera } = useThree();
  const { progress } = useScrollProgress();

  // Ref for smooth look-at interpolation
  const currentLookAt = useRef(new Vector3(0, 0, -20));

  useFrame((_, delta) => {
    // Get target positions based on scroll
    const targetPosition = getCameraPosition(progress);
    const targetLookAt = getLookAtPosition(progress);

    // Smooth camera movement
    damp3(
      camera.position,
      [targetPosition.x, targetPosition.y, targetPosition.z],
      0.15,
      delta
    );

    // Smooth look-at
    damp3(
      currentLookAt.current,
      [targetLookAt.x, targetLookAt.y, targetLookAt.z],
      0.12,
      delta
    );

    camera.lookAt(currentLookAt.current);
  });

  return null;
}

export default ScrollCamera;
