import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Container from '../components/ui/Container';
import Eyebrow from '../components/ui/Eyebrow';
import SplitWords from '../components/ui/SplitWords';
import { useLanguage } from '../context/LanguageContext';
import { getProject, getNextProject } from '../data/projects';

/**
 * Red Collar direction project detail page.
 * back link → meta row → massive uppercase title → full-bleed cover →
 * summary → facts strip → challenge/solution split → screen gallery →
 * tech list → next-project teaser → footer.
 */

const PageShell = styled.main`
  padding-top: 140px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-grotesk);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
  margin-bottom: 48px;
  transition: color 0.3s var(--ease-snap), gap 0.4s var(--ease-expo);

  &::before {
    content: '←';
  }

  &:hover {
    color: var(--ink);
    gap: 16px;
  }
`;

const HeroHead = styled.header`
  padding-bottom: 72px;
  border-bottom: 1px solid var(--bone-line);
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--bone-line);

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
`;

const ProjectTitle = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 12vw, 14rem);
  font-weight: 700;
  line-height: 0.82;
  letter-spacing: -0.055em;
  text-transform: uppercase;
  margin: 0;
`;

const Cover = styled.div<{ $accent: string }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: ${(p) => p.$accent};
  margin: 96px 0;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 900px) {
    margin: 64px 0;
  }
`;

const Intro = styled.section`
  display: grid;
  grid-template-columns: 1fr 2.4fr;
  gap: 64px;
  padding: 80px 0 120px;
  border-bottom: 1px solid var(--bone-line);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 48px 0 80px;
  }
`;

const IntroLabel = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
`;

const IntroBody = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.8vw, 2.5rem);
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: -0.025em;
  color: var(--ink);
  max-width: 22em;
`;

const Facts = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 80px 0;
  border-bottom: 1px solid var(--bone-line);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 0;
    padding: 48px 0;
  }
`;

const Fact = styled.div`
  border-right: 1px solid var(--bone-line);
  padding-right: 24px;

  &:last-child {
    border-right: none;
  }

  @media (max-width: 900px) {
    &:nth-child(2n) {
      border-right: none;
    }
  }
`;

const FactLabel = styled.span`
  display: block;
  font-family: var(--font-grotesk);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
  margin-bottom: 12px;
`;

const FactValue = styled.span`
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.125rem, 1.8vw, 1.5rem);
  font-weight: 600;
  line-height: 1.1;
  color: var(--ink);
  letter-spacing: -0.02em;
  text-transform: uppercase;
`;

const Split = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  padding: 120px 0;
  border-bottom: 1px solid var(--bone-line);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 80px 0;
  }
`;

const SplitCol = styled.article`
  padding: 0 48px 0 0;
  border-right: 1px solid var(--bone-line);

  &:last-child {
    padding: 0 0 0 48px;
    border-right: none;
  }

  @media (max-width: 900px) {
    padding: 48px 0;
    border-right: none;
    border-bottom: 1px solid var(--bone-line);

    &:last-child {
      padding: 48px 0;
      border-bottom: none;
    }
  }
`;

const SplitTitle = styled.h2`
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
  margin-bottom: 24px;
`;

const SplitBody = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.375rem, 2.2vw, 1.875rem);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: var(--ink);
`;

const Gallery = styled.section`
  padding: 96px 0;
`;

const GalleryGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const GalleryImg = styled(motion.figure)`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
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

const NextWrap = styled.section`
  padding: 120px 0;
  border-top: 1px solid var(--bone-line);
`;

const NextLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
  padding: 48px 0;
  color: var(--ink);
  transition: padding 0.5s var(--ease-expo), color 0.4s var(--ease-snap);
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 8rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.05em;
  text-transform: uppercase;

  &::after {
    content: '→';
    font-family: var(--font-grotesk);
    font-size: 1.25rem;
    font-weight: 400;
    opacity: 0.6;
    transition: transform 0.5s var(--ease-expo);
  }

  &:hover {
    color: var(--accent);
    padding-left: 24px;

    &::after {
      transform: translateX(16px);
      opacity: 1;
    }
  }
`;

const TagList = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  padding: 6px 14px;
  border: 1px solid var(--bone-line);
  border-radius: 999px;
`;

const NotFoundShell = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  gap: 24px;
`;

const TechSection = styled.section`
  padding: 80px 0;
  border-top: 1px solid var(--bone-line);
`;

const ProjectDetail = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const project = slug ? getProject(slug) : undefined;

  if (!project) {
    return (
      <>
        <Navigation />
        <PageShell>
          <Container>
            <NotFoundShell>
              <Eyebrow>404</Eyebrow>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {t('projectDetail.notFound')}
              </h1>
              <BackLink to="/work">{t('projectDetail.viewAll')}</BackLink>
            </NotFoundShell>
          </Container>
        </PageShell>
        <Footer />
      </>
    );
  }

  const i18n = project[language];
  const next = getNextProject(project.slug);
  const nextI18n = next[language];

  return (
    <>
      <Navigation />
      <PageShell data-nav-theme="light">
        <Container>
          <BackLink to="/work">{t('projectDetail.back')}</BackLink>
          <HeroHead>
            <MetaRow>
              <span>
                {project.number} — {project.year}
              </span>
              <span>{project.client}</span>
              <span>{project.category.toUpperCase()}</span>
            </MetaRow>
            <ProjectTitle>{i18n.title.split(' — ')[0]}</ProjectTitle>
          </HeroHead>

          <Cover $accent={project.accent}>
            <img src={project.cover} alt={i18n.title} />
          </Cover>

          <Intro>
            <IntroLabel>Summary</IntroLabel>
            <IntroBody>{i18n.summary}</IntroBody>
          </Intro>

          <Facts>
            <Fact>
              <FactLabel>Client</FactLabel>
              <FactValue>{project.client}</FactValue>
            </Fact>
            <Fact>
              <FactLabel>Year</FactLabel>
              <FactValue>{project.year}</FactValue>
            </Fact>
            <Fact>
              <FactLabel>Role</FactLabel>
              <FactValue>{i18n.role}</FactValue>
            </Fact>
            <Fact>
              <FactLabel>Category</FactLabel>
              <FactValue>{project.category.toUpperCase()}</FactValue>
            </Fact>
          </Facts>

          <Split>
            <SplitCol>
              <SplitTitle>{t('projectDetail.theChallenge')}</SplitTitle>
              <SplitBody>{i18n.challenge}</SplitBody>
            </SplitCol>
            <SplitCol>
              <SplitTitle>{t('projectDetail.ourSolution')}</SplitTitle>
              <SplitBody>{i18n.solution}</SplitBody>
            </SplitCol>
          </Split>

          {project.screens.length > 0 && (
            <Gallery>
              <GalleryGrid>
                {project.screens.map((src, i) => (
                  <GalleryImg
                    key={src}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.9,
                      delay: i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <img
                      src={src}
                      alt={`${i18n.title} — screen ${i + 1}`}
                      loading="lazy"
                    />
                  </GalleryImg>
                ))}
              </GalleryGrid>
            </Gallery>
          )}

          <TechSection>
            <SplitTitle>{t('projectDetail.techStack')}</SplitTitle>
            <TagList style={{ marginTop: 24 }}>
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagList>
          </TechSection>

          <NextWrap>
            <Eyebrow>Next project</Eyebrow>
            <NextLink to={`/work/${next.slug}`}>
              <span>
                <SplitWords as="span" text={nextI18n.title.split(' — ')[0]} />
              </span>
            </NextLink>
          </NextWrap>
        </Container>
      </PageShell>
      <Footer />
    </>
  );
};

export default ProjectDetail;
