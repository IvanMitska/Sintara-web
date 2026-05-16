import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import Eyebrow from '../../components/ui/Eyebrow';
import { useLanguage } from '../../context/LanguageContext';

const Shell = styled.section`
  padding: 160px 32px;
  background: #fff;
  color: var(--ink);

  @media (max-width: 900px) {
    padding: 96px 20px;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 64px;
  align-items: start;
  max-width: 1680px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const Body = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.4vw, 3rem);
  line-height: 1.18;
  letter-spacing: -0.03em;
  font-weight: 500;
  color: var(--ink);
  text-transform: none;

  .accent {
    color: var(--accent);
  }
`;

const Footnote = styled.p`
  margin-top: 40px;
  font-family: var(--font-grotesk);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
`;

/**
 * Word-by-word scroll reveal. Each word starts gray and "lights up"
 * as the section scrolls into view. A more Red-Collar-ish move than
 * a static serif paragraph.
 */
const Manifesto = () => {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const words = t('home.manifesto.body').split(' ');

  return (
    <Shell data-nav-theme="light">
      <Layout>
        <div>
          <Eyebrow>{t('home.manifesto.eyebrow')}</Eyebrow>
        </div>

        <div>
          <Body>
            {reduced ? (
              <span>{t('home.manifesto.body')}</span>
            ) : (
              words.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0.12 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.022,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.25em',
                  }}
                >
                  {word}
                </motion.span>
              ))
            )}
          </Body>
          <Footnote>{t('home.manifesto.footnote')}</Footnote>
        </div>
      </Layout>
    </Shell>
  );
};

export default Manifesto;
