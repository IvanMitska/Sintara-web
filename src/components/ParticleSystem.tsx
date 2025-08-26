import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ParticleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;

const ParticleCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  background: transparent;
`;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const ParticleSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Цвета частиц
  const colors = [
    'rgba(142, 45, 226, 0.6)',
    'rgba(74, 0, 224, 0.6)',
    'rgba(255, 125, 84, 0.4)',
    'rgba(255, 180, 67, 0.4)',
    'rgba(255, 255, 255, 0.3)'
  ];

  // Создание частицы
  const createParticle = (x?: number, y?: number): Particle => {
    const life = Math.random() * 300 + 100;
    return {
      x: x ?? Math.random() * dimensions.width,
      y: y ?? Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: life,
      maxLife: life
    };
  };

  // Инициализация частиц
  const initParticles = () => {
    const particleCount = Math.min(150, Math.floor((dimensions.width * dimensions.height) / 10000));
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle());
    }
  };

  // Обновление частиц
  const updateParticles = () => {
    particlesRef.current.forEach((particle, index) => {
      // Обновляем позицию
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Притягиваем к мыши
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100 * 0.01;
        particle.vx += dx * force;
        particle.vy += dy * force;
      }

      // Ограничиваем скорость
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Обновляем жизнь
      particle.life--;
      particle.opacity = (particle.life / particle.maxLife) * 0.7;

      // Граничные условия
      if (particle.x < 0 || particle.x > dimensions.width || 
          particle.y < 0 || particle.y > dimensions.height || 
          particle.life <= 0) {
        particlesRef.current[index] = createParticle();
      }
    });
  };

  // Рисование частиц
  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    particlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      
      // Рисуем частицу с градиентом
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });

    // Рисуем связи между близкими частицами
    particlesRef.current.forEach((particle1, i) => {
      particlesRef.current.slice(i + 1).forEach(particle2 => {
        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 80) {
          ctx.save();
          ctx.globalAlpha = (80 - distance) / 80 * 0.2;
          ctx.strokeStyle = 'rgba(142, 45, 226, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle1.x, particle1.y);
          ctx.lineTo(particle2.x, particle2.y);
          ctx.stroke();
          ctx.restore();
        }
      });
    });
  };

  // Основной цикл анимации
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateParticles();
    drawParticles(ctx);
    animationRef.current = requestAnimationFrame(animate);
  };

  // Обработка движения мыши
  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }
  };

  // Обработка изменения размера окна
  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        initParticles();
        animate();
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <ParticleContainer>
      <ParticleCanvas ref={canvasRef} />
    </ParticleContainer>
  );
};

export default ParticleSystem; 