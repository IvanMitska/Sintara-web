import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { flux } from './flux';
import { markReady } from '../lib/loadManager';

/**
 * CrystalScene — replaces the BlackHole. A faceted violet crystal floats
 * at the centre with a soft fresnel rim and view-dependent chromatic
 * shift; thousands of dust motes drift in deep space behind it. Pointer
 * parallax tilts the cluster; the whole thing breathes slowly.
 *
 * No HDRI / Environment — a hand-rolled shader does fake refraction so
 * we don't pay the cubemap cost (the site is already animation-heavy).
 * Brand palette: deep violet body → bright violet rim → near-white tips.
 */

// ── crystal shader ──────────────────────────────────────────────────────
// Phong-ish lighting + view-dependent fresnel + inner cell noise → reads
// as a polished, slightly translucent amethyst even without a real env map.
const crystalVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec3 vObjPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vObjPos = position;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const crystalFragment = /* glsl */ `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec3 vObjPos;

  uniform float uTime;
  uniform vec3 uCore;     // deep violet — base body
  uniform vec3 uRim;      // bright violet — fresnel edge
  uniform vec3 uTip;      // near-white — hottest highlights
  uniform vec3 uLightA;   // main key light dir (cool)
  uniform vec3 uLightB;   // back/rim light dir (warm white)

  // cheap value noise — for inner cellular gradient
  float hash(vec3 p){
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }
  float vnoise(vec3 p){
    vec3 i = floor(p), f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i);
    float n100 = hash(i + vec3(1, 0, 0));
    float n010 = hash(i + vec3(0, 1, 0));
    float n110 = hash(i + vec3(1, 1, 0));
    float n001 = hash(i + vec3(0, 0, 1));
    float n101 = hash(i + vec3(1, 0, 1));
    float n011 = hash(i + vec3(0, 1, 1));
    float n111 = hash(i + vec3(1, 1, 1));
    return mix(
      mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
      mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
      u.z
    );
  }

  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);

    // fresnel — strong rim on grazing angles
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float fres = pow(1.0 - ndv, 2.2);

    // two-light wrapped lambert (the "studio key + rim" trick)
    float kA = max(0.0, dot(N, normalize(uLightA)) * 0.5 + 0.5);
    float kB = max(0.0, dot(N, normalize(uLightB)) * 0.5 + 0.5);
    float lit = kA * 0.7 + kB * 0.4;

    // specular blob from key light (Blinn-Phong)
    vec3 H = normalize(normalize(uLightA) + V);
    float spec = pow(max(dot(N, H), 0.0), 64.0);

    // inner cellular gradient — the gem isn't perfectly uniform inside
    float inner = vnoise(vObjPos * 2.4 + vec3(0.0, uTime * 0.05, 0.0));
    inner = inner * 0.6 + vnoise(vObjPos * 6.0) * 0.4;

    // colour ramp: core (deep violet) → rim (bright violet) → tip (white)
    vec3 col = mix(uCore, uRim, fres);
    col = mix(col, uTip, pow(fres, 6.0));

    // multiply lighting in, then add specular as a screen-style highlight
    col *= 0.55 + lit * 0.9;
    col += spec * 0.7 * uTip;

    // soft inner glow — gem reads as slightly translucent, not opaque
    col += uRim * inner * 0.18;

    // subtle chromatic split on the rim (cyan/magenta along normal)
    float chrom = pow(fres, 4.0) * 0.18;
    col.r += chrom;
    col.b += chrom * 1.4;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ── particle shader ─────────────────────────────────────────────────────
// Round soft dot, distance falloff, slight twinkle. Cheap — purely GPU.
const particleVertex = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  varying float vAlpha;
  varying float vSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3 uPointer; // -1..1 x/y, z=parallax depth

  void main() {
    vec3 p = position;
    // slow drift around starting point
    float t = uTime * 0.18 + aSeed * 6.2831;
    p.x += sin(t) * 0.08;
    p.y += cos(t * 0.82) * 0.08;
    p.z += sin(t * 0.6) * 0.06;

    // gentle pointer-driven parallax — deeper motes track more
    float depth = clamp((-p.z + 8.0) / 16.0, 0.0, 1.0);
    p.x += uPointer.x * 0.35 * depth;
    p.y += uPointer.y * 0.35 * depth;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (300.0 / -mv.z);

    // distance-based alpha so very-near + very-far motes are subtle
    float d = length(mv.xyz);
    vAlpha = smoothstep(0.0, 4.0, d) * (1.0 - smoothstep(14.0, 22.0, d));
    vSeed = aSeed;
  }
`;

const particleFragment = /* glsl */ `
  precision highp float;
  varying float vAlpha;
  varying float vSeed;
  uniform float uTime;
  uniform vec3 uTint;

  void main() {
    // round, soft dot
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.0, r);
    // soft twinkle so the field feels alive rather than static
    float tw = 0.55 + 0.45 * sin(uTime * 2.0 + vSeed * 18.0);
    gl_FragColor = vec4(uTint, a * vAlpha * tw * 0.9);
  }
`;

// ── helpers ─────────────────────────────────────────────────────────────

// Build a cluster of icosa / octahedron shards that interpenetrate to
// look like a single complex gem rather than separate primitives.
type Shard = {
  geom: THREE.BufferGeometry;
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
};

const buildShards = (): Shard[] => {
  // Tweaked by eye — central big shard plus three smaller off-axis ones.
  const ico = new THREE.IcosahedronGeometry(1, 0);
  const octa = new THREE.OctahedronGeometry(1, 0);
  // flat-shade — faceted look (no normal smoothing across faces)
  ico.computeVertexNormals();
  octa.computeVertexNormals();
  return [
    { geom: ico, pos: [0, 0, 0], rot: [0.2, 0.6, 0.1], scale: 1.45 },
    { geom: octa, pos: [0.85, 0.55, 0.3], rot: [0.7, 0.2, -0.3], scale: 0.9 },
    { geom: octa, pos: [-0.8, -0.35, -0.2], rot: [-0.4, 1.1, 0.5], scale: 0.75 },
    { geom: ico, pos: [0.3, -0.95, 0.1], rot: [0.9, -0.5, 0.2], scale: 0.62 },
  ];
};

// 800 motes on a thick spherical shell, biased to the screen plane so the
// scene reads as a dust cloud rather than a uniform sphere.
const buildParticles = (count = 800) => {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // random point on a shell, radius 3..10
    const r = 3 + Math.pow(Math.random(), 0.8) * 7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    let z = r * Math.cos(phi);
    // push toward the camera plane a bit so we read it across the frame
    z *= 0.55;
    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    sizes[i] = 1.2 + Math.random() * 3.4;
    seeds[i] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  return g;
};

// ── component ───────────────────────────────────────────────────────────

const CrystalScene = () => {
  const { size, viewport } = useThree();
  const clusterRef = useRef<THREE.Group>(null!);
  const framesRef = useRef(0);

  const shards = useMemo(buildShards, []);
  const particles = useMemo(() => buildParticles(800), []);

  // Shared crystal material — one ShaderMaterial reused across all shards.
  const crystalMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: crystalVertex,
      fragmentShader: crystalFragment,
      uniforms: {
        uTime: { value: 0 },
        // Brand palette — accent (#7C3AED), accentBright (#A78BFA), paper
        uCore: { value: new THREE.Color('#3a1a78') },      // deep violet body
        uRim: { value: new THREE.Color('#a78bfa') },        // brand-violet rim
        uTip: { value: new THREE.Color('#ecebf3') },        // paper-white tip
        uLightA: { value: new THREE.Vector3(0.6, 0.8, 0.5).normalize() },
        uLightB: { value: new THREE.Vector3(-0.7, -0.2, 0.4).normalize() },
      },
    });
  }, []);

  // Particle material — additive blend so motes layer nicely on black.
  const particleMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
        uPointer: { value: new THREE.Vector3() },
        uTint: { value: new THREE.Color('#cdbcff') }, // soft brand-violet
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);

    // Signal preloader once the shader has actually drawn a few frames.
    framesRef.current += 1;
    if (framesRef.current === 3) markReady('webgl');

    const t = state.clock.elapsedTime;
    crystalMat.uniforms.uTime.value = t;
    particleMat.uniforms.uTime.value = t;

    // smooth pointer → uniforms (Vector3: xy in NDC, z spare for depth)
    const p = particleMat.uniforms.uPointer.value as THREE.Vector3;
    p.x += (flux.pointer.x - p.x) * Math.min(1, d * 2.4);
    p.y += (flux.pointer.y - p.y) * Math.min(1, d * 2.4);

    if (clusterRef.current) {
      // continuous slow spin + tilt that tracks the pointer
      const targetRotX = -p.y * 0.35;
      const targetRotY = p.x * 0.6 + t * 0.12;
      clusterRef.current.rotation.x +=
        (targetRotX - clusterRef.current.rotation.x) * Math.min(1, d * 2.0);
      clusterRef.current.rotation.y +=
        (targetRotY - clusterRef.current.rotation.y) * Math.min(1, d * 2.0);
      // subtle breathing
      const breathe = 1 + Math.sin(t * 0.6) * 0.025;
      clusterRef.current.scale.setScalar(breathe);
    }
  });

  // Scale the whole composition to viewport — the crystal should anchor
  // the centre of the frame regardless of aspect ratio.
  const fit = Math.min(viewport.width, viewport.height) * 0.42;

  return (
    <>
      {/* deep starlit black — slight violet undertone */}
      <color attach="background" args={['#08060f']} />

      {/* soft ambient + brand-violet hemispheric tint so off-shader fallbacks
          still look correct if the shader ever needs to be swapped out */}
      <ambientLight intensity={0.4} />
      <hemisphereLight args={['#a78bfa', '#1a0d3a', 0.5]} />

      {/* particle dust field — behind the gem */}
      <points
        geometry={particles}
        material={particleMat}
        position={[0, 0, -1]}
        frustumCulled={false}
      />

      {/* the crystal cluster itself */}
      <group ref={clusterRef} scale={fit / 2.4}>
        {shards.map((s, i) => (
          <mesh
            key={i}
            geometry={s.geom}
            material={crystalMat}
            position={s.pos}
            rotation={s.rot}
            scale={s.scale}
          />
        ))}
      </group>

      {/* subtle ground-glow plane way behind the gem for depth */}
      <mesh position={[0, -0.5, -4]}>
        <planeGeometry args={[28, 14]} />
        <meshBasicMaterial
          color={'#1a0d3a'}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>

      {/* dummy keeps `size` reactive (RHF re-renders on resize) */}
      <group userData={{ w: size.width }} />
    </>
  );
};

export default CrystalScene;
