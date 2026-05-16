import styled from 'styled-components';
import { motion } from 'framer-motion';
import Eyebrow from '../../components/ui/Eyebrow';
import SplitWords from '../../components/ui/SplitWords';
import { useLanguage } from '../../context/LanguageContext';

const Shell = styled.section`
  background: var(--ink);
  color: #fff;
  padding: 120px 32px 140px;

  @media (max-width: 900px) {
    padding: 80px 20px 96px;
  }
`;

const Inner = styled.div`
  max-width: 1680px;
  margin: 0 auto;
`;

const Head = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.4fr;
  align-items: end;
  gap: 48px;
  padding-bottom: 64px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding-bottom: 48px;
  }
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 11rem);
  font-weight: 700;
  line-height: 0.85;
  letter-spacing: -0.05em;
  text-transform: uppercase;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Step = styled(motion.div)`
  padding: 56px 32px 56px 0;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);

  &:nth-child(4n) {
    border-right: none;
  }

  @media (max-width: 1100px) {
    &:nth-child(2n) {
      border-right: none;
    }
    &:nth-child(4n) {
      border-right: 1px solid rgba(255, 255, 255, 0.12);
    }
  }
  @media (max-width: 640px) {
    border-right: none;
    padding: 40px 0;
  }
`;

const StepNum = styled.div`
  font-family: var(--font-display);
  font-size: clamp(4rem, 8vw, 9rem);
  font-weight: 700;
  line-height: 0.85;
  letter-spacing: -0.05em;
  color: var(--accent);
  margin-bottom: 32px;
`;

const StepTitle = styled.h3`
  font-family: var(--font-grotesk);
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
  text-transform: uppercase;
`;

const StepDesc = styled.p`
  font-family: var(--font-grotesk);
  font-size: 0.9375rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.65);
  max-width: 34ch;
`;

const Process = () => {
  const { t } = useLanguage();

  const steps = [
    { n: '01', k: '1' },
    { n: '02', k: '2' },
    { n: '03', k: '3' },
    { n: '04', k: '4' },
  ];

  return (
    <Shell data-surface="dark" data-nav-theme="dark">
      <Inner>
        <Head>
          <Eyebrow>{t('home.process.eyebrow')}</Eyebrow>
          <Title>
            <SplitWords as="span" text={t('home.process.title')} />
          </Title>
        </Head>


        <Grid>
          {steps.map((s, i) => (
            <Step
              key={s.n}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <StepNum>{s.n}</StepNum>
              <StepTitle>{t(`home.process.${s.k}.title`)}</StepTitle>
              <StepDesc>{t(`home.process.${s.k}.desc`)}</StepDesc>
            </Step>
          ))}
        </Grid>
      </Inner>
    </Shell>
  );
};

export default Process;
