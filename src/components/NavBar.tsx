import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import AudioToggle from './AudioToggle';
import Crosshair from './ui/Crosshair';
import { stopScroll, startScroll } from '../lib/lenis';

/**
 * Sintara v2 navigation — Lusion-style. Wordmark left; audio toggle +
 * "Let's talk" pill + "Menu" pill right. Menu opens a full-screen dark
 * overlay with oversized links. Header colour follows [data-nav-theme].
 */

type NavTheme = 'light' | 'dark';

const Strip = styled.div<{ $theme: NavTheme; $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ $scrolled }) => ($scrolled ? '14px' : '24px')} 32px;
  pointer-events: none;
  color: ${({ $theme }) => ($theme === 'dark' ? '#fff' : 'var(--ink)')};
  transition:
    color 0.5s var(--ease-snap),
    padding 0.5s var(--ease-snap);

  & > * {
    pointer-events: auto;
  }

  @media (max-width: 640px) {
    padding: ${({ $scrolled }) => ($scrolled ? '12px' : '16px')} 18px;
  }
`;

const Wordmark = styled(Link)`
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.045em;
  color: inherit;
  display: inline-flex;
  align-items: center;
  line-height: 1;

  .dot {
    color: var(--cyan);
    margin-left: 1px;
  }
`;

const Cluster = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Pill = styled(Link)<{ $solid?: boolean; $theme: NavTheme }>`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 44px;
  padding: 0 22px;
  border-radius: 999px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  transition:
    background 0.4s var(--ease-snap),
    color 0.4s var(--ease-snap),
    border-color 0.4s var(--ease-snap);

  background: ${({ $solid, $theme }) =>
    $solid
      ? 'var(--ink)'
      : $theme === 'dark'
        ? 'rgba(255,255,255,0.06)'
        : 'rgba(255,255,255,0.55)'};
  color: ${({ $solid, $theme }) =>
    $solid ? '#fff' : $theme === 'dark' ? '#fff' : 'var(--ink)'};
  border: 1px solid
    ${({ $solid, $theme }) =>
      $solid
        ? 'var(--ink)'
        : $theme === 'dark'
          ? 'rgba(255,255,255,0.2)'
          : 'rgba(10,10,12,0.14)'};

  .led {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--cyan);
  }

  &:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }

  @media (max-width: 600px) {
    &.hide-sm {
      display: none;
    }
  }
`;

const MenuBtn = styled.button<{ $theme: NavTheme; $open: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 11px;
  height: 44px;
  padding: 0 20px;
  border-radius: 999px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  backdrop-filter: blur(10px);
  background: ${({ $open, $theme }) =>
    $open
      ? '#fff'
      : $theme === 'dark'
        ? 'rgba(255,255,255,0.06)'
        : 'rgba(255,255,255,0.55)'};
  color: ${({ $open, $theme }) =>
    $open ? 'var(--ink)' : $theme === 'dark' ? '#fff' : 'var(--ink)'};
  border: 1px solid
    ${({ $open, $theme }) =>
      $open
        ? '#fff'
        : $theme === 'dark'
          ? 'rgba(255,255,255,0.2)'
          : 'rgba(10,10,12,0.14)'};
  transition: all 0.4s var(--ease-snap);

  .bars {
    position: relative;
    width: 16px;
    height: 10px;
  }
  .bars span {
    position: absolute;
    left: 0;
    width: 100%;
    height: 1.5px;
    background: currentColor;
    border-radius: 2px;
    transition: transform 0.4s var(--ease-snap);
  }
  .bars span:nth-child(1) {
    top: 0;
    transform: ${({ $open }) =>
      $open ? 'translateY(4.25px) rotate(45deg)' : 'none'};
  }
  .bars span:nth-child(2) {
    bottom: 0;
    transform: ${({ $open }) =>
      $open ? 'translateY(-4.25px) rotate(-45deg)' : 'none'};
  }
`;

// ─── Overlay ──────────────────────────────────────────────────────────

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 99;
  background: #08080b;
  color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const OverlayInner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 120px clamp(20px, 5vw, 80px) 40px;
  position: relative;
`;

const BigNav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const Row = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: baseline;
  gap: clamp(16px, 3vw, 40px);
  padding: clamp(8px, 1.4vw, 16px) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  overflow: hidden;

  &:first-child {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .idx {
    font-family: var(--font-grotesk);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--cyan);
    font-variant-numeric: tabular-nums;
  }

  .label {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(2.75rem, 9vw, 7rem);
    letter-spacing: -0.045em;
    line-height: 1.02;
    transition: transform 0.5s var(--ease-expo), color 0.4s var(--ease-snap);
  }

  &:hover .label,
  &.active .label {
    color: var(--cyan);
    transform: translateX(clamp(12px, 2vw, 32px));
  }
`;

const FootRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  flex-wrap: wrap;
  padding: 28px clamp(20px, 5vw, 80px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  .group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .glabel {
    font-size: 0.625rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 4px;
  }
  a {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.95rem;
    transition: color 0.25s;
  }
  a:hover {
    color: var(--cyan);
  }
`;

const LangBtn = styled.button`
  font-family: inherit;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #fff;
  padding: 9px 16px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: transparent;
  border-radius: 999px;
  transition: all 0.3s;

  &:hover {
    color: var(--ink);
    background: #fff;
    border-color: #fff;
  }
`;

const navItems = [
  { to: '/work', key: 'nav.work' },
  { to: '/services', key: 'nav.services' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
];

interface NavBarProps {
  surface?: NavTheme;
}

const NavBar = ({ surface }: NavBarProps) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navTheme, setNavTheme] = useState<NavTheme>(surface ?? 'dark');
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const reduced = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) stopScroll();
    else startScroll();
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // [data-nav-theme] section observer
  useEffect(() => {
    if (surface) {
      setNavTheme(surface);
      return;
    }
    let observer: IntersectionObserver | null = null;
    const timer = window.setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>('[data-nav-theme]');
      if (!els.length) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const th = entry.target.getAttribute(
                'data-nav-theme',
              ) as NavTheme | null;
              if (th) setNavTheme(th);
            }
          });
        },
        { rootMargin: '-72px 0px -99.4% 0px', threshold: 0 },
      );
      els.forEach((el) => observer!.observe(el));
    }, 60);
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [surface, location.pathname]);

  const theme: NavTheme = open ? 'dark' : navTheme;
  const isRu = language === 'ru';

  return (
    <>
      <Strip $theme={theme} $scrolled={scrolled}>
        <Wordmark to="/" aria-label="Sintara — home">
          Sintara<span className="dot">.</span>
        </Wordmark>

        <Cluster>
          <AudioToggle theme={theme} />
          <Pill
            to="/contact"
            $solid
            $theme={theme}
            className="hide-sm"
            data-cursor="hover"
          >
            <span className="led" />
            {isRu ? 'Связаться' : "Let's talk"}
          </Pill>
          <MenuBtn
            $theme={theme}
            $open={open}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t('nav.close') : t('nav.menu')}
            data-cursor="hover"
          >
            {open ? t('nav.close') : t('nav.menu')}
            <span className="bars" aria-hidden>
              <span />
              <span />
            </span>
          </MenuBtn>
        </Cluster>
      </Strip>

      <AnimatePresence>
        {open && (
          <Overlay
            initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-surface="dark"
          >
            <OverlayInner>
              <Crosshair
                style={{ top: '14%', right: '12%' }}
                $size={18}
                $color="rgba(255,255,255,0.4)"
              />
              <Crosshair
                style={{ bottom: '8%', left: '8%' }}
                $size={14}
                $color="rgba(255,255,255,0.3)"
              />
              <BigNav>
                {navItems.map((item, i) => (
                  <Row
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    data-cursor="hover"
                  >
                    <span className="idx">
                      0{i + 1}
                    </span>
                    <motion.span
                      className="label"
                      initial={reduced ? false : { y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.18 + i * 0.07,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{ display: 'inline-block' } as CSSProperties}
                    >
                      {t(item.key)}
                    </motion.span>
                  </Row>
                ))}
              </BigNav>
            </OverlayInner>

            <FootRow>
              <div className="group">
                <span className="glabel">{isRu ? 'Контакт' : 'Contact'}</span>
                <a href="mailto:sintaradev@gmail.com">sintaradev@gmail.com</a>
                <a href="https://t.me/IvanMitska" target="_blank" rel="noreferrer">
                  Telegram — @IvanMitska
                </a>
              </div>
              <div className="group">
                <span className="glabel">{isRu ? 'Соцсети' : 'Social'}</span>
                <a
                  href="https://www.instagram.com/sintara_studio/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </div>
              <LangBtn onClick={toggleLanguage}>
                {isRu ? 'EN' : 'RU'}
              </LangBtn>
            </FootRow>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
