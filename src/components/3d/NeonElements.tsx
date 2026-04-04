import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingOrb({
  position,
  color,
  size = 0.3,
  pulseSpeed = 1,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
  pulseSpeed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.5;
      const scale = size * (1 + Math.sin(state.clock.elapsedTime * pulseSpeed * 2) * 0.1);
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[position[0], position[1], position[2]]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
      <pointLight color={color} intensity={0.25} distance={25} decay={2} />
    </group>
  );
}

export function NeonElements() {
  // Orbs spread along the journey (z: 30 to -850)
  const orbs = [
    { position: [-20, 12, 20] as [number, number, number], color: '#7c3aed', size: 0.4 },
    { position: [25, -10, -60] as [number, number, number], color: '#a855f7', size: 0.35 },
    { position: [-30, 15, -180] as [number, number, number], color: '#6366f1', size: 0.4 },
    { position: [35, -8, -340] as [number, number, number], color: '#8b5cf6', size: 0.35 },
    { position: [-25, 18, -500] as [number, number, number], color: '#7c3aed', size: 0.45 },
    { position: [30, -12, -660] as [number, number, number], color: '#a855f7', size: 0.35 },
    { position: [-35, 10, -820] as [number, number, number], color: '#6366f1', size: 0.4 },
  ];

  return (
    <>
      {orbs.map((orb, index) => (
        <FloatingOrb
          key={index}
          position={orb.position}
          color={orb.color}
          size={orb.size}
          pulseSpeed={0.7 + index * 0.1}
        />
      ))}
    </>
  );
}

export default NeonElements;
