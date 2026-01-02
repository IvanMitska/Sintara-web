import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaRobot, FaExternalLinkAlt, FaArrowRight, FaMobileAlt, FaLaptopCode } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const PortfolioSection = styled.section`
  padding: 100px 0;
  background: transparent;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled(motion.h2)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 20px;
`;

const Subtitle = styled(motion.p)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FilterContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 50px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active
    ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
    : 'rgba(255, 255, 255, 0.03)'};
  color: ${props => props.$active ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'};
  border: 1px solid ${props => props.$active
    ? 'rgba(124, 58, 237, 0.5)'
    : 'rgba(255, 255, 255, 0.1)'};
  padding: 12px 24px;
  border-radius: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    font-size: 14px;
  }

  &:hover {
    background: ${props => props.$active
      ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
      : 'rgba(124, 58, 237, 0.15)'};
    border-color: rgba(124, 58, 237, 0.4);
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.8) 0%, rgba(10, 5, 20, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.5), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(124, 58, 237, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 60px rgba(124, 58, 237, 0.1);

    &::before {
      opacity: 1;
    }
  }
`;

const ProjectImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%);
`;

const ProjectImage = styled.div<{ $imageUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;

  ${ProjectCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProjectPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(20, 10, 40, 0.9) 100%);

  svg {
    font-size: 48px;
    color: rgba(124, 58, 237, 0.4);
    transition: all 0.3s ease;
  }

  ${ProjectCard}:hover & svg {
    color: rgba(124, 58, 237, 0.6);
    transform: scale(1.1);
  }
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(10, 5, 20, 0.95) 0%, transparent 100%);
  display: flex;
  align-items: flex-end;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const ViewProjectButton = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a78bfa;
  font-size: 0.9rem;
  font-weight: 500;

  svg {
    transition: transform 0.3s ease;
  }

  ${ProjectCard}:hover & svg {
    transform: translateX(4px);
  }
`;

const ProjectContent = styled.div`
  padding: 24px;
`;

const ProjectCategory = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;

  svg {
    font-size: 12px;
  }
`;

const ProjectTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 10px;
  letter-spacing: -0.01em;
`;

const ProjectDescription = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin: 0;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const TechBadge = styled.span`
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 500;
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-top: 60px;
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
  padding: 16px 32px;
  border-radius: 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);

  svg {
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);

    svg {
      transform: translateX(4px);
    }
  }
`;

type Project = {
  id: number;
  slug: string;
  title: string;
  category: 'website' | 'bot';
  description: string;
  imageUrl: string;
  tech: string[];
};

const projects: Project[] = [
  {
    id: 1,
    slug: 'ecommerce-platform',
    title: 'E-commerce Platform',
    category: 'website',
    description: 'Full-featured online store with payment integration and inventory management.',
    imageUrl: '',
    tech: ['React', 'Node.js', 'Stripe'],
  },
  {
    id: 2,
    slug: 'booking-bot',
    title: 'Restaurant Bot',
    category: 'bot',
    description: 'Telegram bot for ordering food and table reservations with admin panel.',
    imageUrl: '',
    tech: ['Python', 'Telegram API', 'PostgreSQL'],
  },
  {
    id: 3,
    slug: 'saas-dashboard',
    title: 'SaaS Dashboard',
    category: 'website',
    description: 'Analytics dashboard with real-time data visualization and reporting.',
    imageUrl: '',
    tech: ['Next.js', 'TypeScript', 'D3.js'],
  },
  {
    id: 4,
    slug: 'learning-bot',
    title: 'Learning Platform Bot',
    category: 'bot',
    description: 'Educational bot with courses, quizzes, and progress tracking.',
    imageUrl: '',
    tech: ['Node.js', 'MongoDB', 'Telegram API'],
  },
  {
    id: 5,
    slug: 'corporate-website',
    title: 'Corporate Website',
    category: 'website',
    description: 'Modern corporate website with CMS integration and multilingual support.',
    imageUrl: '',
    tech: ['React', 'Sanity CMS', 'i18n'],
  },
  {
    id: 6,
    slug: 'delivery-app',
    title: 'Delivery Service Bot',
    category: 'bot',
    description: 'Complete delivery management system with driver tracking and notifications.',
    imageUrl: '',
    tech: ['Python', 'Redis', 'Google Maps API'],
  },
];

const Portfolio: React.FC = memo(() => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'website' | 'bot'>('all');
  const { t } = useLanguage();

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  const getProjectTitle = (id: number) => t(`portfolio.project${id}.title`);
  const getProjectDescription = (id: number) => t(`portfolio.project${id}.description`);

  return (
    <PortfolioSection id="portfolio">
      <Container>
        <SectionHeader>
          <Title
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('portfolio.title')}
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('portfolio.subtitle')}
          </Subtitle>
        </SectionHeader>

        <FilterContainer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FilterButton
            $active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          >
            {t('portfolio.filter.all')}
          </FilterButton>
          <FilterButton
            $active={activeFilter === 'website'}
            onClick={() => setActiveFilter('website')}
          >
            <FaGlobe /> {t('portfolio.filter.websites')}
          </FilterButton>
          <FilterButton
            $active={activeFilter === 'bot'}
            onClick={() => setActiveFilter('bot')}
          >
            <FaRobot /> {t('portfolio.filter.bots')}
          </FilterButton>
        </FilterContainer>

        <ProjectsGrid layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <Link
                key={project.id}
                to={`/project/${project.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <ProjectCard
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProjectImageWrapper>
                    {project.imageUrl ? (
                      <ProjectImage $imageUrl={project.imageUrl} />
                    ) : (
                      <ProjectPlaceholder>
                        {project.category === 'website' ? <FaGlobe /> : <FaRobot />}
                      </ProjectPlaceholder>
                    )}
                    <ProjectOverlay>
                      <ViewProjectButton>
                        {t('portfolio.viewProject')} <FaArrowRight />
                      </ViewProjectButton>
                    </ProjectOverlay>
                  </ProjectImageWrapper>

                  <ProjectContent>
                    <ProjectCategory>
                      {project.category === 'website' ? (
                        <><FaGlobe /> {t('portfolio.category.website')}</>
                      ) : (
                        <><FaRobot /> {t('portfolio.category.bot')}</>
                      )}
                    </ProjectCategory>
                    <ProjectTitle>{getProjectTitle(project.id)}</ProjectTitle>
                    <ProjectDescription>{getProjectDescription(project.id)}</ProjectDescription>
                    <TechStack>
                      {project.tech.map((tech, i) => (
                        <TechBadge key={i}>{tech}</TechBadge>
                      ))}
                    </TechStack>
                  </ProjectContent>
                </ProjectCard>
              </Link>
            ))}
          </AnimatePresence>
        </ProjectsGrid>

        <CTAContainer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CTAButton href="#contact">
            {t('portfolio.startProject')} <FaArrowRight />
          </CTAButton>
        </CTAContainer>
      </Container>
    </PortfolioSection>
  );
});

Portfolio.displayName = 'Portfolio';

export default Portfolio;
