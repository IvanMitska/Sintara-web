import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Eyebrow from '../../components/ui/Eyebrow';
import { useLanguage } from '../../context/LanguageContext';
import { projects } from '../../data/projects';

const Shell = styled.section`
  background: #fff;
  color: var(--ink);
  padding: 120px 0 0;
`;

const Head = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 32px;
  padding: 0 32px 80px;
  max-width: 1680px;
  margin: 0 auto;
  border-bottom: 1px solid var(--bone-line);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 0 20px 56px;
  }
`;

const BigTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 13vw, 14rem);
  font-weight: 700;
  line-height: 0.82;
  letter-spacing: -0.055em;
  text-transform: uppercase;
  margin-top: 28px;
`;

const AllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 18px 30px;
  background: var(--ink);
  color: #fff;
  font-family: var(--font-grotesk);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 999px;
  border: 1.5px solid var(--ink);
  transition:
    background 0.3s var(--ease-snap),
    color 0.3s var(--ease-snap),
    border-color 0.3s var(--ease-snap);

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

// ─── Case block ────────────────────────────────────────────────────────

const CaseBlock = styled(motion.article)`
  position: relative;
  background: #fff;
  color: var(--ink);
  padding: 96px 32px 104px;
  isolation: isolate;

  @media (max-width: 1024px) {
    padding: 72px 24px 80px;
  }

  @media (max-width: 640px) {
    padding: 56px 20px 64px;
  }
`;

const CaseInner = styled.div`
  max-width: 1680px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

/**
 * Top counter row spanning the full case width above the case content.
 * Big "02" on the left, dashed progress bar in the middle, "of 05" on the
 * right. Tells the reader exactly where they are in the reel.
 */
const CounterRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 24px;
  padding-bottom: 32px;
  margin-bottom: 56px;
  border-bottom: 1px solid var(--bone-line);

  @media (max-width: 1024px) {
    margin-bottom: 40px;
    padding-bottom: 24px;
  }
`;

const CounterNumber = styled.div`
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--ink);

  .total {
    color: var(--muted);
    font-size: 0.5em;
    margin-left: 10px;
    letter-spacing: 0;
    vertical-align: 8px;
  }
`;

const ProgressBar = styled.div<{ $progress: number }>`
  position: relative;
  height: 2px;
  background: var(--bone-line);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    width: ${({ $progress }) => `${$progress}%`};
    background: var(--accent);
    transform-origin: left;
  }
`;

const CategoryChip = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--accent);
  padding: 8px 14px;
  border: 1.5px solid var(--accent);
  border-radius: 999px;
  background: rgba(124, 58, 237, 0.05);
  white-space: nowrap;
`;

const CaseGrid = styled.div<{ $imageSide: 'left' | 'right' }>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 40px 48px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const TextCol = styled.div<{ $imageSide: 'left' | 'right' }>`
  grid-column: ${({ $imageSide }) =>
    $imageSide === 'left' ? '8 / 13' : '1 / 6'};
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-column: 1 / -1;
    order: 2;
    gap: 24px;
  }
`;

const ImageCol = styled.div<{ $imageSide: 'left' | 'right' }>`
  grid-column: ${({ $imageSide }) =>
    $imageSide === 'left' ? '1 / 8' : '6 / 13'};

  @media (max-width: 1024px) {
    grid-column: 1 / -1;
    order: 1;
  }
`;

/**
 * Meta line — client · year. No more dot/divider tricks; just em-dashes
 * separating the parts so it reads like an editorial caption.
 */
const MetaLine = styled.div`
  font-family: var(--font-grotesk);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  .sep {
    width: 18px;
    height: 1px;
    background: var(--bone-line);
    display: inline-block;
  }
`;

const CaseTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 6.4vw, 7.25rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: inherit;
  margin: 0;

  a {
    color: inherit;
    transition: color 0.4s var(--ease-snap);
    background-image: linear-gradient(var(--accent), var(--accent));
    background-size: 0% 8px;
    background-position: 0 100%;
    background-repeat: no-repeat;
    transition:
      color 0.4s var(--ease-snap),
      background-size 0.6s var(--ease-expo);
  }

  a:hover {
    color: var(--accent);
  }
`;

const Summary = styled.p`
  font-family: var(--font-grotesk);
  font-size: clamp(1rem, 1.15vw, 1.125rem);
  line-height: 1.55;
  color: var(--muted);
  max-width: 46ch;
`;

/**
 * "What we delivered" — surfaces the `role` data that was previously
 * unused. A small label above a comma-separated list. Concrete proof
 * of scope without forcing the reader to open the case.
 */
const Deliverables = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
  border-top: 1px solid var(--bone-line);
  border-bottom: 1px solid var(--bone-line);

  .label {
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--muted);
  }

  .body {
    font-family: var(--font-grotesk);
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--ink);
  }
`;

const TagsRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--muted);
  padding: 6px 12px;
  border: 1px solid var(--bone-line);
  border-radius: 999px;
`;

/**
 * Image stage — clean, contained. Hover reveals an arrow badge in the
 * top-right corner and a "Open case" caption sliding up from the
 * bottom. The whole tile is one click target — no separate button
 * elsewhere needed.
 */
const ImageStage = styled(Link)`
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  isolation: isolate;
  overflow: hidden;
  background: var(--bone-line);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    transition: transform 1.4s var(--ease-expo);
    will-change: transform;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0) 55%
    );
    z-index: 2;
    opacity: 0;
    transition: opacity 0.5s var(--ease-snap);
  }

  &:hover {
    img {
      transform: scale(1.04);
    }
    &::before {
      opacity: 1;
    }
  }
`;

const CornerArrow = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  color: var(--ink);
  display: grid;
  place-items: center;
  font-size: 1.125rem;
  transform: scale(0.8);
  opacity: 0;
  transition:
    transform 0.5s var(--ease-expo),
    opacity 0.4s var(--ease-snap),
    background 0.3s var(--ease-snap);

  ${ImageStage}:hover & {
    transform: scale(1);
    opacity: 1;
  }

  ${ImageStage}:hover &:hover {
    background: var(--accent);
    color: #fff;
  }

  @media (max-width: 640px) {
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
  }
`;

const HoverCaption = styled.span`
  position: absolute;
  left: 24px;
  bottom: 24px;
  z-index: 3;
  font-family: var(--font-grotesk);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #fff;
  transform: translateY(12px);
  opacity: 0;
  transition:
    transform 0.5s var(--ease-expo),
    opacity 0.4s var(--ease-snap);

  ${ImageStage}:hover & {
    transform: translateY(0);
    opacity: 1;
  }
`;

const CATEGORY_KEY: Record<string, string> = {
  website: 'portfolio.category.website',
  bot: 'portfolio.category.bot',
  crm: 'portfolio.category.crm',
  saas: 'portfolio.category.saas',
};

const SelectedWork = () => {
  const { language, t } = useLanguage();

  return (
    <Shell data-nav-theme="light">
      <Head>
        <div>
          <Eyebrow>{t('home.work.eyebrow')}</Eyebrow>
          <BigTitle>
            {t('home.work.title1').replace('.', '')} / {t('home.work.title2')}
          </BigTitle>
        </div>
        <AllLink to="/work">{t('home.work.cta')}</AllLink>
      </Head>

      {projects.map((p, i) => {
        const i18n = p[language];
        const imageSide: 'left' | 'right' = i % 2 === 0 ? 'right' : 'left';
        const total = projects.length;
        const progress = ((i + 1) / total) * 100;

        return (
          <CaseBlock
            key={p.slug}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.95,
              delay: 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <CaseInner>
              <CounterRow>
                <CounterNumber>
                  {p.number}
                  <span className="total">/ {String(total).padStart(2, '0')}</span>
                </CounterNumber>
                <ProgressBar $progress={progress} aria-hidden="true" />
                <CategoryChip>{t(CATEGORY_KEY[p.category])}</CategoryChip>
              </CounterRow>

              <CaseGrid $imageSide={imageSide}>
                <ImageCol $imageSide={imageSide}>
                  <ImageStage to={`/work/${p.slug}`} aria-label={i18n.title}>
                    <img src={p.cover} alt={i18n.title} loading="lazy" />
                    <HoverCaption>{t('home.work.openCase')} →</HoverCaption>
                    <CornerArrow aria-hidden="true">→</CornerArrow>
                  </ImageStage>
                </ImageCol>

                <TextCol $imageSide={imageSide}>
                  <MetaLine>
                    <span>{p.client}</span>
                    <span className="sep" />
                    <span>{p.year}</span>
                  </MetaLine>

                  <CaseTitle>
                    <Link to={`/work/${p.slug}`}>
                      {i18n.title.split(' — ')[0]}
                    </Link>
                  </CaseTitle>

                  <Summary>{i18n.summary}</Summary>

                  <Deliverables>
                    <span className="label">{t('home.work.deliverables')}</span>
                    <span className="body">{i18n.role}</span>
                  </Deliverables>

                  <TagsRow>
                    {p.tags.slice(0, 5).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </TagsRow>
                </TextCol>
              </CaseGrid>
            </CaseInner>
          </CaseBlock>
        );
      })}
    </Shell>
  );
};

export default SelectedWork;
