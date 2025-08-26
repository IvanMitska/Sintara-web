import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WhatIDoSectionContainer = styled.section`
  padding: 6rem 2rem;
  background-color: #000; /* Или #0a0a0a как у About, или другой оттенок */
  color: #fff;
  text-align: center; /* Общее выравнивание по центру для заголовка */
  overflow: hidden; // Для предотвращения случайных overflow при анимации
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 3rem; /* Больше отступ под заголовком */
  span {
    color: #9d4edd; /* Фиолетовый акцент для "I DO" */
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem; /* Пространство между колонками на мобильных */

  @media (min-width: 768px) {
    flex-direction: row; /* Колонки в ряд на десктопе */
    justify-content: center; /* Центрируем группу колонок */
    align-items: flex-start; /* Выравниваем по верху */
    gap: 4rem; /* Пространство между колонками */
  }
`;

const ServiceBlock = styled.div`
  background-color: #111; /* Фон для блоков */
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px; /* Максимальная ширина блока */
  width: 100%;
  text-align: left; /* Текст внутри блока по левому краю */
  border: 1px solid #222; /* Тонкая рамка */
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(157, 78, 221, 0.2); /* Тень с фиолетовым оттенком */
  }
`;

const ServiceTitle = styled.h3`
  font-size: clamp(1.5rem, 4vw, 1.8rem);
  color: #9d4edd;
  margin-bottom: 1rem;
  /* Можно добавить иконку перед заголовком */
`;

const ServiceDescription = styled.p`
  font-size: clamp(0.9rem, 2vw, 1rem);
  line-height: 1.7;
  color: #ccc;
  margin-bottom: 1.5rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap; 
  gap: 0.75rem; 
  margin-top: 1rem;
`;

const Tag = styled.span`
  background-color: #2a2a2a; 
  color: #9d4edd; 
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  font-size: 0.8rem;
  font-family: 'Space Mono', monospace; 
  border: 1px solid #3a3a3a;
`;

// TODO: Список навыков и технологий (теги)
// TODO: Анимации при скролле (GSAP ScrollTrigger)

const WhatIDo: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const developBlockRef = useRef<HTMLDivElement>(null);
  const designBlockRef = useRef<HTMLDivElement>(null);

  const devSkills = ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Next.js', 'Styled Components', 'GSAP'];
  const designSkills = ['UI/UX Design', 'Figma', 'Prototyping', 'Wireframing', 'Responsive Design', 'Adobe XD'];

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const titleEl = titleRef.current;
    const developEl = developBlockRef.current;
    const designEl = designBlockRef.current;

    if (sectionEl && titleEl) {
      gsap.fromTo(
        titleEl,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionEl, start: 'top 80%', toggleActions: 'play none none none' }
        }
      );
    }

    const blocks = [developEl, designEl].filter(Boolean) as HTMLElement[];
    if (blocks.length > 0) {
      gsap.fromTo(
        blocks,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out', stagger: 0.3,
          scrollTrigger: { trigger: sectionEl, start: 'top 70%', toggleActions: 'play none none none' }
        }
      );
    }

  }, []);

  return (
    <WhatIDoSectionContainer id="what-i-do" ref={sectionRef}>
      <SectionTitle ref={titleRef}>WHAT <span>I DO</span></SectionTitle>
      <ContentWrapper>
        <ServiceBlock ref={developBlockRef}>
          <ServiceTitle>DEVELOP</ServiceTitle>
          <ServiceDescription>
            Crafting responsive and performant web applications with modern technologies. 
            Focused on clean code, great user experience, and scalable solutions.
          </ServiceDescription>
          <TagsContainer>
            {devSkills.map(skill => <Tag key={skill}>{skill}</Tag>)}
          </TagsContainer>
        </ServiceBlock>
        <ServiceBlock ref={designBlockRef}>
          <ServiceTitle>DESIGN</ServiceTitle>
          <ServiceDescription>
            Designing intuitive and visually appealing user interfaces. From wireframes
            to final mockups, ensuring a seamless blend of aesthetics and usability.
          </ServiceDescription>
          <TagsContainer>
            {designSkills.map(skill => <Tag key={skill}>{skill}</Tag>)}
          </TagsContainer>
        </ServiceBlock>
      </ContentWrapper>
    </WhatIDoSectionContainer>
  );
};

export default WhatIDo;
