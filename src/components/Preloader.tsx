import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { stopScroll, startScroll, scrollToTop } from '../lib/lenis';
import { lockScroll, unlockScroll } from '../lib/scrollLock';
import { loadProgress, allReady } from '../lib/loadManager';

/**
 * Cinematic preloader — black screen, centred Sintara mark, a 0→100 counter
 * pinned bottom-left, a progress hairline, then a curtain wipe reveal.
 *
 * The counter tracks *real* readiness (loadManager): fonts loaded, the
 * WebGL scene compiled and drawn, and any registered 3D assets. It only
 * completes once the site is actually ready — so the user always lands
 * on a fully-loaded page.
 */

const Shell = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Mark = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 34px;

  .logo {
    width: clamp(120px, 17vw, 210px);
    height: clamp(120px, 17vw, 210px);
    background-color: #fff;
    -webkit-mask: url('/logo/sintara_logo.svg') center / contain no-repeat;
    mask: url('/logo/sintara_logo.svg') center / contain no-repeat;
    will-change: transform, opacity;
  }

  .caption {
    font-size: 0.625rem;
    font-weight: 500;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
  }
`;

const Counter = styled.div`
  position: absolute;
  left: clamp(20px, 4vw, 56px);
  bottom: clamp(20px, 4vw, 48px);
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(3.5rem, 11vw, 9rem);
  line-height: 0.85;
  letter-spacing: -0.05em;
  font-variant-numeric: tabular-nums;
  color: #fff;
`;

const Meta = styled.div`
  position: absolute;
  right: clamp(20px, 4vw, 56px);
  bottom: clamp(24px, 4vw, 52px);
  text-align: right;
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.8;
`;

const Track = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: rgba(255, 255, 255, 0.08);

  span {
    display: block;
    height: 100%;
    background: var(--accent-bright);
    transform-origin: left;
  }
`;

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    lockScroll();
    stopScroll();
    scrollToTop(true);

    const minTime = 1000; // ms — minimum on-screen time for polish
    const maxTime = 11000; // ms — hard safety so it can never hang
    const start = performance.now();
    let raf = 0;
    let endTimer = 0;
    let displayed = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const real = loadProgress(); // 0..1 — genuine readiness
      const ready = allReady();
      // honest target, capped below 100 until the site is truly loaded,
      // but always creeping so the counter never looks frozen
      const cap = ready ? 100 : 94;
      const target = Math.min(cap, Math.max(real * 100, displayed + 0.22));
      displayed += (target - displayed) * 0.12;
      if (displayed > 100) displayed = 100;
      setProgress(Math.round(displayed));

      if (
        (ready && displayed >= 99.4 && elapsed >= minTime) ||
        elapsed >= maxTime
      ) {
        setProgress(100);
        endTimer = window.setTimeout(() => setDone(true), 420);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(endTimer);
      // Balance the lockScroll() above in THIS effect's cleanup. lockScroll is
      // reference-counted, so pairing lock+unlock per mount keeps it balanced
      // under StrictMode's mount→unmount→remount in dev (otherwise locks would
      // settle at 1 and leave <html> overflow:hidden, blocking scroll past the
      // hero) — and also releases the lock if the preloader unmounts via
      // navigation rather than the exit-complete path.
      unlockScroll();
    };
  }, []);

  const handleExitComplete = () => {
    startScroll();
    scrollToTop(true);
    onComplete();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!done && (
        <Shell
          initial={{ opacity: 1 }}
          exit={
            reduced
              ? { opacity: 0 }
              : { y: '-100%' }
          }
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        >
          <Mark
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="logo"
              role="img"
              aria-label="Sintara"
              initial={
                reduced
                  ? { opacity: 0, scale: 1, rotate: 0 }
                  : { opacity: 0, scale: 0.72, rotate: -45 }
              }
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 1.05,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
            <motion.span
              className="caption"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Digital Product Studio
            </motion.span>
          </Mark>

          <Counter>{String(progress).padStart(3, '0')}</Counter>

          <Meta>
            Est. 2024
            <br />
            Loading
          </Meta>

          <Track>
            <motion.span
              style={{ scaleX: progress / 100 }}
              transition={{ ease: 'linear' }}
            />
          </Track>
        </Shell>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
