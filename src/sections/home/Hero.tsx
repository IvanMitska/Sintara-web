import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import Crosshair from '../../components/ui/Crosshair';
import { flux } from '../../webgl/flux';

/**
 * Hero — a single 100vh frame. The background is a looped <video> sat
 * full-bleed inside the section; the DOM frame above it owns the type:
 * a multi-line centered headline anchored by small UI vignettes in the
 * corners (top-left eyebrow, bottom-left meta block, bottom-right
 * scroll cue).
 *
 * Asset is loaded from /public/home/hero-loop.mp4 (+ optional .webm).
 * A poster image (hero-poster.jpg) shows instantly while the video
 * downloads; if neither file exists yet, the dark fallback Shell
 * background still reads as intentional.
 */

const HERO_VIDEO_MP4 = '/home/hero-loop.mp4';
const HERO_VIDEO_WEBM = '/home/hero-loop.webm';
const HERO_POSTER = '/home/hero-poster.jpg';

const Shell = styled.section`
  position: relative;
  height: 100svh;
  min-height: 640px;
  width: 100%;
  /* Solid dark fallback so the frame reads even before the video paints
     (or if no asset has been dropped in yet). Matches CrystalScene's bg. */
  background: #08060f;
  color: #fff;
  overflow: hidden;
`;

const VideoBg = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  /* Tonal grading layer (below) handles colour-correction; we let the
     video sit raw so the source palette is preserved. */
  pointer-events: none;
`;

const Tint = styled.div`
  /* No more "rectangle behind the title" — that read as a CSS plate, not
     a design choice. Two clean layers:
     1. Vertical edge vignette so the NavBar / meta corners always have
        a quiet ground.
     2. Light global darken (~22%) so the wordmark, which sits on its
        own with only a text-shadow halo, stays anchored.
     The wordmark itself owns its legibility via stacked text-shadow. */
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(
      180deg,
      rgba(8, 6, 15, 0.6) 0%,
      rgba(8, 6, 15, 0) 18%,
      rgba(8, 6, 15, 0) 80%,
      rgba(8, 6, 15, 0.65) 100%
    ),
    rgba(8, 6, 15, 0.3);
`;

const Frame = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  /* breathing room from viewport edges; matches the navbar padding */
  padding: clamp(18px, 4vh, 56px) clamp(20px, 4vw, 56px);
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr 1fr;
`;

// ── top-left tagline ───────────────────────────────────────────────────
const Eyebrow = styled(motion.div)`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  align-self: start;
  /* nudge down a touch — the navbar already lives at the very top */
  margin-top: clamp(36px, 6vh, 64px);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.66);
  max-width: 22ch;
  line-height: 1.5;

  .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 10px;
    border-radius: 50%;
    background: var(--accent-bright);
    vertical-align: 1px;
    /* gentle pulse — signals the page is live */
    animation: heroPulse 2.4s ease-in-out infinite;
  }
  @keyframes heroPulse {
    0%, 100% { opacity: 0.55; transform: scale(1); }
    50%      { opacity: 1;    transform: scale(1.25); }
  }
`;

// ── center wordmark — single editorial line ─────────────────────────────
const Title = styled(motion.h1)`
  grid-column: 1 / -1;
  grid-row: 2 / 3;
  align-self: center;
  justify-self: center;
  margin: 0;
  padding: 0;
  text-align: center;
  font-family: var(--font-display);
  /* Semibold — sits between fashion-bold and editorial-light, reads as
     a confident wordmark without screaming. */
  font-weight: 600;
  /* Bigger than a paragraph headline, but still single-line at all
     widths so the moon/asteroids stay readable around it. */
  font-size: clamp(3rem, 11vw, 11rem);
  letter-spacing: -0.035em;
  line-height: 0.95;
  color: #fff;
  white-space: nowrap;
  /* No shadow at all — clean type, lives on the video honestly. The
     <Tint> layer below provides any needed contrast. If a bright moment
     ever washes the wordmark out, raise the global Tint darken; do not
     bring back a soft text-shadow (always reads as a smudged plate). */
  text-shadow: none;

  /* Phones: stack the two words and go large. A single line maxed out near
     edge-to-edge; stacking lets each word breathe and read as a poster, which
     suits the narrow viewport. Desktop keeps the single editorial line. */
  @media (max-width: 600px) {
    font-size: clamp(3.6rem, 20vw, 5.6rem);
    line-height: 0.9;
    white-space: normal;

    .wm {
      display: block;
    }
    .wm + .wm {
      margin-left: 0;
    }
  }

  .wm {
    display: inline-block;
    overflow: hidden;
    /* Negative letter-spacing trims trailing space from the inline box,
       which then makes overflow:hidden clip the right ink-extent of the
       last glyph — round letters like "a" / "o" lose their right edge.
       Compensate with padding-right; the rise-mask still works because
       overflow:hidden clips at the padding box (content + padding). */
    padding-right: 0.08em;
    /* word gap = padding-right + margin-left, kept around 0.28em total */
    & + .wm { margin-left: 0.2em; }
  }
  .ch {
    display: inline-block;
    /* No explicit will-change — framer-motion adds it for the duration
       of the entrance animation and removes it after. A CSS will-change
       here would keep 13 GPU compositor layers alive forever. */
  }
`;

// ── bottom-left meta ───────────────────────────────────────────────────
const Meta = styled(motion.div)`
  grid-column: 1 / 2;
  grid-row: 3 / 4;
  align-self: end;
  display: flex;
  align-items: flex-end;
  gap: 18px;
  max-width: 380px;
  color: rgba(255, 255, 255, 0.7);

  .index {
    flex: 0 0 auto;
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 50%;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.8125rem;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.04em;
  }
  .stack {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .label {
    font-size: 0.625rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
  }
  .body {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.78);
    max-width: 30ch;
  }
`;

// ── bottom-right scroll cue ────────────────────────────────────────────
const ScrollCue = styled(motion.div)`
  grid-column: 2 / 3;
  grid-row: 3 / 4;
  align-self: end;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);

  .track {
    position: relative;
    width: 36px;
    height: 1px;
    background: rgba(255, 255, 255, 0.22);
    overflow: hidden;
  }
  .track::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 40%;
    background: var(--accent-bright);
    animation: cueSlide 2.1s var(--ease-expo) infinite;
  }
  @keyframes cueSlide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(250%); }
  }
`;

// ── reveal animation ───────────────────────────────────────────────────
// Each character of the wordmark rises from below, staggered. Masked
// by `.wm`'s overflow:hidden so glyphs reveal cleanly without ghosting.
const charVariants = {
  hidden: { y: '110%' },
  show: (i: number) => ({
    y: '0%',
    transition: {
      duration: 0.95,
      delay: 0.35 + i * 0.045,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const Hero = ({ ready }: { ready: boolean }) => {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const shellRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Tell GlobalCanvas when the hero is on-screen so it can freeze the
  // WebGL render loop once we scroll past. With no long sticky, we use a
  // simple IntersectionObserver instead of scrollYProgress.
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    flux.heroVisible = true;
    let prev = true;
    const emit = (visible: boolean) => {
      if (visible === prev) return;
      prev = visible;
      flux.heroVisible = visible;
      // Pause the hero video once it scrolls out of view — otherwise the
      // decoder keeps burning GPU/CPU (notably on mobile) during the rest of
      // the page scroll. Resume on return.
      const v = videoRef.current;
      if (v) {
        if (visible) v.play().catch(() => {});
        else v.pause();
      }
      window.dispatchEvent(
        new CustomEvent('hero:visibility', { detail: visible }),
      );
    };
    const io = new IntersectionObserver(
      (entries) => emit(entries[0].isIntersecting),
      { threshold: 0.02 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      emit(false);
    };
  }, []);

  useEffect(() => {
    flux.heroReady = ready;
    return () => {
      flux.heroReady = false;
    };
  }, [ready]);

  // Wordmark is the brand mark — same in EN and RU. Two words so the
  // overflow mask can lift each one as a self-contained unit; each
  // character animates independently inside.
  const wordmark: [string, string] = ['Sintara', 'Studio'];
  const ariaLabel = wordmark.join(' ');

  return (
    <Shell ref={shellRef} data-nav-theme="dark">
      <VideoBg
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO_POSTER}
        aria-hidden="true"
      >
        {/* WebM first — Chrome/Firefox pick it (smaller); Safari falls
            back to MP4. Browsers ignore unknown <source>s, so missing
            files are silently skipped. */}
        <source src={HERO_VIDEO_WEBM} type="video/webm" />
        <source src={HERO_VIDEO_MP4} type="video/mp4" />
      </VideoBg>
      <Tint />
      <Frame>
        {/* decorative crosshairs — quiet scatter in the dead corners */}
        <Crosshair
          style={{ top: '24%', left: '8%' }}
          $size={12}
          $color="rgba(255,255,255,0.32)"
        />
        <Crosshair
          style={{ top: '30%', right: '9%' }}
          $size={14}
          $color="rgba(255,255,255,0.28)"
        />
        <Crosshair
          style={{ bottom: '38%', right: '14%' }}
          $size={10}
          $color="rgba(255,255,255,0.24)"
        />

        <Eyebrow
          initial={reduced ? false : 'hidden'}
          animate={ready ? 'show' : 'hidden'}
          variants={fadeIn}
          custom={0.15}
        >
          <span className="dot" />
          {t('home.hero.eyebrow')}
        </Eyebrow>

        <Title aria-label={ariaLabel}>
          {wordmark.map((word, wi) => {
            // continue the character index across words so the stagger
            // flows through the whole wordmark rather than restarting
            const charOffset = wi === 0 ? 0 : wordmark[0].length;
            return (
              <span className="wm" key={wi} aria-hidden="true">
                {word.split('').map((c, ci) => (
                  <motion.span
                    className="ch"
                    key={ci}
                    custom={charOffset + ci}
                    initial={reduced ? false : 'hidden'}
                    animate={ready ? 'show' : 'hidden'}
                    variants={charVariants}
                  >
                    {c}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </Title>

        <Meta
          initial={reduced ? false : 'hidden'}
          animate={ready ? 'show' : 'hidden'}
          variants={fadeIn}
          custom={0.85}
        >
          <span className="index">{t('home.hero.metaIndex')}</span>
          <div className="stack">
            <span className="label">{t('home.hero.metaLabel')}</span>
            <p className="body">{t('home.hero.metaBody')}</p>
          </div>
        </Meta>

        <ScrollCue
          initial={reduced ? false : 'hidden'}
          animate={ready ? 'show' : 'hidden'}
          variants={fadeIn}
          custom={0.95}
        >
          {t('home.hero.scroll')}
          <span className="track" />
        </ScrollCue>
      </Frame>
    </Shell>
  );
};

export default Hero;
