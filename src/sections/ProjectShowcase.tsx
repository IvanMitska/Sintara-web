import React, { useState, memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import IPhoneMockup from '../components/IPhoneMockup';
import MacBookMockup from '../components/MacBookMockup';
import { useLanguage } from '../context/LanguageContext';

const glowPulse = keyframes`
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
`;

const ShowcaseSection = styled.section`
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
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ShowcaseContent = styled(motion.div)`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const ProjectSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 1200px) {
    order: 2;
  }
`;

const ProjectTab = styled(motion.button)<{ $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: ${props => props.$active
    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(20, 10, 40, 0.9) 100%)'
    : 'linear-gradient(135deg, rgba(20, 10, 40, 0.6) 0%, rgba(10, 5, 20, 0.8) 100%)'};
  border: 1px solid ${props => props.$active
    ? 'rgba(124, 58, 237, 0.3)'
    : 'rgba(255, 255, 255, 0.06)'};
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => props.$active
      ? 'linear-gradient(180deg, #7c3aed 0%, #6d28d9 100%)'
      : 'transparent'};
    transition: all 0.3s ease;
  }

  &:hover {
    background: ${props => props.$active
      ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(20, 10, 40, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(20, 10, 40, 0.8) 100%)'};
    border-color: rgba(124, 58, 237, 0.3);
    transform: translateX(4px);
  }
`;

const ProjectIcon = styled.div<{ $active: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$active
    ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
    : 'rgba(255, 255, 255, 0.05)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
`;

const ProjectTabContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProjectTabCategory = styled.span<{ $active: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${props => props.$active ? '#a78bfa' : 'rgba(255, 255, 255, 0.4)'};
  font-weight: 600;
  transition: color 0.3s ease;
`;

const ProjectTabTitle = styled.h3<{ $active: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: ${props => props.$active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  margin: 6px 0;
  transition: color 0.3s ease;
`;

const ProjectTabDescription = styled.p<{ $active: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85rem;
  color: ${props => props.$active ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)'};
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;
`;

const DeviceShowcase = styled.div`
  position: relative;
  min-height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1200px) {
    order: 1;
    min-height: 450px;
  }

  @media (max-width: 768px) {
    min-height: 350px;
  }
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  left: 50%;
  top: 50%;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: ${glowPulse} 4s ease-in-out infinite;
  z-index: 0;

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

const DeviceWrapper = styled(motion.div)`
  position: absolute;
  display: flex;
  align-items: flex-end;
  z-index: 1;
`;

const MacBookContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const IPhoneContainer = styled.div`
  position: relative;
  z-index: 2;
  margin-left: -70px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-left: -50px;
    margin-bottom: 10px;
  }
`;

const ProjectDetails = styled(motion.div)`
  margin-top: 40px;
  padding: 32px;
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.8) 0%, rgba(10, 5, 20, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.4), transparent);
  }

  @media (max-width: 1200px) {
    order: 3;
  }
`;

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const DetailsInfo = styled.div``;

const DetailsCategory = styled.span`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #a78bfa;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
`;

const DetailsTitle = styled.h4`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TechBadge = styled.span`
  padding: 6px 12px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(124, 58, 237, 0.2);
    border-color: rgba(124, 58, 237, 0.4);
    color: #a78bfa;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
`;

const FeatureCheck = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    font-size: 10px;
    color: white;
  }
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);

  svg {
    font-size: 14px;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);

    svg {
      transform: translateX(4px);
    }
  }
`;

interface Project {
  id: number;
  icon: string;
  category: string;
  title: string;
  shortDescription: string;
  features: string[];
  techStack: string[];
  macbookImage?: string;
  iphoneImage?: string;
}

const projects: Project[] = [
  {
    id: 1,
    icon: '🛒',
    category: 'E-commerce',
    title: 'Online Store Platform',
    shortDescription: 'Full-featured store with payments and user dashboard',
    features: [
      'Responsive design',
      'Online payments',
      'User accounts',
      'Discount system',
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
  },
  {
    id: 2,
    icon: '🤖',
    category: 'Telegram Bot',
    title: 'Booking Automation Bot',
    shortDescription: 'Automated client booking with CRM integration',
    features: [
      'Auto scheduling',
      'Reminders',
      'Online payments',
      'CRM integration',
    ],
    techStack: ['Python', 'Aiogram', 'Redis', 'PostgreSQL'],
  },
  {
    id: 3,
    icon: '🏢',
    category: 'Corporate Website',
    title: 'Tech Company Site',
    shortDescription: 'Modern website with animations and CRM integration',
    features: [
      '3D animations',
      'SEO optimized',
      'CRM integration',
      'Multi-language',
    ],
    techStack: ['React', 'GSAP', 'Three.js', 'Node.js'],
  },
  {
    id: 4,
    icon: '🍕',
    category: 'Food Delivery',
    title: 'Delivery App',
    shortDescription: 'Real-time courier tracking and loyalty program',
    features: [
      'Live tracking',
      'Push notifications',
      'Loyalty program',
      'Quick reorder',
    ],
    techStack: ['React Native', 'Firebase', 'Node.js', 'MongoDB'],
  },
];

const ProjectShowcase: React.FC = memo(() => {
  const [activeProject, setActiveProject] = useState(0);
  const { t } = useLanguage();

  const getProjectData = (index: number) => ({
    ...projects[index],
    category: t(`showcase.project${index + 1}.category`),
    title: t(`showcase.project${index + 1}.title`),
    shortDescription: t(`showcase.project${index + 1}.description`),
    features: [
      t(`showcase.project${index + 1}.feature1`),
      t(`showcase.project${index + 1}.feature2`),
      t(`showcase.project${index + 1}.feature3`),
      t(`showcase.project${index + 1}.feature4`),
    ],
  });

  const currentProject = getProjectData(activeProject);

  return (
    <ShowcaseSection id="showcase">
      <Container>
        <SectionHeader>
          <Title
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('showcase.title')}
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('showcase.subtitle')}
          </Subtitle>
        </SectionHeader>

        <ShowcaseContent
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ProjectSelector>
            {projects.map((project, index) => {
              const projectData = getProjectData(index);
              return (
                <ProjectTab
                  key={project.id}
                  $active={activeProject === index}
                  onClick={() => setActiveProject(index)}
                  whileTap={{ scale: 0.98 }}
                >
                  <ProjectIcon $active={activeProject === index}>
                    {project.icon}
                  </ProjectIcon>
                  <ProjectTabContent>
                    <ProjectTabCategory $active={activeProject === index}>
                      {projectData.category}
                    </ProjectTabCategory>
                    <ProjectTabTitle $active={activeProject === index}>
                      {projectData.title}
                    </ProjectTabTitle>
                    <ProjectTabDescription $active={activeProject === index}>
                      {projectData.shortDescription}
                    </ProjectTabDescription>
                  </ProjectTabContent>
                </ProjectTab>
              );
            })}
          </ProjectSelector>

          <DeviceShowcase>
            <BackgroundGlow />
            <AnimatePresence mode="wait">
              <DeviceWrapper
                key={activeProject}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <MacBookContainer>
                  <MacBookMockup
                    screenImage={currentProject.macbookImage}
                    animate={true}
                    showBrowser={true}
                    websiteUrl="sintara.dev"
                  />
                </MacBookContainer>
                <IPhoneContainer>
                  <IPhoneMockup
                    screenImage={currentProject.iphoneImage}
                    animate={true}
                  />
                </IPhoneContainer>
              </DeviceWrapper>
            </AnimatePresence>
          </DeviceShowcase>
        </ShowcaseContent>

        <ProjectDetails
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <DetailsHeader>
            <DetailsInfo>
              <DetailsCategory>{currentProject.category}</DetailsCategory>
              <DetailsTitle>{currentProject.title}</DetailsTitle>
            </DetailsInfo>
            <TechStack>
              {currentProject.techStack.map((tech, i) => (
                <TechBadge key={i}>{tech}</TechBadge>
              ))}
            </TechStack>
          </DetailsHeader>

          <FeatureGrid>
            {currentProject.features.map((feature, i) => (
              <FeatureItem key={i}>
                <FeatureCheck>
                  <FaCheck />
                </FeatureCheck>
                {feature}
              </FeatureItem>
            ))}
          </FeatureGrid>

          <CTAButton href="#contact">
            {t('showcase.cta')} <FaArrowRight />
          </CTAButton>
        </ProjectDetails>
      </Container>
    </ShowcaseSection>
  );
});

ProjectShowcase.displayName = 'ProjectShowcase';

export default ProjectShowcase;
