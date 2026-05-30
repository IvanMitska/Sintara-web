import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { flux } from './flux';
import { markReady } from '../lib/loadManager';

/**
 * Interstellar-style black hole — a full-screen raymarched shader drawn
 * on a clip-space quad. Light rays are bent by gravity each step, so the
 * accretion disk behind the hole wraps over the top and bottom into the
 * iconic halo. Real-time; reacts to pointer (orbit) and scroll (dolly).
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uSpin;
  uniform vec2 uPointer;
  uniform float uScroll;
  uniform float uBurst;

  #define STEPS 220
  #define RS 1.0
  #define DISK_IN 3.6
  #define DISK_OUT 8.2

  float hash(vec2 p){
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
               u.y);
  }
  float fbm(vec2 p){
    float s = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++){ s += a * vnoise(p); p *= 2.04; a *= 0.5; }
    return s;
  }

  // accretion-disk emission at a point inside the disk slab
  vec3 diskSample(vec3 pos, float rad){
    float t = clamp((rad - DISK_IN) / (DISK_OUT - DISK_IN), 0.0, 1.0);
    float ang = atan(pos.z, pos.x);
    // keplerian shear — inner gas orbits faster; uSpin winds up on scroll
    float orbit = uSpin * 1.6 / pow(rad, 1.5);

    // concentric ring bands — high radial-frequency density variation,
    // the structured "grooves" of the disk
    float rings = fbm(vec2(rad * 4.5, ang * 0.6 + orbit * 0.2));
    rings = rings * 0.58 + fbm(vec2(rad * 15.0, ang * 1.0 + orbit * 0.4)) * 0.42;

    // orbital filaments — domain-warped wisps sheared by rotation
    vec2 q = vec2(ang * 2.2 + orbit, rad * 0.7);
    float w = fbm(q * 1.2);
    vec2 qw = q + w * 1.2;
    float fila = fbm(qw * vec2(5.0, 3.2));

    // fine micro-structure — very high-frequency wisps
    float micro = fbm(qw * vec2(22.0, 9.0));
    // fine radial striae — cheap sharp grooves modulated by the wisps
    float striae = sin(rad * 52.0 + w * 6.0 + orbit * 0.3) * 0.5 + 0.5;
    striae = pow(striae, 3.5);

    float dens = rings * 0.5 + fila * 0.32 + micro * 0.18;
    float hot = pow(rings, 3.0) * 0.6
              + pow(fila, 2.4) * 0.6
              + pow(micro, 3.0) * 0.95
              + striae * micro * 0.55;

    // temperature: white-hot inner edge → gold → amber rim
    vec3 cIn = vec3(1.0, 0.93, 0.78);   // warm white-gold
    vec3 cMid = vec3(1.0, 0.72, 0.32);  // gold
    vec3 cOut = vec3(0.88, 0.4, 0.12);  // deep amber
    vec3 c = mix(cIn, cMid, smoothstep(0.0, 0.38, t));
    c = mix(c, cOut, smoothstep(0.38, 1.0, t));

    float bright = 0.14 + dens * 0.62 + hot * 1.05;
    bright *= mix(2.4, 0.4, t);              // inner far hotter
    bright += smoothstep(0.22, 0.0, t) * 0.8; // soft hot inner glow
    bright *= smoothstep(0.0, 0.12, t);      // softened inner edge
    bright *= smoothstep(1.0, 0.8, t);       // soft outer fade
    bright *= 1.0 + 0.45 * sin(ang + 1.3);   // Doppler beaming

    return c * bright;
  }

  // point-star layer — round stars at random cell positions
  float starLayer(vec2 s, float scale){
    vec2 g = s * scale;
    vec2 cell = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash(cell);
    vec2 off = (vec2(hash(cell + 1.3), hash(cell + 2.7)) - 0.5) * 0.7;
    float d = length(f - off);
    float star = smoothstep(0.07, 0.0, d);
    star *= step(0.84, h);
    star *= 0.35 + hash(cell + 4.1) * 0.95;
    return star;
  }
  // lensed background starfield — the projection warps near the hole,
  // so stars look compressed / smeared around the shadow
  vec3 starField(vec3 dir){
    vec2 s = dir.xy / (abs(dir.z) + 0.3);
    float a = starLayer(s, 20.0);
    float b = starLayer(s + 9.0, 40.0);
    return vec3(0.86, 0.9, 1.0) * (a + b * 0.7);
  }

  void main(){
    vec2 uv = vUv - 0.5;
    uv.x *= uResolution.x / uResolution.y;

    // ── scroll choreography — fly straight into the hole's centre ──
    float s = uScroll;
    // part linear (responsive from the very first scroll), part eased
    // (gentle settle) — no dead zone, no sudden jump
    float lin = clamp((s - 0.04) / 0.92, 0.0, 1.0);
    float dive2 = mix(lin, lin * lin * (3.0 - 2.0 * lin), 0.5);
    float breathe = sin(uTime * 0.18) * 0.5 * (1.0 - dive2);

    // camera flies toward the centre — the hole stays centred and engulfs
    float dist = mix(30.0, 1.7, dive2) + breathe;
    float yaw = uPointer.x * 0.3 + uTime * 0.015;
    float pitch = 0.07 + uPointer.y * 0.06;

    vec3 ro = vec3(sin(yaw) * cos(pitch), sin(pitch),
                   cos(yaw) * cos(pitch)) * dist;

    vec3 fwd = normalize(-ro);                     // always aimed at centre
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
    vec3 up = cross(fwd, right);
    // FOV widens as you plunge → the rush of falling in
    float focal = mix(1.12, 0.78, dive2);
    vec3 rd = normalize(fwd * focal + right * uv.x + up * uv.y);

    // geodesic raymarch — h2 (angular momentum²) is conserved
    vec3 pos = ro;
    vec3 dir = rd;
    vec3 hvec = cross(pos, dir);
    float h2 = dot(hvec, hvec);

    vec3 col = vec3(0.0);

    for (int i = 0; i < STEPS; i++){
      float r2 = dot(pos, pos);
      float r = sqrt(r2);
      if (r < RS){ break; }       // captured by the hole
      if (r > 90.0){ break; }     // escaped to infinity

      float dt = clamp(r * 0.045, 0.032, 1.25);
      // light-bending acceleration in the Schwarzschild field
      vec3 accel = -1.5 * h2 * pos / (r2 * r2 * r);
      dir += accel * dt;

      // volumetric accretion disk — a thin glowing slab in y = 0.
      // Front, over-the-top and under-the-bottom lensed images all
      // accumulate, building the full Interstellar halo.
      float rad = length(pos.xz);
      if (rad > DISK_IN && rad < DISK_OUT){
        float halfT = 0.13 + (rad - DISK_IN) / (DISK_OUT - DISK_IN) * 0.13;
        float hgt = abs(pos.y);
        if (hgt < halfT){
          float vert = 1.0 - hgt / halfT;
          vert *= vert;
          col += diskSample(pos, rad) * vert * dt * 1.85;
        }
      }

      pos += dir * dt;
    }

    // lensed starfield — full strength where light escapes, faint in the
    // captured shadow so the centre reads as deep space, not a void
    // uniform brightness — no hard step at the shadow edge (avoids a
    // thin ring artefact); the centre still reads as deep space
    col += starField(normalize(dir)) * 0.7;

    // approach surge — the disk flares as you fall toward it,
    // then everything fades through the event horizon at the very end
    float surge = smoothstep(0.6, 0.9, s) * (1.0 - smoothstep(0.9, 1.0, s));
    col *= 1.0 + uBurst * 0.6 + surge * 0.8;
    col *= 1.0 - smoothstep(0.93, 1.0, s);

    // tunnel vignette closing in during the plunge
    float vig = 1.0 - dive2 * clamp(length(uv) - 0.12, 0.0, 1.0) * 1.5;
    col *= clamp(vig, 0.0, 1.0);

    // filmic-ish tone
    col = col / (col + 1.1);
    col = pow(col, vec3(0.82));
    // restore the gold the tonemap washes out
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(lum), col, 1.32);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const BlackHole = () => {
  const { size } = useThree();
  const sim = useRef({ lastBurst: 0, burst: 0, frames: 0 });

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uSpin: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uScroll: { value: 0 },
      uBurst: { value: 0 },
    }),
    [],
  );

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    // a few frames in, the shader is compiled and drawn — signal the
    // preloader that the WebGL scene is genuinely ready
    sim.current.frames += 1;
    if (sim.current.frames === 3) markReady('webgl');
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uResolution.value.set(size.width, size.height);
    uniforms.uScroll.value = flux.heroProgress;
    // disk rotation — winds up dramatically as you scroll into the hole
    uniforms.uSpin.value += d * (1.0 + flux.heroProgress * 7.0);

    const p = uniforms.uPointer.value;
    p.x += (flux.pointer.x - p.x) * Math.min(1, d * 2.2);
    p.y += (flux.pointer.y - p.y) * Math.min(1, d * 2.2);

    if (flux.burst !== sim.current.lastBurst) {
      sim.current.lastBurst = flux.burst;
      sim.current.burst = 1;
    }
    sim.current.burst *= 0.93;
    if (sim.current.burst < 0.002) sim.current.burst = 0;
    uniforms.uBurst.value = sim.current.burst;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

export default BlackHole;
