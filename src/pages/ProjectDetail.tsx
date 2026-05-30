import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Reveal from '../components/ui/Reveal';
import Crosshair from '../components/ui/Crosshair';
import SplitWords from '../components/ui/SplitWords';
import PillLink from '../components/ui/PillLink';
import { useLanguage } from '../context/LanguageContext';
import { getProject, getNextProject } from '../data/projects';

/**
 * Project detail — cinematic case study. The hero fuses the cover image
 * into a full-viewport opener: text sits in a strong dark zone at the
 * top, the cover bleeds in clearly at the bottom. Replaces the old
 * "empty dark headline + standalone cover" stack — one cinematic
 * moment instead of two.
 * Below: a light run of facts / challenge-solution / gallery / tech,
 * then a dark next-project teaser.
 */

// ─── Hero ─────────────────────────────────────────────────────────────

const Hero = styled.header<{ $cover: string; $accent: string }>`
  position: relative;
  /* Three-layer background — same pattern as the inner-page bookends,
     but here the middle layer is the per-project cover and the bottom
     fallback uses project.accent (each case has its own brand colour).
     The gradient is strong at top and fades to clear at bottom so the
     headline stays readable while the cover reveals cleanly below. */
  background:
    linear-gradient(
      180deg,
      rgba(10, 10, 12, 0.92) 0%,
      rgba(10, 10, 12, 0.85) 35%,
      rgba(10, 10, 12, 0.7) 60%,
      rgba(10, 10, 12, 0.3) 85%,
      rgba(10, 10, 12, 0) 100%
    ),
    url(${(p) => p.$cover}) center / cover no-repeat,
    ${(p) => p.$accent};
  color: #fff;
  overflow: hidden;
  min-height: 100svh;
  padding: clamp(130px, 18vh, 220px) clamp(20px, 5vw, 80px)
    clamp(48px, 8vh, 96px);

  /* Mobile: stronger overlay across the whole hero — narrow viewports
     compress the text zone, so the cover needs more darkening to keep
     the giant title readable. */
  @media (max-width: 860px) {
    background:
      linear-gradient(
        180deg,
        rgba(10, 10, 12, 0.94) 0%,
        rgba(10, 10, 12, 0.88) 50%,
        rgba(10, 10, 12, 0.62) 85%,
        rgba(10, 10, 12, 0.3) 100%
      ),
      url(${(p) => p.$cover}) center / cover no-repeat,
      ${(p) => p.$accent};
  }
`;

const Inner = styled.div`
  max-width: 1500px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  /* White on cover-as-bg: muted-dark gets washed out where the cover
     bleeds through the overlay. Slight transparency keeps it from
     fighting the title for attention. */
  color: rgba(255, 255, 255, 0.78);
  transition:
    color 0.3s var(--ease-snap),
    gap 0.4s var(--ease-expo);

  &::before {
    content: '←';
  }
  &:hover {
    color: #fff;
    gap: 16px;
  }
`;

const ProjectTitle = styled.h1`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(3.5rem, 14vw, 17rem);
  /* Phones: scale the hero up with the viewport so it doesn't sit at the small
     clamp floor; the floor still protects the narrowest phones. Desktop curve
     unchanged. */
  @media (max-width: 600px) {
    font-size: clamp(3.5rem, 18.5vw, 17rem);
  }
  line-height: 0.86;
  /* Bumped from clamp(24px, 4vh, 48px) so the title sits in roughly the
     same place after removing the MetaRow strip that used to live
     between BackLink and Title. */
  margin: clamp(72px, 13vh, 160px) 0 0;
`;

const Lead = styled.p`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.375rem, 2.6vw, 2.4rem);
  line-height: 1.24;
  letter-spacing: -0.02em;
  /* Bumped from muted-dark to a high-opacity white — muted-dark sat in
     a part of the overlay where the cover bleeds through, washing out
     the lead text on bright covers (Kaif orange / Unicar green). */
  color: rgba(255, 255, 255, 0.95);
  max-width: 22em;
  margin: clamp(28px, 4.5vh, 56px) 0 0;
`;

// ─── Light content run ────────────────────────────────────────────────

const Body = styled.section`
  background: var(--paper);
  color: var(--ink);
  padding: clamp(64px, 10vh, 150px) clamp(20px, 5vw, 80px)
    clamp(40px, 6vh, 90px);
`;

const SectionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
  }
`;

const Facts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--bone-line);
  border-bottom: 1px solid var(--bone-line);

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Fact = styled.div`
  padding: clamp(28px, 4vh, 48px) 28px clamp(28px, 4vh, 48px) 0;
  border-right: 1px solid var(--bone-line);

  &:last-child {
    border-right: none;
    padding-right: 0;
  }

  @media (max-width: 760px) {
    &:nth-child(2n) {
      border-right: none;
      padding-right: 0;
    }
    &:nth-child(-n + 2) {
      border-bottom: 1px solid var(--bone-line);
    }
  }

  .label {
    display: block;
    font-family: var(--font-grotesk);
    font-size: 0.625rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--muted);
    margin-bottom: 14px;
  }
  .value {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: clamp(1.0625rem, 1.5vw, 1.375rem);
    line-height: 1.15;
    letter-spacing: -0.015em;
    color: var(--ink);
  }
`;

const Split = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 6vw, 110px);
  padding: clamp(64px, 10vh, 150px) 0 clamp(40px, 6vh, 90px);

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: clamp(40px, 7vh, 72px);
  }
`;

const SplitCol = styled.article`
  .body {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.375rem, 2.3vw, 2.125rem);
    line-height: 1.26;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin-top: 24px;
  }
`;

const Gallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 3vh, 40px);
  padding-bottom: clamp(40px, 6vh, 90px);
`;

const Shot = styled(motion.figure)`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 14px;
  background: var(--bone-line);
  margin: 0;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Tech = styled.div`
  padding: clamp(48px, 7vh, 96px) 0 clamp(64px, 9vh, 130px);
  border-top: 1px solid var(--bone-line);
`;

const TagList = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 28px;
`;

const Tag = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  padding: 8px 16px;
  border: 1px solid var(--bone-line);
  border-radius: 999px;
`;

// ─── Next project ─────────────────────────────────────────────────────

const NextShell = styled.section`
  position: relative;
  background: var(--ink);
  color: #fff;
  overflow: hidden;
  padding: clamp(80px, 13vh, 180px) clamp(20px, 5vw, 80px);
`;

const NextInner = styled.div`
  max-width: 1500px;
  margin: 0 auto;

  .eyebrow {
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--accent-bright);
  }
`;

const NextLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-top: clamp(20px, 3vh, 36px);
  padding: clamp(20px, 3vh, 40px) 0;
  color: #fff;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.5rem, 9vw, 9rem);
  line-height: 0.95;
  letter-spacing: -0.03em;
  transition:
    color 0.4s var(--ease-snap),
    padding-left 0.5s var(--ease-expo);

  &::after {
    content: '↗';
    font-size: 0.42em;
    color: var(--accent-bright);
    transition: transform 0.5s var(--ease-expo);
  }

  &:hover {
    color: var(--accent-bright);
    padding-left: clamp(12px, 2vw, 32px);

    &::after {
      transform: translate(10px, -10px);
    }
  }
`;

// ─── 404 fallback ─────────────────────────────────────────────────────

const MissingShell = styled.section`
  background: var(--ink);
  color: #fff;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  text-align: center;
  padding: 120px 24px;

  .eyebrow {
    font-family: var(--font-grotesk);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--accent-bright);
  }
  h1 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2.25rem, 6vw, 5rem);
    line-height: 0.98;
    letter-spacing: -0.03em;
  }
`;

const ProjectDetail = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();

  const project = slug ? getProject(slug) : undefined;

  if (!project) {
    return (
      <>
        <NavBar surface="dark" />
        <MissingShell data-surface="dark" data-nav-theme="dark">
          <span className="eyebrow">Error 404</span>
          <h1>{t('projectDetail.notFound')}</h1>
          <PillLink to="/work" variant="light" arrow>
            {t('projectDetail.viewAll')}
          </PillLink>
        </MissingShell>
        <Footer />
      </>
    );
  }

  const i18n = project[language];
  const next = getNextProject(project.slug);
  const nextI18n = next[language];
  const title = i18n.title.split(' — ')[0];
  const nextTitle = nextI18n.title.split(' — ')[0];
  const isRu = language === 'ru';

  return (
    <>
      <NavBar />

      <Hero
        data-surface="dark"
        data-nav-theme="dark"
        $cover={project.cover}
        $accent={project.accent}
      >
        <Crosshair
          style={{ top: '18%', right: '8%' }}
          $size={15}
          $color="rgba(255,255,255,0.28)"
        />
        <Inner>
          <Reveal as="span">
            <BackLink to="/work">{t('projectDetail.back')}</BackLink>
          </Reveal>
          <ProjectTitle>
            <SplitWords as="span" text={title} delay={0.08} />
          </ProjectTitle>
          <Reveal delay={0.2}>
            <Lead>{i18n.summary}</Lead>
          </Reveal>
        </Inner>
      </Hero>

      <Body data-nav-theme="light">
        <Inner>
          <Facts>
            {[
              [isRu ? 'Клиент' : 'Client', project.client],
              [isRu ? 'Год' : 'Year', project.year],
              [isRu ? 'Роль' : 'Role', i18n.role],
              [isRu ? 'Тип' : 'Category', project.category.toUpperCase()],
            ].map(([label, value], i) => (
              <Reveal key={label} delay={i * 0.06}>
                <Fact>
                  <span className="label">{label}</span>
                  <span className="value">{value}</span>
                </Fact>
              </Reveal>
            ))}
          </Facts>

          <Split>
            <SplitCol>
              <Reveal as="span">
                <SectionLabel>{t('projectDetail.theChallenge')}</SectionLabel>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="body">{i18n.challenge}</p>
              </Reveal>
            </SplitCol>
            <SplitCol>
              <Reveal as="span">
                <SectionLabel>{t('projectDetail.ourSolution')}</SectionLabel>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="body">{i18n.solution}</p>
              </Reveal>
            </SplitCol>
          </Split>

          {project.screens.length > 0 && (
            <Gallery>
              {project.screens.map((src, i) => (
                <Shot
                  key={src}
                  initial={{ opacity: 0, y: 48 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{
                    duration: 0.95,
                    delay: (i % 2) * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <img
                    src={src}
                    alt={`${title} — ${i + 1}`}
                    loading="lazy"
                  />
                </Shot>
              ))}
            </Gallery>
          )}

          <Tech>
            <Reveal as="span">
              <SectionLabel>{t('projectDetail.techStack')}</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <TagList>
                {project.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagList>
            </Reveal>
          </Tech>
        </Inner>
      </Body>

      <NextShell data-surface="dark" data-nav-theme="dark">
        <Crosshair
          style={{ top: '22%', right: '10%' }}
          $size={15}
          $color="rgba(255,255,255,0.3)"
        />
        <NextInner>
          <Reveal as="span" className="eyebrow">
            {isRu ? 'Следующий проект' : 'Next project'}
          </Reveal>
          <Reveal delay={0.05}>
            <NextLink to={next.href ?? `/work/${next.slug}`} data-cursor="hover">
              {nextTitle}
            </NextLink>
          </Reveal>
        </NextInner>
      </NextShell>

      <Footer />
    </>
  );
};

export default ProjectDetail;
