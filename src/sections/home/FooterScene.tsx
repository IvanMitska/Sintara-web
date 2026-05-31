import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import ErrorBoundary from '../../components/ErrorBoundary';
const ASTRONAUT_URL = '/models/astronaut.glb';
const ICONS_URL = '/models/icons.glb';

// NOTE: this scene no longer registers a loadManager task. It's lazy-mounted
// near the footer (well after the preloader) and pre-warmed in the background
// (see CtaFinale), so the preloader must NOT wait on it — gating the preloader
// on a task that only completes on scroll would hang it at ~94% until the 11s
// safety timeout.

/**
 * FooterScene — the cinematic 3D layer behind the closing CTA. A floating
 * astronaut holds the centre while a cloud of iridescent Spline primitives
 * drifts around it and scatters away from the cursor.
 *
 * Models live in /public/models — `astronaut.glb` (Draco + WebP, ~4.7 MB,
 * skinned, 4 clips) and `icons.glb` (Draco, ~0.45 MB, 9 named groups).
 *
 * Astronaut model: "Animated Astronaut Character in Space Suit Loop" by
 * LasquetiSpice (sketchfab.com), licensed CC-BY-4.0 — attribution required,
 * see /public/models/animated_astronaut.../license.txt. Keep a visible
 * credit somewhere on the site.
 */

// Named groups inside icons.glb (verified after Draco compression).
const ICON_NAMES = [
  'glass',
  'chain',
  'sphere',
  'helix',
  'puzzle',
  'displace',
  'gear 2',
  'abstract',
  'gear',
];

// ── shared pointer state ──────────────────────────────────────────────
// NDC pointer relative to the footer canvas, plus its world projection on
// the z=0 plane. Written by window listeners + the per-frame raycast.
type PointerState = {
  ndc: THREE.Vector2;
  world: THREE.Vector3;
  inside: boolean;
};

// ── material palette ──────────────────────────────────────────────────
// A varied set echoing the Spline reference: mirror chrome, holographic
// pastel, soft matte purple, lime pop, candy pink and a pearl white.
type IconMaterialSpec = THREE.MeshPhysicalMaterialParameters;

const MATERIAL_SPECS: IconMaterialSpec[] = [
  // chrome / mirror
  {
    color: '#e9eaf2',
    metalness: 1,
    roughness: 0.12,
    iridescence: 0.25,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.7,
  },
  // holographic pastel
  {
    color: '#d9d5ef',
    metalness: 0.65,
    roughness: 0.18,
    iridescence: 1,
    iridescenceIOR: 1.95,
    iridescenceThicknessRange: [200, 1300],
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.6,
  },
  // soft matte purple
  {
    color: '#9b7bff',
    metalness: 0.3,
    roughness: 0.46,
    iridescence: 0.35,
    clearcoat: 0.6,
    clearcoatRoughness: 0.3,
    envMapIntensity: 1.1,
  },
  // lime pop
  {
    color: '#8fd94a',
    metalness: 0.45,
    roughness: 0.32,
    iridescence: 0.4,
    clearcoat: 0.85,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.3,
  },
  // candy pink
  {
    color: '#ff79bd',
    metalness: 0.85,
    roughness: 0.2,
    iridescence: 0.55,
    iridescenceThicknessRange: [120, 900],
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.5,
  },
  // pearl white
  {
    color: '#eef0f8',
    metalness: 0.22,
    roughness: 0.5,
    iridescence: 0.6,
    clearcoat: 0.7,
    clearcoatRoughness: 0.28,
    envMapIntensity: 1.15,
  },
];

function makeMaterials() {
  return MATERIAL_SPECS.map((s) => new THREE.MeshPhysicalMaterial(s));
}

// Clone a named icon group, recentre it on the origin and rescale so its
// largest dimension equals `target`. Spline lays the set out on a grid, so
// each group carries a grid offset we have to strip.
function normalizeIcon(src: THREE.Object3D, target: number) {
  const obj = src.clone(true);
  obj.position.set(0, 0, 0);
  obj.rotation.set(0, 0, 0);
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;

  obj.position.sub(center);
  const wrap = new THREE.Group();
  wrap.add(obj);
  wrap.scale.setScalar(target / maxDim);
  return wrap;
}

// ── one drifting primitive ────────────────────────────────────────────
type IconDatum = {
  object: THREE.Object3D;
  home: THREE.Vector3;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  spin: THREE.Vector3;
  bobAmp: number;
  bobSpeed: number;
  phase: number;
};

function FloatingIcon({
  datum,
  pointer,
  reduced,
}: {
  datum: IconDatum;
  pointer: React.MutableRefObject<PointerState>;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const d = datum;
    const t = state.clock.elapsedTime;

    if (reduced) {
      g.position.copy(d.home);
      return;
    }

    const dt = Math.min(delta, 0.05);

    // spring back toward the home slot
    d.vel.x += (d.home.x - d.pos.x) * 2.4 * dt;
    d.vel.y += (d.home.y - d.pos.y) * 2.4 * dt;
    d.vel.z += (d.home.z - d.pos.z) * 2.4 * dt;

    // repulsion from the cursor (xy only, falls off over radius R)
    if (pointer.current.inside) {
      const pw = pointer.current.world;
      const dx = d.pos.x - pw.x;
      const dy = d.pos.y - pw.y;
      const dist = Math.hypot(dx, dy);
      const R = 4.6;
      if (dist < R && dist > 0.0001) {
        const falloff = 1 - dist / R;
        const push = falloff * falloff * 30;
        d.vel.x += (dx / dist) * push * dt;
        d.vel.y += (dy / dist) * push * dt;
      }
    }

    const damp = Math.exp(-dt * 3.1);
    d.vel.multiplyScalar(damp);
    d.pos.addScaledVector(d.vel, dt);

    g.position.copy(d.pos);
    g.position.y += Math.sin(t * d.bobSpeed + d.phase) * d.bobAmp;
    g.rotation.x += dt * d.spin.x;
    g.rotation.y += dt * d.spin.y;
    g.rotation.z += dt * d.spin.z;
  });

  return (
    <group ref={ref} position={datum.home}>
      <primitive object={datum.object} />
    </group>
  );
}

// ── the cloud of primitives + cursor raycast ──────────────────────────
function IconCloud({
  count,
  pointer,
  reduced,
}: {
  count: number;
  pointer: React.MutableRefObject<PointerState>;
  reduced: boolean;
}) {
  const { scene } = useGLTF(ICONS_URL);
  const camera = useThree((s) => s.camera);

  // Resolve the icon groups by walking the scene graph. GLTFLoader
  // sanitises node names (spaces → underscores), so we match the original
  // name kept in `userData.name` as well as the sanitised `name`.
  const sources = useMemo(() => {
    const wanted = new Set(ICON_NAMES);
    const found: THREE.Object3D[] = [];
    scene.traverse((o) => {
      const original = (o.userData?.name as string | undefined) ?? '';
      if (wanted.has(original) || wanted.has(o.name)) found.push(o);
    });
    return found;
  }, [scene]);

  const data = useMemo<IconDatum[]>(() => {
    if (sources.length === 0) return [];
    const materials = makeMaterials();
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0];

    // Jittered grid → even coverage. The viewport is split into cells, one
    // icon per cell with random jitter, so nothing clumps or leaves gaps.
    const X_HALF = 13;
    const Y_HALF = 6.4;
    const cols = Math.max(2, Math.round(Math.sqrt(count * 2.1)));
    const rows = Math.ceil(count / cols);
    const cellW = (X_HALF * 2) / cols;
    const cellH = (Y_HALF * 2) / rows;
    // shuffle cell assignment so icon shapes/colours aren't grid-aligned
    const cells = Array.from({ length: cols * rows }, (_, k) => k);
    for (let k = cells.length - 1; k > 0; k--) {
      const j = (Math.random() * (k + 1)) | 0;
      [cells[k], cells[j]] = [cells[j], cells[k]];
    }

    return Array.from({ length: count }, (_, i) => {
      const src = sources[i % sources.length];
      const object = normalizeIcon(src, rand(1.5, 2.9));

      const mat = pick(materials);
      object.traverse((c) => {
        const mesh = c as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.material = mat;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      });

      // cell centre + jitter
      const cell = cells[i];
      const cx = cell % cols;
      const cy = (cell / cols) | 0;
      const x = -X_HALF + (cx + 0.5) * cellW + rand(-1, 1) * cellW * 0.4;
      const y = -Y_HALF + (cy + 0.5) * cellH + rand(-1, 1) * cellH * 0.4;
      // icons over the astronaut sit behind it; the rest roam front/back
      const overAstronaut = Math.abs(x) < 3.4 && y > -5 && y < 2.4;
      const z = overAstronaut ? rand(-5.5, -2.6) : rand(-3.6, 3);
      const home = new THREE.Vector3(x, y, z);

      return {
        object,
        home,
        pos: home.clone(),
        vel: new THREE.Vector3(),
        spin: new THREE.Vector3(
          rand(-0.35, 0.35),
          rand(-0.4, 0.4),
          rand(-0.3, 0.3),
        ),
        bobAmp: rand(0.08, 0.22),
        bobSpeed: rand(0.4, 0.9),
        phase: rand(0, Math.PI * 2),
      };
    });
  }, [sources, count]);

  // project the NDC pointer onto the z=0 plane once per frame
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    [],
  );
  useFrame(() => {
    if (!pointer.current.inside) return;
    raycaster.setFromCamera(pointer.current.ndc, camera);
    raycaster.ray.intersectPlane(plane, pointer.current.world);
  });

  return (
    <>
      {data.map((d, i) => (
        <FloatingIcon key={i} datum={d} pointer={pointer} reduced={reduced} />
      ))}
    </>
  );
}

// ── the astronaut ─────────────────────────────────────────────────────
function Astronaut({
  pointer,
  reduced,
}: {
  pointer: React.MutableRefObject<PointerState>;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(ASTRONAUT_URL);
  const { actions } = useAnimations(animations, group);

  // centre + scale the model to a fixed on-screen height
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 9.2 / (size.y || 1);
    // On phones the figure dominates the narrow frame and its head/torso sit
    // right over the heading + CTA. Drop it lower (mobile only) so it reads as
    // a backdrop; desktop keeps the original placement. Matches `count`'s
    // one-shot innerWidth read — viewport class doesn't change mid-session.
    const mobileDrop = window.innerWidth < 768 ? -1.8 : 0;
    return {
      scale,
      offset: new THREE.Vector3(
        -center.x * scale,
        // sit the astronaut low — head behind the wordmark, waving hand
        // reaching up toward the eyebrow line
        -center.y * scale - 3.4 + mobileDrop,
        -center.z * scale,
      ),
    };
  }, [scene]);

  useEffect(() => {
    // prefer the hand-wave clip; fall back to whatever the model ships
    const action =
      actions.wave ?? actions.floating ?? Object.values(actions)[0];
    if (!action) return;
    if (reduced) {
      action.play();
      action.paused = true;
      return;
    }
    action.reset().fadeIn(0.6).play();
    return () => {
      action.fadeOut(0.4);
    };
  }, [actions, reduced]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || reduced) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    // gentle lean toward the cursor
    const ty = pointer.current.inside ? pointer.current.ndc.x * 0.26 : 0;
    const tx = pointer.current.inside ? -pointer.current.ndc.y * 0.12 : 0;
    g.rotation.y += (ty - g.rotation.y) * Math.min(1, dt * 2.2);
    g.rotation.x += (tx - g.rotation.x) * Math.min(1, dt * 2.2);
    // weightless drift — the wave clip only moves the arm
    g.position.y = Math.sin(t * 0.5) * 0.32;
    g.rotation.z = Math.sin(t * 0.34) * 0.04;
  });

  return (
    <group ref={group}>
      <group position={fit.offset} scale={fit.scale}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// ── scene contents ────────────────────────────────────────────────────
// Renders inside <Suspense>, so its useEffect only runs once every useGLTF
// in the scene has resolved (models loaded + parsed) and the astronaut /
// icon cloud are actually mounted in the THREE scene graph. At that moment
// we force-compile every material in the tree (so the heavy iridescent /
// chrome / clearcoat shaders are GPU-ready) — scrolling to the footer then
// reveals an already-warm scene with no shader-compile hitch.
function ReadySignal() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    try {
      gl.compile(scene, camera);
    } catch {
      // compile failures aren't fatal — the scene compiles lazily on its
      // first real render frame instead.
    }
  }, [gl, scene, camera]);
  return null;
}

function Scene({
  pointer,
  reduced,
}: {
  pointer: React.MutableRefObject<PointerState>;
  reduced: boolean;
}) {
  // lighter cloud on small / lower-power devices
  const count = useMemo(() => {
    const w = window.innerWidth;
    if (w < 600) return 6;
    if (w < 1100) return 14;
    return 24;
  }, []);

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 6, 8]} intensity={1.6} />
      <directionalLight
        position={[-6, -2, 4]}
        intensity={0.7}
        color="#5b5bff"
      />
      <pointLight position={[0, 1, 6]} intensity={40} color="#A78BFA" />

      <Astronaut pointer={pointer} reduced={reduced} />
      <IconCloud count={count} pointer={pointer} reduced={reduced} />

      {/* The "city" preset fetches an HDR from drei's CDN — on a flaky mobile
          network that fetch can fail intermittently. Isolate it: a failure
          drops only the reflections (materials look slightly flatter), never
          the whole scene or the page. */}
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>
      </ErrorBoundary>
      <ReadySignal />
    </Suspense>
  );
}

// ── public component ──────────────────────────────────────────────────
const FooterScene = ({ active }: { active: boolean }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState>({
    ndc: new THREE.Vector2(),
    world: new THREE.Vector3(),
    inside: false,
  });

  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const coarse = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches,
    [],
  );

  // translate window pointer events into canvas-local NDC (desktop only —
  // there's no cursor-scatter on touch, so skip the per-pointermove rect read)
  useEffect(() => {
    if (coarse) return;
    const onMove = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      pointer.current.inside = inside;
      if (inside) {
        pointer.current.ndc.set(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -(((e.clientY - r.top) / r.height) * 2 - 1),
        );
      }
    };
    const onLeave = () => {
      pointer.current.inside = false;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [coarse]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        // Mobile: cap DPR + drop MSAA. The iridescent/clearcoat physical
        // materials are fragment-shader heavy, so shading fewer pixels with no
        // multisampling is a large GPU win at little visual cost on a small
        // background scene.
        dpr={coarse ? [1, 1.25] : [1, 1.6]}
        frameloop={active && !reduced ? 'always' : 'demand'}
        camera={{ position: [0, 0, 15], fov: 36 }}
        gl={{
          antialias: !coarse,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Scene pointer={pointer} reduced={reduced} />
      </Canvas>
    </div>
  );
};

export default FooterScene;
