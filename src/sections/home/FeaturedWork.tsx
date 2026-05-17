import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { projects } from '../../data/projects';
import Reveal from '../../components/ui/Reveal';
import PillLink from '../../components/ui/PillLink';

/**
 * Featured work — an editorial project grid. Tag row, full-bleed cover,
 * oversized title that slides on hover.
 */

const Shell = styled.section`
  background: var(--paper);
  color: var(--ink);
  padding: clamp(80px, 11vh, 150px) clamp(20px, 5vw, 80px)
    clamp(90px, 13vh, 170px);
`;

const Inner = styled.div`
  max-width: 1500px;
  margin: 0 auto;
`;

const Head = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 40px;
  align-items: end;
  margin-bottom: clamp(48px, 7vh, 90px);

  h2 {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(2.75rem, 9vw, 11rem);
    line-height: 0.9;
    letter-spacing: -0.05em;
  }

  p {
    font-size: 0.9375rem;
    line-height: 1.55;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    max-width: 320px;
    justify-self: end;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 20px;
    p {
      justify-self: start;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(28px, 4vw, 64px) clamp(24px, 3vw, 48px);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const CardWrap = styled(motion.div)`
  &:nth-child(even) {
    margin-top: clamp(0px, 6vw, 80px);
  }
  @media (max-width: 720px) {
    &:nth-child(even) {
      margin-top: 0;
    }
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  color: var(--ink);

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 14px;
    margin-bottom: 16px;
    font-size: 0.625rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .tags span::after {
    content: '·';
    margin-left: 14px;
    color: var(--accent);
  }
  .tags span:last-child::after {
    content: '';
  }

  .frame {
    position: relative;
    aspect-ratio: 16 / 11;
    border-radius: 14px;
    overflow: hidden;
    background: var(--bone-dim);
  }
  .frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.02);
    transition: transform 0.9s var(--ease-expo);
  }

  .meta {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin-top: 18px;
  }
  .title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.5rem, 3vw, 2.75rem);
    letter-spacing: -0.035em;
    line-height: 1;
    transition: transform 0.5s var(--ease-expo), color 0.4s var(--ease-snap);
  }
  .arrow {
    font-size: 1.5rem;
    opacity: 0;
    transform: translateX(-8px);
    transition: opacity 0.3s, transform 0.4s var(--ease-expo);
  }
  .year {
    font-size: 0.75rem;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }

  &:hover .frame img {
    transform: scale(1.08);
  }
  &:hover .title {
    color: var(--accent);
    transform: translateX(10px);
  }
  &:hover .arrow {
    opacity: 1;
    transform: translateX(0);
  }
`;

const More = styled.div`
  display: flex;
  justify-content: center;
  margin-top: clamp(56px, 8vh, 100px);
`;

const FeaturedWork = () => {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const isRu = language === 'ru';
  const featured = projects.slice(0, 4);

  return (
    <Shell data-nav-theme="light">
      <Inner>
        <Head>
          <Reveal as="h2">{isRu ? 'Избранные работы' : 'Featured work'}</Reveal>
          <Reveal as="p" delay={0.1}>
            {isRu
              ? 'Подборка цифровых продуктов для амбициозных команд'
              : 'A selection of digital products built for ambitious teams'}
          </Reveal>
        </Head>

        <Grid>
          {featured.map((p, i) => {
            const loc = isRu ? p.ru : p.en;
            return (
              <CardWrap
                key={p.slug}
                initial={reduced ? false : { opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.9,
                  delay: (i % 2) * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Card to={`/work/${p.slug}`} data-cursor="hover">
                  <div className="tags">
                    {p.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="frame">
                    <img src={p.cover} alt={loc.title} loading="lazy" />
                  </div>
                  <div className="meta">
                    <span className="title">
                      {p.client}
                      <span className="arrow" aria-hidden>
                        {'  ↗'}
                      </span>
                    </span>
                    <span className="year">{p.year}</span>
                  </div>
                </Card>
              </CardWrap>
            );
          })}
        </Grid>

        <More>
          <PillLink to="/work" variant="dark" arrow>
            {isRu ? 'Смотреть все работы' : 'View all work'}
          </PillLink>
        </More>
      </Inner>
    </Shell>
  );
};

export default FeaturedWork;
