import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Container from '../components/ui/Container';
import Eyebrow from '../components/ui/Eyebrow';
import SplitWords from '../components/ui/SplitWords';
import { useLanguage } from '../context/LanguageContext';

const PageShell = styled.main`
  padding-top: 160px;
  padding-bottom: 160px;

  @media (max-width: 900px) {
    padding-top: 120px;
    padding-bottom: 96px;
  }
`;

const Head = styled.header`
  padding: 64px 0 96px;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(4rem, 16vw, 18rem);
  font-weight: 700;
  line-height: 0.82;
  letter-spacing: -0.055em;
  text-transform: uppercase;
  margin: 24px 0 48px;
`;

const Sub = styled.p`
  font-family: var(--font-grotesk);
  font-size: clamp(1.125rem, 1.4vw, 1.375rem);
  line-height: 1.5;
  color: var(--muted);
  max-width: 600px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 64px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const ActionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  min-height: 440px;
  background: var(--ink);
  color: #fff;
  border: 1.5px solid var(--ink);
  transition: background 0.5s var(--ease-expo), border-color 0.5s var(--ease-expo);
  position: relative;
  overflow: hidden;

  &:hover {
    background: var(--accent);
    border-color: var(--accent);
  }

  @media (max-width: 900px) {
    min-height: 360px;
    padding: 32px;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.6);
`;

const ActionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.045em;
  text-transform: uppercase;
  margin-top: 40px;
`;

const Arrow = styled.span`
  font-size: 2rem;
  font-family: var(--font-grotesk);
`;

const CardFoot = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardDetail = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.7;
`;

const Sidelist = styled.div`
  display: flex;
  flex-direction: column;
`;

const SideHead = styled(Eyebrow)`
  margin-bottom: 8px;
`;

const SideLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 0;
  border-bottom: 1px solid var(--bone-line);
  transition: padding 0.55s var(--ease-expo);

  .info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  .name {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 2.4vw, 2rem);
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.035em;
    text-transform: uppercase;
    color: var(--ink);
    transition: color 0.3s var(--ease-snap);
  }

  .meta {
    font-family: var(--font-grotesk);
    font-size: 0.8125rem;
    line-height: 1.4;
    color: var(--muted);
  }

  .arrow {
    flex: none;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 1.5px solid var(--bone-line);
    display: grid;
    place-items: center;
    font-size: 0.9375rem;
    color: var(--ink);
    transition:
      transform 0.5s var(--ease-expo),
      background 0.35s var(--ease-snap),
      border-color 0.35s var(--ease-snap),
      color 0.35s var(--ease-snap);
  }

  &:hover {
    padding-left: 16px;

    .name {
      color: var(--accent);
    }
    .arrow {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
      transform: rotate(-45deg) scale(1.05);
    }
  }
`;

const Contact = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />
      <PageShell data-nav-theme="light">
        <Container>
          <Head>
            <Eyebrow>{t('contact.page.eyebrow')}</Eyebrow>
            <Title>
              <SplitWords as="span" text={t('contact.page.title1')} />
              {' '}
              <SplitWords
                as="span"
                text={t('contact.page.title2')}
                delay={0.18}
              />
            </Title>
            <Sub>{t('contact.page.sub')}</Sub>
          </Head>

          <Grid>
            <ActionCard to="/brief">
              <Top>
                <span>01 — {t('contact.page.brief')}</span>
                <span>{t('contact.page.response')}</span>
              </Top>
              <div>
                <ActionTitle>{t('contact.page.brief')}</ActionTitle>
                <CardFoot>
                  <CardDetail>{t('contact.brief.detail')}</CardDetail>
                  <Arrow>→</Arrow>
                </CardFoot>
              </div>
            </ActionCard>

            <Sidelist>
              <SideHead>{t('contact.channels.title')}</SideHead>
              <SideLink href="mailto:sintaradev@gmail.com">
                <span className="info">
                  <span className="name">Email</span>
                  <span className="meta">
                    sintaradev@gmail.com — {t('contact.email.meta')}
                  </span>
                </span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </SideLink>
              <SideLink
                href="https://t.me/IvanMitska"
                target="_blank"
                rel="noreferrer"
              >
                <span className="info">
                  <span className="name">Telegram</span>
                  <span className="meta">
                    @IvanMitska — {t('contact.telegram.meta')}
                  </span>
                </span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </SideLink>
              <SideLink
                href="https://www.instagram.com/sintara_studio/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="info">
                  <span className="name">Instagram</span>
                  <span className="meta">
                    @sintara_studio — {t('contact.instagram.meta')}
                  </span>
                </span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </SideLink>
            </Sidelist>
          </Grid>
        </Container>
      </PageShell>
      <Footer />
    </>
  );
};

export default Contact;

