import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import PillLink from '../components/ui/PillLink';
import Reveal from '../components/ui/Reveal';
import Crosshair from '../components/ui/Crosshair';
import { useLanguage } from '../context/LanguageContext';

/**
 * About — the studio voice page. Same dark→light→dark rhythm as Work
 * and Services so the three inner pages read as siblings. About gets
 * its own textured bookends in a copper→teal palette — the third
 * panel of the triptych alongside Work (crimson→green) and Services
 * (magenta→indigo). The middle holds two editorial story blocks and a
 * numbered list of operating principles (Services-style row spotlight).
 */

// ─── Hero ─────────────────────────────────────────────────────────────

const Hero = styled.header`
  position: relative;
  /* Textured opener — copper/ember painterly splash from /public/about,
     the warm side of the About bookend pair (third panel of the inner
     pages triptych). Layers:
       1. dark gradient (top) — keeps the white headline readable
       2. hero-bg.webp (middle) — copper splash with dark vignette and
          a warm halo near the upper-third
       3. solid --ink (bottom fallback) */
  background:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.28) 0%,
      rgba(0, 0, 0, 0.38) 55%,
      rgba(0, 0, 0, 0.58) 100%
    ),
    url('/about/hero-bg.webp') center / cover no-repeat,
    var(--ink);
  color: #fff;
  overflow: hidden;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(116px, 15vh, 172px) clamp(20px, 5vw, 80px)
    clamp(40px, 6vh, 80px);

  /* Mobile: heavier overlay — the giant title fights a busy texture
     more on a narrow viewport. */
  @media (max-width: 860px) {
    background:
      linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.5) 0%,
        rgba(0, 0, 0, 0.68) 100%
      ),
      url('/about/hero-bg.webp') center / cover no-repeat,
      var(--ink);
  }
`;

const HeroBand = styled.div`
  width: 100%;
  max-width: 1560px;
  margin: 0 auto;
`;

const HeroTop = styled(HeroBand)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent-bright);

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-bright);
  }

  &.right {
    color: var(--muted-dark);
    &::before {
      display: none;
    }
  }
`;

const HeroTitle = styled.h1`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(3.5rem, 13.2vw, 16.5rem);
  /* Phones: the 3.5rem clamp floor made the hero read small. Scale up with the
     viewport on mobile — the floor still protects the narrowest phones (~≤330px)
     where the longest title line would otherwise wrap. Desktop curve unchanged. */
  @media (max-width: 600px) {
    font-size: clamp(3.5rem, 18.5vw, 16.5rem);
  }
  line-height: 0.84;
  letter-spacing: -0.04em;
  margin: 0;

  .line {
    display: block;
    overflow: hidden;
    /* Pad the clip box for descenders at line-height 0.84; a small
       negative margin keeps lines tight without merging them. */
    padding-bottom: 0.26em;
    margin-bottom: -0.12em;
  }
  .line > span {
    display: inline-block;
    will-change: transform;
  }
`;

const HeroFoot = styled(HeroBand)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  flex-wrap: wrap;

  p {
    max-width: 540px;
    font-size: clamp(1.0625rem, 1.2vw, 1.3125rem);
    line-height: 1.5;
    color: var(--muted-dark);
  }

  .marker {
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent-bright);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
`;

// ─── Story (Why we exist / How we think) ──────────────────────────────

const StoryShell = styled.section`
  background: var(--paper);
  color: var(--ink);
  padding: clamp(72px, 11vh, 152px) clamp(20px, 5vw, 80px);
`;

const StoryInner = styled.div`
  max-width: 1560px;
  margin: 0 auto;
`;

const StoryBlock = styled(motion.article)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2.4fr);
  gap: clamp(24px, 4vw, 88px);
  padding: clamp(48px, 7vh, 88px) 0;
  border-top: 1px solid var(--bone-line);

  &:last-child {
    border-bottom: 1px solid var(--bone-line);
  }

  .title {
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    padding-top: 16px;
  }

  .body {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.5rem, 2.6vw, 2.5rem);
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: var(--ink);
    max-width: 22ch;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 40px 0;

    .body {
      max-width: 100%;
    }
  }
`;

// ─── Principles (numbered row list, Services-style spotlight) ─────────

const PrinciplesShell = styled.section`
  background: var(--paper);
  color: var(--ink);
  padding: 0 clamp(20px, 5vw, 80px) clamp(72px, 11vh, 152px);
`;

const PrinciplesInner = styled.div`
  max-width: 1560px;
  margin: 0 auto;
`;

const PrinciplesHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  flex-wrap: wrap;
  margin-bottom: clamp(28px, 4.5vh, 56px);

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--accent);

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
    }
  }

  h2 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.25rem, 5vw, 4.5rem);
    line-height: 0.98;
    letter-spacing: -0.03em;
    margin-top: 14px;
  }

  p {
    max-width: 340px;
    font-size: 0.9375rem;
    line-height: 1.55;
    color: var(--muted);
  }
`;

/* Hovering one row spotlights it — the rest fade back, same pattern
   as the Services capabilities list. */
const Rows = styled.div`
  border-top: 1px solid var(--bone-line);

  &:hover > div:not(:hover) {
    opacity: 0.42;
  }
`;

const Row = styled.div`
  position: relative;
  display: grid;
  grid-template-columns:
    clamp(40px, 4vw, 72px) minmax(0, 1.5fr)
    minmax(0, 1fr);
  align-items: center;
  gap: clamp(14px, 2.4vw, 48px);
  padding: clamp(24px, 3.6vh, 46px) clamp(16px, 2.4vw, 40px);
  border-bottom: 1px solid var(--bone-line);
  transition: opacity 0.45s var(--ease-snap);

  .num {
    font-family: var(--font-grotesk);
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
    transition: color 0.4s var(--ease-snap);
  }

  .name {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: clamp(1.5rem, 3.4vw, 3rem);
    line-height: 1.02;
    letter-spacing: -0.035em;
    color: var(--ink);
    /* Same layer-pinning trick used on the Services rows so the colour
       transition on hover doesn't promote/repaint the layer. */
    transform: translate3d(0, 0, 0);
    will-change: transform;
    backface-visibility: hidden;
    transition: color 0.4s var(--ease-snap);
  }

  .desc {
    font-size: 0.9375rem;
    line-height: 1.55;
    color: var(--muted);
    max-width: 46ch;
    transition: color 0.4s var(--ease-snap);
  }

  &:hover .num,
  &:hover .name {
    color: var(--accent);
  }
  &:hover .desc {
    color: var(--ink);
  }

  @media (max-width: 1040px) {
    grid-template-columns: clamp(30px, 8vw, 48px) 1fr;
    gap: 6px 18px;
    padding: 30px 16px;

    .desc {
      grid-column: 2 / -1;
      margin-top: 10px;
    }
  }
`;

// ─── Closing CTA ──────────────────────────────────────────────────────

const CtaShell = styled.section`
  position: relative;
  /* Textured closer — teal/forest painterly splash from /public/about,
     the cool side of the About bookend pair. Mirrors the warm hero so
     the page reads as a bookended pair.
       1. radial darkening (top) — crushes the corners, lifts the
          centre so the headline + pill sit in a halo
       2. cta-bg.webp (middle) — teal splash with cool halo
       3. solid --ink (bottom fallback) */
  background:
    radial-gradient(
      ellipse at 50% 45%,
      rgba(0, 0, 0, 0.42) 0%,
      rgba(0, 0, 0, 0.62) 55%,
      rgba(0, 0, 0, 0.82) 100%
    ),
    url('/about/cta-bg.webp') center / cover no-repeat,
    var(--ink);
  color: #fff;
  overflow: hidden;
  /* Near-symmetric vertical padding with Work/Services so the closing
     pill sits in roughly the same vertical spot across all three
     inner pages, with a slight bottom bias for the fade tail. */
  padding: clamp(180px, 26vh, 320px) clamp(20px, 5vw, 80px)
    clamp(200px, 30vh, 380px);
  text-align: center;

  /* Soft fade-to-ink along the bottom edge so the seam into the global
     Footer (solid var(--ink)) dissolves instead of cutting hard. Same
     pattern as Work/Services CTA. */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: clamp(220px, 30vh, 380px);
    background: linear-gradient(
      to bottom,
      rgba(8, 6, 18, 0) 0%,
      rgba(8, 6, 18, 0.45) 45%,
      var(--ink) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  /* Mobile: heavier darkening — narrow viewport compresses readability
     around the bright halo. */
  @media (max-width: 860px) {
    background:
      radial-gradient(
        ellipse at 50% 45%,
        rgba(0, 0, 0, 0.65) 0%,
        rgba(0, 0, 0, 0.82) 100%
      ),
      url('/about/cta-bg.webp') center / cover no-repeat,
      var(--ink);
  }
`;

const CtaInner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(28px, 5vh, 56px);

  .eyebrow {
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--accent-bright);
  }

  h2 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.75rem, 8.5vw, 9rem);
    line-height: 0.92;
    letter-spacing: -0.03em;
  }
`;

// ─── Component ────────────────────────────────────────────────────────

const principles = [1, 2, 3, 4] as const;

const About = () => {
  const { t, language } = useLanguage();
  const reduced = useReducedMotion();
  const isRu = language === 'ru';

  const titleLines = [t('about.title1'), t('about.title2')];

  return (
    <>
      <NavBar />

      <Hero data-surface="dark" data-nav-theme="dark">
        <Crosshair
          style={{ top: '24%', right: '8%' }}
          $size={16}
          $color="rgba(255,255,255,0.34)"
        />
        <Crosshair
          style={{ bottom: '28%', left: '5%' }}
          $size={13}
          $color="rgba(255,255,255,0.22)"
        />

        <HeroTop>
          <Reveal as="span">
            <Tag>{t('about.eyebrow')}</Tag>
          </Reveal>
          <Reveal as="span" delay={0.06}>
            <Tag className="right">
              {isRu ? 'Основано в 2026' : 'Est. 2026'}
            </Tag>
          </Reveal>
        </HeroTop>

        <HeroBand>
          <HeroTitle>
            {titleLines.map((line, i) => (
              <span className="line" key={line}>
                <motion.span
                  initial={reduced ? false : { y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1,
                    delay: 0.15 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </HeroTitle>
        </HeroBand>

        <HeroFoot>
          <Reveal as="p" delay={0.2}>
            {t('about.lead')}
          </Reveal>
          <Reveal as="span" delay={0.26}>
            <span className="marker">
              {isRu ? '01 — Студия' : '01 — The studio'}
            </span>
          </Reveal>
        </HeroFoot>
      </Hero>

      <StoryShell data-nav-theme="light">
        <StoryInner>
          <StoryBlock
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="title">{t('about.block1.title')}</span>
            <p className="body">{t('about.block1.body')}</p>
          </StoryBlock>
          <StoryBlock
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="title">{t('about.block2.title')}</span>
            <p className="body">{t('about.block2.body')}</p>
          </StoryBlock>
        </StoryInner>
      </StoryShell>

      <PrinciplesShell data-nav-theme="light">
        <PrinciplesInner>
          <PrinciplesHead>
            <div>
              <Reveal as="span" className="eyebrow">
                {t('about.principles.eyebrow')}
              </Reveal>
              <Reveal as="h2" delay={0.05}>
                {t('about.principles.title')}
              </Reveal>
            </div>
            <Reveal as="p" delay={0.1}>
              {isRu
                ? 'Четыре простых правила, которые избавляют клиента от типичных рисков работы со студией.'
                : 'Four simple rules that take the usual agency risks off the table.'}
            </Reveal>
          </PrinciplesHead>

          <Rows>
            {principles.map((n, i) => (
              <Reveal key={n} delay={i * 0.05}>
                <Row data-cursor="hover">
                  <span className="num">0{n}</span>
                  <span className="name">{t(`about.principles.${n}.t`)}</span>
                  <span className="desc">{t(`about.principles.${n}.d`)}</span>
                </Row>
              </Reveal>
            ))}
          </Rows>
        </PrinciplesInner>
      </PrinciplesShell>

      <CtaShell data-surface="dark" data-nav-theme="dark">
        <Crosshair
          style={{ top: '22%', left: '12%' }}
          $size={15}
          $color="rgba(255,255,255,0.3)"
        />
        <Crosshair
          style={{ bottom: '20%', right: '14%' }}
          $size={15}
          $color="rgba(255,255,255,0.3)"
        />
        <CtaInner>
          <Reveal as="span" className="eyebrow">
            {isRu ? 'Готовы начать?' : 'Ready to start?'}
          </Reveal>
          <Reveal as="h2" delay={0.05}>
            {isRu ? 'Давайте поработаем' : 'Let’s work together'}
          </Reveal>
          <Reveal delay={0.12}>
            <PillLink to="/brief" variant="light" arrow>
              {t('nav.getStarted')}
            </PillLink>
          </Reveal>
        </CtaInner>
      </CtaShell>

      <Footer />
    </>
  );
};

export default About;
