import React from 'react';
import styled from 'styled-components';
import ProjectCard from '../components/ProjectCard'; // Импортируем карточку

const WorkSectionContainer = styled.section`
  padding: 6rem 2rem;
  background-color: #000; /* Фон секции */
  color: #fff;
  text-align: center;
  overflow: hidden; // Для анимаций
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 3rem;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Адаптивная сетка */
  gap: 2.5rem; /* Пространство между карточками */
  max-width: 1200px; /* Ограничиваем максимальную ширину сетки */
  margin: 0 auto; /* Центрируем сетку */
`;

// Примерные данные проектов
const projectsData = [
  { id: '01', title: 'Project Alpha', tags: ['React', 'Node.js', 'Web Design'], imageUrl: 'https://via.placeholder.com/400x225/2a2a2a/555?text=Project+Alpha' },
  { id: '02', title: 'Service Beta', tags: ['TypeScript', 'GraphQL'], imageUrl: 'https://via.placeholder.com/400x225/2a2a2a/555?text=Service+Beta' },
  { id: '03', title: 'Platform Gamma', tags: ['Next.js', 'Firebase'], imageUrl: 'https://via.placeholder.com/400x225/2a2a2a/555?text=Platform+Gamma' },
  // Можно добавить больше проектов
];

// TODO: Анимации при скролле (GSAP ScrollTrigger) для сетки/карточек

const Work: React.FC = () => {
  return (
    <WorkSectionContainer id="work">
      <SectionTitle>My Work</SectionTitle>
      <ProjectsGrid>
        {projectsData.map(project => (
          <ProjectCard 
            key={project.id}
            number={project.id}
            title={project.title}
            imageUrl={project.imageUrl}
            tags={project.tags}
          />
        ))}
      </ProjectsGrid>
    </WorkSectionContainer>
  );
};

export default Work;
