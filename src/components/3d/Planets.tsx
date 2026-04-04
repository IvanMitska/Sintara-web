import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { planetStations } from '../../data/cameraPath';

// Model paths
const modelPaths: Record<string, string> = {
  moon: '/models/moon.glb',
  jupiter: '/models/jupiter.glb',
  saturn: '/models/saturn.glb',
  mars: '/models/mars.glb',
  uran: '/models/uran.glb',
  neptune: '/models/neptune.glb',
};

// Single planet component
function Planet({
  planetName,
  position,
  scale,
  rotationSpeed = 0.0002,
}: {
  planetName: string;
  position: THREE.Vector3;
  scale: number;
  rotationSpeed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const modelPath = modelPaths[planetName];
  const { scene } = useGLTF(modelPath);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene.clone()} />
    </group>
  );
}

// Preload all models
useGLTF.preload('/models/moon.glb');
useGLTF.preload('/models/jupiter.glb');
useGLTF.preload('/models/saturn.glb');
useGLTF.preload('/models/mars.glb');
useGLTF.preload('/models/uran.glb');
useGLTF.preload('/models/neptune.glb');

export function Planets() {
  return (
    <>
      {planetStations.map((station, index) => (
        <Planet
          key={station.id}
          planetName={station.planet}
          position={station.planetPosition}
          scale={station.planetScale}
          rotationSpeed={0.0001 + index * 0.00002}
        />
      ))}
    </>
  );
}

export default Planets;
