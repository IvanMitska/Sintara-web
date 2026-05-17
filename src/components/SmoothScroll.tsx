import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { setLenis } from '../lib/lenis';
import { flux } from '../webgl/flux';

/**
 * Lenis smooth-scroll provider. Mount once near the app root.
 * Disabled when the user prefers reduced motion.
 */
const SmoothScroll = () => {
  const { pathname } = useLocation();

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

  // Reset scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default SmoothScroll;
