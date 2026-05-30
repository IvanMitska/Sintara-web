import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { setLenis, scrollPositions } from '../lib/lenis';
import { flux } from '../webgl/flux';

/**
 * Lenis smooth-scroll provider. Mount once near the app root.
 * Disabled when the user prefers reduced motion.
 *
 * Owns scroll *saving* — every paint we record the current offset for the
 * active history entry, so back/forward navigation can restore it. The
 * actual *applying* of the saved offset (or jumping to 0 on PUSH) is done
 * by RouteMount, which mounts inside each route's element — so the jump
 * lands exactly when the new tree commits, never on the still-visible old
 * tree during a Suspense-pending transition.
 */

const SmoothScroll = () => {
  const { key: locationKey } = useLocation();

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

  return null;
};

export default SmoothScroll;
