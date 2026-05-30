import type Lenis from 'lenis';

// Module-level singleton so non-React code (preloader, anchor links)
// can pause / resume / scroll the page.
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = (): Lenis | null => instance;

export const stopScroll = () => instance?.stop();
export const startScroll = () => instance?.start();

export const scrollToTop = (immediate = true) =>
  instance?.scrollTo(0, { immediate });

// Saved scroll offsets per history entry, used for back/forward restore.
// Lives at module scope so SmoothScroll can keep it filled while RouteMount
// (rendered inside each lazy route) reads it on commit.
export const scrollPositions = new Map<string, number>();

// Apply a scroll target synchronously so the new tree's first paint lands
// at the right offset — both the real window and Lenis's internal state.
export const applyScroll = (target: number, resize = false) => {
  window.scrollTo(0, target);
  if (instance) {
    if (resize) instance.resize();
    instance.scrollTo(target, { immediate: true, force: true });
  }
};
