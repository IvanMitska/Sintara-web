import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';
import PillLink from '../../components/ui/PillLink';

/**
 * Editorial statement — CTA pill + a short supporting paragraph and a
 * dateline marker. The oversized "Where ideas become digital products"
 * headline that used to sit between them was dropped on the user's
 * request: it was leaving a tall void between the pill and the foot and
 * adding nothing the surrounding sections don't already say.
 */

const Shell = styled.section`
  position: relative;
  z-index: 1;
  background: transparent;
  color: var(--ink);
  /* Compact vertical rhythm — no editorial headline lives here anymore,
     so the section is just pill + foot. Keep just enough top/bottom to
     separate it from Manifesto above and the next section below. */
  padding: clamp(24px, 4vh, 56px) 0 clamp(40px, 6vh, 80px);
`;

const Top = styled.div`
  display: flex;
  justify-content: center;
  /* Pill → foot breathing room. Roughly doubled from the previous pass
     so the CTA reads as a standalone accent with a clear pause before
     the supporting paragraph, instead of fusing into a single group. */
  margin-bottom: clamp(56px, 8vh, 120px);
`;

const Foot = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1500px;
  margin: 0 auto;
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
  const isRu = language === 'ru';

  return (
    <Shell data-nav-theme="light">
      <Top>
        <PillLink to="/work" variant="light">
          {isRu ? 'Все проекты' : 'See all projects'}
        </PillLink>
      </Top>

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
