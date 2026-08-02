/**
 * scrollFlow — media that reacts to how fast you scroll.
 *
 * Scroll fast and registered elements squash along the scroll axis, then
 * settle back when the page stops. Volume-preserving (the stretch on one axis
 * is paid for on the other), so it reads as elasticity rather than as an image
 * being resized.
 *
 * Same shape as lib/magnetic: one scroll listener, one rAF loop shared by every
 * element, and the loop parks itself once everything is back at rest. Elements
 * outside the viewport are skipped entirely — an IntersectionObserver flips a
 * flag rather than the loop measuring rects it doesn't need.
 */

interface Entry {
  el: HTMLElement;
  intensity: number;
  visible: boolean;
  /** Last applied deformation, kept to avoid redundant style writes. */
  applied: number;
}

const entries = new Set<Entry>();
let io: IntersectionObserver | null = null;
const byElement = new WeakMap<Element, Entry>();

let raf = 0;
let listening = false;
let lastScroll = 0;
let velocity = 0;

// Beyond this the effect stops growing — a flung scroll shouldn't liquefy
// the page, and the cap is what keeps this tasteful rather than gimmicky.
const MAX_DEFORM = 0.05;

const wake = () => {
  if (!raf) raf = requestAnimationFrame(tick);
};

const onScroll = () => wake();

const tick = () => {
  const scroll = window.scrollY;
  const delta = scroll - lastScroll;
  lastScroll = scroll;

  // Smooth the raw per-frame delta: unfiltered it jitters between frames on a
  // trackpad and the elements buzz instead of flowing.
  velocity += (delta - velocity) * 0.16;

  const raw = velocity * 0.0022;
  const deform = Math.max(-MAX_DEFORM, Math.min(MAX_DEFORM, raw));

  for (const entry of entries) {
    if (!entry.visible) {
      if (entry.applied !== 0) {
        entry.el.style.transform = '';
        entry.applied = 0;
      }
      continue;
    }
    const k = deform * entry.intensity;
    // Sub-tenth-of-a-percent changes are invisible; skipping them keeps us off
    // the style-recalc path while the page is nearly still.
    if (Math.abs(k - entry.applied) < 0.0008) continue;
    entry.applied = k;
    entry.el.style.transform = k
      ? `scale3d(${(1 - k * 0.5).toFixed(4)}, ${(1 + k).toFixed(4)}, 1)`
      : '';
  }

  // Rest = no meaningful velocity left. One more frame of settling is cheap
  // insurance against parking mid-deformation.
  if (Math.abs(velocity) < 0.05 && Math.abs(deform) < 0.0008) {
    velocity = 0;
    for (const entry of entries) {
      if (entry.applied !== 0) {
        entry.el.style.transform = '';
        entry.applied = 0;
      }
    }
    raf = 0;
    return;
  }

  raf = requestAnimationFrame(tick);
};

/**
 * Register an element. Returns an unregister fn.
 * No-ops for reduced-motion users.
 */
export const registerFlow = (
  el: HTMLElement,
  intensity = 1,
): (() => void) => {
  if (
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return () => {};
  }

  const entry: Entry = { el, intensity, visible: false, applied: 0 };
  entries.add(entry);
  byElement.set(el, entry);

  if (!io) {
    io = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          const target = byElement.get(record.target);
          if (target) target.visible = record.isIntersecting;
        }
        wake();
      },
      { rootMargin: '10%' },
    );
  }
  io.observe(el);

  if (!listening) {
    lastScroll = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    listening = true;
  }

  return () => {
    entries.delete(entry);
    byElement.delete(el);
    io?.unobserve(el);
    el.style.transform = '';
    if (entries.size === 0) {
      window.removeEventListener('scroll', onScroll);
      listening = false;
      io?.disconnect();
      io = null;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      velocity = 0;
    }
  };
};
