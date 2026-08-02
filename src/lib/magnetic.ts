/**
 * magnetic — elements that lean toward the cursor.
 *
 * One window `pointermove` listener and one rAF loop serve every magnetic
 * element on the page, rather than a listener + loop per button. The loop
 * parks itself as soon as everything has settled back to rest, so an idle
 * page costs nothing.
 *
 * Written straight to `style.transform` instead of going through React or
 * framer-motion: these are pure compositor transforms on elements that never
 * re-render, so a state update per frame would be pure overhead.
 */

interface Entry {
  el: HTMLElement;
  /** How far the element follows the pointer, 0..1 of the offset. */
  strength: number;
  /** Pull radius in px, measured from the element's edge outward. */
  radius: number;
  /** Optional inner element offset on top of the parent's — a parallax. */
  child: HTMLElement | null;
  childStrength: number;
  // target / current offsets
  tx: number;
  ty: number;
  cx: number;
  cy: number;
}

const entries = new Set<Entry>();
let raf = 0;
let pointerX = -9999;
let pointerY = -9999;
let listening = false;

const onMove = (e: PointerEvent) => {
  pointerX = e.clientX;
  pointerY = e.clientY;
  start();
};

const start = () => {
  if (!raf) raf = requestAnimationFrame(tick);
};

const tick = () => {
  let moving = false;

  for (const entry of entries) {
    const r = entry.el.getBoundingClientRect();
    // Measure from the element's box, not its centre: a wide pill should pull
    // from anywhere along its length, not only near the middle.
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = pointerX - cx;
    const dy = pointerY - cy;
    const outsideX = Math.max(0, Math.abs(dx) - r.width / 2);
    const outsideY = Math.max(0, Math.abs(dy) - r.height / 2);
    const distance = Math.hypot(outsideX, outsideY);

    if (distance < entry.radius) {
      // Falls off toward the edge of the radius so the element doesn't snap
      // to a non-zero offset the instant the pointer crosses the boundary.
      const falloff = 1 - distance / entry.radius;
      entry.tx = dx * entry.strength * falloff;
      entry.ty = dy * entry.strength * falloff;
    } else {
      entry.tx = 0;
      entry.ty = 0;
    }

    entry.cx += (entry.tx - entry.cx) * 0.16;
    entry.cy += (entry.ty - entry.cy) * 0.16;

    // Snap the last fraction of a pixel to zero, otherwise the loop never
    // reaches rest and we keep a rAF alive forever for an invisible offset.
    if (Math.abs(entry.cx) < 0.05 && Math.abs(entry.tx) === 0) entry.cx = 0;
    if (Math.abs(entry.cy) < 0.05 && Math.abs(entry.ty) === 0) entry.cy = 0;

    entry.el.style.transform =
      entry.cx || entry.cy
        ? `translate3d(${entry.cx.toFixed(2)}px, ${entry.cy.toFixed(2)}px, 0)`
        : '';

    if (entry.child) {
      const kx = entry.cx * entry.childStrength;
      const ky = entry.cy * entry.childStrength;
      entry.child.style.transform =
        kx || ky
          ? `translate3d(${kx.toFixed(2)}px, ${ky.toFixed(2)}px, 0)`
          : '';
    }

    if (entry.cx || entry.cy) moving = true;
  }

  raf = moving ? requestAnimationFrame(tick) : 0;
};

export interface MagneticOptions {
  strength?: number;
  radius?: number;
  /** CSS selector for an inner element that gets its own parallax offset. */
  childSelector?: string;
  /**
   * Extra offset for the child as a fraction of the parent's, applied on top
   * of it. Negative makes the child trail behind the element it sits in
   * (the effect you usually want); positive makes it lead.
   */
  childStrength?: number;
}

/**
 * Register an element. Returns an unregister fn — call it on unmount.
 * No-ops (and reports it) on touch or reduced-motion, so callers don't need
 * to guard themselves.
 */
export const registerMagnetic = (
  el: HTMLElement,
  {
    strength = 0.22,
    radius = 90,
    childSelector,
    childStrength = 0.4,
  }: MagneticOptions = {},
): (() => void) => {
  if (
    typeof window === 'undefined' ||
    !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return () => {};
  }

  const entry: Entry = {
    el,
    strength,
    radius,
    child: childSelector
      ? el.querySelector<HTMLElement>(childSelector)
      : null,
    childStrength,
    tx: 0,
    ty: 0,
    cx: 0,
    cy: 0,
  };
  entries.add(entry);

  if (!listening) {
    window.addEventListener('pointermove', onMove, { passive: true });
    listening = true;
  }

  return () => {
    entries.delete(entry);
    el.style.transform = '';
    if (entry.child) entry.child.style.transform = '';
    if (entries.size === 0 && listening) {
      window.removeEventListener('pointermove', onMove);
      listening = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
  };
};
