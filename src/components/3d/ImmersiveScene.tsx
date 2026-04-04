import { useRef, useEffect, useMemo, memo, useCallback } from 'react';
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';
import { planetStations } from '../../data/cameraPath';

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: #050208;
`;

// Preload models
useGLTF.preload('/models/moon.glb');
useGLTF.preload('/models/jupiter.glb');
useGLTF.preload('/models/saturn (1).glb');
useGLTF.preload('/models/mars.glb');
useGLTF.preload('/models/uran.glb');
useGLTF.preload('/models/neptune.glb');

// Global state (no re-renders)
const scrollState = {
  progress: 0,
  needsUpdate: true,
  lastScrollTime: 0,
};

// Planet component - no rotation for performance
const Planet = memo(({ modelPath, position, scale }: {
  modelPath: string;
  position: THREE.Vector3;
  scale: number;
}) => {
  const { scene } = useGLTF(modelPath);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.frustumCulled = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group position={position} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
});

Planet.displayName = 'Planet';

// All planets
const Planets = memo(() => {
  const configs = [
    { path: '/models/moon.glb' },
    { path: '/models/jupiter.glb' },
    { path: '/models/saturn (1).glb' },
    { path: '/models/mars.glb' },
    { path: '/models/uran.glb' },
    { path: '/models/neptune.glb' },
  ];

  return (
    <>
      {planetStations.map((station, i) => (
        <Planet
          key={station.id}
          modelPath={configs[i]?.path || configs[0].path}
          position={station.planetPosition}
          scale={station.planetScale}
        />
      ))}
    </>
  );
});

Planets.displayName = 'Planets';

// Camera controller - only updates on scroll
const CameraController = memo(() => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3(0, 0, -20));

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = Math.min(window.scrollY / h, 1);
      scrollState.needsUpdate = true;
      scrollState.lastScrollTime = Date.now();
      invalidate(); // Trigger render
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame(() => {
    if (!scrollState.needsUpdate) return;

    const p = scrollState.progress;
    const n = planetStations.length;
    const sp = p * (n - 1);
    const ci = Math.min(Math.floor(sp), n - 1);
    const ni = Math.min(ci + 1, n - 1);
    const t = sp - ci;

    const curr = planetStations[ci];
    const next = planetStations[ni];

    targetPos.current.lerpVectors(curr.cameraPosition, next.cameraPosition, t);
    targetLook.current.lerpVectors(curr.lookAt, next.lookAt, t);

    camera.position.lerp(targetPos.current, 0.12);
    currentLook.current.lerp(targetLook.current, 0.12);
    camera.lookAt(currentLook.current);

    // Stop updating after animation settles
    const dist = camera.position.distanceTo(targetPos.current);
    if (dist < 0.01 && Date.now() - scrollState.lastScrollTime > 100) {
      scrollState.needsUpdate = false;
    } else {
      invalidate(); // Keep animating
    }
  });

  return null;
});

CameraController.displayName = 'CameraController';

// Simple stars
const Stars = memo(() => {
  const { camera } = useThree();
  const ref = useRef<THREE.Points>(null);

  const [geo, mat] = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const r = 150 + Math.random() * 350;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const m = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
    });
    return [g, m];
  }, []);

  useFrame(() => {
    if (ref.current && scrollState.needsUpdate) {
      ref.current.position.z = camera.position.z;
    }
  });

  return <points ref={ref} geometry={geo} material={mat} />;
});

Stars.displayName = 'Stars';

// Scene
const Scene = memo(() => (
  <>
    <color attach="background" args={['#050208']} />
    <ambientLight intensity={0.5} />
    <directionalLight position={[50, 50, 50]} intensity={0.7} />
    <Stars />
    <Planets />
    <CameraController />
  </>
));

Scene.displayName = 'Scene';

// Main
export const ImmersiveScene = memo(() => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <CanvasContainer>
      <Canvas
        frameloop="demand"
        camera={{ fov: 60, near: 0.1, far: 2000, position: [0, 5, 45] }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        performance={{ min: 0.5 }}
        onCreated={() => invalidate()}
      >
        <Scene />
      </Canvas>
    </CanvasContainer>
  );
});

ImmersiveScene.displayName = 'ImmersiveScene';

export default ImmersiveScene;
