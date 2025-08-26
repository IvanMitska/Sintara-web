import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Анимации
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(142, 45, 226, 0.3); }
  50% { box-shadow: 0 0 40px rgba(142, 45, 226, 0.6); }
`;

const TechStackSection = styled.section`
  padding: 8rem 0;
  background: linear-gradient(135deg, #000 0%, #0a0a0a 50%, #000 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 30% 30%, rgba(142, 45, 226, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(74, 0, 224, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(255, 125, 84, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 6rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #8E2DE2, #4A00E0, #FF7D54, #FFB443);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  animation: ${float} 6s ease-in-out infinite;
`;

const SectionDescription = styled.p`
  font-size: clamp(1rem, 2vw, 1.3rem);
  max-width: 800px;
  margin: 0 auto;
  color: #a0a0a0;
  line-height: 1.6;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'var(--color-primary-gradient)' : 'transparent'};
  color: ${props => props.$active ? '#fff' : '#a0a0a0'};
  border: ${props => props.$active ? 'none' : '1px solid rgba(142, 45, 226, 0.3)'};
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    color: #fff;
    border-color: var(--color-primary);
    box-shadow: 0 5px 15px rgba(142, 45, 226, 0.3);
    
    &::before {
      left: 100%;
    }
  }
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
  }
`;

const TechCard = styled.div<{ $category: string; $featured?: boolean }>`
  background: rgba(17, 17, 17, 0.8);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform-style: preserve-3d;
  
  ${props => props.$featured && css`
    border: 2px solid var(--color-primary);
    animation: ${glowPulse} 3s ease-in-out infinite;
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => {
      switch(props.$category) {
        case 'frontend': return 'linear-gradient(135deg, rgba(142, 45, 226, 0.1), rgba(74, 0, 224, 0.1))';
        case 'backend': return 'linear-gradient(135deg, rgba(255, 125, 84, 0.1), rgba(255, 180, 67, 0.1))';
        case 'tools': return 'linear-gradient(135deg, rgba(76, 217, 100, 0.1), rgba(52, 199, 89, 0.1))';
        case 'design': return 'linear-gradient(135deg, rgba(255, 45, 85, 0.1), rgba(255, 105, 180, 0.1))';
        default: return 'linear-gradient(135deg, rgba(142, 45, 226, 0.1), rgba(74, 0, 224, 0.1))';
      }
    }};
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
  
  &:hover {
    transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    
    &::before {
      opacity: 1;
    }
  }
  
  &.animate-in {
    animation: ${float} 4s ease-in-out infinite;
  }
`;

const TechIcon = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
    transition: all 0.3s ease;
  }
  
  ${TechCard}:hover & img {
    filter: drop-shadow(0 0 20px rgba(142, 45, 226, 0.8));
    transform: scale(1.1);
  }
`;

const TechName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
  
  ${TechCard}:hover & {
    color: var(--color-primary);
  }
`;

const TechDescription = styled.p`
  font-size: 0.85rem;
  color: #888;
  line-height: 1.4;
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  
  ${TechCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SkillLevel = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  z-index: 2;
`;

const ExpertLevel = styled(SkillLevel)`
  background: #4CD964;
  box-shadow: 0 0 10px rgba(76, 217, 100, 0.5);
`;

const AdvancedLevel = styled(SkillLevel)`
  background: #FF9500;
  box-shadow: 0 0 10px rgba(255, 149, 0, 0.5);
`;

const IntermediateLevel = styled(SkillLevel)`
  background: #007AFF;
  box-shadow: 0 0 10px rgba(0, 122, 255, 0.5);
`;

interface TechItem {
  id: string;
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'tools' | 'design';
  level: 'expert' | 'advanced' | 'intermediate';
  description: string;
  featured?: boolean;
}

const techStack: TechItem[] = [
  {
    id: 'react',
    name: 'React',
    icon: '/icons/react.svg',
    category: 'frontend',
    level: 'expert',
    description: 'Библиотека для создания интерфейсов',
    featured: true
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '/icons/typescript.svg',
    category: 'frontend',
    level: 'expert',
    description: 'Типизированный JavaScript',
    featured: true
  },
  {
    id: 'next',
    name: 'Next.js',
    icon: '/icons/nextjs.svg',
    category: 'frontend',
    level: 'advanced',
    description: 'React фреймворк для продакшена'
  },
  {
    id: 'threejs',
    name: 'Three.js',
    icon: '/icons/threejs.svg',
    category: 'frontend',
    level: 'advanced',
    description: '3D графика в браузере'
  },
  {
    id: 'gsap',
    name: 'GSAP',
    icon: '/icons/gsap.svg',
    category: 'frontend',
    level: 'expert',
    description: 'Мощная библиотека анимаций'
  },
  {
    id: 'styled-components',
    name: 'Styled Components',
    icon: '/icons/styled-components.svg',
    category: 'frontend',
    level: 'expert',
    description: 'CSS-in-JS решение'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: '/icons/nodejs.svg',
    category: 'backend',
    level: 'advanced',
    description: 'JavaScript runtime для сервера'
  },
  {
    id: 'vite',
    name: 'Vite',
    icon: '/icons/vite.svg',
    category: 'tools',
    level: 'advanced',
    description: 'Быстрый инструмент сборки'
  },
  {
    id: 'webpack',
    name: 'Webpack',
    icon: '/icons/webpack.svg',
    category: 'tools',
    level: 'intermediate',
    description: 'Сборщик модулей'
  },
  {
    id: 'git',
    name: 'Git',
    icon: '/icons/git.svg',
    category: 'tools',
    level: 'expert',
    description: 'Система контроля версий'
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: '/icons/figma.svg',
    category: 'design',
    level: 'advanced',
    description: 'Инструмент для дизайна интерфейсов'
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    icon: '/icons/tailwindcss.svg',
    category: 'frontend',
    level: 'advanced',
    description: 'Utility-first CSS фреймворк'
  }
];

const categories = [
  { id: 'all', name: 'Все технологии', count: techStack.length },
  { id: 'frontend', name: 'Frontend', count: techStack.filter(t => t.category === 'frontend').length },
  { id: 'backend', name: 'Backend', count: techStack.filter(t => t.category === 'backend').length },
  { id: 'tools', name: 'Инструменты', count: techStack.filter(t => t.category === 'tools').length },
  { id: 'design', name: 'Дизайн', count: techStack.filter(t => t.category === 'design').length }
];

const InteractiveTechStack: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredTech = activeCategory === 'all' 
    ? techStack 
    : techStack.filter(tech => tech.category === activeCategory);

  const renderSkillLevel = (level: TechItem['level']) => {
    switch (level) {
      case 'expert': return <ExpertLevel />;
      case 'advanced': return <AdvancedLevel />;
      case 'intermediate': return <IntermediateLevel />;
      default: return null;
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    
    // Анимация при смене категории
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, scale: 0.8, y: 20 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          ease: 'back.out(1.7)'
        }
      );
    }
  };

  useEffect(() => {
    if (sectionRef.current && gridRef.current) {
      // Анимация появления секции
      gsap.fromTo(
        sectionRef.current.querySelector('.section-header'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Анимация появления фильтров
      gsap.fromTo(
        sectionRef.current.querySelector('.filter-container'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Анимация появления карточек
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  return (
    <TechStackSection id="tech-stack" ref={sectionRef}>
      <Container>
        <SectionHeader className="section-header">
          <SectionTitle>Технологический арсенал</SectionTitle>
          <SectionDescription>
            Современные инструменты и технологии, которые я использую для создания выдающихся веб-решений. 
            Каждая технология выбрана для максимальной эффективности и качества результата.
          </SectionDescription>
        </SectionHeader>

        <FilterContainer className="filter-container">
          {categories.map(category => (
            <FilterButton
              key={category.id}
              $active={activeCategory === category.id}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name} ({category.count})
            </FilterButton>
          ))}
        </FilterContainer>

        <TechGrid ref={gridRef}>
          {filteredTech.map(tech => (
            <TechCard
              key={tech.id}
              $category={tech.category}
              $featured={tech.featured}
              onMouseEnter={() => setHoveredTech(tech.id)}
              onMouseLeave={() => setHoveredTech(null)}
              className={hoveredTech === tech.id ? 'animate-in' : ''}
            >
              {renderSkillLevel(tech.level)}
              <TechIcon>
                <img src={tech.icon} alt={`${tech.name} icon`} />
              </TechIcon>
              <TechName>{tech.name}</TechName>
              <TechDescription>{tech.description}</TechDescription>
            </TechCard>
          ))}
        </TechGrid>
      </Container>
    </TechStackSection>
  );
};

export default InteractiveTechStack; 