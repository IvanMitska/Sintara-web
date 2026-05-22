import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import PillLink from '../../components/ui/PillLink';

/**
 * Editorial statement — an oversized headline that the page-wide ribbon
 * threads through. The decorative ribbon now lives at the page level
 * (see PageRibbon), so this section is just type on a shared surface.
 */

const Shell = styled.section`
  position: relative;
  z-index: 1;
  background: transparent;
  color: var(--ink);
  padding: clamp(56px, 8vh, 110px) 0 clamp(56px, 8vh, 110px);
`;

const Top = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: clamp(28px, 4vh, 56px);
`;

const Heading = styled.h2`
  position: relative;
  z-index: 1;
  margin: 0 auto;
  max-width: 1500px;
  padding: 0 clamp(20px, 5vw, 80px);
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.75rem, 9.2vw, 12rem);
  line-height: 0.95;
  letter-spacing: -0.02em;
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
  margin: clamp(32px, 4.5vh, 64px) auto 0;
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

const Statement = () => {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const isRu = language === 'ru';

  const lines = isRu
    ? ['Где идеи', 'становятся', 'продуктом']
    : ['Where ideas', 'become digital', 'products'];

  return (
    <Shell data-nav-theme="light">
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
              viewport={{ once: true, amount: 0.25 }}
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
