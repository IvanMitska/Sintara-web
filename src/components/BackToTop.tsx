import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowUp } from 'react-icons/fa';

const BackToTopButton = styled.button<{ visible: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 6rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(90deg, #8E2DE2, #4A00E0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  cursor: pointer;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transform: translateY(${props => props.visible ? 0 : '20px'});
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(142, 45, 226, 0.3);
  z-index: 1000;
  
  &:hover {
    transform: translateY(${props => props.visible ? '-5px' : '15px'});
    box-shadow: 0 8px 15px rgba(142, 45, 226, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    bottom: 1.5rem;
    right: 5.5rem;
  }
`;

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Показать кнопку когда пользователь прокрутил на 300px вниз
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  
  // Прокрутка наверх при нажатии
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  return (
    <BackToTopButton 
      visible={isVisible} 
      onClick={scrollToTop}
      aria-label="Прокрутить наверх"
    >
      <FaArrowUp />
    </BackToTopButton>
  );
};

export default BackToTop; 