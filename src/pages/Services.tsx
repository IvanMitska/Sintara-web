import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import PillLink from '../components/ui/PillLink';
import Reveal from '../components/ui/Reveal';
import Crosshair from '../components/ui/Crosshair';
import { useLanguage } from '../context/LanguageContext';

/**
 * Services — cinematic capabilities page. A frame-filling dark hero, a
 * light run of numbered service rows that flood with electric accent on
 * hover (siblings dim into a spotlight), and a dark closing CTA.
 */

// ─── Hero ─────────────────────────────────────────────────────────────

const Hero = styled.header`
  position: relative;
  /* Same textured bookend treatment as the Work page hero — keeps the
     two top-level inner pages visually parented. Layers:
       1. dark gradient (top) — darkens the photo so the white headline
          stays readable
       2. hero-bg.webp (middle) — magenta/crimson painterly splash from
          /public/services (sibling to /work in style, but on the
          violet→magenta side of the brand palette)
       3. solid --ink (bottom fallback) */
  background:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.28) 0%,
      rgba(0, 0, 0, 0.38) 55%,
      rgba(0, 0, 0, 0.58) 100%
    ),
    url('/services/hero-bg.webp') center / cover no-repeat,
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
      url('/services/hero-bg.webp') center / cover no-repeat,
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
  line-height: 0.84;
  letter-spacing: -0.04em;
  margin: 0;

  .line {
    display: block;
    overflow: hidden;
    /* The mask box is tighter than the glyphs at line-height 0.84, so
       descenders (g, y, p, the period) get sliced. Pad the clip box for
       descenders; a small negative margin keeps lines tight but leaves a
       little breathing room so stacked lines don't visually merge. */
    padding-bottom: 0.26em;
    margin-bottom: -0.12em;
  }
  .line > span {
    display: inline-block;
    will-change: transform;
  }
  /* With the textured background, all-white reads cleaner — the photo
     carries the colour. The class stays on the markup so a colour accent
     can be reintroduced later without touching the JSX. */
`;

const HeroFoot = styled(HeroBand)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  flex-wrap: wrap;

  p {
    max-width: 460px;
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

// ─── Service list ─────────────────────────────────────────────────────

const ListShell = styled.section`
  background: var(--paper);
  color: var(--ink);
  padding: clamp(72px, 11vh, 152px) clamp(20px, 5vw, 80px);
`;

const ListInner = styled.div`
  max-width: 1560px;
  margin: 0 auto;
`;

const ListHead = styled.div`
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

/* Hovering one row spotlights it — the rest fade back. */
const Rows = styled.div`
  border-top: 1px solid var(--bone-line);

  &:hover a:not(:hover) {
    opacity: 0.42;
  }
`;

const Row = styled(Link)`
  position: relative;
  display: grid;
  grid-template-columns:
    clamp(40px, 4vw, 72px) minmax(0, 1.5fr)
    minmax(0, 1fr) auto clamp(0px, 4vw, 76px);
  align-items: center;
  gap: clamp(14px, 2.4vw, 48px);
  padding: clamp(24px, 3.6vh, 46px) clamp(16px, 2.4vw, 40px);
  border-bottom: 1px solid var(--bone-line);
  color: var(--ink);
  scroll-margin-top: 110px;
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
    font-size: clamp(2rem, 4.6vw, 4.25rem);
    line-height: 0.98;
    letter-spacing: -0.035em;
    color: var(--ink);
    transition:
      color 0.4s var(--ease-snap),
      transform 0.55s var(--ease-expo);
  }

  .desc {
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--muted);
    max-width: 40ch;
    transition: color 0.4s var(--ease-snap);
  }

  .quote {
    justify-self: end;
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    white-space: nowrap;
    color: var(--muted);
    transition: color 0.4s var(--ease-snap);
  }

  .go {
    justify-self: end;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 1px solid var(--bone-line);
    display: grid;
    place-items: center;
    font-size: 1.125rem;
    color: var(--ink);
    opacity: 0;
    transform: scale(0.6) rotate(-12deg);
    transition:
      opacity 0.3s var(--ease-snap),
      transform 0.5s var(--ease-expo),
      background 0.4s var(--ease-snap),
      border-color 0.4s var(--ease-snap),
      color 0.4s var(--ease-snap);
  }

  /* Home-style hover: the name slides + ignites to accent, the meta turns
     accent, and the circular arrow snaps in — no full-block fill. */
  &:hover .name {
    color: var(--accent);
    transform: translateX(clamp(8px, 1.4vw, 26px));
  }
  &:hover .num,
  &:hover .quote {
    color: var(--accent);
  }
  &:hover .desc {
    color: var(--ink);
  }
  &:hover .go {
    opacity: 1;
    transform: scale(1) rotate(0deg);
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }

  @media (max-width: 1040px) {
    grid-template-columns: clamp(30px, 8vw, 48px) 1fr;
    gap: 6px 18px;
    padding: 30px 16px;

    .desc {
      grid-column: 2 / -1;
      margin-top: 8px;
    }
    .quote {
      grid-column: 2 / -1;
      justify-self: start;
      margin-top: 14px;
    }
    .go {
      display: none;
    }
    &:hover .name {
      transform: none;
    }
  }
`;

// ─── Closing CTA ──────────────────────────────────────────────────────

const CtaShell = styled.section`
  position: relative;
  /* Symmetric textured closer — mirrors the warm hero with a cool splash
     to give the page bookended visual rhythm (same pattern as Work).
       1. radial darkening (top) — crushes the corners, lifts the centre
          so the white headline + pill sit in a halo
       2. cta-bg.webp (middle) — indigo/cyan painterly splash from
          /public/services (sibling to /work in style, but on the
          violet→indigo side of the brand palette)
       3. solid --ink (bottom fallback) */
  background:
    radial-gradient(
      ellipse at 50% 45%,
      rgba(0, 0, 0, 0.42) 0%,
      rgba(0, 0, 0, 0.62) 55%,
      rgba(0, 0, 0, 0.82) 100%
    ),
    url('/services/cta-bg.webp') center / cover no-repeat,
    var(--ink);
  color: #fff;
  overflow: hidden;
  /* Near-symmetric vertical padding with a slight bottom bias so the
     fade tail extends past the headline (same proportions as Work). */
  padding: clamp(180px, 26vh, 320px) clamp(20px, 5vw, 80px)
    clamp(200px, 30vh, 380px);
  text-align: center;

  /* Soft fade-to-ink along the bottom edge so the seam into the global
     Footer (solid var(--ink)) dissolves instead of cutting hard. */
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
     around the bright centre. */
  @media (max-width: 860px) {
    background:
      radial-gradient(
        ellipse at 50% 45%,
        rgba(0, 0, 0, 0.65) 0%,
        rgba(0, 0, 0, 0.82) 100%
      ),
      url('/services/cta-bg.webp') center / cover no-repeat,
      var(--ink);
  }
`;

const CtaInner = styled.div`
  /* Lifted above the bottom fade-to-ink overlay (CtaShell::after at
     z-index 1) so headline and pill stay fully visible on short
     viewports where the button might drift into the fade zone. */
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

const services = [
  { n: '01', nameKey: 'home.services.1.title', descKey: 'home.services.1.desc', id: 'web' },
  { n: '02', nameKey: 'home.services.2.title', descKey: 'home.services.2.desc', id: 'webapp' },
  { n: '03', nameKey: 'home.services.3.title', descKey: 'home.services.3.desc', id: 'bot' },
  { n: '04', nameKey: 'home.services.4.title', descKey: 'home.services.4.desc', id: 'crm' },
  { n: '05', nameKey: 'home.services.5.title', descKey: 'home.services.5.desc', id: 'redesign' },
  { n: '06', nameKey: 'home.services.6.title', descKey: 'home.services.6.desc', id: 'support' },
];

const Services = () => {
  const { t, language } = useLanguage();
  const reduced = useReducedMotion();
  const isRu = language === 'ru';

  const titleLines = [t('services.page.title1'), t('services.page.title2')];

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
            <Tag>{t('services.page.eyebrow')}</Tag>
          </Reveal>
          <Reveal as="span" delay={0.06}>
            <Tag className="right">
              {isRu ? 'Студия Sintara' : 'Sintara Studio'}
            </Tag>
          </Reveal>
        </HeroTop>

        <HeroBand>
          <HeroTitle>
            {titleLines.map((line, i) => (
              <span className={`line${i === 1 ? ' accent' : ''}`} key={line}>
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
            {t('services.page.sub')}
          </Reveal>
          <Reveal as="span" delay={0.26}>
            <span className="marker">
              {String(services.length).padStart(2, '0')} —{' '}
              {isRu ? 'Направлений' : 'Capabilities'}
            </span>
          </Reveal>
        </HeroFoot>
      </Hero>

      <ListShell data-nav-theme="light">
        <ListInner>
          <ListHead>
            <div>
              <Reveal as="span" className="eyebrow">
                {isRu ? 'Услуги' : 'Services'}
              </Reveal>
              <Reveal as="h2" delay={0.05}>
                {isRu ? 'Что мы делаем' : 'What we build'}
              </Reveal>
            </div>
            <Reveal as="p" delay={0.1}>
              {isRu
                ? 'Выберите направление и заполните короткий бриф — вернёмся с понятным планом и сметой.'
                : 'Pick a direction and start a short brief — we’ll come back with a clear plan and quote.'}
            </Reveal>
          </ListHead>

          <Rows>
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.05}>
                <Row id={s.id} to="/brief" data-cursor="hover">
                  <span className="num">{s.n}</span>
                  <span className="name">{t(s.nameKey)}</span>
                  <span className="desc">{t(s.descKey)}</span>
                  <span className="quote">
                    {isRu ? 'Рассчитать' : 'Get a quote'}
                  </span>
                  <span className="go" aria-hidden>
                    ↗
                  </span>
                </Row>
              </Reveal>
            ))}
          </Rows>
        </ListInner>
      </ListShell>

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
            {isRu ? 'Расскажите о проекте' : 'Tell us what’s next'}
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

export default Services;
