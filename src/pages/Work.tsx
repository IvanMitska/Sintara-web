import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import PillLink from '../components/ui/PillLink';
import Reveal from '../components/ui/Reveal';
import Crosshair from '../components/ui/Crosshair';
import { useLanguage } from '../context/LanguageContext';
import { projects } from '../data/projects';

/**
 * Work — selected projects index. A frame-filling dark hero, a varied
 * 12-column case grid with cinematic hover, and a dark closing CTA.
 */

// ─── Hero ─────────────────────────────────────────────────────────────

const Hero = styled.header`
  position: relative;
  background: var(--ink);
  color: #fff;
  overflow: hidden;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(116px, 15vh, 172px) clamp(20px, 5vw, 80px)
    clamp(40px, 6vh, 80px);
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
  color: var(--cyan);

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--cyan);
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
  }
  .line > span {
    display: inline-block;
    will-change: transform;
  }
  .accent {
    color: var(--accent);
  }
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
    color: var(--cyan);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
`;

// ─── Case grid ────────────────────────────────────────────────────────

const GridShell = styled.section`
  background: var(--paper);
  color: var(--ink);
  padding: clamp(72px, 11vh, 152px) clamp(20px, 5vw, 80px);
`;

const Grid = styled.div`
  max-width: 1560px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(56px, 8vh, 120px) 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 56px;
  }
`;

const CaseWrap = styled(motion.article)<{ $span: number; $offset: number }>`
  grid-column: ${({ $span, $offset }) => `${$offset + 1} / span ${$span}`};

  @media (max-width: 1200px) {
    grid-column: span 6;
  }
  @media (max-width: 900px) {
    grid-column: 1 / -1;
  }
`;

const Cover = styled(Link)<{ $accent: string }>`
  display: block;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: ${({ $accent }) => $accent};
  aspect-ratio: 16 / 11;
  width: 100%;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.4s var(--ease-expo);
    will-change: transform;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.55) 0%,
      rgba(0, 0, 0, 0) 50%
    );
    pointer-events: none;
  }

  .index {
    position: absolute;
    top: 20px;
    left: 22px;
    z-index: 1;
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: #fff;
    mix-blend-mode: difference;
  }

  .view {
    position: absolute;
    right: 22px;
    bottom: 20px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 18px;
    border-radius: 999px;
    background: #fff;
    font-family: var(--font-grotesk);
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ink);
    opacity: 0;
    transform: translateY(14px);
    transition:
      opacity 0.4s,
      transform 0.55s var(--ease-expo);
  }

  &:hover img {
    transform: scale(1.07);
  }
  &:hover .view {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CaseMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--bone-line);
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--muted);
`;

const CaseTitle = styled.h2`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.875rem, 3.6vw, 3.5rem);
  line-height: 0.98;
  letter-spacing: -0.035em;
  color: var(--ink);
  margin: 18px 0 12px;
  transition:
    color 0.35s var(--ease-snap),
    transform 0.5s var(--ease-expo);

  a:hover & {
    color: var(--accent);
    transform: translateX(8px);
  }
`;

const CaseSummary = styled.p`
  font-family: var(--font-grotesk);
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--muted);
  max-width: 56ch;
`;

const TagsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 22px;
`;

const Tg = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  padding: 7px 13px;
  border: 1px solid var(--bone-line);
  border-radius: 999px;
`;

const TitleLink = styled(Link)`
  display: block;
  color: inherit;
`;

// ─── Closing CTA ──────────────────────────────────────────────────────

const CtaShell = styled.section`
  position: relative;
  background: var(--ink);
  color: #fff;
  overflow: hidden;
  padding: clamp(96px, 16vh, 220px) clamp(20px, 5vw, 80px);
  text-align: center;
`;

const CtaInner = styled.div`
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
    color: var(--cyan);
  }

  h2 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.75rem, 8.5vw, 9rem);
    line-height: 0.92;
    letter-spacing: -0.03em;
  }
`;

const layouts = [
  { span: 7, offset: 0 },
  { span: 4, offset: 8 },
  { span: 5, offset: 1 },
  { span: 6, offset: 6 },
  { span: 7, offset: 0 },
];

const Work = () => {
  const { language, t } = useLanguage();
  const reduced = useReducedMotion();
  const isRu = language === 'ru';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const titleLines = [t('work.title1'), t('work.title2')];

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
            <Tag>{t('work.eyebrow')}</Tag>
          </Reveal>
          <Reveal as="span" delay={0.06}>
            <Tag className="right">
              {isRu ? '2024 — 2025' : '2024 — 2025'}
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
            {t('work.sub')}
          </Reveal>
          <Reveal as="span" delay={0.26}>
            <span className="marker">
              {String(projects.length).padStart(2, '0')} —{' '}
              {isRu ? 'Проектов' : 'Projects'}
            </span>
          </Reveal>
        </HeroFoot>
      </Hero>

      <GridShell data-nav-theme="light">
        <Grid>
          {projects.map((p, i) => {
            const l = layouts[i % layouts.length];
            const i18n = p[language];
            const title = i18n.title.split(' — ')[0];
            return (
              <CaseWrap
                key={p.slug}
                $span={l.span}
                $offset={l.offset}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.95,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Cover
                  to={`/work/${p.slug}`}
                  $accent={p.accent}
                  data-cursor="hover"
                >
                  <span className="index">{p.number}</span>
                  <img src={p.cover} alt={title} loading="lazy" />
                  <span className="view">
                    {isRu ? 'Смотреть кейс' : 'View case'} ↗
                  </span>
                </Cover>
                <TitleLink to={`/work/${p.slug}`} data-cursor="hover">
                  <CaseMeta>
                    <span>{p.client}</span>
                    <span>{p.year}</span>
                  </CaseMeta>
                  <CaseTitle>{title}</CaseTitle>
                </TitleLink>
                <CaseSummary>{i18n.summary}</CaseSummary>
                <TagsRow>
                  {p.tags.slice(0, 4).map((tag) => (
                    <Tg key={tag}>{tag}</Tg>
                  ))}
                </TagsRow>
              </CaseWrap>
            );
          })}
        </Grid>
      </GridShell>

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
            {isRu ? 'Ваш проект — следующий' : 'Your project is next'}
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

export default Work;
