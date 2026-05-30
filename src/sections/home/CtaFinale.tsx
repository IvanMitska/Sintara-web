import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';
import PillLink from '../../components/ui/PillLink';
import Reveal from '../../components/ui/Reveal';
import Crosshair from '../../components/ui/Crosshair';
import ErrorBoundary from '../../components/ErrorBoundary';
import FooterScene from './FooterScene';

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

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Shell ref={shellRef} data-nav-theme="dark">
      <ErrorBoundary fallback={null}>
        <FooterScene active={inView} />
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
