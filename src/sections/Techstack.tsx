import React from 'react';
import InteractiveTechStack from '../components/InteractiveTechStack';

// Анимации
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const TechStackSection = styled.section`
  width: 100%;
  padding: 6rem 2rem;
  background: transparent;
  color: #fff;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(90deg, #8E2DE2, #4A00E0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  opacity: 0;
  transform: translateY(30px);
`;

const Description = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  max-width: 700px;
  margin: 0 auto 4rem;
  opacity: 0.8;
  text-align: center;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(30px);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2.5rem;
  width: 100%;
  max-width: 1000px;
`;

const TechCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0;
  transform: scale(0.9);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(142, 45, 226, 0.2), rgba(74, 0, 224, 0.2));
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  &:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 10px 30px rgba(74, 0, 224, 0.3);
    &::before {
      opacity: 1;
    }
  }
`;

const TechIcon = styled.img`
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
  object-fit: contain;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
`;

const TechName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
`;

// Обновленный список технологий
const techStack = [
  { id: 1, name: 'React', icon: '/icons/react.svg' },
  { id: 2, name: 'TypeScript', icon: '/icons/typescript.svg' },
  { id: 3, name: 'JavaScript', icon: '/icons/javascript.svg' },
  { id: 4, name: 'HTML5', icon: '/icons/html5.svg' },
  { id: 5, name: 'CSS3', icon: '/icons/css3.svg' },
  { id: 6, name: 'Styled Components', icon: '/icons/styled-components.svg' },
  { id: 7, name: 'GSAP', icon: '/icons/gsap.svg' },
  { id: 8, name: 'Vite', icon: '/icons/vite.svg' },
  { id: 9, name: 'Git', icon: '/icons/git.svg' },
  { id: 10, name: 'Node.js', icon: '/icons/nodejs.svg' },
  { id: 11, name: 'Webpack', icon: '/icons/webpack.svg' },
  { id: 12, name: 'Figma', icon: '/icons/figma.svg' },
  { id: 13, name: 'Three.js', icon: '/icons/threejs.svg' },
  { id: 14, name: 'Next.js', icon: '/icons/nextjs.svg' },
  { id: 15, name: 'Tailwind CSS', icon: '/icons/tailwindcss.svg' },
  { id: 16, name: 'Redux', icon: '/icons/redux.svg' },
];

const TechStack: React.FC = () => {
  return <InteractiveTechStack />;
};

export default TechStack;
