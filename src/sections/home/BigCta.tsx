import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SplitWords from '../../components/ui/SplitWords';
import { useLanguage } from '../../context/LanguageContext';

const Shell = styled.section`
  padding: 180px 32px;
  background: var(--accent);
  color: #fff;
  position: relative;
  overflow: hidden;

  @media (max-width: 900px) {
    padding: 112px 20px;
  }
`;

const Inner = styled.div`
  max-width: 1680px;
  margin: 0 auto;
`;

const Headline = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 14vw, 17rem);
  font-weight: 700;
  line-height: 0.82;
  letter-spacing: -0.055em;
  margin: 0;
  text-transform: uppercase;

  span {
    display: block;
  }
`;

const Lower = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 48px;
  margin-top: 80px;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-top: 48px;
  }
`;

const Sub = styled.p`
  font-family: var(--font-grotesk);
  font-size: clamp(1rem, 1.3vw, 1.25rem);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  max-width: 520px;
`;

const Ctas = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

const Primary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 26px 48px;
  background: #fff;
  color: var(--ink);
  font-family: var(--font-grotesk);
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 999px;
  border: 1.5px solid #fff;
  transition: background 0.3s var(--ease-snap), color 0.3s var(--ease-snap),
    border-color 0.3s var(--ease-snap);

  &::after {
    content: '→';
    font-size: 1.125rem;
    transition: transform 0.4s var(--ease-expo);
  }

  &:hover {
    background: var(--ink);
    color: #fff;
    border-color: var(--ink);

    &::after {
      transform: translateX(8px);
    }
  }

  @media (max-width: 900px) {
    padding: 20px 36px;
  }
`;

const Secondary = styled.a`
  font-family: var(--font-grotesk);
  font-size: 1rem;
  color: #fff;
  opacity: 0.9;
  padding-bottom: 4px;
  border-bottom: 1px solid currentColor;
  transition: opacity 0.3s var(--ease-snap);

  &:hover {
    opacity: 1;
  }
`;

const BigCta = () => {
  const { t } = useLanguage();

  return (
    <Shell data-surface="dark" data-nav-theme="dark">
      <Inner>
        <Headline>
          <span>
            <SplitWords as="span" text={t('home.cta.line1')} />
          </span>
          <span>
            <SplitWords as="span" text={t('home.cta.line2')} delay={0.15} />
          </span>
          <span>
            <SplitWords as="span" text={t('home.cta.line3')} delay={0.3} />
          </span>
        </Headline>

        <Lower>
          <Sub>{t('home.cta.sub')}</Sub>
          <Ctas>
            <Primary to="/brief">{t('home.cta.primary')}</Primary>
            <Secondary href="mailto:sintaradev@gmail.com">
              {t('home.cta.secondary')}
            </Secondary>
          </Ctas>
        </Lower>
      </Inner>
    </Shell>
  );
};

export default BigCta;
