import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<any[]>([]);
  const shootingStarsRef = useRef<any[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Размер canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // Класс для звезд
    class Star {
      x: number;
      y: number;
      z: number;
      prevX: number;
      prevY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.prevX = x;
        this.prevY = y;
        this.size = (1 - z / 1000) * 2;
        const colors = ['#ffffff', '#ffeaa7', '#74b9ff', '#a29bfe', '#fd79a8'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(speed: number) {
        this.prevX = this.x / (this.z * 0.001);
        this.prevY = this.y / (this.z * 0.001);
        
        this.z -= speed;
        
        if (this.z <= 0) {
          this.x = (Math.random() - 0.5) * 2000;
          this.y = (Math.random() - 0.5) * 2000;
          this.z = 1000;
          this.prevX = this.x / (this.z * 0.001);
          this.prevY = this.y / (this.z * 0.001);
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const x = this.x / (this.z * 0.001);
        const y = this.y / (this.z * 0.001);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Рисуем линию (эффект движения)
        ctx.beginPath();
        ctx.moveTo(centerX + this.prevX, centerY + this.prevY);
        ctx.lineTo(centerX + x, centerY + y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.globalAlpha = (1 - this.z / 1000) * 0.8;
        ctx.stroke();
        
        // Рисуем звезду
        ctx.beginPath();
        ctx.arc(centerX + x, centerY + y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 1 - this.z / 1000;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Класс для падающих звезд
    class ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      opacityDelta: number;
      angle: number;
      
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.length = Math.random() * 80 + 10;
        this.speed = Math.random() * 10 + 6;
        this.opacity = 0;
        this.opacityDelta = 0.05;
        this.angle = Math.random() * Math.PI / 4 + Math.PI / 4;
      }
      
      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity += this.opacityDelta;
        
        if (this.opacity >= 1) {
          this.opacityDelta = -this.opacityDelta;
        }
        
        if (this.opacity <= 0 || this.y > canvas.height || this.x > canvas.width) {
          this.reset();
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        const gradient = ctx.createLinearGradient(
          this.x, this.y,
          this.x - this.length * Math.cos(this.angle),
          this.y - this.length * Math.sin(this.angle)
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - this.length * Math.cos(this.angle),
          this.y - this.length * Math.sin(this.angle)
        );
        ctx.stroke();
        ctx.restore();
      }
    }

    // Инициализация звезд
    const initStars = () => {
      starsRef.current = [];
      shootingStarsRef.current = [];
      
      // Создаем обычные звезды
      for (let i = 0; i < 800; i++) {
        starsRef.current.push(new Star(
          (Math.random() - 0.5) * 2000,
          (Math.random() - 0.5) * 2000,
          Math.random() * 1000
        ));
      }
      
      // Создаем падающие звезды
      for (let i = 0; i < 3; i++) {
        shootingStarsRef.current.push(new ShootingStar());
      }
    };

    // Анимация
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Очищаем canvas с эффектом следа
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Анимируем обычные звезды
      starsRef.current.forEach(star => {
        star.update(2);
        star.draw(ctx);
      });
      
      // Анимируем падающие звезды
      shootingStarsRef.current.forEach(star => {
        star.update();
        star.draw(ctx);
      });
      
      // Добавляем пульсирующее свечение в центре
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = Date.now() * 0.001;
      const pulse = Math.sin(time) * 0.5 + 0.5;
      
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 200
      );
      gradient.addColorStop(0, `rgba(142, 45, 226, ${pulse * 0.1})`);
      gradient.addColorStop(0.5, `rgba(74, 0, 224, ${pulse * 0.05})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return <Canvas ref={canvasRef} />;
};

export default SpaceBackground;