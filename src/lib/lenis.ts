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
