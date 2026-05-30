import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';
import PillLink from '../../components/ui/PillLink';
import Reveal from '../../components/ui/Reveal';
import Crosshair from '../../components/ui/Crosshair';
import ErrorBoundary from '../../components/ErrorBoundary';
// Lazy so the ~1.1 MB three.js chunk + ~4.5 MB astronaut.glb leave the eager
// home graph (they were `modulepreload`-ed and gated the preloader). The scene
// is mounted ahead of the viewport (see `shouldMount` below) so it has loaded +
// compiled by the time the user scrolls down — no pop-in — but first paint of
// the page no longer waits on ~5.6 MB of footer assets.
const FooterScene = lazy(() => import('./FooterScene'));

/**
 * Closing CTA — a dark cinematic panel. A floating astronaut and a cloud
 * of iridescent primitives render in WebGL behind the wordmark; a halftone
 * dot field rises from the bottom edge as a 2D sparkle layer on top.
 */

const Shell = styled.section`
  position: relative;
  background: radial-gradient(
    ellipse 72% 64% at 50% 40%,
    #161636 0%,
    #0a0a16 58%,
    #050509 100%
  );
  color: #fff;
  min-height: 92svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(110px, 16vh, 220px) clamp(20px, 5vw, 80px)
    clamp(80px, 12vh, 160px);
  overflow: hidden;
`;

const Field = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(28px, 5vh, 56px);
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);

  &::before,
  &::after {
    content: '';
    width: 28px;
    height: 1px;
    background: rgba(255, 255, 255, 0.4);
  }
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(3rem, 12vw, 14rem);
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: #fff;
  margin: 0;
`;

const DotField = ({ active }: { active: boolean }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only run the (~3000 arc/frame) loop while the footer is on screen.
    // Offscreen — i.e. the whole time you read the page above it — this
    // would otherwise burn the main thread for nothing.
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const gap = 26;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const draw = (time: number) => {
      const t = time * 0.001;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      for (let y = 0; y < h + gap; y += gap) {
        // dots concentrate toward the bottom edge
        const edge = Math.min(1, Math.max(0, (y / h - 0.32) / 0.68));
        if (edge <= 0) continue;
        for (let x = 0; x < w + gap; x += gap) {
          const wave =
            Math.sin(x * 0.018 + t * 0.9) *
              Math.cos(y * 0.022 - t * 0.7) *
              0.5 +
            0.5;
          const r = edge * (0.7 + wave * 2.6);
          if (r < 0.15) continue;
          // toned down — a faint sparkle over the dark 3D scene
          ctx.globalAlpha = 0.05 + edge * 0.24;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return <Field ref={ref} aria-hidden />;
};

const CtaFinale = () => {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const shellRef = useRef<HTMLElement>(null);
  // Gates the WebGL render loop (frameloop) to when the footer is on
  // screen. The scene itself stays mounted from page load on purpose —
  // it loads + compiles behind the preloader so it's ready to animate the
  // moment the user reaches it, no pop-in. See FooterScene's ReadySignal.
  const [inView, setInView] = useState(false);
  // Latches true the first time the footer comes within a generous margin, so
  // the lazy 3D chunk + models start downloading well before the section is
  // actually visible. Once mounted it never unmounts (no reload on scroll-away).
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    // Frameloop / DotField gate — tight margin, toggles with visibility.
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px' },
    );
    io.observe(el);
    // Mount gate — wide lead margin, fires once. ~1.5 screens of runway gives
    // the assets time to load before the footer paints.
    const mountIo = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          mountIo.disconnect();
        }
      },
      { rootMargin: '1200px' },
    );
    mountIo.observe(el);
    return () => {
      io.disconnect();
      mountIo.disconnect();
    };
  }, []);

  // Warm the footer 3D in the background as soon as the page goes idle — long
  // before the mount gate above fires. Downloads the chunk (three.js) and the
  // GLB models into cache WITHOUT rendering anything, so a fast scroll to the
  // footer finds ~5.6 MB already cached instead of waiting on it mid-scroll
  // (the "scroll to the bottom, then it loads" pop-in). Render still happens
  // only at the 1200px mount gate. The /models/* immutable cache header makes
  // drei's later useGLTF fetch reuse these warmed responses (one network hit).
  useEffect(() => {
    let warmed = false;
    const warm = () => {
      if (warmed) return;
      warmed = true;
      void import('./FooterScene');
      ['/models/astronaut.glb', '/models/icons.glb'].forEach((url) => {
        fetch(url, { priority: 'low' } as RequestInit).catch(() => {});
      });
    };
    const win = window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout?: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    let idle = 0;
    let timer = 0;
    if (win.requestIdleCallback) {
      idle = win.requestIdleCallback(warm, { timeout: 2500 });
    } else {
      timer = window.setTimeout(warm, 800);
    }
    return () => {
      if (idle && win.cancelIdleCallback) win.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <Shell ref={shellRef} data-nav-theme="dark">
      <ErrorBoundary fallback={null}>
        {shouldMount && (
          <Suspense fallback={null}>
            <FooterScene active={inView} />
          </Suspense>
        )}
      </ErrorBoundary>
      <DotField active={inView} />
      <Crosshair
        style={{ top: '16%', left: '12%' }}
        $size={16}
        $color="rgba(255,255,255,0.5)"
      />
      <Crosshair
        style={{ top: '20%', right: '14%' }}
        $size={16}
        $color="rgba(255,255,255,0.5)"
      />

      <Inner>
        <Reveal as="span">
          <Eyebrow>
            {isRu ? 'Есть идея, которая ждёт?' : 'Got a big idea waiting?'}
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <Title>
            {isRu ? 'Давайте' : "Let's work"}
            <br />
            {isRu ? 'поработаем!' : 'together!'}
          </Title>
        </Reveal>
        <Reveal delay={0.14}>
          <PillLink to="/brief" variant="light" arrow>
            {isRu ? 'Начать проект' : 'Start a project'}
          </PillLink>
        </Reveal>
      </Inner>
    </Shell>
  );
};

export default CtaFinale;
