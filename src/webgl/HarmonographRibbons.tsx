import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flux } from './flux';

/**
 * Harmonograph ribbons — the hero centrepiece. Bundles of glowing strands
 * trace 3D Lissajous / harmonograph curves; each strand is a thin ribbon,
 * additively blended so overlaps bloom into painterly bands. The whole
 * figure is evaluated in the vertex shader from a few uniforms, so its
 * phases drift every frame (live morph) for free. Reads `flux` for the
 * pointer warp and click burst.
 */

const GROUPS = 3;
const STRANDS = 56; // per group
const SEG = 200; // segments along a strand
const SPREAD = 0.46; // phase fan that thickens each bundle

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uBurst;
  uniform float uWidth;
  attribute float aT;
  attribute float aSide;
  attribute float aPhase;
  attribute float aGroup;
  attribute float aSeed;
  varying float vAlpha;
  varying float vGroup;
  varying float vGlow;

  void groupParams(float g, out vec3 freq, out vec3 amp, out vec3 bphase) {
    if (g < 0.5) {
      freq = vec3(3.0, 2.0, 4.0);
      amp = vec3(2.5, 2.0, 2.2);
      bphase = vec3(0.0, 1.7, 0.5);
    } else if (g < 1.5) {
      freq = vec3(2.0, 5.0, 3.0);
      amp = vec3(2.2, 1.8, 2.5);
      bphase = vec3(2.1, 0.0, 3.2);
    } else {
      freq = vec3(5.0, 3.0, 2.0);
      amp = vec3(2.0, 2.4, 2.0);
      bphase = vec3(1.0, 2.4, 0.8);
    }
  }

  vec3 curve(float t, float ph, vec3 freq, vec3 amp, vec3 bphase) {
    return vec3(
      amp.x * sin(freq.x * t + bphase.x + ph),
      amp.y * sin(freq.y * t + bphase.y + ph * 1.3),
      amp.z * sin(freq.z * t + bphase.z + ph * 0.7)
    );
  }

  void main() {
    vec3 freq, amp, bphase;
    groupParams(aGroup, freq, amp, bphase);

    // per-strand amplitude jitter so layers don't perfectly overlap
    amp *= 1.0 + (aSeed - 0.5) * 0.12;

    // time drift → the figure slowly re-weaves; pointer + burst warp it
    float drift = uTime * (0.05 + aGroup * 0.014);
    bphase += vec3(drift, -drift * 0.8, drift * 0.6);
    bphase += vec3(uPointer.x, uPointer.y, uPointer.x * 0.5) * 0.4;
    bphase += uBurst * 1.8;

    float t = aT * 6.2831853;
    vec3 P = curve(t, aPhase, freq, amp, bphase);

    // analytic tangent
    vec3 Td = vec3(
      amp.x * freq.x * cos(freq.x * t + bphase.x + aPhase),
      amp.y * freq.y * cos(freq.y * t + bphase.y + aPhase * 1.3),
      amp.z * freq.z * cos(freq.z * t + bphase.z + aPhase * 0.7)
    );
    vec3 tangent = normalize(Td);
    vec3 ref = normalize(vec3(0.0, 1.0, 0.4));
    vec3 nrm = normalize(cross(tangent, ref));

    float width = uWidth * (0.55 + aSeed * 0.9);
    vec3 pos = P + nrm * aSide * width;

    vGroup = aGroup;
    // soft ribbon edges + faint speed glow at sharp turns
    vAlpha = 1.0 - abs(aSide) * 0.55;
    vGlow = clamp(length(Td) * 0.012, 0.0, 0.8);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vGroup;
  varying float vGlow;

  void main() {
    vec3 col = vGroup < 0.5 ? uColorA : (vGroup < 1.5 ? uColorB : uColorC);
    col *= 0.85 + vGlow;
    gl_FragColor = vec4(col, vAlpha * uOpacity);
  }
`;

function buildGeometry() {
  const totalStrands = GROUPS * STRANDS;
  const ringCount = SEG + 1;
  const vertsPerStrand = ringCount * 2;
  const vertCount = totalStrands * vertsPerStrand;

  const position = new Float32Array(vertCount * 3); // unused, shader-driven
  const aT = new Float32Array(vertCount);
  const aSide = new Float32Array(vertCount);
  const aPhase = new Float32Array(vertCount);
  const aGroup = new Float32Array(vertCount);
  const aSeed = new Float32Array(vertCount);
  const indices: number[] = [];

  let v = 0;
  for (let g = 0; g < GROUPS; g++) {
    for (let s = 0; s < STRANDS; s++) {
      const phase = (s / (STRANDS - 1) - 0.5) * SPREAD;
      const seed = Math.random();
      const strandStart = v;
      for (let i = 0; i < ringCount; i++) {
        const t = i / SEG;
        for (let k = 0; k < 2; k++) {
          aT[v] = t;
          aSide[v] = k === 0 ? -1 : 1;
          aPhase[v] = phase;
          aGroup[v] = g;
          aSeed[v] = seed;
          v++;
        }
      }
      for (let i = 0; i < SEG; i++) {
        const a = strandStart + i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, b, c, c, b, d);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geo.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
  geo.setAttribute('aSide', new THREE.BufferAttribute(aSide, 1));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(aPhase, 1));
  geo.setAttribute('aGroup', new THREE.BufferAttribute(aGroup, 1));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
  geo.setIndex(indices);
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);
  return geo;
}

const HarmonographRibbons = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const sim = useRef({ lastBurst: 0, burst: 0 });

  const geometry = useMemo(buildGeometry, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uBurst: { value: 0 },
      uWidth: { value: 0.07 },
      uOpacity: { value: 0.17 },
      uColorA: { value: new THREE.Color('#86E0E6') },
      uColorB: { value: new THREE.Color('#5A52FF') },
      uColorC: { value: new THREE.Color('#C9D2FF') },
    }),
    [],
  );

  useFrame((state, dt) => {
    if (!flux.heroVisible) return;
    const d = Math.min(dt, 0.05);
    uniforms.uTime.value = state.clock.elapsedTime;

    // smoothed pointer warp
    const p = uniforms.uPointer.value;
    p.x += (flux.pointer.x - p.x) * Math.min(1, d * 2.5);
    p.y += (flux.pointer.y - p.y) * Math.min(1, d * 2.5);

    // burst kick on click
    if (flux.burst !== sim.current.lastBurst) {
      sim.current.lastBurst = flux.burst;
      sim.current.burst = 1;
    }
    sim.current.burst *= 0.94;
    if (sim.current.burst < 0.002) sim.current.burst = 0;
    uniforms.uBurst.value = sim.current.burst;

    const mesh = meshRef.current;
    if (mesh) {
      mesh.rotation.y += d * 0.06;
      mesh.rotation.z = Math.sin(state.clock.elapsedTime * 0.13) * 0.08;
      mesh.scale.setScalar(1 - flux.heroProgress * 0.16);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, 0.45, 0]}
      frustumCulled={false}
    >
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default HarmonographRibbons;
