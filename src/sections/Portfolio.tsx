import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PortfolioSection = styled.section`
  padding: 8rem 0;
  background-color: #0a0a0a;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
`;

const SectionTitle = styled.h2`
  background: linear-gradient(90deg, #8E2DE2, #4A00E0, #FF7D54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -10px;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #8E2DE2, #4A00E0);
  }
`;

const SectionDescription = styled.p`
  font-size: clamp(1rem, 2vw, 1.1rem);
  max-width: 600px;
  margin: 0 auto;
  color: #a0a0a0;
  line-height: 1.6;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'linear-gradient(90deg, #8E2DE2, #4A00E0)' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#a0a0a0'};
  border: ${props => props.active ? 'none' : '1px solid #333'};
  padding: 0.6rem 1.2rem;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(90deg, #8E2DE2, #4A00E0)' : 'rgba(142, 45, 226, 0.1)'};
    border-color: ${props => props.active ? 'transparent' : '#8E2DE2'};
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ProjectCard = styled.div`
  background-color: #111;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
    
    .project-image {
      transform: scale(1.05);
    }
    
    .overlay {
      opacity: 1;
    }
  }
`;

const ProjectImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
`;

const ProjectImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const ProjectInfo = styled.div`
  padding: 1.5rem;
`;

const ProjectCategory = styled.p`
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #8E2DE2;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  color: #fff;
  margin-bottom: 0.75rem;
`;

const ProjectDescription = styled.p`
  font-size: 0.9rem;
  color: #a0a0a0;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #8E2DE2;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4A00E0;
  }
  
  &::after {
    content: '→';
    transition: transform 0.3s ease;
  }
  
  &:hover::after {
    transform: translateX(5px);
  }
`;

const ViewAllContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 4rem;
`;

const ViewAllButton = styled.a`
  display: inline-block;
  background: transparent;
  border: 2px solid #8E2DE2;
  color: white;
  padding: 0.9rem 2.5rem;
  border-radius: 5px;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background-color: rgba(142, 45, 226, 0.1);
  }
`;

type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  link: string;
};

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const filter = filterRef.current;
    const projects = projectsRef.current;
    const cta = ctaRef.current;

    if (section && header && filter && projects && cta) {
      // Анимация заголовка
      gsap.fromTo(
        header,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Анимация фильтров
      gsap.fromTo(
        filter,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Анимация проектов
      gsap.fromTo(
        projects.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: projects,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Анимация кнопки "Все проекты"
      gsap.fromTo(
        cta,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: cta,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, [activeFilter]);

  const projects: Project[] = [
    {
      id: 1,
      title: 'Корпоративный сайт',
      category: 'website',
      description: 'Современный корпоративный сайт для компании в сфере IT-услуг.',
      imageUrl: '/icons/placeholder.svg',
      link: '#',
    },
    {
      id: 2,
      title: 'Интернет-магазин',
      category: 'website',
      description: 'Многофункциональный интернет-магазин с интеграцией платежных систем.',
      imageUrl: '/icons/placeholder.svg',
      link: '#',
    },
    {
      id: 3,
      title: 'Бот для ресторана',
      category: 'bot',
      description: 'Telegram-бот для заказа блюд и бронирования столиков в ресторане.',
      imageUrl: '/icons/placeholder.svg',
      link: '#',
    },
    {
      id: 4,
      title: 'Лендинг для продукта',
      category: 'website',
      description: 'Высококонверсионный лендинг для нового IT-продукта.',
      imageUrl: '/icons/placeholder.svg',
      link: '#',
    },
    {
      id: 5,
      title: 'Бот для онлайн-школы',
      category: 'bot',
      description: 'Telegram-бот с личным кабинетом для учеников онлайн-школы.',
      imageUrl: '/icons/placeholder.svg',
      link: '#',
    },
    {
      id: 6,
      title: 'Сервис доставки',
      category: 'bot',
      description: 'Веб-приложение и Telegram-бот для службы доставки.',
      imageUrl: '/icons/placeholder.svg',
      link: '#',
    },
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  return (
    <PortfolioSection id="portfolio" ref={sectionRef}>
      <Container>
        <SectionHeader ref={headerRef}>
          <SectionTitle>Наши работы</SectionTitle>
          <SectionDescription>
            Примеры реализованных проектов — сайтов и Telegram-ботов для различных бизнесов
          </SectionDescription>
        </SectionHeader>

        <FilterContainer ref={filterRef}>
          <FilterButton 
            active={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')}
          >
            Все проекты
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'website'} 
            onClick={() => setActiveFilter('website')}
          >
            Сайты
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'bot'} 
            onClick={() => setActiveFilter('bot')}
          >
            Telegram-боты
          </FilterButton>
        </FilterContainer>

        <ProjectsGrid ref={projectsRef}>
          {filteredProjects.map(project => (
            <ProjectCard key={project.id}>
              <ProjectImageContainer>
                <ProjectImage 
                  className="project-image" 
                  imageUrl={project.imageUrl} 
                />
                <ProjectOverlay className="overlay">
                  <ProjectLink href={project.link}>Подробнее</ProjectLink>
                </ProjectOverlay>
              </ProjectImageContainer>
              <ProjectInfo>
                <ProjectCategory>
                  {project.category === 'website' ? 'Сайт' : 'Telegram-бот'}
                </ProjectCategory>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <ProjectLink href={project.link}>Смотреть проект</ProjectLink>
              </ProjectInfo>
            </ProjectCard>
          ))}
        </ProjectsGrid>

        <ViewAllContainer ref={ctaRef}>
          <ViewAllButton href="#contact">Заказать похожий проект</ViewAllButton>
        </ViewAllContainer>
      </Container>
    </PortfolioSection>
  );
};

export default Portfolio; 