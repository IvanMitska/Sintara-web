import { Link } from '../components/ui/Link';
import styled from 'styled-components';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Container from '../components/ui/Container';
import Eyebrow from '../components/ui/Eyebrow';
import SplitWords from '../components/ui/SplitWords';
import { useLanguage } from '../context/LanguageContext';

const Shell = styled.main`
  padding-top: 180px;
  padding-bottom: 120px;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Big = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(9rem, 36vw, 28rem);
  font-weight: 700;
  line-height: 0.82;
  letter-spacing: -0.06em;
  margin: 32px 0 48px;

  .zero {
    color: var(--accent);
  }
`;

const Body = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.025em;
  max-width: 20em;
  margin-bottom: 48px;
`;

const Links = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const Primary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 22px 36px;
  background: var(--ink);
  color: #fff;
  font-family: var(--font-grotesk);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 999px;
  border: 1.5px solid var(--ink);
  transition: background 0.3s var(--ease-snap), border-color 0.3s;

  &::after {
    content: '→';
    transition: transform 0.4s var(--ease-expo);
  }

  &:hover {
    background: var(--accent);
    border-color: var(--accent);

    &::after {
      transform: translateX(6px);
    }
  }
`;

const Secondary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 22px 32px;
  font-family: var(--font-grotesk);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink);
  border-radius: 999px;
  border: 1.5px solid var(--ink);
  transition: background 0.3s var(--ease-snap), color 0.3s;

  &:hover {
    background: var(--ink);
    color: #fff;
  }
`;

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <>
      <Navigation />
      <Shell data-nav-theme="light">
        <Container>
          <Eyebrow>{t('notFound.eyebrow')}</Eyebrow>
          <Big>
            4<span className="zero">0</span>4
          </Big>
          <Body>
            <SplitWords as="span" text={t('notFound.message')} />
          </Body>
          <Links>
            <Primary to="/">{t('notFound.home')}</Primary>
            <Secondary to="/work">{t('nav.work')}</Secondary>
          </Links>
        </Container>
      </Shell>
      <Footer />
    </>
  );
};

export default NotFound;
