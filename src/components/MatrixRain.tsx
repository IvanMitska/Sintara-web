import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.3;
  z-index: 1;
`;

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Символы для матрицы - реальный код и технологичные символы
    const codeSnippets = [
      'const', 'function', 'return', 'async', 'await', 'import', 'export', 
      'React', 'useState', 'useEffect', 'props', 'state', 'render',
      'class', 'extends', 'super', 'this', 'new', 'typeof',
      '<div>', '</div>', '<span>', '</span>', 'onClick', 'onChange',
      '{}', '[]', '()', '=>', '===', '!==', '&&', '||',
      'npm', 'yarn', 'git', 'push', 'pull', 'commit',
      'API', 'REST', 'GraphQL', 'fetch', 'axios', 'query',
      'if', 'else', 'for', 'while', 'do', 'switch', 'case',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'true', 'false', 'null', 'undefined', 'NaN',
      'CSS', 'HTML', 'JS', 'TS', 'JSX', 'TSX'
    ];
    const symbolsArray = codeSnippets;
    
    const fontSize = 16;
    const columns = canvas.width / (fontSize * 4); // Уменьшаем количество колонок для длинных слов
    const drops: number[] = [];
    
    // Инициализация капель
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      // Затемнение для эффекта следа
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Градиентный цвет текста
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#8E2DE2');
      gradient.addColorStop(0.5, '#4A00E0');
      gradient.addColorStop(1, '#FF7D54');
      
      ctx.fillStyle = gradient;
      ctx.font = `${fontSize}px monospace`;
      
      // Рисуем символы
      for (let i = 0; i < drops.length; i++) {
        const symbol = symbolsArray[Math.floor(Math.random() * symbolsArray.length)];
        const x = i * fontSize * 4; // Увеличиваем расстояние между колонками
        const y = drops[i] * fontSize;
        
        // Добавляем свечение для последнего символа
        if (drops[i] * fontSize > 0 && drops[i] * fontSize < canvas.height) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#8E2DE2';
          ctx.fillText(symbol, x, y);
          ctx.shadowBlur = 0;
        }
        
        // Сброс капли когда она достигает низа
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return <Canvas ref={canvasRef} />;
};

export default MatrixRain;