/**
 * flux — the shared mutable state between the DOM layer and the WebGL
 * layer. DOM code (scroll, pointer, section progress) writes to it; the
 * WebGL scenes read it inside their render loop.
 *
 * It is a plain mutable singleton on purpose: every WebGL read happens
 * inside `useFrame`, never in React render, so reactivity would only add
 * overhead. This is the spine of the engine — one place the whole site
 * and the 3D world agree on "where we are".
 */
export interface Flux {
  /** Native scroll position in px. */
  scroll: number;
  /** Smoothed scroll velocity (px/frame-ish) from Lenis. */
  scrollVelocity: number;
  /** Pointer in normalized device coords (-1..1), y up. */
  pointer: { x: number; y: number };
  /** True while the pointer is over the viewport. */
  pointerInside: boolean;
  /** Hero section scroll progress, 0..1. */
  heroProgress: number;
  /** True while the hero scene is on screen and worth simulating. */
  heroVisible: boolean;
  /** True once the preloader is gone and the hero intro may play. */
  heroReady: boolean;
  /** Monotonic counter — bumped on click to detonate particles. */
  burst: number;
  /** Viewport size in CSS px. */
  viewportW: number;
  viewportH: number;
  /** Current route pathname — lets the canvas pick what to render. */
  route: string;
}

export const flux: Flux = {
  scroll: 0,
  scrollVelocity: 0,
  pointer: { x: 0, y: 0 },
  pointerInside: true,
  heroProgress: 0,
  heroVisible: true,
  heroReady: false,
  burst: 0,
  viewportW: typeof window !== 'undefined' ? window.innerWidth : 1280,
  viewportH: typeof window !== 'undefined' ? window.innerHeight : 800,
  route: '/',
};
