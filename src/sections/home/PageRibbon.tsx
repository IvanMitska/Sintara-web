import { useRef } from 'react';
import type { RefObject } from 'react';
import styled from 'styled-components';
import {
  useScroll,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';

/**
 * PageRibbon — Lusion-style threading ribbons. Each ribbon is a worm: a
 * short continuous segment of a winding track. As the page scrolls the
 * worm's geometry is recomputed so it crawls along the track, head first,
 * top to bottom.
 *
 * Drawn as a plain solid <path> (no dashes, no scaled strokes) so it
 * always renders — the segment itself is the geometry that moves.
 */

const Layer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Svg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;

  path {
    fill: none;
    stroke-width: clamp(13px, 1.6vw, 30px);
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }
`;

type Track = {
  grad: string;
  cx: number; // centre on the 0–100 x axis
  amp: number; // lateral swing
  k: number; // waves along the whole track
  phase: number;
};

// Two tracks kept on opposite halves of the page so the ribbons read as
// two distinct strands, not a tangle. Different wave counts → they cross
// at angles rather than running parallel.
const TRACKS: Track[] = [
  { grad: 'rA', cx: 29, amp: 23, k: 16, phase: 0.5 },
  { grad: 'rB', cx: 72, amp: 23, k: 21, phase: 3.6 },
];

// worm length as a fraction of the whole track
const WL = 0.55;
const SAMPLES = 16;

const round = (n: number) => Math.round(n * 100) / 100;

// Catmull-Rom → cubic Bézier — a smooth curve through all sample points.
const spline = (pts: [number, number][]) => {
  let d = `M ${round(pts[0][0])} ${round(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? pts[i + 1];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(p2[0])} ${round(p2[1])}`;
  }
  return d;
};

// The worm — the slice of the winding track between `head` and `head + WL`,
// where `head` is driven by scroll progress p (0 → above the top, 1 → below
// the bottom). Coordinates live in the 0–100 × 0–200 viewBox.
const buildWorm = (p: number, t: Track) => {
  const head = -WL + p * (1 + WL);
  const pts: [number, number][] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const s = head + WL * (i / SAMPLES);
    const x = t.cx + t.amp * Math.sin(s * t.k + t.phase);
    const y = -14 + 228 * s;
    pts.push([x, y]);
  }
  return spline(pts);
};

const PageRibbon = ({
  targetRef,
}: {
  targetRef: RefObject<HTMLDivElement | null>;
}) => {
  const reduced = useReducedMotion() ?? false;
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });
  const prog = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 26,
    mass: 0.5,
  });

  useMotionValueEvent(prog, 'change', (p) => {
    if (reduced) return;
    TRACKS.forEach((t, i) => {
      pathRefs.current[i]?.setAttribute('d', buildWorm(p, t));
    });
  });

  return (
    <Layer aria-hidden>
      <Svg viewBox="0 0 100 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3D37F2" />
            <stop offset="1" stopColor="#6FCED7" />
          </linearGradient>
          <linearGradient id="rB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6FCED7" />
            <stop offset="1" stopColor="#3D37F2" />
          </linearGradient>
        </defs>

        {TRACKS.map((t, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={buildWorm(reduced ? 0.5 : 0, t)}
            stroke={`url(#${t.grad})`}
          />
        ))}
      </Svg>
    </Layer>
  );
};

export default PageRibbon;
