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
 * Contact — the action page. Same dark→light→dark rhythm as the other
 * inner pages so the bookends read as siblings. The bookends here use
 * a wine→navy palette built around the brand violet: it's the most
 * "brand-statement" pair of the four inner pages, fitting because
 * Contact is the conversion moment.
 */

// ─── Hero ─────────────────────────────────────────────────────────────

const Hero = styled.header`
  position: relative;
  /* Textured opener — wine/violet painterly splash from /public/contact,
     the warm (brand-led) side of the Contact bookend pair. Layers:
       1. dark gradient (top) — keeps the white headline readable
       2. hero-bg.webp (middle) — wine splash with hot violet halo
       3. solid --ink (bottom fallback) */
  background:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.28) 0%,
      rgba(0, 0, 0, 0.38) 55%,
      rgba(0, 0, 0, 0.58) 100%
    ),
    url('/contact/hero-bg.webp') center / cover no-repeat,
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
      url('/contact/hero-bg.webp') center / cover no-repeat,
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

// ─── Actions (brief card + channels) ──────────────────────────────────

const ActionsShell = styled.section`
  background: var(--paper);
  color: var(--ink);
  padding: clamp(72px, 11vh, 152px) clamp(20px, 5vw, 80px);
`;

const ActionsInner = styled.div`
  max-width: 1560px;
  margin: 0 auto;
`;

const ActionsHead = styled.div`
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

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 56px);

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

/* Primary action — big magnetic dark panel that opens the brief. The
   arrow grows + nudges on hover, no background colour swap (cleaner). */
const BriefCard = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: clamp(380px, 50vh, 560px);
  padding: clamp(32px, 4.4vw, 64px);
  border-radius: 24px;
  background: var(--ink);
  color: #fff;
  overflow: hidden;
  transition: transform 0.7s var(--ease-expo);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 80% 20%,
      rgba(124, 58, 237, 0.22) 0%,
      transparent 55%
    );
    opacity: 0;
    transition: opacity 0.6s var(--ease-snap);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
  }
  &:hover::before {
    opacity: 1;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);

    .num {
      color: var(--accent-bright);
    }
  }

  .title {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.5rem, 5.6vw, 5rem);
    line-height: 0.96;
    letter-spacing: -0.035em;
    margin-top: clamp(36px, 6vh, 64px);
  }

  .foot {
    margin-top: clamp(28px, 4.4vh, 48px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .detail {
    font-family: var(--font-grotesk);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
  }

  .arrow {
    flex: none;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #fff;
    color: var(--ink);
    display: grid;
    place-items: center;
    font-size: 1.5rem;
    transition:
      transform 0.55s var(--ease-expo),
      background 0.35s var(--ease-snap),
      color 0.35s var(--ease-snap);
  }

  &:hover .arrow {
    transform: translate(6px, -6px) scale(1.08) rotate(-8deg);
    background: var(--accent);
    color: #fff;
  }
`;

/* Channels — vertical list with Services-style spotlight: hovered row
   stays full opacity, siblings dim back. */
const Channels = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChannelsHead = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 18px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--muted);
  }
`;

const ChannelList = styled.div`
  border-top: 1px solid var(--bone-line);

  &:hover a:not(:hover) {
    opacity: 0.42;
  }
`;

const ChannelRow = styled.a`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 24px;
  padding: clamp(22px, 3vh, 34px) 4px;
  border-bottom: 1px solid var(--bone-line);
  color: var(--ink);
  transition: opacity 0.45s var(--ease-snap);

  .info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  .name {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: clamp(1.5rem, 2.6vw, 2.25rem);
    line-height: 1.04;
    letter-spacing: -0.03em;
    color: var(--ink);
    transform: translate3d(0, 0, 0);
    will-change: transform;
    backface-visibility: hidden;
    transition:
      color 0.4s var(--ease-snap),
      transform 0.55s var(--ease-expo);
  }

  .meta {
    font-family: var(--font-grotesk);
    font-size: 0.8125rem;
    line-height: 1.45;
    color: var(--muted);
  }

  .handle {
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 2px;
  }

  .arrow {
    flex: none;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 1px solid var(--bone-line);
    display: grid;
    place-items: center;
    font-size: 0.9375rem;
    color: var(--ink);
    transition:
      transform 0.55s var(--ease-expo),
      background 0.35s var(--ease-snap),
      border-color 0.35s var(--ease-snap),
      color 0.35s var(--ease-snap);
  }

  &:hover .name {
    color: var(--accent);
    transform: translate3d(clamp(6px, 0.8vw, 14px), 0, 0);
  }
  &:hover .arrow {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
    transform: rotate(-45deg) scale(1.05);
  }
`;

// ─── Closing CTA — email reinforcement ────────────────────────────────

const CtaShell = styled.section`
  position: relative;
  /* Textured closer — cyan/navy painterly splash from /public/contact,
     the cool side of the Contact bookend pair with brand violet bleed.
       1. radial darkening (top) — crushes corners, lifts the centre
          so the email pill sits in a halo
       2. cta-bg.webp (middle) — cyan splash with violet accent
       3. solid --ink (bottom fallback) */
  background:
    radial-gradient(
      ellipse at 50% 45%,
      rgba(0, 0, 0, 0.42) 0%,
      rgba(0, 0, 0, 0.62) 55%,
      rgba(0, 0, 0, 0.82) 100%
    ),
    url('/contact/cta-bg.webp') center / cover no-repeat,
    var(--ink);
  color: #fff;
  overflow: hidden;
  /* Near-symmetric vertical padding with the other inner pages so the
     closing pill sits in roughly the same vertical spot, with a slight
     bottom bias for the fade tail. */
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
     around the bright halo. */
  @media (max-width: 860px) {
    background:
      radial-gradient(
        ellipse at 50% 45%,
        rgba(0, 0, 0, 0.65) 0%,
        rgba(0, 0, 0, 0.82) 100%
      ),
      url('/contact/cta-bg.webp') center / cover no-repeat,
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
    font-size: clamp(2.5rem, 7.5vw, 7.5rem);
    line-height: 0.96;
    letter-spacing: -0.03em;
  }
`;

const EMAIL = 'sintaradev@gmail.com';
const TELEGRAM = 'https://t.me/IvanMitska';
const INSTAGRAM = 'https://www.instagram.com/sintara_studio/';

const Contact = () => {
  const { t, language } = useLanguage();
  const reduced = useReducedMotion();
  const isRu = language === 'ru';

  const titleLines = [t('contact.page.title1'), t('contact.page.title2')];

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
            <Tag>{t('contact.page.eyebrow')}</Tag>
          </Reveal>
          <Reveal as="span" delay={0.06}>
            <Tag className="right">{t('contact.page.response')}</Tag>
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
            {t('contact.page.sub')}
          </Reveal>
          <Reveal as="span" delay={0.26}>
            <span className="marker">
              {isRu ? '04 — Связаться' : '04 — Get in touch'}
            </span>
          </Reveal>
        </HeroFoot>
      </Hero>

      <ActionsShell data-nav-theme="light">
        <ActionsInner>
          <ActionsHead>
            <div>
              <Reveal as="span" className="eyebrow">
                {isRu ? 'Как начать' : 'How to start'}
              </Reveal>
              <Reveal as="h2" delay={0.05}>
                {isRu ? 'Выберите канал' : 'Pick your channel'}
              </Reveal>
            </div>
            <Reveal as="p" delay={0.1}>
              {isRu
                ? 'Заполните бриф для понятной сметы, или напишите напрямую — мы открыты для всего.'
                : 'Fill out the brief for a clear quote, or reach us directly — we’re open to all of it.'}
            </Reveal>
          </ActionsHead>

          <ActionsGrid>
            <Reveal>
              <BriefCard to="/brief" data-cursor="hover">
                <div className="top">
                  <span className="num">01 — {isRu ? 'Рекомендуем' : 'Recommended'}</span>
                  <span>{t('contact.page.response')}</span>
                </div>
                <div>
                  <div className="title">{t('contact.page.brief')}</div>
                  <div className="foot">
                    <span className="detail">{t('contact.brief.detail')}</span>
                    <span className="arrow" aria-hidden>
                      →
                    </span>
                  </div>
                </div>
              </BriefCard>
            </Reveal>

            <Channels>
              <Reveal as="span">
                <ChannelsHead>{t('contact.channels.title')}</ChannelsHead>
              </Reveal>
              <ChannelList>
                <Reveal>
                  <ChannelRow href={`mailto:${EMAIL}`} data-cursor="hover">
                    <span className="info">
                      <span className="name">Email</span>
                      <span className="meta">{t('contact.email.meta')}</span>
                      <span className="handle">{EMAIL}</span>
                    </span>
                    <span className="arrow" aria-hidden>
                      →
                    </span>
                  </ChannelRow>
                </Reveal>
                <Reveal delay={0.06}>
                  <ChannelRow
                    href={TELEGRAM}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                  >
                    <span className="info">
                      <span className="name">Telegram</span>
                      <span className="meta">{t('contact.telegram.meta')}</span>
                      <span className="handle">@IvanMitska</span>
                    </span>
                    <span className="arrow" aria-hidden>
                      →
                    </span>
                  </ChannelRow>
                </Reveal>
                <Reveal delay={0.12}>
                  <ChannelRow
                    href={INSTAGRAM}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                  >
                    <span className="info">
                      <span className="name">Instagram</span>
                      <span className="meta">{t('contact.instagram.meta')}</span>
                      <span className="handle">@sintara_studio</span>
                    </span>
                    <span className="arrow" aria-hidden>
                      →
                    </span>
                  </ChannelRow>
                </Reveal>
              </ChannelList>
            </Channels>
          </ActionsGrid>
        </ActionsInner>
      </ActionsShell>

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
            {isRu ? 'Прямая линия' : 'Direct line'}
          </Reveal>
          <Reveal as="h2" delay={0.05}>
            {isRu ? 'Почта открыта' : 'Email is open'}
          </Reveal>
          <Reveal delay={0.12}>
            <PillLink href={`mailto:${EMAIL}`} variant="light" arrow>
              {EMAIL}
            </PillLink>
          </Reveal>
        </CtaInner>
      </CtaShell>

      <Footer />
    </>
  );
};

export default Contact;
