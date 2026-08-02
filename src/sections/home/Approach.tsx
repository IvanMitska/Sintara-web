import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';
import PillLink from '../../components/ui/PillLink';
import Reveal from '../../components/ui/Reveal';
import MaskedLines from '../../components/ui/MaskedLines';

/**
 * "Bold ideas, brought to life" — a statement and a project still shown
 * in its natural colours. The page-wide ribbon (see PageRibbon) carries
 * the visual accent that the old standalone blue disc used to.
 */

const Shell = styled.section`
  position: relative;
  z-index: 1;
  background: transparent;
  color: var(--ink);
  padding: clamp(90px, 13vh, 190px) clamp(20px, 5vw, 80px);
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1500px;
  margin: 0 auto;
`;

const Heading = styled.h2`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.5rem, 8vw, 9.5rem);
  line-height: 0.96;
  letter-spacing: -0.02em;
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
  background: var(--paper);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.04);
    transition: transform 0.9s var(--ease-expo);
  }

  &:hover img {
    transform: scale(1.1);
  }

  /* keeps the white tag readable now that the image isn't tinted */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.45), transparent);
    pointer-events: none;
  }

  .tag {
    position: absolute;
    z-index: 1;
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
  const isRu = language === 'ru';

  const lines = isRu
    ? ['Смелые идеи,', 'воплощённые в жизнь']
    : ['Bold ideas,', 'brought to life'];

  return (
    <Shell data-nav-theme="light">
      <Inner>
        <Heading>
          <MaskedLines lines={lines} />
        </Heading>

        <Row>
          <Reveal>
            <Still data-cursor="hover">
              {/* Standalone homepage showcase mockup — intentionally not
                  tied to any real project on the site, so it lives in
                  /public/home/ rather than /public/projects/<slug>/.
                  No v() wrap: cache-bust helper only stamps /projects/*
                  paths; if this file ever needs a forced refresh we can
                  rename it (e.g. approach-v2.avif) or extend the helper. */}
              <img
                src="/home/approach.avif"
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
                  ? 'Начинаем с задачи бизнеса, а не с макета: сперва — как продукт работает и на чём зарабатывает, потом — как он выглядит. Поэтому то, что мы делаем, выразительно снаружи и безупречно внутри.'
                  : 'We start with the business problem, not the mockup — first how the product works and where it makes money, then how it looks. That’s why our work is expressive outside and flawless under the hood.'}
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
