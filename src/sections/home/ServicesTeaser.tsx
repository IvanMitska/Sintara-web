import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Eyebrow from '../../components/ui/Eyebrow';
import { useLanguage } from '../../context/LanguageContext';

/**
 * "What we build" — premium editorial services list with a soft 3D
 * watermark behind the rows (RedCollar pattern).
 *
 * The 3D Sintara logo is **deliberately muted**: light pastel palette,
 * 0.75 opacity, sticky-centered behind the rows. Black row text reads
 * cleanly on top — the 3D acts as a decorative watermark that breathes
 * life into the otherwise quiet whitespace.
 *
 * On row hover the 3D recolors to a pastel tint of the service accent
 * and `kick`s once. Subtle, never competes with the type.
 */

// 3D logo lazy-loaded so Three.js doesn't bloat the home initial bundle.
const SintaraLogo3D = lazy(() => import('../../components/brand/SintaraLogo3D'));
import type { LogoKickKind } from '../../components/brand/SintaraLogo3D';

// ─── Layout shell ──────────────────────────────────────────────────

const Shell = styled.section`
  position: relative;
  background: #fff;
  color: var(--ink);
  border-top: 1px solid var(--bone-line);
  border-bottom: 1px solid var(--bone-line);
  padding: 140px 0 0;
  overflow: hidden;
`;

const Head = styled.div`
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  align-items: end;
  gap: 64px;
  padding: 0 40px 96px;
  max-width: 1680px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 48px;
    padding: 0 24px 64px;
  }

  @media (max-width: 640px) {
    padding: 0 20px 56px;
  }
`;

const HeadLeft = styled.div`
  position: relative;
`;

const HeadRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;

  @media (max-width: 1024px) {
    align-items: flex-start;
  }
`;

const EyebrowRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 28px;
`;

const ServiceCount = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '';
    width: 24px;
    height: 1px;
    background: var(--bone-line);
  }

  strong {
    color: var(--ink);
    font-weight: 600;
  }
`;

const BigTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 13vw, 14rem);
  font-weight: 700;
  line-height: 0.82;
  letter-spacing: -0.055em;
  text-transform: uppercase;
  margin: 0 0 32px;
`;

const TitleLine = styled.span`
  display: block;
  overflow: hidden;
  padding-bottom: 0.04em;
`;

const TitleWord = styled(motion.span)`
  display: inline-block;
  transform-origin: 0 100%;
`;

const SlashWord = styled(TitleWord)`
  color: var(--accent);
  margin-right: 0.18em;
`;

const Subtitle = styled.p`
  font-family: var(--font-grotesk);
  font-size: clamp(1rem, 1.15vw, 1.125rem);
  line-height: 1.55;
  color: var(--muted);
  max-width: 38ch;
  margin: 0;
`;

const AllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 18px 30px;
  background: var(--ink);
  color: #fff;
  font-family: var(--font-grotesk);
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border-radius: 999px;
  border: 1.5px solid var(--ink);
  transition:
    background 0.3s var(--ease-snap),
    color 0.3s var(--ease-snap),
    border-color 0.3s var(--ease-snap),
    padding 0.5s var(--ease-expo);

  &::after {
    content: '→';
    transition: transform 0.4s var(--ease-expo);
  }

  &:hover {
    background: var(--accent);
    border-color: var(--accent);
    padding: 18px 36px;

    &::after {
      transform: translateX(6px);
    }
  }
`;

// ─── List + 3D watermark ───────────────────────────────────────────

const List = styled.div`
  position: relative;
  isolation: isolate;
`;

/**
 * Sticky anchor with zero height — doesn't disturb row flow. Sticks
 * to the top of the viewport once the list scrolls into view.
 */
const Logo3DAnchor = styled.div`
  position: sticky;
  top: 0;
  height: 0;
  z-index: 0;
  pointer-events: none;

  @media (max-width: 900px) {
    display: none;
  }
`;

/**
 * The 3D's actual placement — absolute, dropped below the anchor so the
 * logo sits in the viewport center while the anchor is stuck. Slightly
 * biased horizontally so it doesn't block the row title column.
 */
const Logo3DPlacement = styled.div`
  position: absolute;
  top: 42vh;
  left: 64%;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  pointer-events: none;
  opacity: 0.95;
`;

const LogoMount = styled.div`
  width: clamp(460px, 50vw, 720px);
  aspect-ratio: 1;
  position: relative;
`;

// ─── Row ───────────────────────────────────────────────────────────

const MotionLink = motion.create(Link);

/**
 * Service row. Full-width grid: number — title — description — price
 * — chevron. Z-index: 1 keeps it above the 3D watermark. Background
 * stays transparent so the watermark shows through.
 */
const Row = styled(MotionLink)<{ $accent: string }>`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr) auto 36px;
  gap: 32px;
  align-items: center;
  padding: 44px 40px;
  isolation: isolate;
  cursor: pointer;
  text-decoration: none;
  color: var(--ink);
  background: transparent;
  transition: color 0.55s var(--ease-snap);
  --row-accent: ${({ $accent }) => $accent};

  & > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 60px 1fr auto;
    gap: 14px 24px;
    padding: 32px 24px;

    .price {
      grid-column: 2 / -1;
      justify-self: start;
      text-align: left;
      margin-top: 8px;
    }

    .arrow {
      display: none;
    }
  }

  @media (max-width: 640px) {
    padding: 28px 20px;
    grid-template-columns: 1fr;
    gap: 12px;

    .price {
      grid-column: 1;
    }
  }
`;

const Num = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: color 0.5s var(--ease-snap);

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--bone-line);
    transition:
      background 0.5s var(--ease-snap),
      transform 0.6s var(--ease-expo);
  }

  ${Row}:hover & {
    color: var(--row-accent);
  }
  ${Row}:hover & .dot {
    background: var(--row-accent);
    transform: scale(1.8);
  }
`;

/**
 * Title with per-letter hover-flip — ink layer slides up, accent copy
 * rolls in from below with a staggered delay driven by `--i`. Mirrors
 * the mega-menu animation in Navigation.tsx.
 */
const Name = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.6vw, 4rem);
  font-weight: 700;
  line-height: 0.94;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  margin: 0;
  position: relative;
  display: block;

  .hover-flip {
    display: inline-block;
  }

  .hf-char {
    position: relative;
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
    line-height: 1;
  }

  .hf-front,
  .hf-back {
    display: inline-block;
    line-height: inherit;
    transition: transform 0.45s cubic-bezier(0.65, 0.05, 0.36, 1);
    will-change: transform;
  }

  .hf-back {
    position: absolute;
    top: 100%;
    left: 0;
    color: var(--row-accent);
  }

  /* Stagger only on hover-in so the reverse snaps back in sync —
     otherwise trailing chars on long titles lag ~600ms behind and
     look frozen mid-flight when sweeping between rows. */
  ${Row}:hover & .hf-front,
  ${Row}:hover & .hf-back,
  ${Row}:focus-visible & .hf-front,
  ${Row}:focus-visible & .hf-back {
    transition-delay: calc(var(--i, 0) * 18ms);
  }

  ${Row}:hover & .hf-front,
  ${Row}:focus-visible & .hf-front {
    transform: translateY(-100%);
  }
  ${Row}:hover & .hf-back,
  ${Row}:focus-visible & .hf-back {
    transform: translateY(-100%);
  }

  @media (prefers-reduced-motion: reduce) {
    .hf-front,
    .hf-back {
      transition: none;
    }
    ${Row}:hover & .hf-front,
    ${Row}:focus-visible & .hf-front {
      transform: none;
      color: var(--row-accent);
    }
    .hf-back {
      display: none;
    }
  }
`;

function HoverFlipText({ children }: { children: string }): ReactElement {
  const chars = Array.from(children);
  return (
    <span className="hover-flip" aria-label={children}>
      {chars.map((ch, i) => {
        const display = ch === ' ' ? ' ' : ch;
        return (
          <span
            key={i}
            className="hf-char"
            style={{ '--i': i } as CSSProperties}
            aria-hidden="true"
          >
            <span className="hf-front">{display}</span>
            <span className="hf-back">{display}</span>
          </span>
        );
      })}
    </span>
  );
}

const Price = styled.div`
  text-align: right;
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .from {
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--muted);
  }

  .val {
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 1.6vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--ink);
    transition: color 0.5s var(--ease-snap);
  }

  ${Row}:hover & .val {
    color: var(--row-accent);
  }
`;

const Arrow = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--ink);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 0.875rem;
  transform: scale(0.55);
  opacity: 0;
  transition:
    transform 0.6s var(--ease-expo),
    opacity 0.4s var(--ease-snap),
    background 0.4s var(--ease-snap);

  ${Row}:hover & {
    transform: scale(1);
    opacity: 1;
    background: var(--row-accent);
  }
`;

// ─── Data ──────────────────────────────────────────────────────────

interface Service {
  n: string;
  k: string;
  price: string;
  /** Saturated CSS color used for row hover state (rail, dot, arrow). */
  accent: string;
  /** Saturated logo gradient: from/to are vivid endpoints; mid is a
   *  deep dark so the metallic shader gets a punchy tonal range. */
  logo: { from: string; mid: string; to: string };
  /** One-shot motion fired on row hover. */
  kick: LogoKickKind;
}

/**
 * Saturated palettes per row. `from`/`to` are vivid brand-adjacent
 * colors; `mid` is a near-black tint of the same hue so the
 * meshPhysical + gradient shader produces strong light-to-shadow
 * contrast across the model rather than a washed pastel wash.
 */
const services: Service[] = [
  {
    n: '01',
    k: '1',
    price: '$1 500',
    accent: '#7c3aed',
    logo: { from: '#a855f7', mid: '#180033', to: '#ec4899' },
    kick: 'spin',
  },
  {
    n: '02',
    k: '2',
    price: '$15 000',
    accent: '#06b6d4',
    logo: { from: '#06b6d4', mid: '#021a25', to: '#3b82f6' },
    kick: 'flip',
  },
  {
    n: '03',
    k: '3',
    price: '$1 200',
    accent: '#0ea5e9',
    logo: { from: '#38bdf8', mid: '#02132c', to: '#6366f1' },
    kick: 'bounce',
  },
  {
    n: '04',
    k: '4',
    price: '$5 000',
    accent: '#d946ef',
    logo: { from: '#d946ef', mid: '#26052f', to: '#f43f5e' },
    kick: 'tumble',
  },
  {
    n: '05',
    k: '5',
    price: '$3 000',
    accent: '#f59e0b',
    logo: { from: '#f59e0b', mid: '#1f0d05', to: '#ef4444' },
    kick: 'pulse',
  },
  {
    n: '06',
    k: '6',
    price: '$900/mo',
    accent: '#22c55e',
    logo: { from: '#22c55e', mid: '#04140e', to: '#06b6d4' },
    kick: 'wobble',
  },
];

const DEFAULT_LOGO = { from: '#a855f7', mid: '#0a0a14', to: '#ec4899' };

const ServicesTeaser = () => {
  const { t } = useLanguage();
  const [logoColor, setLogoColor] = useState(DEFAULT_LOGO);
  const logoKickRef = useRef(0);
  const logoKickKindRef = useRef<LogoKickKind>('spin');

  // IntersectionObserver gate — Canvas freezes (frameloop="never") when
  // the services list is off-screen, so the 3D logo doesn't burn GPU
  // frames behind sections the user has already scrolled past.
  const listRef = useRef<HTMLDivElement>(null);
  const [logoActive, setLogoActive] = useState(true);
  useEffect(() => {
    const el = listRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entry]) => setLogoActive(entry.isIntersecting),
      { rootMargin: '200px 0px 200px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleRowEnter = (i: number) => {
    setLogoColor(services[i].logo);
    // Set kind first so the next frame reads the matching motion.
    logoKickKindRef.current = services[i].kick;
    logoKickRef.current++;
  };

  const handleListLeave = () => {
    setLogoColor(DEFAULT_LOGO);
  };

  return (
    <Shell data-nav-theme="light">
      <Head>
        <HeadLeft>
          <EyebrowRow>
            <Eyebrow>{t('home.services.eyebrow')}</Eyebrow>
            <ServiceCount>
              <strong>{String(services.length).padStart(2, '0')}</strong>{' '}
              {t('home.services.count')}
            </ServiceCount>
          </EyebrowRow>

          <BigTitle>
            <TitleLine>
              <TitleWord
                initial={{ y: '110%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              >
                {t('home.services.title1')}
              </TitleWord>
            </TitleLine>
            <TitleLine>
              <SlashWord
                initial={{ y: '110%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: 0.95,
                  delay: 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                /
              </SlashWord>
              <TitleWord
                initial={{ y: '110%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: 0.95,
                  delay: 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {t('home.services.title2')}
              </TitleWord>
            </TitleLine>
          </BigTitle>

          <Subtitle>{t('home.services.subtitle')}</Subtitle>
        </HeadLeft>

        <HeadRight>
          <AllLink to="/services">{t('home.services.cta')}</AllLink>
        </HeadRight>
      </Head>

      <List ref={listRef} onMouseLeave={handleListLeave}>
        <Logo3DAnchor aria-hidden="true">
          <Logo3DPlacement>
            <LogoMount>
              <Suspense fallback={null}>
                <SintaraLogo3D
                  size={560}
                  color={logoColor.from}
                  colorMid={logoColor.mid}
                  colorTo={logoColor.to}
                  envPreset="apartment"
                  kickRef={logoKickRef}
                  kickKindRef={logoKickKindRef}
                  active={logoActive}
                />
              </Suspense>
            </LogoMount>
          </Logo3DPlacement>
        </Logo3DAnchor>

        {services.map((s, i) => (
          <Row
            key={s.n}
            to="/services"
            $accent={s.accent}
            onMouseEnter={() => handleRowEnter(i)}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Num className="num">
              <span className="dot" />
              {s.n} / {String(services.length).padStart(2, '0')}
            </Num>

            <Name>
              <HoverFlipText>{t(`home.services.${s.k}.title`)}</HoverFlipText>
            </Name>

            <Price className="price">
              <span className="from">{t('services.page.priceFrom')}</span>
              <span className="val">{s.price}</span>
            </Price>

            <Arrow className="arrow" aria-hidden="true">
              →
            </Arrow>
          </Row>
        ))}
      </List>
    </Shell>
  );
};

export default ServicesTeaser;
