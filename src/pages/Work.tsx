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
import { projects } from '../data/projects';

const PageShell = styled.main`
  padding-top: 160px;

  @media (max-width: 900px) {
    padding-top: 120px;
  }
`;

const Head = styled.header`
  padding: 64px 0 120px;
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
  max-width: 560px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 64px 24px;
  padding-bottom: 160px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 64px;
    padding-bottom: 96px;
  }
`;

const CaseWrap = styled(motion.div)<{ $span: number; $offset: number }>`
  grid-column: ${({ $span, $offset }) => `${$offset + 1} / span ${$span}`};

  @media (max-width: 1200px) {
    grid-column: span 6;
  }

  @media (max-width: 900px) {
    grid-column: 1 / -1;
  }
`;

const Cover = styled(Link)<{ $accent: string }>`
  display: block;
  position: relative;
  overflow: hidden;
  background: ${({ $accent }) => $accent};
  aspect-ratio: 16 / 11;
  width: 100%;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.4s var(--ease-expo);
    will-change: transform;
  }

  &:hover img {
    transform: scale(1.06);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.45) 0%,
      rgba(0, 0, 0, 0) 45%
    );
    pointer-events: none;
  }
`;

const CaseMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--bone-line);
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--muted);
`;

const CaseTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.6vw, 3.5rem);
  font-weight: 700;
  line-height: 0.92;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: var(--ink);
  margin: 20px 0 10px;
`;

const CaseSummary = styled.p`
  font-family: var(--font-grotesk);
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--muted);
  max-width: 56ch;
`;

const TagsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const Tag = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  padding: 6px 12px;
  border: 1px solid var(--bone-line);
  border-radius: 999px;
`;

const layouts = [
  { span: 8, offset: 0 },
  { span: 4, offset: 8 },
  { span: 5, offset: 2 },
  { span: 6, offset: 6 },
  { span: 7, offset: 0 },
];

const Work = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />
      <PageShell data-nav-theme="light">
        <Container>
          <Head>
            <Eyebrow>{t('work.eyebrow')}</Eyebrow>
            <Title>
              <SplitWords as="span" text={t('work.title1')} />
              {' '}
              <SplitWords as="span" text={t('work.title2')} delay={0.18} />
            </Title>
            <Sub>{t('work.sub')}</Sub>
          </Head>

          <Grid>
            {projects.map((p, i) => {
              const l = layouts[i % layouts.length];
              const i18n = p[language];
              return (
                <CaseWrap
                  key={p.slug}
                  $span={l.span}
                  $offset={l.offset}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.95,
                    delay: 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Cover to={`/work/${p.slug}`} $accent={p.accent}>
                    <img src={p.cover} alt={i18n.title} loading="lazy" />
                  </Cover>
                  <CaseMeta>
                    <span>
                      {p.number} — {p.client}
                    </span>
                    <span>{p.year}</span>
                  </CaseMeta>
                  <CaseTitle>{i18n.title.split(' — ')[0]}</CaseTitle>
                  <CaseSummary>{i18n.summary}</CaseSummary>
                  <TagsRow>
                    {p.tags.slice(0, 4).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </TagsRow>
                </CaseWrap>
              );
            })}
          </Grid>
        </Container>
      </PageShell>
      <Footer />
    </>
  );
};

export default Work;
