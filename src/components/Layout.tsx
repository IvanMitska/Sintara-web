import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

// Стилизованный контейнер с градиентным фоном для создания современного эффекта
const LayoutContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-background);
  position: relative;
  overflow: hidden;

  // Градиентная сетка на фоне для создания современного "tech" эффекта
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(142, 45, 226, 0.05) 0%, transparent 25%),
                radial-gradient(circle at 80% 20%, rgba(74, 0, 224, 0.05) 0%, transparent 35%);
    z-index: 0;
    pointer-events: none;
  }

  // Линии сетки для усиления технологичного вида
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0;
    pointer-events: none;
  }
`;

// Главный контейнер с содержимым
const MainContent = styled.main`
  position: relative;
  z-index: 1;
`;

// Эффект "частиц" для создания современного цифрового фона
const ParticlesCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.2;
`;

// Контейнер для курсора с эффектом "следования"
const CustomCursor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
  position: fixed;
  pointer-events: none;
  z-index: 999;
  transition: transform 0.1s ease, opacity 0.3s ease;
  transform: translate(-50%, -50%);
  opacity: 0; // Скрыт по умолчанию, показывается только при движении мыши

  &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: var(--color-primary);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  // Эффект для обработки движения мыши и обновления пользовательского курсора
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!cursorVisible) setCursorVisible(true);
    };

    const onMouseLeave = () => {
      setCursorVisible(false);
    };

    // Настройка анимации частиц на канвасе
    const canvas = document.getElementById('particles') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles: { x: number; y: number; radius: number; dx: number; dy: number; color: string }[] = [];
        
        // Создаем частицы
        for (let i = 0; i < 50; i++) {
          const radius = Math.random() * 2 + 0.5;
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const dx = (Math.random() - 0.5) * 0.5;
          const dy = (Math.random() - 0.5) * 0.5;
          const color = Math.random() > 0.5 ? 'rgba(142, 45, 226, 0.7)' : 'rgba(74, 0, 224, 0.7)';
          
          particles.push({ x, y, radius, dx, dy, color });
        }
        
        // Функция для анимации частиц
        const animate = () => {
          requestAnimationFrame(animate);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          particles.forEach(particle => {
            // Обновляем положение
            particle.x += particle.dx;
            particle.y += particle.dy;
            
            // Проверяем границы
            if (particle.x + particle.radius > canvas.width || particle.x - particle.radius < 0) {
              particle.dx = -particle.dx;
            }
            
            if (particle.y + particle.radius > canvas.height || particle.y - particle.radius < 0) {
              particle.dy = -particle.dy;
            }
            
            // Рисуем частицу
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            ctx.closePath();
            
            // Соединяем частицы линиями если они близко друг к другу
            particles.forEach(otherParticle => {
              const distance = Math.sqrt(
                Math.pow(particle.x - otherParticle.x, 2) + 
                Math.pow(particle.y - otherParticle.y, 2)
              );
              
              if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(142, 45, 226, ${0.2 - distance/500})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
                ctx.closePath();
              }
            });
          });
        };
        
        animate();
      }
    }

    // Обработчики событий для курсора
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // Обработчик для интерактивных элементов
    const handleElementInteraction = (entering: boolean) => {
      const cursor = document.getElementById('custom-cursor');
      if (cursor) {
        if (entering) {
          cursor.style.transform = `translate(-50%, -50%) scale(1.5)`;
          cursor.style.backgroundColor = 'rgba(142, 45, 226, 0.1)';
          cursor.style.mixBlendMode = 'difference';
        } else {
          cursor.style.transform = `translate(-50%, -50%) scale(1)`;
          cursor.style.backgroundColor = 'transparent';
          cursor.style.mixBlendMode = 'normal';
        }
      }
    };

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => handleElementInteraction(true));
      element.addEventListener('mouseleave', () => handleElementInteraction(false));
    });

    // Обработчик изменения размера окна
    const onResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', () => handleElementInteraction(true));
        element.removeEventListener('mouseleave', () => handleElementInteraction(false));
      });
    };
  }, [cursorVisible]);

  // Эффект для плавной прокрутки при клике на якорные ссылки
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        const targetId = anchor.getAttribute('href')?.substring(1);
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
  
  return (
    <LayoutContainer>
      <Navigation />
      <MainContent>
        {children}
      </MainContent>
      <ParticlesCanvas id="particles" />
      <CustomCursor 
        id="custom-cursor" 
        style={{ 
          left: `${mousePosition.x}px`, 
          top: `${mousePosition.y}px`,
          opacity: cursorVisible ? 1 : 0
        }} 
      />
    </LayoutContainer>
  );
};

export default Layout;
