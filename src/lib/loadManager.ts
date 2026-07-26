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

// NOTE: there is no longer a persistent WebGL hero (it's a <video> now), so
// the old `webgl` gate has been removed. It used to be settled by
// GlobalCanvas/CrystalScene, none of which mount anymore — leaving the task
// permanently `done: false`, so allReady() never returned true and the
// preloader always ran to its 11s safety timeout. The `footer` 3D task still
// registers itself at runtime (see FooterScene) when the home page mounts.
const tasks: Record<string, Task> = {
  fonts: { done: false, weight: 1 },
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
    // Explicitly request every PP Neue Montreal weight up front. Otherwise
    // the browser only fetches a weight when some element first needs it —
    // which can happen mid-navigation and flash the fallback (FOUT). Kicking
    // them all off here means fonts.ready waits for the display typeface to
    // be fully loaded, so the preloader covers the fetch.
    const display = "'PP Neue Montreal'";
    [`400 1em ${display}`, `600 1em ${display}`, `800 1em ${display}`].forEach(
      (font) => fonts.load(font).catch(() => {}),
    );

    fonts.ready.then(() => markReady('fonts')).catch(() => markReady('fonts'));
    // Safety — never let a stalled font load block the site. Keep this
    // comfortably long: if it fires before the fonts actually arrive, the
    // preloader releases early and the hero headline visibly re-renders
    // (fallback → PP Neue) right in front of the user on slow connections.
    // The preloader has its own 11s hard cap, so 8s here still guarantees
    // the site never hangs on a dead font CDN.
    window.setTimeout(() => markReady('fonts'), 8000);
  } else {
    markReady('fonts');
  }
}
