import { useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import Lenis from 'lenis';
import { setLenis, getLenis } from '../lib/lenis';
import { flux } from '../webgl/flux';

/**
 * Lenis smooth-scroll provider. Mount once near the app root.
 * Disabled when the user prefers reduced motion.
 *
 * Also owns scroll restoration for the whole app: it remembers each
 * history entry's scroll offset and, on back/forward (POP) navigation,
 * restores it — so the browser back button returns you to where you
 * were (e.g. the case grid) instead of snapping to the top. Forward
 * navigation (PUSH/REPLACE) always lands at the top.
 */

// Keyed by history entry (location.key) so it survives unmount/remount.
const scrollPositions = new Map<string, number>();

const SmoothScroll = () => {
  const { key: locationKey } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Reduced motion → native scroll, still feed the WebGL layer.
    if (reduced) {
      const onScroll = () => {
        flux.scroll = window.scrollY;
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    setLenis(lenis);

    lenis.on('scroll', (e: { scroll: number; velocity: number }) => {
      flux.scroll = e.scroll;
      flux.scrollVelocity = e.velocity;
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Let us own restoration — disable the browser's own guess, which
  // fights manual scrolling in an SPA.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Continuously remember the scroll offset for the current history entry.
  useEffect(() => {
    const save = () => scrollPositions.set(locationKey, window.scrollY);
    save();
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [locationKey]);

  // On navigation: restore the remembered offset for back/forward (POP),
  // otherwise jump to the top. useLayoutEffect runs before paint so the
  // jump lands before the new page is shown — no visible twitch.
  useLayoutEffect(() => {
    const lenis = getLenis();

    if (navType === 'POP') {
      // Back/forward → restore. Recompute dimensions first so a large
      // saved offset isn't clamped against the previous route's height.
      const target = scrollPositions.get(locationKey) ?? 0;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(target, { immediate: true, force: true });
      } else {
        window.scrollTo(0, target);
      }
      return;
    }

    // Forward navigation (PUSH/REPLACE) → top. Target 0 is never clamped,
    // so we skip resize() — calling it here fires a stray scroll event with
    // the outgoing offset and twitches the incoming page.
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [locationKey, navType]);

  return null;
};

export default SmoothScroll;
