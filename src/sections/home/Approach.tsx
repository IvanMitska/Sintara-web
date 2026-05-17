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
import Reveal from '../../components/ui/Reveal';

/**
 * "Bold ideas, brought to life" — a statement with a big electric-blue
 * disc bleeding off the top-left and a blue-duotone project still.
 */

const Shell = styled.section`
  position: relative;
  background: var(--paper);
  color: var(--ink);
  padding: clamp(90px, 13vh, 190px) clamp(20px, 5vw, 80px);
  overflow: hidden;
`;

const Disc = styled(motion.div)`
  position: absolute;
  left: -16vw;
  top: -22vw;
  width: 52vw;
  height: 52vw;
  max-width: 760px;
  max-height: 760px;
  border-radius: 50%;
  background: var(--accent);
  z-index: 0;
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1500px;
  margin: 0 auto;
`;

const Heading = styled.h2`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.5rem, 8vw, 9.5rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
  margin: 0 0 clamp(48px, 8vh, 120px);

  span {
    display: block;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 80px);
  align-items: end;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Still = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 14px;
  overflow: hidden;
  background: var(--accent);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    mix-blend-mode: luminosity;
    opacity: 0.9;
    transform: scale(1.04);
    transition: transform 0.9s var(--ease-expo);
  }

  &:hover img {
    transform: scale(1.1);
  }

  .tag {
    position: absolute;
    left: 18px;
    bottom: 16px;
    font-size: 0.625rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #fff;
  }
`;

const TextCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;

  p {
    font-size: clamp(1.0625rem, 1.5vw, 1.5rem);
    line-height: 1.5;
    color: var(--ink);
    max-width: 520px;
    letter-spacing: -0.01em;
  }
`;

const Approach = () => {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const isRu = language === 'ru';

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const discY = useTransform(scrollYProgress, [0, 1], [-80, 120]);

  const lines = isRu
    ? ['Смелые идеи,', 'воплощённые в жизнь']
    : ['Bold ideas,', 'brought to life'];

  return (
    <Shell ref={ref} data-nav-theme="light">
      <Disc style={{ y: reduced ? 0 : discY }} aria-hidden />

      <Inner>
        <Heading>
          {lines.map((l, i) => (
            <Reveal as="span" key={l} delay={i * 0.08} y={50}>
              {l}
            </Reveal>
          ))}
        </Heading>

        <Row>
          <Reveal>
            <Still data-cursor="hover">
              <img
                src="/projects/kaif-crm/cover.webp"
                alt=""
                loading="lazy"
              />
              <span className="tag">Web · Product · Engineering</span>
            </Still>
          </Reveal>

          <Reveal delay={0.1}>
            <TextCol>
              <p>
                {isRu
                  ? 'Мы соединяем стратегию, дизайн и инженерию, чтобы создавать сайты, веб-приложения и Telegram-ботов — выразительные внешне и безупречные внутри.'
                  : 'We combine strategy, design and engineering to build websites, web apps and Telegram bots that look sharp and run flawlessly — from launch to scale.'}
              </p>
              <PillLink to="/about" variant="dark">
                {isRu ? 'Наш подход' : 'Our approach'}
              </PillLink>
            </TextCol>
          </Reveal>
        </Row>
      </Inner>
    </Shell>
  );
};

export default Approach;
