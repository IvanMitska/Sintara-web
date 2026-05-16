import styled from 'styled-components';
import { motion } from 'framer-motion';
import Eyebrow from '../../components/ui/Eyebrow';
import SplitWords from '../../components/ui/SplitWords';
import { useLanguage } from '../../context/LanguageContext';

const Shell = styled.section`
  padding: 160px 32px;
  background: #fff;
  color: var(--ink);

  @media (max-width: 900px) {
    padding: 96px 20px;
  }
`;

const Inner = styled.div`
  max-width: 1680px;
  margin: 0 auto;
`;

const Head = styled.div`
  padding-bottom: 72px;
  border-bottom: 1px solid var(--bone-line);
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 11rem);
  font-weight: 700;
  line-height: 0.85;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  margin-top: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.blockquote)`
  padding: 72px 48px 56px 0;
  border-right: 1px solid var(--bone-line);
  border-bottom: 1px solid var(--bone-line);
  margin: 0;
  position: relative;

  &::before {
    content: '\\201D';
    position: absolute;
    top: 28px;
    right: 48px;
    font-family: var(--font-display);
    font-size: 8rem;
    line-height: 1;
    color: var(--bone-line);
    transition: color 0.5s var(--ease-snap);
    pointer-events: none;
    z-index: 0;
  }

  &:hover::before {
    color: var(--accent-soft);
  }

  &:hover .accent-dot {
    width: 64px;
  }

  &:nth-child(2n) {
    padding-left: 48px;
    padding-right: 0;
    border-right: none;

    &::before {
      right: 0;
    }
  }

  @media (max-width: 900px) {
    padding: 48px 0;
    border-right: none;

    &::before {
      right: 0;
      font-size: 6rem;
    }

    &:nth-child(2n) {
      padding-left: 0;
    }
  }
`;

const Accent = styled.div`
  width: 24px;
  height: 24px;
  background: var(--accent);
  border-radius: 999px;
  margin-bottom: 32px;
  transition: width 0.55s var(--ease-expo);
`;

const Quote = styled.p`
  position: relative;
  z-index: 1;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.8vw, 2.25rem);
  line-height: 1.2;
  letter-spacing: -0.025em;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 32px;
`;

const Attr = styled.footer`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: var(--font-grotesk);
  font-style: normal;
`;

const Name = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: var(--ink);
`;

const Role = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--muted);
`;

const Testimonials = () => {
  const { t } = useLanguage();
  const items = ['1', '2', '3', '4'];

  return (
    <Shell data-nav-theme="light">
      <Inner>
        <Head>
          <Eyebrow>{t('home.testimonials.eyebrow')}</Eyebrow>
          <Title>
            <SplitWords as="span" text={t('home.testimonials.title1')} />{' '}
            <SplitWords as="span" text={t('home.testimonials.title2')} delay={0.18} />
          </Title>
        </Head>

        <Grid>
          {items.map((k, i) => (
            <Card
              key={k}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.8,
                delay: (i % 2) * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Accent className="accent-dot" />
              <Quote>{t(`home.testimonials.${k}.quote`)}</Quote>
              <Attr>
                <Name>{t(`home.testimonials.${k}.name`)}</Name>
                <Role>{t(`home.testimonials.${k}.role`)}</Role>
              </Attr>
            </Card>
          ))}
        </Grid>
      </Inner>
    </Shell>
  );
};

export default Testimonials;
