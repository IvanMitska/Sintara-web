import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import * as THREE from 'three';
import { Suspense, useMemo, useRef, useState } from 'react';
import type { MutableRefObject, RefObject } from 'react';

const BASE_SCALE = 0.0022;

/**
 * Module-level geometry cache. Both Canvas instances (Navigation overlay
 * and ServicesTeaser watermark) render the same SVG, so the heavy
 * ExtrudeGeometry — tens of thousands of triangles — is built once per
 * URL and shared. Survives unmount/remount; never disposed.
 */
type CachedGeo = { geometry: THREE.ExtrudeGeometry; yMin: number; yMax: number };
const geometryCache = new Map<string, CachedGeo>();

type SVGData = ReturnType<typeof SVGLoader.prototype.parse>;

function buildGeometry(data: SVGData): CachedGeo {
  const shapes: THREE.Shape[] = [];
  data.paths.forEach((path) => {
    const pathShapes = SVGLoader.createShapes(path);
    pathShapes.forEach((s) => shapes.push(s));
  });

  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: 110,
    bevelEnabled: true,
    bevelThickness: 5,
    bevelSize: 4,
    bevelOffset: 0,
    bevelSegments: 3,
    curveSegments: 18,
  });

  geo.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1));
  geo.computeBoundingBox();
  const center = new THREE.Vector3();
  geo.boundingBox!.getCenter(center);
  geo.translate(-center.x, -center.y, -center.z);
  geo.computeVertexNormals();
  geo.computeBoundingBox();

  return { geometry: geo, yMin: geo.boundingBox!.min.y, yMax: geo.boundingBox!.max.y };
}

export type LogoKickKind =
  | 'spin'
  | 'flip'
  | 'tumble'
  | 'bounce'
  | 'wobble'
  | 'pulse';

type LogoMeshProps = {
  url: string;
  color: string;
  colorMid?: string;
  colorTo?: string;
  hovered: boolean;
  pointerRef: RefObject<{ x: number; y: number }>;
  hoverBumpRef: RefObject<number>;
  clickBumpRef: RefObject<number>;
  kickRef?: MutableRefObject<number>;
  /** Optional companion to `kickRef`. Set this to the desired motion
   *  kind *before* bumping `kickRef.current`. Defaults to 'spin' so
   *  callers that don't care (e.g. Navigation) keep prior behavior. */
  kickKindRef?: MutableRefObject<LogoKickKind>;
  /** Idle behaviour: 'spin' = continuous Y rotation (default),
   *  'sway' = gentle oscillation that keeps the mark near face-on. */
  idleMotion?: 'spin' | 'sway';
};

type GradientUniforms = {
  uColorA: { value: THREE.Color };
  uColorMid: { value: THREE.Color };
  uColorB: { value: THREE.Color };
  uPosY0: { value: number };
  uPosY1: { value: number };
};

type ShaderLike = {
  uniforms: Record<string, { value: unknown }>;
  vertexShader: string;
  fragmentShader: string;
};

function LogoMesh({
  url,
  color,
  colorMid,
  colorTo,
  hovered,
  pointerRef,
  hoverBumpRef,
  clickBumpRef,
  kickRef,
  kickKindRef,
  idleMotion = 'spin',
}: LogoMeshProps) {
  const ref = useRef<THREE.Mesh>(null);
  const data = useLoader(SVGLoader, url);
  const fromInit = useRef(color).current;
  const midInit = useRef(colorMid ?? '#0a0a14').current;
  const toInit = useRef(colorTo ?? color).current;
  const targetFrom = useMemo(() => new THREE.Color(color), [color]);
  const targetMid = useMemo(
    () => new THREE.Color(colorMid ?? '#0a0a14'),
    [colorMid],
  );
  const targetTo = useMemo(
    () => new THREE.Color(colorTo ?? color),
    [colorTo, color],
  );
  const uniformsRef = useRef<GradientUniforms | null>(null);

  const { geometry, yMin, yMax } = useMemo(() => {
    const cached = geometryCache.get(url);
    if (cached) return cached;
    const built = buildGeometry(data);
    geometryCache.set(url, built);
    return built;
  }, [data, url]);

  const animRef = useRef({
    spinSpeed: 0.55,
    yKick: 0,
    zKick: 0,
    rollProgress: 1,        // X-axis 360° flip (1 = idle)
    tumbleProgress: 1,      // Z-axis 360° tumble (1 = idle)
    bounceProgress: 1,      // squash + Y bob (1 = idle)
    wobbleEnergy: 0,        // decaying high-freq tilt (0 = idle)
    pulseProgress: 0,       // scale pulse (0 = idle)
    nextFidget: 3,
    lastHoverBump: 0,
    lastClickBump: 0,
    lastKick: 0,
  });

  useFrame((state, dt) => {
    if (!ref.current) return;
    const s = animRef.current;
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 4);

    if (uniformsRef.current) {
      const lerpK = Math.min(1, dt * 4);
      uniformsRef.current.uColorA.value.lerp(targetFrom, lerpK);
      uniformsRef.current.uColorMid.value.lerp(targetMid, lerpK);
      uniformsRef.current.uColorB.value.lerp(targetTo, lerpK);
    }

    if (hoverBumpRef.current !== s.lastHoverBump) {
      s.lastHoverBump = hoverBumpRef.current;
      s.yKick = Math.min(s.yKick + 7, 14);
      s.zKick += 2.5 * (Math.random() > 0.5 ? 1 : -1);
    }

    if (kickRef && kickRef.current !== s.lastKick) {
      s.lastKick = kickRef.current;
      const kind: LogoKickKind = kickKindRef?.current ?? 'spin';
      const sign = Math.random() > 0.5 ? 1 : -1;
      switch (kind) {
        case 'flip':
          s.rollProgress = 0;
          s.pulseProgress = Math.max(s.pulseProgress, 0.4);
          break;
        case 'tumble':
          s.tumbleProgress = 0;
          s.zKick += 1.5 * sign;
          break;
        case 'bounce':
          s.bounceProgress = 0;
          s.yKick = Math.min(s.yKick + 2, 14);
          break;
        case 'wobble':
          s.wobbleEnergy = 1;
          s.zKick += 3 * sign;
          break;
        case 'pulse':
          s.pulseProgress = 1;
          s.yKick = Math.min(s.yKick + 1.5, 14);
          break;
        case 'spin':
        default:
          s.yKick = Math.min(s.yKick + 6, 14);
          s.zKick += 2 * sign;
          s.pulseProgress = Math.max(s.pulseProgress, 0.6);
          break;
      }
    }

    if (clickBumpRef.current !== s.lastClickBump) {
      s.lastClickBump = clickBumpRef.current;
      s.rollProgress = 0;
      s.pulseProgress = 1;
      s.yKick += 4;
    }

    const decay = Math.exp(-dt * 2.5);
    s.yKick *= decay;
    s.zKick *= decay;

    if (t > s.nextFidget) {
      s.yKick += 2 + Math.random() * 2;
      if (Math.random() < 0.4) s.zKick += (Math.random() - 0.5) * 3.5;
      s.nextFidget = t + 3 + Math.random() * 4;
    }

    const idleSpeed = 0.55 + Math.sin(t * 0.6) * 0.25;
    const targetSpeed = hovered ? 2.0 : idleSpeed;
    s.spinSpeed += (targetSpeed - s.spinSpeed) * k;

    if (idleMotion === 'sway') {
      // Ease toward a gentle oscillation — the mark stays readable and
      // never rotates through the messy edge-on profiles.
      const swayTarget = Math.sin(t * 0.34) * (hovered ? 0.85 : 0.5);
      ref.current.rotation.y +=
        (swayTarget - ref.current.rotation.y) * Math.min(1, dt * 1.8);
    } else {
      ref.current.rotation.y += dt * (s.spinSpeed + s.yKick);
    }

    const wobbleX = Math.sin(t * 0.85) * 0.22;
    const tiltTargetX = pointerRef.current!.y * 0.5 + wobbleX;
    ref.current.rotation.x +=
      (tiltTargetX - ref.current.rotation.x) * Math.min(1, dt * 5);

    if (s.rollProgress < 1) {
      const prevEased = 1 - Math.pow(1 - s.rollProgress, 3);
      s.rollProgress = Math.min(1, s.rollProgress + dt / 0.65);
      const eased = 1 - Math.pow(1 - s.rollProgress, 3);
      ref.current.rotation.x += (eased - prevEased) * Math.PI * 2;
    }

    // Z-axis 360° tumble — same easing curve as rollProgress, applied to Z
    if (s.tumbleProgress < 1) {
      const prevEased = 1 - Math.pow(1 - s.tumbleProgress, 3);
      s.tumbleProgress = Math.min(1, s.tumbleProgress + dt / 0.7);
      const eased = 1 - Math.pow(1 - s.tumbleProgress, 3);
      ref.current.rotation.z += (eased - prevEased) * Math.PI * 2;
    }

    // Bounce — squash + Y bob over ~0.7s (sin curve damped to zero)
    let bounceY = 0;
    let bounceScale = 1;
    if (s.bounceProgress < 1) {
      s.bounceProgress = Math.min(1, s.bounceProgress + dt / 0.7);
      const p = s.bounceProgress;
      const damp = 1 - p;
      bounceY = Math.sin(p * Math.PI * 2) * 0.22 * damp;
      bounceScale = 1 + Math.sin(p * Math.PI) * 0.18 * damp;
    }

    // Wobble — high-frequency tilt that decays over ~0.6s
    let wobbleZAdd = 0;
    let wobbleXAdd = 0;
    if (s.wobbleEnergy > 0) {
      s.wobbleEnergy = Math.max(0, s.wobbleEnergy - dt * 1.6);
      const amp = s.wobbleEnergy;
      wobbleZAdd = Math.sin(t * 22) * amp * 2.4;
      wobbleXAdd = Math.cos(t * 26) * amp * 1.6;
    }

    const wobbleZ = Math.cos(t * 0.55) * 0.14;
    const tiltTargetZ = -pointerRef.current!.x * 0.35 + wobbleZ;
    ref.current.rotation.z +=
      (tiltTargetZ - ref.current.rotation.z) * Math.min(1, dt * 5);
    ref.current.rotation.z += dt * (s.zKick + wobbleZAdd);
    ref.current.rotation.x += dt * wobbleXAdd;

    ref.current.position.y = Math.sin(t * 1.25) * 0.12 + bounceY;
    ref.current.position.x = Math.cos(t * 0.9) * 0.06;

    if (s.pulseProgress > 0) {
      s.pulseProgress = Math.max(0, s.pulseProgress - dt * 1.6);
    }
    const extraScale = 1 + Math.sin(s.pulseProgress * Math.PI) * 0.18;
    ref.current.scale.setScalar(BASE_SCALE * extraScale * bounceScale);
  });

  function injectGradient(shader: ShaderLike) {
    const u: GradientUniforms = {
      uColorA: { value: new THREE.Color(fromInit) },
      uColorMid: { value: new THREE.Color(midInit) },
      uColorB: { value: new THREE.Color(toInit) },
      uPosY0: { value: yMin },
      uPosY1: { value: yMax },
    };
    shader.uniforms.uColorA = u.uColorA;
    shader.uniforms.uColorMid = u.uColorMid;
    shader.uniforms.uColorB = u.uColorB;
    shader.uniforms.uPosY0 = u.uPosY0;
    shader.uniforms.uPosY1 = u.uPosY1;
    uniformsRef.current = u;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
       varying vec3 vGradPos;
       varying vec3 vGradView;`,
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
       vGradPos = position;
       vGradView = (modelViewMatrix * vec4(position, 1.0)).xyz;`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
       varying vec3 vGradPos;
       varying vec3 vGradView;
       uniform vec3 uColorA;
       uniform vec3 uColorMid;
       uniform vec3 uColorB;
       uniform float uPosY0;
       uniform float uPosY1;`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      'vec4 diffuseColor = vec4( diffuse, opacity );',
      `float pT = clamp((vGradPos.y - uPosY0) / max(0.0001, uPosY1 - uPosY0), 0.0, 1.0);
       float nT = clamp(0.5 + 0.5 * normalize(vNormal).y, 0.0, 1.0);
       float t = mix(pT, nT, 0.55);

       float dist = clamp(abs(t - 0.5) * 2.0, 0.0, 1.0);
       dist = pow(dist, 1.6);
       vec3 endColor = (t < 0.5) ? uColorA : uColorB;
       vec3 bodyColor = mix(uColorMid, endColor, dist);

       vec3 viewDir = normalize(-vGradView);
       float fresnel = pow(1.0 - max(0.0, dot(viewDir, normalize(vNormal))), 2.6);
       vec3 rimTint = mix(uColorA, uColorB, 0.5) * 1.35;
       bodyColor = mix(bodyColor, rimTint, fresnel * 0.5);

       vec4 diffuseColor = vec4(bodyColor, opacity);`,
    );
  }

  return (
    <mesh ref={ref} geometry={geometry} scale={BASE_SCALE} castShadow receiveShadow>
      <meshPhysicalMaterial
        metalness={0.78}
        roughness={0.3}
        iridescence={1}
        iridescenceIOR={1.6}
        iridescenceThicknessRange={[280, 1500]}
        envMapIntensity={0.65}
        clearcoat={1}
        clearcoatRoughness={0.08}
        side={THREE.DoubleSide}
        onBeforeCompile={injectGradient as unknown as THREE.Material['onBeforeCompile']}
      />
    </mesh>
  );
}

type SintaraLogo3DProps = {
  size?: number;
  color?: string;
  colorMid?: string;
  colorTo?: string;
  url?: string;
  envPreset?:
    | 'apartment'
    | 'city'
    | 'dawn'
    | 'forest'
    | 'lobby'
    | 'night'
    | 'park'
    | 'studio'
    | 'sunset'
    | 'warehouse';
  kickRef?: MutableRefObject<number>;
  kickKindRef?: MutableRefObject<LogoKickKind>;
  /**
   * When false, the Canvas freezes via `frameloop="never"`. The GPU
   * stops doing per-frame work but the WebGL context, geometry, and
   * uniforms stay alive — flipping back to true resumes instantly with
   * no re-init cost. Use IntersectionObserver to gate this from the
   * parent so the logo only burns frames while it's actually on screen.
   */
  active?: boolean;
  /** Passed through to the mesh — see LogoMeshProps.idleMotion. */
  idleMotion?: 'spin' | 'sway';
};

export default function SintaraLogo3D({
  size = 320,
  color = '#c084fc',
  colorMid,
  colorTo,
  url = '/logo/sintara_logo.svg',
  envPreset = 'studio',
  kickRef,
  kickKindRef,
  active = true,
  idleMotion = 'spin',
}: SintaraLogo3DProps) {
  const [hovered, setHovered] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const hoverBumpRef = useRef(0);
  const clickBumpRef = useRef(0);

  function handlePointerEnter() {
    setHovered(true);
    hoverBumpRef.current++;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function handlePointerLeave() {
    setHovered(false);
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
  }

  function handlePointerDown() {
    clickBumpRef.current++;
  }

  return (
    <div
      style={{ width: size, height: size, cursor: 'pointer' }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
    >
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 35 }}
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.12} />
          <directionalLight position={[3, 4, 5]} intensity={0.7} />
          <directionalLight position={[-4, -2, 3]} intensity={0.45} color="#ff6ec7" />
          <directionalLight position={[2, -3, -4]} intensity={0.28} color="#8b5cf6" />
          <LogoMesh
            url={url}
            color={color}
            colorMid={colorMid}
            colorTo={colorTo}
            hovered={hovered}
            pointerRef={pointerRef}
            hoverBumpRef={hoverBumpRef}
            clickBumpRef={clickBumpRef}
            kickRef={kickRef}
            kickKindRef={kickKindRef}
            idleMotion={idleMotion}
          />
          <Environment preset={envPreset} />
        </Suspense>
      </Canvas>
    </div>
  );
}
