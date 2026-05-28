import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { lockScroll, unlockScroll } from '../lib/scrollLock';

/**
 * Sintara mega-menu — ported 1:1 from sintara-crm-web.
 *
 * Top strip: wordmark on the left, MENU pill on the right. Color follows
 * the [data-nav-theme] section underneath via IntersectionObserver.
 *
 * Overlay: fullscreen, light editorial background. 3D Sintara logo on
 * the left half (Three.js), giant nav items on the right half with the
 * "hover-flip" letter effect (front line slides up, violet copy rolls
 * in from below, with per-letter stagger via --i CSS var). Each nav item
 * also tints the 3D logo gradient on hover.
 */

type NavTheme = 'light' | 'dark';

// 3D logo lazy-loaded so Three.js doesn't bloat the initial bundle.
const SintaraLogo3D = lazy(() => import('./brand/SintaraLogo3D'));

const DEFAULT_LOGO_FROM = '#a855f7';
const DEFAULT_LOGO_MID = '#0a0419';
const DEFAULT_LOGO_TO = '#ec4899';

// ─── Top strip ─────────────────────────────────────────────────────────

const Strip = styled.div<{ $theme: NavTheme }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 32px;
  pointer-events: none;
  color: ${({ $theme }) => ($theme === 'dark' ? '#fff' : 'var(--ink)')};
  transition: color 0.5s var(--ease-snap);

  & > * {
    pointer-events: auto;
  }

  @media (max-width: 640px) {
    padding: 16px 20px;
  }
`;

const dotPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.35); }
`;

const Wordmark = styled(Link)`
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.035em;
  color: inherit;
  display: inline-flex;
  align-items: center;
  line-height: 1;
  transition: color 0.4s var(--ease-snap);

  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: var(--accent);
    border-radius: 50%;
    margin-left: 8px;
    transform: translateY(-2px);
    animation: ${dotPulse} 2.4s ease-in-out infinite;
  }

  &:hover {
    color: var(--accent);
  }
`;

const MenuBtn = styled.button<{ $theme: NavTheme; $open: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 0 22px;
  height: 44px;
  border-radius: 999px;
  cursor: pointer;
  overflow: hidden;
  font-family: var(--font-grotesk);
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  background: ${({ $open }) => ($open ? 'var(--ink)' : 'transparent')};
  color: ${({ $open, $theme }) =>
    $open ? 'var(--bone)' : $theme === 'dark' ? '#fff' : 'var(--ink)'};
  border: 1px solid
    ${({ $open, $theme }) =>
      $open
        ? 'var(--ink)'
        : $theme === 'dark'
        ? 'rgba(255,255,255,0.18)'
        : 'rgba(10,10,10,0.12)'};
  transition:
    color 0.4s var(--ease-snap),
    background 0.4s var(--ease-snap),
    border-color 0.4s var(--ease-snap);

  &:hover {
    border-color: ${({ $open, $theme }) =>
      $open ? 'var(--ink)' : $theme === 'dark' ? '#fff' : 'var(--ink)'};
  }

  .label {
    user-select: none;
    line-height: 1;
  }

  .glyph {
    position: relative;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: ${({ $open }) =>
      $open ? 'var(--bone)' : 'transparent'};
    color: ${({ $open }) => ($open ? 'var(--ink)' : 'currentColor')};
    transition: background 0.4s var(--ease-snap),
      color 0.4s var(--ease-snap);

    .line-top,
    .line-bottom,
    .line-mid {
      position: absolute;
      left: 50%;
      top: 50%;
      height: 1px;
      background: currentColor;
      border-radius: 2px;
      transform-origin: center;
    }

    .line-top {
      width: 14px;
      transform: translate(-50%, -3px);
      transition: transform 0.45s var(--ease-snap);
    }

    .line-bottom {
      width: 14px;
      transform: translate(-50%, 3px);
      transition: transform 0.45s var(--ease-snap);
    }

    .line-mid {
      width: 10px;
      transform: translate(-50%, -50%);
      transition:
        width 0.45s var(--ease-snap),
        opacity 0.45s var(--ease-snap);
    }

    ${({ $open }) =>
      $open &&
      css`
        .line-top {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        .line-bottom {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
        .line-mid {
          width: 0;
          opacity: 0;
        }
      `}
  }

  ${({ $open }) =>
    !$open &&
    css`
      &:hover .glyph .line-mid {
        width: 14px;
      }
    `}
`;

// ─── Fullscreen overlay ───────────────────────────────────────────────

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 99;
  background: var(--bone);
  color: var(--ink);
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow-y: auto;
`;

const OverlayTopPad = styled.div`
  height: 96px;

  @media (max-width: 640px) {
    height: 72px;
  }
`;

const OverlayBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 64px;
  align-items: center;
  padding: 24px 40px 24px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 24px 24px 24px;
  }
`;

const Logo3DSlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 460px;

  @media (max-width: 1024px) {
    min-height: 280px;
  }
`;

const BigNav = styled.nav`
  display: flex;
  flex-direction: column;
  align-self: center;
`;

const BigNavRow = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 0;
  border-top: 1px solid rgba(10, 10, 10, 0.08);
  color: var(--ink);
  text-decoration: none;
  transition: color 0.35s var(--ease-snap);

  &:last-child {
    border-bottom: 1px solid rgba(10, 10, 10, 0.08);
  }

  /* hover-flip text container */
  .hover-flip {
    display: inline-block;
    font-family: var(--font-display);
    font-size: clamp(2.25rem, 5.5vw, 4.25rem);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.03em;
    text-transform: uppercase;
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
    transition: transform 0.48s cubic-bezier(0.65, 0.05, 0.36, 1);
    transition-delay: calc(var(--i, 0) * 24ms);
    will-change: transform;
  }

  .hf-back {
    position: absolute;
    top: 100%;
    left: 0;
    color: var(--menu-accent, var(--accent));
  }

  &:hover .hf-front,
  &:focus-visible .hf-front {
    transform: translateY(-100%);
  }
  &:hover .hf-back,
  &:focus-visible .hf-back {
    transform: translateY(-100%);
  }

  /* arrow */
  .arrow {
    display: inline-flex;
    align-items: center;
    color: var(--menu-accent, var(--accent));
    opacity: 0;
    transform: translateX(-12px);
    transition:
      opacity 0.22s var(--ease-snap),
      transform 0.32s var(--ease-expo);
    pointer-events: none;
  }

  &:hover .arrow,
  &:focus-visible .arrow {
    opacity: 1;
    transform: translateX(0);
  }

  &.active {
    color: var(--accent);
  }

  @media (prefers-reduced-motion: reduce) {
    .hf-front,
    .hf-back {
      transition: none;
    }
    &:hover .hf-front,
    &:focus-visible .hf-front {
      transform: none;
      color: var(--menu-accent, var(--accent));
    }
    .hf-back {
      display: none;
    }
  }
`;

const OverlayFoot = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 40px;
  padding: 28px 40px;
  border-top: 1px solid rgba(10, 10, 10, 0.08);
  font-family: var(--font-grotesk);
  font-size: 0.875rem;
  color: var(--muted);
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;

  .group-title {
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--muted);
    margin-bottom: 12px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  a {
    color: var(--ink);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: color 0.25s var(--ease-snap);

    &.muted {
      color: var(--muted);
    }

    .bar {
      display: inline-block;
      width: 0;
      height: 1px;
      background: currentColor;
      transition: width 0.22s var(--ease-snap);
    }

    &:hover {
      color: var(--accent);

      .bar {
        width: 14px;
      }
    }

    &.muted:hover {
      color: var(--ink);
    }
  }

  .cta-col {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  .cta-link {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--ink);

    .arrow {
      transition: transform 0.25s var(--ease-snap);
      display: inline-block;
    }

    &:hover {
      color: var(--accent);

      .arrow {
        transform: translateX(4px);
      }
    }
  }

  .login-link {
    font-size: 0.8125rem;
    color: var(--muted);

    &:hover {
      color: var(--ink);
    }
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;

    .cta-col {
      grid-column: span 2;
      align-items: flex-start;
    }
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px 20px;

    .cta-col {
      grid-column: auto;
    }
  }
`;

const LangBtn = styled.button`
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 8px 14px;
  border: 1px solid rgba(10, 10, 10, 0.12);
  background: transparent;
  border-radius: 999px;
  cursor: pointer;
  transition:
    color 0.3s,
    border-color 0.3s,
    background 0.3s;

  &:hover {
    color: var(--accent);
    border-color: var(--accent);
  }
`;

// ─── Hover-flip text helper (per-letter stagger) ─────────────────────

function HoverFlipText({ children }: { children: string }): React.ReactElement {
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

// ─── Component ────────────────────────────────────────────────────────

interface NavigationProps {
  /** Forced theme override (e.g. for pages without tagged sections). */
  surface?: 'light' | 'dark';
}

const navItems: {
  to: string;
  key: string;
  from: string;
  mid: string;
  to3D: string;
}[] = [
  { to: '/work', key: 'nav.work', from: '#d946ef', mid: '#0d041a', to3D: '#f43f5e' },
  { to: '/services', key: 'nav.services', from: '#06b6d4', mid: '#020817', to3D: '#6366f1' },
  { to: '/about', key: 'nav.about', from: '#22c55e', mid: '#04140e', to3D: '#06b6d4' },
  { to: '/contact', key: 'nav.contact', from: '#f59e0b', mid: '#1a0606', to3D: '#ef4444' },
  { to: '/brief', key: 'nav.getStarted', from: '#0ea5e9', mid: '#04081f', to3D: '#7c3aed' },
];

const Navigation = ({ surface }: NavigationProps) => {
  const [open, setOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<NavTheme>(surface || 'light');
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const reduced = useReducedMotion();

  // 3D logo color state — shifts on nav hover to give the model a "tint"
  const [logoFrom, setLogoFrom] = useState(DEFAULT_LOGO_FROM);
  const [logoMid, setLogoMid] = useState(DEFAULT_LOGO_MID);
  const [logoTo, setLogoTo] = useState(DEFAULT_LOGO_TO);
  const logoKickRef = useRef(0);

  // Reset logo color whenever overlay closes
  useEffect(() => {
    if (!open) {
      setLogoFrom(DEFAULT_LOGO_FROM);
      setLogoMid(DEFAULT_LOGO_MID);
      setLogoTo(DEFAULT_LOGO_TO);
    }
  }, [open]);

  // Navigate → close + reset theme to forced surface
  useEffect(() => {
    setOpen(false);
    if (surface) setNavTheme(surface);
  }, [location.pathname, surface]);

  // Lock scroll while overlay open (compensates scrollbar width — no shift)
  useEffect(() => {
    if (!open) return;
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [open]);

  // ESC closes overlay
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // [data-nav-theme] observer — preserved from previous Navigation
  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setup = () => {
      const elements = document.querySelectorAll<HTMLElement>(
        '[data-nav-theme]',
      );
      if (!elements.length) return;

      const navLine = 80;
      let initial: NavTheme | null = null;
      elements.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= navLine && r.bottom > navLine) {
          initial = el.getAttribute('data-nav-theme') as NavTheme | null;
        }
      });
      if (initial) setNavTheme(initial);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const theme = entry.target.getAttribute(
                'data-nav-theme',
              ) as NavTheme | null;
              if (theme === 'light' || theme === 'dark') {
                setNavTheme(theme);
              }
            }
          });
        },
        {
          rootMargin: '-80px 0px -99.5% 0px',
          threshold: 0,
        },
      );

      elements.forEach((el) => observer!.observe(el));
    };

    const timer = window.setTimeout(setup, 50);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      observer = null;
    };
  }, [location.pathname]);

  // While overlay is open, force light header (overlay bg is bone white).
  const effectiveTheme: NavTheme = open ? 'light' : navTheme;

  return (
    <>
      <Strip $theme={effectiveTheme}>
        <Wordmark to="/" aria-label="Sintara — home">
          Sintara
          <span className="dot" />
        </Wordmark>

        <MenuBtn
          $theme={effectiveTheme}
          $open={open}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t('nav.close') : t('nav.menu')}
          aria-expanded={open}
        >
          <span className="label">{open ? t('nav.close') : t('nav.menu')}</span>
          <span className="glyph" aria-hidden>
            <span className="line-top" />
            <span className="line-bottom" />
            <span className="line-mid" />
          </span>
        </MenuBtn>
      </Strip>

      <AnimatePresence>
        {open && (
          <Overlay
            initial={
              reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }
            }
            animate={
              reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }
            }
            exit={
              reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }
            }
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            data-surface="light"
          >
            <OverlayTopPad />

            <OverlayBody>
              <Logo3DSlot>
                <Suspense fallback={null}>
                  <SintaraLogo3D
                    size={460}
                    color={logoFrom}
                    colorMid={logoMid}
                    colorTo={logoTo}
                    envPreset="warehouse"
                    kickRef={logoKickRef}
                  />
                </Suspense>
              </Logo3DSlot>

              <BigNav>
                {navItems.map((item) => (
                  <BigNavRow
                    key={item.to}
                    to={item.to}
                    style={{ '--menu-accent': item.from } as CSSProperties}
                    onMouseEnter={() => {
                      setLogoFrom(item.from);
                      setLogoMid(item.mid);
                      setLogoTo(item.to3D);
                      logoKickRef.current++;
                    }}
                    onMouseLeave={() => {
                      setLogoFrom(DEFAULT_LOGO_FROM);
                      setLogoMid(DEFAULT_LOGO_MID);
                      setLogoTo(DEFAULT_LOGO_TO);
                    }}
                    onFocus={() => {
                      setLogoFrom(item.from);
                      setLogoMid(item.mid);
                      setLogoTo(item.to3D);
                      logoKickRef.current++;
                    }}
                    onBlur={() => {
                      setLogoFrom(DEFAULT_LOGO_FROM);
                      setLogoMid(DEFAULT_LOGO_MID);
                      setLogoTo(DEFAULT_LOGO_TO);
                    }}
                    onClick={() => setOpen(false)}
                  >
                    <HoverFlipText>{t(item.key)}</HoverFlipText>
                    <span className="arrow" aria-hidden>
                      <svg
                        width="44"
                        height="14"
                        viewBox="0 0 44 14"
                        fill="none"
                      >
                        <path
                          d="M0 7H42M42 7L36 1M42 7L36 13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </span>
                  </BigNavRow>
                ))}
              </BigNav>
            </OverlayBody>

            <OverlayFoot>
              <div>
                <div className="group-title">/ Sales</div>
                <ul>
                  <li>
                    <a href="mailto:sintaradev@gmail.com">
                      <span className="bar" aria-hidden />
                      <span>sintaradev@gmail.com</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://t.me/IvanMitska"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="bar" aria-hidden />
                      <span>@IvanMitska</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <div className="group-title">/ Elsewhere</div>
                <ul>
                  <li>
                    <a
                      href="https://t.me/IvanMitska"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="bar" aria-hidden />
                      <span>Telegram</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/sintara_studio/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="bar" aria-hidden />
                      <span>Instagram</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="cta-col">
                <Link
                  to="/brief"
                  className="cta-link"
                  onClick={() => setOpen(false)}
                >
                  <span className="arrow">→</span> {t('nav.getStarted')}
                </Link>
                <LangBtn onClick={toggleLanguage}>
                  {language === 'en' ? 'RU' : 'EN'}
                </LangBtn>
              </div>
            </OverlayFoot>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
