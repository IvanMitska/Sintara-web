import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Container from '../components/ui/Container';
import Eyebrow from '../components/ui/Eyebrow';
import SplitWords from '../components/ui/SplitWords';
import { useLanguage } from '../context/LanguageContext';

const PageShell = styled.main`
  padding-top: 160px;

  @media (max-width: 900px) {
    padding-top: 120px;
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
  max-width: 640px;
`;

const List = styled.div`
  padding-bottom: 120px;
  border-top: 1px solid var(--bone-line);

  @media (max-width: 900px) {
    padding-bottom: 72px;
  }
`;

const Row = styled(motion.article)`
  display: grid;
  grid-template-columns: 80px minmax(0, 1.2fr) minmax(0, 1.6fr) 140px;
  align-items: start;
  gap: 48px;
  padding: 56px 0;
  border-bottom: 1px solid var(--bone-line);
  position: relative;
  overflow: hidden;
  transition: color 0.4s var(--ease-snap);
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--accent);
    transform: translateY(101%);
    transition: transform 0.75s var(--ease-expo);
    z-index: 0;
  }

  &:hover::before {
    transform: translateY(0);
  }

  & > * {
    position: relative;
    z-index: 1;
    transition: color 0.4s var(--ease-snap);
  }

  &:hover,
  &:hover .muted,
  &:hover .val {
    color: #fff;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 60px 1fr;
    gap: 16px 24px;
    padding: 40px 0;

    .desc {
      grid-column: 2 / -1;
    }
    .price {
      grid-column: 2 / -1;
      justify-self: start;
      text-align: left;
      margin-top: 12px;
    }
  }
`;

const Num = styled.div`
  font-family: var(--font-grotesk);
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  padding-top: 16px;
`;

const Name = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5vw, 4.5rem);
  font-weight: 700;
  line-height: 0.92;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: var(--ink);
`;

const Desc = styled.p`
  font-family: var(--font-grotesk);
  font-size: 1rem;
  line-height: 1.55;
  color: var(--muted);
  padding-top: 12px;
  max-width: 52ch;
`;

const Price = styled.div`
  text-align: right;
  padding-top: 14px;

  .label {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--muted);
    display: block;
    margin-bottom: 4px;
  }

  .val {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1.625rem;
    letter-spacing: -0.015em;
    color: var(--ink);
  }
`;

const services = [
  {
    n: '01',
    nameKey: 'home.services.1.title',
    descKey: 'home.services.1.desc',
    price: '$1 500',
    id: 'web',
  },
  {
    n: '02',
    nameKey: 'home.services.2.title',
    descKey: 'home.services.2.desc',
    price: '$15 000',
    id: 'webapp',
  },
  {
    n: '03',
    nameKey: 'home.services.3.title',
    descKey: 'home.services.3.desc',
    price: '$1 200',
    id: 'bot',
  },
  {
    n: '04',
    nameKey: 'home.services.4.title',
    descKey: 'home.services.4.desc',
    price: '$5 000',
    id: 'crm',
  },
  {
    n: '05',
    nameKey: 'home.services.5.title',
    descKey: 'home.services.5.desc',
    price: '$3 000',
    id: 'redesign',
  },
  {
    n: '06',
    nameKey: 'home.services.6.title',
    descKey: 'home.services.6.desc',
    price: '$900/mo',
    id: 'support',
  },
];

const Cta = styled.div`
  padding-top: 80px;
  display: flex;
  justify-content: center;
`;

const CtaLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 22px 44px;
  background: var(--ink);
  color: #fff;
  font-family: var(--font-grotesk);
  font-size: 0.9375rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 999px;
  border: 1.5px solid var(--ink);
  transition: background 0.3s var(--ease-snap), border-color 0.3s var(--ease-snap);

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

const Services = () => {
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
            <Eyebrow>{t('services.page.eyebrow')}</Eyebrow>
            <Title>
              <SplitWords as="span" text={t('services.page.title1')} />
              {' '}
              <SplitWords
                as="span"
                text={t('services.page.title2')}
                delay={0.18}
              />
            </Title>
            <Sub>{t('services.page.sub')}</Sub>
          </Head>

          <List>
            {services.map((s, i) => (
              <Row
                key={s.n}
                id={s.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.75,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Num className="muted">{s.n}</Num>
                <Name>{t(s.nameKey)}</Name>
                <Desc className="desc muted">{t(s.descKey)}</Desc>
                <Price className="price">
                  <span className="label muted">
                    {t('services.page.priceFrom')}
                  </span>
                  <span className="val">{s.price}</span>
                </Price>
              </Row>
            ))}
          </List>

          <Cta>
            <CtaLink to="/brief">{t('nav.getStarted')}</CtaLink>
          </Cta>
        </Container>
      </PageShell>
      <Footer />
    </>
  );
};

export default Services;
