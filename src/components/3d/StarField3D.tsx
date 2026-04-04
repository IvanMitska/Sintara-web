import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarField3DProps {
  count?: number;
}

const vertexShader = `
  attribute float size;
  attribute vec3 color;
  attribute float brightness;

  varying vec3 vColor;
  varying float vBrightness;

  uniform float time;

  void main() {
    vColor = color;
    vBrightness = brightness;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    float sizeAttenuation = size * (300.0 / -mvPosition.z);
    float twinkle = 1.0 + sin(time * 2.0 + position.x * 10.0) * 0.3 * brightness;

    gl_PointSize = sizeAttenuation * twinkle;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vBrightness;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    float glow = exp(-dist * 4.0) * vBrightness;

    vec3 finalColor = vColor + glow * 0.5;

    gl_FragColor = vec4(finalColor, alpha * (0.6 + vBrightness * 0.4));
  }
`;

export function StarField3D({ count = 8000 }: StarField3DProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [positions, colors, sizes, brightness] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const brightness = new Float32Array(count);

    // Journey spans from z=50 to z=-900
    const journeyStart = 80;
    const journeyEnd = -950;
    const journeyLength = journeyStart - journeyEnd;

    for (let i = 0; i < count; i++) {
      const radius = 100 + Math.random() * 250;
      const theta = Math.random() * Math.PI * 2;
      const z = journeyStart - Math.random() * journeyLength;

      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(theta) * 0.5;
      positions[i * 3 + 2] = z;

      const colorType = Math.random();
      if (colorType < 0.6) {
        colors[i * 3] = 0.95 + Math.random() * 0.05;
        colors[i * 3 + 1] = 0.95 + Math.random() * 0.05;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (colorType < 0.8) {
        colors[i * 3] = 0.7 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 0.6 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      }

      const sizeRandom = Math.random();
      if (sizeRandom < 0.9) {
        sizes[i] = 0.3 + Math.random() * 0.7;
      } else if (sizeRandom < 0.98) {
        sizes[i] = 1.0 + Math.random() * 1.5;
      } else {
        sizes[i] = 2.5 + Math.random() * 2.0;
      }

      brightness[i] = Math.random();
    }

    return [positions, colors, sizes, brightness];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current && materialRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.001;
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-brightness" count={count} array={brightness} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ time: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default StarField3D;
