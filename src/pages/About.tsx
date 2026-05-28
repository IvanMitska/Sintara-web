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
  font-size: clamp(4rem, 15vw, 16rem);
  font-weight: 700;
  line-height: 0.82;
  letter-spacing: -0.055em;
  text-transform: uppercase;
  margin: 24px 0 48px;
`;

const Lead = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.8vw, 2.5rem);
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: -0.025em;
  max-width: 1100px;
  color: var(--ink);
  text-transform: none;
`;

const Blocks = styled.section`
  padding-bottom: 120px;
`;

const Block = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 2.4fr;
  gap: 64px;
  padding: 64px 0;
  border-top: 1px solid var(--bone-line);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 40px 0;
  }
`;

const BlockTitle = styled.h2`
  font-family: var(--font-grotesk);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
  padding-top: 8px;
`;

const BlockBody = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.375rem, 2.4vw, 2rem);
  font-weight: 500;
  line-height: 1.22;
  letter-spacing: -0.02em;
  color: var(--ink);
`;

const PrinciplesShell = styled.section`
  padding: 120px 32px 160px;
  background: var(--ink);
  color: #fff;
`;

const PrinciplesInner = styled.div`
  max-width: 1680px;
  margin: 0 auto;
`;

const PrinciplesHead = styled.div`
  padding-bottom: 72px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
`;

const PrinciplesTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(3rem, 9vw, 10rem);
  font-weight: 700;
  line-height: 0.85;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  margin-top: 20px;
`;

const PrinciplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Principle = styled(motion.div)`
  padding: 64px 48px 64px 0;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);

  &:nth-child(2n) {
    padding-left: 48px;
    padding-right: 0;
    border-right: none;
  }

  @media (max-width: 900px) {
    padding: 40px 0;
    border-right: none;

    &:nth-child(2n) {
      padding-left: 0;
    }
  }
`;

const PNum = styled.div`
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--accent);
  margin-bottom: 16px;
`;

const PTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.035em;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

const PBody = styled.p`
  font-family: var(--font-grotesk);
  font-size: 1rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.7);
  max-width: 48ch;
`;

const About = () => {
  const { t } = useLanguage();

  return (
    <>
      <Navigation />
      <PageShell data-nav-theme="light">
        <Container>
          <Head>
            <Eyebrow>{t('about.eyebrow')}</Eyebrow>
            <Title>
              <SplitWords as="span" text={t('about.title1')} />
              {' '}
              <SplitWords as="span" text={t('about.title2')} delay={0.18} />
            </Title>
            <Lead>{t('about.lead')}</Lead>
          </Head>

          <Blocks>
            <Block
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <BlockTitle>{t('about.block1.title')}</BlockTitle>
              <BlockBody>{t('about.block1.body')}</BlockBody>
            </Block>
            <Block
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <BlockTitle>{t('about.block2.title')}</BlockTitle>
              <BlockBody>{t('about.block2.body')}</BlockBody>
            </Block>
          </Blocks>
        </Container>
      </PageShell>

      <PrinciplesShell data-surface="dark" data-nav-theme="dark">
        <PrinciplesInner>
          <PrinciplesHead>
            <Eyebrow>{t('about.principles.eyebrow')}</Eyebrow>
            <PrinciplesTitle>
              <SplitWords as="span" text={t('about.principles.title')} />
            </PrinciplesTitle>
          </PrinciplesHead>
          <PrinciplesGrid>
            {[1, 2, 3, 4].map((n, i) => (
              <Principle
                key={n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.8,
                  delay: (i % 2) * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <PNum>0{n}</PNum>
                <PTitle>{t(`about.principles.${n}.t`)}</PTitle>
                <PBody>{t(`about.principles.${n}.d`)}</PBody>
              </Principle>
            ))}
          </PrinciplesGrid>
        </PrinciplesInner>
      </PrinciplesShell>

      <Footer />
    </>
  );
};

export default About;
