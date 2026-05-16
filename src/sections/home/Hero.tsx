import { useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import SplitWords from '../../components/ui/SplitWords';

/**
 * Hero — type-led, on the site's white / ink / purple system.
 * Composition is two-zone: the headline holds the left, the numbered
 * service index runs as a column on the right, value line + CTAs below.
 */

const Shell = styled.section`
  position: relative;
  padding: 132px 32px 56px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  color: var(--ink);
  overflow: clip;

  @media (max-width: 640px) {
    padding: 104px 20px 40px;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--bone-line);
  font-family: var(--font-grotesk);
  font-size: 0.8125rem;
  font-weight: 500;

  .studio {
    color: var(--muted);
    letter-spacing: -0.005em;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--ink);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 0.6875rem;
    white-space: nowrap;
  }

  @media (max-width: 560px) {
    font-size: 0.75rem;
    .status {
      font-size: 0.625rem;
      letter-spacing: 0.1em;
    }
  }
`;

const Dot = styled.span`
  position: relative;
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: var(--accent);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--accent);
    animation: heroPing 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
  }

  @keyframes heroPing {
    0% {
      transform: scale(1);
      opacity: 0.55;
    }
    70%,
    100% {
      transform: scale(3);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`;

const Mid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 56px;
  align-items: start;
  padding: 44px 0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 36px;
    padding: 36px 0;
  }
`;

const Headline = styled(motion.h1)`
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.035em;
  font-size: clamp(2.5rem, 9vw, 12rem);
  margin: 0;
  color: var(--ink);
  will-change: transform;

  @media (max-width: 640px) {
    font-size: clamp(2.5rem, 12vw, 5rem);
    letter-spacing: -0.03em;
  }
`;

const Line = styled.span`
  display: block;
  white-space: nowrap;

  @media (max-width: 768px) {
    white-space: normal;
  }
`;

const AccentLine = styled(Line)`
  color: var(--accent);
`;

const ServiceIndex = styled(motion.ul)`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-width: 232px;

  li {
    display: flex;
    align-items: baseline;
    gap: 14px;
    padding: 15px 0;
    border-top: 1px solid var(--bone-line);
    font-family: var(--font-grotesk);
    font-size: 0.8125rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ink);
  }

  li:last-child {
    border-bottom: 1px solid var(--bone-line);
  }

  .num {
    color: var(--accent);
    font-variant-numeric: tabular-nums;
    font-size: 0.6875rem;
  }

  @media (max-width: 900px) {
    min-width: 0;
  }
`;

const Lower = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 48px;
  align-items: end;
  padding-top: 32px;
  border-top: 1px solid var(--bone-line);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const Value = styled.p`
  font-family: var(--font-grotesk);
  font-size: clamp(1.0625rem, 1.35vw, 1.25rem);
  line-height: 1.45;
  font-weight: 400;
  color: var(--ink);
  max-width: 460px;
  letter-spacing: -0.005em;
`;

const Ctas = styled.div`
  display: flex;
  gap: 14px;
  justify-self: end;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    justify-self: start;
  }
`;

const Primary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 22px 36px;
  background: var(--ink);
  color: #fff;
  font-family: var(--font-grotesk);
  font-size: 0.9375rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 999px;
  border: 1.5px solid var(--ink);
  transition:
    background 0.3s var(--ease-snap),
    color 0.3s var(--ease-snap),
    border-color 0.3s var(--ease-snap);

  &::after {
    content: '→';
    transition: transform 0.4s var(--ease-expo);
    font-size: 1.125rem;
  }

  &:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;

    &::after {
      transform: translateX(6px);
    }
  }
`;

const Secondary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 22px 32px;
  background: transparent;
  color: var(--ink);
  font-family: var(--font-grotesk);
  font-size: 0.9375rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 999px;
  border: 1.5px solid var(--ink);
  transition: background 0.3s var(--ease-snap), color 0.3s var(--ease-snap);

  &:hover {
    background: var(--ink);
    color: #fff;
  }
`;

const Hero = () => {
  const { t, language } = useLanguage();
  const reduced = useReducedMotion();
  const shellRef = useRef<HTMLElement>(null);

  const services =
    language === 'ru'
      ? ['Сайты', 'Веб-приложения', 'Telegram-боты', 'CRM-системы']
      : ['Websites', 'Web apps', 'Telegram bots', 'Custom CRMs'];

  // One gentle, unified parallax on the headline
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smX = useSpring(mouseX, { stiffness: 90, damping: 22, mass: 0.55 });
  const smY = useSpring(mouseY, { stiffness: 90, damping: 22, mass: 0.55 });

  const { scrollYProgress } = useScroll({
    target: shellRef,
    offset: ['start start', 'end start'],
  });
  const smScroll = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  const headX = useTransform(smX, (x) => (reduced ? 0 : x * 8));
  const headY = useTransform<number, number>(
    [smY, smScroll],
    ([y, s]) => (reduced ? 0 : y * 5 - s * 55),
  );

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Shell
      ref={shellRef}
      data-nav-theme="light"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <TopRow>
        <span className="studio">
          {language === 'ru'
            ? 'Независимая цифровая студия'
            : 'Independent digital studio'}
        </span>
        <span className="status">
          <Dot aria-hidden="true" />
          {language === 'ru' ? 'Открыты для заказов' : 'Taking new work'}
        </span>
      </TopRow>

      <Mid>
        <Headline style={{ x: headX, y: headY }}>
          <Line>
            <SplitWords as="span" text={t('home.hero.line1')} delay={0.1} />
          </Line>
          <Line>
            <SplitWords as="span" text={t('home.hero.line2')} delay={0.3} />
          </Line>
          <AccentLine>
            <SplitWords as="span" text={t('home.hero.line3')} delay={0.52} />
          </AccentLine>
        </Headline>

        <ServiceIndex
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {services.map((service, i) => (
            <li key={service}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <span>{service}</span>
            </li>
          ))}
        </ServiceIndex>
      </Mid>

      <Lower>
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          <Value>{t('home.hero.sub')}</Value>
        </motion.div>
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <Ctas>
            <Primary to="/brief">{t('home.hero.primary')}</Primary>
            <Secondary to="/work">{t('home.hero.secondary')}</Secondary>
          </Ctas>
        </motion.div>
      </Lower>
    </Shell>
  );
};

export default Hero;
