import { useRef } from 'react';
import styled from 'styled-components';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import PillLink from '../../components/ui/PillLink';

/**
 * Editorial statement — an oversized headline with a flowing cyan ribbon
 * threading behind it. The ribbon drifts on scroll for a parallax depth.
 */

const Shell = styled.section`
  position: relative;
  background: var(--paper);
  color: var(--ink);
  padding: clamp(110px, 16vh, 220px) 0 clamp(90px, 13vh, 180px);
  overflow: hidden;
`;

const Top = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: clamp(48px, 8vh, 110px);
`;

const RibbonWrap = styled(motion.div)`
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(130vw, 1700px);
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;
`;

const Heading = styled.h2`
  position: relative;
  z-index: 1;
  margin: 0 auto;
  max-width: 1500px;
  padding: 0 clamp(20px, 5vw, 80px);
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.75rem, 9.2vw, 12rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
  text-align: center;
`;

const Line = styled.span`
  display: block;
  overflow: hidden;

  & > span {
    display: inline-block;
    will-change: transform;
  }
`;

const Foot = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1500px;
  margin: clamp(56px, 8vh, 110px) auto 0;
  padding: 0 clamp(20px, 5vw, 80px);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  flex-wrap: wrap;

  p {
    max-width: 440px;
    font-size: clamp(1rem, 1.15vw, 1.25rem);
    line-height: 1.5;
    color: var(--muted);
  }

  .marker {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink);
  }
`;

const Ribbon = () => (
  <svg viewBox="0 0 1700 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rib" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9CE4EA" />
        <stop offset="0.5" stopColor="#6FCED7" />
        <stop offset="1" stopColor="#8FDDE3" />
      </linearGradient>
    </defs>
    {/* depth shadow */}
    <path
      d="M250 720 C 150 460, 360 210, 720 235 C 1110 262, 1340 470, 1170 690 C 1030 870, 700 880, 560 700 C 450 560, 560 420, 760 460 C 940 496, 1010 640, 900 760"
      stroke="#3FA9B4"
      strokeWidth="88"
      strokeLinecap="round"
      opacity="0.35"
      transform="translate(0 26)"
    />
    <path
      d="M250 720 C 150 460, 360 210, 720 235 C 1110 262, 1340 470, 1170 690 C 1030 870, 700 880, 560 700 C 450 560, 560 420, 760 460 C 940 496, 1010 640, 900 760"
      stroke="url(#rib)"
      strokeWidth="84"
      strokeLinecap="round"
    />
  </svg>
);

const Statement = () => {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const isRu = language === 'ru';

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const ribbonY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const ribbonRotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  const lines = isRu
    ? ['Где идеи', 'становятся', 'продуктом']
    : ['Where ideas', 'become digital', 'products'];

  return (
    <Shell ref={ref} data-nav-theme="light">
      <RibbonWrap
        style={{
          y: reduced ? 0 : ribbonY,
          rotate: reduced ? 0 : ribbonRotate,
        }}
      >
        <Ribbon />
      </RibbonWrap>

      <Top>
        <PillLink to="/work" variant="light">
          {isRu ? 'Все проекты' : 'See all projects'}
        </PillLink>
      </Top>

      <Heading>
        {lines.map((line, i) => (
          <Line key={line}>
            <motion.span
              initial={reduced ? false : { y: '110%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.95,
                delay: i * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {line}
            </motion.span>
          </Line>
        ))}
      </Heading>

      <Foot>
        <p>
          {isRu
            ? 'Мы соединяем дизайн, инженерию и внимание к деталям, чтобы превращать амбициозные идеи в работающие цифровые продукты.'
            : 'We blend design, engineering and obsessive detail to turn ambitious ideas into digital products that actually ship.'}
        </p>
        <span className="marker">
          {isRu ? '⌖ С 2024 · Глобально' : '⌖ Est. 2024 · Worldwide'}
        </span>
      </Foot>
    </Shell>
  );
};

export default Statement;
