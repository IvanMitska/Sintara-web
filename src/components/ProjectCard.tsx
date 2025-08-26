import React from 'react';
import styled from 'styled-components';

interface ProjectCardProps {
  number: string;
  title: string;
  imageUrl?: string; // Сделаем изображение опциональным на случай, если его нет
  tags?: string[];
  // Можно добавить onClick или href для перехода на страницу проекта/демо
}

const CardContainer = styled.div`
  background-color: #111;
  border-radius: 10px;
  overflow: hidden; /* Чтобы изображение не вылезало за скругленные углы */
  border: 1px solid #222;
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
  position: relative; /* Для позиционирования номера */
  min-height: 250px; /* Минимальная высота для карточек без изображений */
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 25px rgba(157, 78, 221, 0.25);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  padding-top: 56.25%; /* Соотношение сторон 16:9 для заглушки */
  background-color: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-family: 'Space Mono', monospace;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: auto; /* Или фиксированная высота, если нужно */
  object-fit: cover;
  display: block;
`;

const InfoContainer = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Чтобы текстовый блок занимал доступное место */
`;

const ProjectNumber = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-size: clamp(1.8rem, 4vw, 2.2rem);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.1); /* Полупрозрачный номер */
  z-index: 1;
`;

const ProjectTitle = styled.h3`
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: #9d4edd;
  margin: 0 0 0.5rem 0;
  z-index: 2; /* Чтобы был над номером, если пересекутся */
`;

const ProjectTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto; /* Прижимаем теги к низу карточки */
  z-index: 2;
`;

const ProjectTag = styled.span`
  background-color: #2a2a2a;
  color: #9d4edd;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: 'Space Mono', monospace;
`;


const ProjectCard: React.FC<ProjectCardProps> = ({ number, title, imageUrl, tags }) => {
  return (
    <CardContainer>
      <ProjectNumber>{number}</ProjectNumber>
      {imageUrl ? (
        <ProjectImage src={imageUrl} alt={title} />
      ) : (
        <ImagePlaceholder>Image Placeholder</ImagePlaceholder>
      )}
      <InfoContainer>
        <ProjectTitle>{title}</ProjectTitle>
        {tags && tags.length > 0 && (
          <ProjectTagsContainer>
            {tags.map(tag => <ProjectTag key={tag}>{tag}</ProjectTag>)}
          </ProjectTagsContainer>
        )}
      </InfoContainer>
    </CardContainer>
  );
};

export default ProjectCard;
