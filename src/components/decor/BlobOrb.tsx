import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  useGLTF,
} from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import * as THREE from 'three';

/**
 * BlobOrb — a small iridescent jelly blob used as background decoration.
 *
 * What makes it actually glow (vs the matte sphere look it had before):
 *
 *   1. **Bloom post-processing** — drei's <Bloom> with a luminance threshold
 *      sweeps over the brightest pixels (iridescent rim, magenta hot spots,
 *      cyan caustics) and bleeds light outward. This is the single biggest
 *      visual jump and is what the Spline reference is doing under the hood.
 *
 *   2. **Vivid `background` colour on MeshTransmissionMaterial** — the
 *      colour the glass refracts when there's nothing behind. Switched from
 *      a deep navy to a saturated magenta so the blob body reads pink-purple
 *      instead of black.
 *
 *   3. **A back-hemisphere Lightformer rig** — coloured plates around the
 *      blob feed drei's PMREM-baked environment. The glass picks these up
 *      as iridescent reflections + caustic colour bands inside the volume.
 *
 *   4. **Vertex-displaced sphere from blobs.gltf** — the gltf is just a
 *      Sphere, so we recompute its vertex positions along the normal with
 *      three octaves of sine for an asymmetric jelly silhouette.
 *
 * The orb lives in a fixed-size absolute-positioned wrapper, so it cannot
 * affect anything outside its footprint. GL init + frame loop are gated by
 * an IntersectionObserver.
 */

const BLOB_URL = '/models/blobs.gltf';

interface Props {
  /** Width/height of the Canvas in CSS pixels (square). */
  size?: number;
  /** Spin rate in revolutions per second. Default `0.05`. */
  spin?: number;
  className?: string;
  /** Use `top` / `right` / `bottom` / `left` here to place the orb. */
  style?: CSSProperties;
}

// ── geometry ──────────────────────────────────────────────────────────
function buildBlobGeometry(srcScene: THREE.Object3D): THREE.BufferGeometry {
  let src: THREE.BufferGeometry | null = null;
  srcScene.traverse((c) => {
    const m = c as THREE.Mesh;
    if (m.isMesh && !src) src = m.geometry.clone();
  });
  const geo: THREE.BufferGeometry =
    src ?? new THREE.IcosahedronGeometry(1, 24);

  geo.center();
  geo.computeBoundingSphere();
  const r = geo.boundingSphere?.radius || 1;
  geo.scale(1 / r, 1 / r, 1 / r);

  const pos = geo.attributes.position as THREE.BufferAttribute;
  const orig = new Float32Array(pos.array);
  for (let i = 0; i < pos.count; i++) {
    const x = orig[i * 3];
    const y = orig[i * 3 + 1];
    const z = orig[i * 3 + 2];
    // three octaves of sine — pronounced amplitude so the silhouette has
    // visible bulges, not a near-perfect sphere
    const d =
      Math.sin(x * 2.3 + y * 0.7) * Math.cos(y * 1.9 + z * 0.8) * 0.22 +
      Math.cos(y * 2.1 + z * 1.5) * Math.sin(x * 1.1) * 0.16 +
      Math.sin(z * 2.5 + x * 1.7) * Math.cos(x * 0.9) * 0.10;
    const k = 1 + d;
    pos.setXYZ(i, x * k, y * k, z * k);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

// ── mesh ──────────────────────────────────────────────────────────────
function BlobMesh({ spin, reduced }: { spin: number; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF(BLOB_URL);

  const geometry = useMemo(() => buildBlobGeometry(scene), [scene]);

  useFrame((state, delta) => {
    const m = ref.current;
    if (!m || reduced) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    m.rotation.y += dt * spin * Math.PI * 2;
    m.rotation.x = Math.sin(t * 0.32) * 0.18;
    m.rotation.z = Math.sin(t * 0.21) * 0.10;
    m.position.y = Math.sin(t * 0.4) * 0.14;
    // gentle breathing scale so the blob feels alive
    const s = 1 + Math.sin(t * 0.5) * 0.025;
    m.scale.setScalar(1.9 * s);
  });

  return (
    <mesh ref={ref} geometry={geometry} scale={1.9}>
      <MeshTransmissionMaterial
        // saturated magenta base — the colour the glass refracts when there's
        // nothing behind. Bright value so the blob body actually reads pink.
        background={new THREE.Color('#e635a2')}
        transmission={1}
        // thin glass — colours pass through without absorbing into black
        thickness={1.35}
        roughness={0.05}
        ior={1.45}
        // dramatic chromatic aberration + distortion = the rainbow ribbons
        // and wavy caustics inside the volume on the reference
        chromaticAberration={0.7}
        anisotropicBlur={0.7}
        distortion={0.6}
        distortionScale={0.45}
        temporalDistortion={0.12}
        // outer skin
        clearcoat={1}
        clearcoatRoughness={0.04}
        // light passing through the glass picks up a deep electric-blue
        // tint at depth → the cool-blue shadows on the underside
        attenuationDistance={1.6}
        attenuationColor={new THREE.Color('#4a3dff')}
        // hot iridescent rim — wider thickness range so the spectral shift
        // sweeps across more of the surface
        iridescence={1}
        iridescenceIOR={2.1}
        iridescenceThicknessRange={[150, 1800]}
        envMapIntensity={2.4}
      />
    </mesh>
  );
}

// ── layout ────────────────────────────────────────────────────────────
const Wrapper = styled.div<{ $size: number }>`
  position: absolute;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  pointer-events: none;
  z-index: 0;
`;

// ── component ─────────────────────────────────────────────────────────
const BlobOrb = ({ size = 320, spin = 0.05, className, style }: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState(false);

  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        if (inView) setSeen(true);
        setActive(inView);
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Wrapper
      ref={wrapRef}
      $size={size}
      className={className}
      style={style}
      aria-hidden="true"
    >
      {seen && (
        <Canvas
          dpr={[1, 1.6]}
          frameloop={active && !reduced ? 'always' : 'demand'}
          camera={{ position: [0, 0, 7], fov: 40 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.35} color="#a02dff" />

            {/* close, bright key lights — feed the specular hot-spots that
                bloom then bleeds outward */}
            <pointLight
              position={[-1.8, 1.4, 2.4]}
              intensity={90}
              color="#ff52d3"
              distance={6}
            />
            <pointLight
              position={[1.8, -1.4, 2.4]}
              intensity={75}
              color="#3a4dff"
              distance={6}
            />
            <pointLight
              position={[0, 2.0, 1.6]}
              intensity={55}
              color="#ff7be0"
              distance={5}
            />
            <pointLight
              position={[0, -1.6, 1.8]}
              intensity={32}
              color="#5be3ff"
              distance={5}
            />

            <BlobMesh spin={spin} reduced={reduced} />

            {/* Coloured Lightformer plates baked into the environment
                cube. The glass refracts these as inner caustic colour. */}
            <Environment background={false} resolution={256} frames={1}>
              <Lightformer
                form="circle"
                position={[-3, 1, -1.5]}
                scale={[5, 5, 1]}
                color="#ff2eb6"
                intensity={14}
              />
              <Lightformer
                form="circle"
                position={[3, -1, -1.5]}
                scale={[5, 5, 1]}
                color="#3a4dff"
                intensity={14}
              />
              <Lightformer
                form="rect"
                position={[0, 3, 0]}
                scale={[8, 3, 1]}
                color="#c34dff"
                intensity={10}
              />
              <Lightformer
                form="circle"
                position={[0, 1.8, 2.8]}
                scale={[3, 3, 1]}
                color="#ffffff"
                intensity={9}
              />
              <Lightformer
                form="rect"
                position={[0, -3, 0]}
                scale={[8, 2, 1]}
                color="#5be3ff"
                intensity={6}
              />
            </Environment>

            {/* Bloom post — finds the brightest pixels (rim, hot spots,
                inner caustics) and bleeds them. This is what makes the
                blob look lit-from-within rather than matte. */}
            <EffectComposer disableNormalPass multisampling={0}>
              <Bloom
                intensity={1.1}
                luminanceThreshold={0.25}
                luminanceSmoothing={0.4}
                kernelSize={KernelSize.LARGE}
                mipmapBlur
                blendFunction={BlendFunction.SCREEN}
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      )}
    </Wrapper>
  );
};

export default BlobOrb;
