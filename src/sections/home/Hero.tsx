import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import Crosshair from '../../components/ui/Crosshair';
import { flux } from '../../webgl/flux';

/**
 * Cinematic hero — a DOM layer over the persistent GlobalCanvas. The
 * black hole renders in WebGL behind. The wordmark is real, crisp type
 * (this DOM layer); on scroll it hands off to the WebGL particle system,
 * which disintegrates it and streams it into the hole.
 */

const Shell = styled.section`
  position: relative;
  height: 320vh;
  background: transparent;
  color: #fff;
`;

const Sticky = styled.div`
  position: sticky;
  top: 0;
  height: 100svh;
  min-height: 600px;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
`;

const Wordmark = styled(motion.h1)`
  position: absolute;
  left: 0;
  right: 0;
  /* Anchored to the bottom edge, Lusion-style — the word is the base of the
     frame, not a floating element. Small gap mirrors lusion.co. */
  bottom: clamp(12px, 2.8vh, 44px);
  margin: 0;
  text-align: center;
  pointer-events: none;
  z-index: 3;
  transform-origin: 50% 70%;
  will-change: transform, opacity, filter;

  .word {
    display: inline-block;
    font-family: var(--font-display);
    /* Semibold — Lusion's wordmark is mid-heavy, not black. PP Neue Montreal
       Extrabold (800) would read too chunky here. */
    font-weight: 600;
    /* Bigger + near full-bleed. Fine-tune the vw value once PP Neue Montreal
       loads — its metrics are narrower than the Schibsted fallback. */
    font-size: clamp(3.2rem, 18vw, 20rem);
    letter-spacing: -0.03em;
    /* line-height trimmed to ~cap-height so glyphs sit flush to the edge */
    line-height: 0.75;
    color: #fff;
    white-space: nowrap;
  }

  .ch {
    display: inline-block;
    will-change: transform, opacity;
  }
`;

const ScrollCue = styled(motion.div)`
  position: absolute;
  right: clamp(20px, 4vw, 56px);
  bottom: clamp(24px, 4vh, 48px);
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
    width: 30px;
    height: 1px;
    background: rgba(255, 255, 255, 0.25);
    overflow: hidden;
  }
  .track::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 40%;
    background: var(--cyan);
    animation: cueSlide 2.1s var(--ease-expo) infinite;
  }
  @keyframes cueSlide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(250%); }
  }
`;

const WORD = 'SINTARA';

const Hero = ({ ready }: { ready: boolean }) => {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const shellRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: shellRef,
    offset: ['start start', 'end end'],
  });

  const uiOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  // the wordmark holds, then drifts up toward the hole and fades
  const wordOpacity = useTransform(scrollYProgress, [0, 0.5, 0.82], [1, 1, 0]);
  const wordY = useTransform(scrollYProgress, [0, 0.42, 0.85], [0, 0, -210]);
  const wordScale = useTransform(scrollYProgress, [0, 0.42, 0.85], [1, 1, 1.16]);
  const wordBlur = useTransform(
    scrollYProgress,
    [0.5, 0.82],
    ['blur(0px)', 'blur(13px)'],
  );

  // Feed hero scroll progress + visibility into the WebGL layer.
  useEffect(() => {
    flux.heroVisible = true;
    const unsub = scrollYProgress.on('change', (v) => {
      flux.heroProgress = v;
      flux.heroVisible = v < 0.999;
    });
    return () => {
      unsub();
      flux.heroVisible = false;
    };
  }, [scrollYProgress]);

  useEffect(() => {
    flux.heroReady = ready;
    return () => {
      flux.heroReady = false;
    };
  }, [ready]);

  const isRu = language === 'ru';

  return (
    <Shell ref={shellRef} data-nav-theme="dark">
      <Sticky>
        <Overlay>
          <motion.div style={{ opacity: reduced ? 1 : uiOpacity }}>
            <Crosshair
              style={{ top: '24%', left: '14%' }}
              $size={14}
              $color="rgba(255,255,255,0.4)"
            />
            <Crosshair
              style={{ top: '34%', right: '11%' }}
              $size={16}
              $color="rgba(255,255,255,0.35)"
            />
            <Crosshair
              style={{ bottom: '34%', left: '22%' }}
              $size={12}
              $color="rgba(255,255,255,0.3)"
            />

            <ScrollCue
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {isRu ? 'Скролл' : 'Scroll'}
              <span className="track" />
            </ScrollCue>
          </motion.div>

          <Wordmark
            aria-label="Sintara"
            style={
              reduced
                ? { opacity: 1 }
                : {
                    opacity: wordOpacity,
                    y: wordY,
                    scale: wordScale,
                    filter: wordBlur,
                  }
            }
          >
            <span className="word" aria-hidden="true">
              {WORD.split('').map((c, i) => (
                <motion.span
                  className="ch"
                  key={i}
                  initial={reduced ? false : { y: '0.42em', opacity: 0 }}
                  animate={ready ? { y: 0, opacity: 1 } : {}}
                  transition={{
                    duration: 0.95,
                    delay: 0.3 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {c}
                </motion.span>
              ))}
            </span>
          </Wordmark>
        </Overlay>
      </Sticky>
    </Shell>
  );
};

export default Hero;
