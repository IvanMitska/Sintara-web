import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { gsap } from 'gsap';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const CursorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CursorDot = styled.div<{ $isHovered: boolean; $isClicked: boolean }>`
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease;
  z-index: 2;
  
  ${props => props.$isHovered && css`
    animation: ${pulse} 1s ease-in-out infinite;
  `}
  
  ${props => props.$isClicked && css`
    transform: translate(-50%, -50%) scale(1.5);
  `}
`;

const CursorCircle = styled.div<{ $isHovered: boolean; $isClicked: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(142, 45, 226, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(2px);
  
  ${props => props.$isHovered && css`
    width: 60px;
    height: 60px;
    border-color: rgba(142, 45, 226, 0.6);
    background: rgba(142, 45, 226, 0.1);
  `}
  
  ${props => props.$isClicked && css`
    width: 30px;
    height: 30px;
    border-color: var(--color-primary);
  `}
`;

const CursorTrail = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(142, 45, 226, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const CursorText = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  background: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  transform: translate(-50%, -150%);
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--color-primary);
  }
`;

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

const CustomCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  // Обновление позиции курсора
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setMousePos(newPos);
      
      // Обновляем след
      setTrail(prevTrail => {
        const newTrail = [
          { x: newPos.x, y: newPos.y, id: Date.now() },
          ...prevTrail.slice(0, 9) // Оставляем только 10 точек следа
        ];
        return newTrail;
      });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  // Анимация движения курсора
  useEffect(() => {
    if (dotRef.current) {
      gsap.to(dotRef.current, {
        x: mousePos.x,
        y: mousePos.y,
        duration: 0.1,
        ease: "power2.out"
      });
    }
    
    if (circleRef.current) {
      gsap.to(circleRef.current, {
        x: mousePos.x,
        y: mousePos.y,
        duration: 0.3,
        ease: "power2.out"
      });
    }
    
    if (textRef.current) {
      gsap.to(textRef.current, {
        x: mousePos.x,
        y: mousePos.y,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  }, [mousePos]);

  // Анимация следа
  useEffect(() => {
    trail.forEach((point, index) => {
      const trailElement = trailRefs.current[index];
      if (trailElement) {
        gsap.to(trailElement, {
          x: point.x,
          y: point.y,
          opacity: 1 - (index * 0.1),
          scale: 1 - (index * 0.1),
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  }, [trail]);

  // Обработчики событий
  useEffect(() => {
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Проверяем интерактивные элементы
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovered(true);
        setCursorText('Click');
      } else if (target.closest('.tech-card') || target.closest('.project-card')) {
        setIsHovered(true);
        setCursorText('View');
      } else if (target.closest('.code-line')) {
        setIsHovered(true);
        setCursorText('Code');
      }
    };
    
    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || 
          target.closest('a') || target.closest('button') ||
          target.closest('.tech-card') || target.closest('.project-card') ||
          target.closest('.code-line')) {
        setIsHovered(false);
        setCursorText('');
      }
    };

    // Добавляем обработчики к интерактивным элементам
    const addEventListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, .tech-card, .project-card, .code-line');
      
      interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', handleMouseEnter as any);
        element.addEventListener('mouseleave', handleMouseLeave as any);
      });
    };

    // Добавляем обработчики с задержкой для загруженного контента
    setTimeout(addEventListeners, 1000);
    
    // Наблюдатель для динамически добавляемых элементов
    const observer = new MutationObserver(addEventListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      observer.disconnect();
    };
  }, []);

  return (
    <CursorContainer>
      {/* След курсора */}
      {trail.map((point, index) => (
        <CursorTrail
          key={point.id}
          ref={(el) => {
            if (el) trailRefs.current[index] = el;
          }}
          style={{ opacity: 0 }}
        />
      ))}
      
      {/* Основной курсор */}
      <CursorDot 
        ref={dotRef}
        $isHovered={isHovered}
        $isClicked={isClicked}
      />
      
      <CursorCircle 
        ref={circleRef}
        $isHovered={isHovered}
        $isClicked={isClicked}
      />
      
      {/* Текст курсора */}
      <CursorText 
        ref={textRef}
        $isVisible={!!cursorText}
      >
        {cursorText}
      </CursorText>
    </CursorContainer>
  );
};

export default CustomCursor; 