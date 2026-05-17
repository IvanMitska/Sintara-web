/**
 * loadManager — the site's real readiness signal. The preloader holds
 * the screen until every registered task is done, so the user only ever
 * lands on a fully-loaded page (fonts ready, the WebGL scene compiled
 * and drawn, and — later — any 3D models finished loading).
 *
 * Plain module, no three.js import, so it is safe to use from the
 * preloader (which lives in the main bundle).
 */

interface Task {
  done: boolean;
  weight: number;
}

const tasks: Record<string, Task> = {
  fonts: { done: false, weight: 1 },
  webgl: { done: false, weight: 5 },
};

const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

/** Register an extra task (e.g. a 3D model) before it starts loading. */
export const registerTask = (name: string, weight = 4) => {
  if (!tasks[name]) {
    tasks[name] = { done: false, weight };
    emit();
  }
};

/** Mark a task complete. */
export const markReady = (name: string) => {
  const t = tasks[name];
  if (t && !t.done) {
    t.done = true;
    emit();
  }
};

/** 0..1 — weighted share of readiness tasks that are done. */
export const loadProgress = (): number => {
  let total = 0;
  let done = 0;
  for (const k in tasks) {
    total += tasks[k].weight;
    if (tasks[k].done) done += tasks[k].weight;
  }
  return total > 0 ? done / total : 1;
};

/** True once every task is done. */
export const allReady = (): boolean => {
  for (const k in tasks) {
    if (!tasks[k].done) return false;
  }
  return true;
};

/** Subscribe to readiness changes. Returns an unsubscribe fn. */
export const onLoadChange = (l: () => void): (() => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

// ── fonts ──────────────────────────────────────────────────────────
if (typeof document !== 'undefined') {
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (fonts && fonts.ready) {
    fonts.ready.then(() => markReady('fonts')).catch(() => markReady('fonts'));
    // safety — never let a stalled font load block the site
    window.setTimeout(() => markReady('fonts'), 4000);
  } else {
    markReady('fonts');
  }
}
