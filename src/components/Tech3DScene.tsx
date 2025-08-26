import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Torus, MeshDistortMaterial, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';

const SceneContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

// Плавающий куб с технологиями
function TechCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Box ref={meshRef} args={[2, 2, 2]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#8E2DE2"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Box>
    </Float>
  );
}

// Вращающийся тор
function TechTorus() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <Torus ref={meshRef} args={[1.5, 0.5, 16, 100]} position={[3, 0, -2]}>
      <meshStandardMaterial
        color="#4A00E0"
        emissive="#4A00E0"
        emissiveIntensity={0.2}
        roughness={0.3}
        metalness={0.7}
      />
    </Torus>
  );
}

// Пульсирующая сфера
function TechSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={[-3, 0, -1]}>
      <meshStandardMaterial
        color="#FF7D54"
        emissive="#FF7D54"
        emissiveIntensity={0.3}
        roughness={0.2}
        metalness={0.9}
        wireframe
      />
    </Sphere>
  );
}

// Парящие частицы
function Particles() {
  const count = 100;
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8E2DE2"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
      />
    </points>
  );
}

// Плавающий текст с технологиями
function FloatingText({ text, position }: { text: string; position: [number, number, number] }) {
  const textRef = useRef<any>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        ref={textRef}
        position={position}
        fontSize={0.3}
        color="#00D9FF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {text}
      </Text>
    </Float>
  );
}

const Tech3DScene: React.FC = () => {
  return (
    <SceneContainer>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8E2DE2" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4A00E0" />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#FF7D54"
        />
        
        <TechCube />
        <TechTorus />
        <TechSphere />
        <Particles />
        
        <FloatingText text="React" position={[2, 2, 0]} />
        <FloatingText text="Node.js" position={[-2, 2, 0]} />
        <FloatingText text="TypeScript" position={[0, -2, 0]} />
        <FloatingText text="Three.js" position={[2, -2, 0]} />
        <FloatingText text="AI/ML" position={[-2, -2, 0]} />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </SceneContainer>
  );
};

export default Tech3DScene;