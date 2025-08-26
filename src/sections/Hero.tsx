import React, { useEffect, useRef, memo, useState, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { FaGithub, FaLinkedinIn, FaTelegram, FaInstagram } from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import MatrixRain from '../components/MatrixRain';

// Ленивая загрузка 3D сцены
const Tech3DScene = lazy(() => import('../components/Tech3DScene'));

// Регистрируем ScrollTrigger для использования эффекта параллакса
gsap.registerPlugin(ScrollTrigger);

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center; 
  min-height: 100vh;
  padding: 120px clamp(2rem, 5vw, 4rem) 80px; 
  background-color: var(--color-background);
  color: var(--color-text);
  position: relative;
  overflow: hidden; 
  width: 100%; 
  box-sizing: border-box;
  margin: 0;
  
  // Усиленное градиентное свечение позади текста
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 0;
    width: 50%;
    height: 60%;
    background: radial-gradient(circle at center, rgba(142, 45, 226, 0.2), transparent 70%);
    filter: blur(80px);
    z-index: 0;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 100px 1.5rem 40px;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 3rem;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
  }
`;


const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: flex-start; 
  z-index: 2;
  flex: 1;
  max-width: 600px;
  width: 100%;
  overflow: visible;

  @media (max-width: 768px) {
    align-items: center; 
    padding-right: 0;
    margin-bottom: 2rem;
    text-align: center;
    order: 2;
    flex: none; 
    width: 100%; 
    max-width: 100%;
    padding: 0 1rem;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
  z-index: 2;
  flex: 1;
  max-width: 500px;
  width: 100%;
  height: 400px;
  position: relative;

  @media (max-width: 768px) {
    width: 100%; 
    max-width: 100%;
    padding-left: 0;
    order: 1;
    margin-bottom: 2rem;
    max-height: 40vh;
  }
`;

const MainHeading = styled.h1`
  margin: 0 0 1rem 0;
  line-height: 1.2;
  font-size: clamp(2rem, 4vw, 2.8rem);
  background: linear-gradient(90deg, #8E2DE2, #4A00E0, #FF7D54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  
  span {
    display: block;
    background: linear-gradient(90deg, #8E2DE2, #4A00E0, #FF7D54);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
`;

// Компонент для анимированной смены слов
const AnimatedWord = styled(motion.span)`
  display: inline-block;
  background: var(--color-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-right: 0.3em;
  position: relative;
`;

const HighlightWord = styled(motion.span)`
  display: inline-block;
  position: relative;
  color: #fff;
  padding: 0 0.15em;
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  margin: 1.5rem 0 2.5rem;
  color: #b0b0b0;
  line-height: 1.8;
  max-width: 600px;
  width: 100%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 0;
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #8E2DE2, #4A00E0);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const TypingText = styled.div`
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  font-family: 'Space Mono', monospace;
  color: var(--color-primary);
  margin-bottom: 1rem;
  min-height: 2.5em;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;

  &::after {
    content: '|';
    animation: blink 1s infinite;
    margin-left: 3px;
    display: inline-block;
    width: 2px;
  }

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`;

const CTAButton = styled.a`
  display: inline-block;
  background: var(--color-primary-gradient);
  color: white;
  padding: 1rem 2.7rem;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  box-shadow: 0 4px 15px rgba(142, 45, 226, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.7s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 25px rgba(142, 45, 226, 0.4);
    
    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 0.8rem 2rem;
    font-size: 1rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem; 
  margin-top: 2.5rem;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
    gap: 1rem;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(142, 45, 226, 0.1);
  border: 1px solid rgba(142, 45, 226, 0.3);
  border-radius: 50%;
  color: var(--color-primary);
  font-size: 1.3rem;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--color-primary);
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(142, 45, 226, 0.4);
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
`;

// Временная заглушка вместо ThreeModel
const ModelPlaceholder = styled.div`
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, rgba(142, 45, 226, 0.3), rgba(74, 0, 224, 0.3));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  text-align: center;
  border: 2px solid rgba(142, 45, 226, 0.5);
  
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
    font-size: 0.9rem;
  }
`;

const Hero: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typingText, setTypingText] = useState('');
  const heroRef = useRef<HTMLElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  
  // Слова для анимации
  const words = ['Креативный', 'Опытный', 'Современный', 'Инновационный'];
  const typingTexts = [
    'console.log("Привет, мир!");', 
    'const developer = "passionate";',
    'function createMagic() { return "✨"; }',
    '// Превращаю идеи в код'
  ];

  // Анимация печати
  useEffect(() => {
    let timeoutId: number;
    
    const currentText = typingTexts[currentWordIndex];
    let currentIndex = 0;
    
    const typeText = () => {
      if (currentIndex < currentText.length) {
        setTypingText(currentText.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeText, 120);
      } else {
        // Пауза после завершения печати
        timeoutId = setTimeout(() => {
          // Очистка и переход к следующему тексту
          timeoutId = setTimeout(() => {
            setTypingText('');
            setCurrentWordIndex((prev) => (prev + 1) % typingTexts.length);
          }, 500);
        }, 2500);
      }
    };

    // Запускаем только при смене индекса
    typeText();
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentWordIndex]); // Убираем isTyping из зависимостей

  // GSAP анимации
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Анимация появления левой колонки
      tl.fromTo(leftColumnRef.current, 
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
      );
      
      // Анимация появления правой колонки
      tl.fromTo(rightColumnRef.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
        "-=0.5"
      );
      
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <HeroSection ref={heroRef}>
      <MatrixRain />
      <HeroContent>
        <LeftColumn ref={leftColumnRef}>
          <MainHeading>
            Привет, я <span>Иван Мицкая</span>
          </MainHeading>
        
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentWordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ 
              fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', 
              marginBottom: '1.5rem',
              background: 'linear-gradient(90deg, #8E2DE2, #4A00E0, #FF7D54)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
              flexWrap: 'nowrap',
              gap: '0.3em',
              minHeight: '2.5rem',
              alignItems: 'center'
            }}
          >
            <AnimatedWord>{words[currentWordIndex]}</AnimatedWord>
            <HighlightWord>разработчик</HighlightWord>
          </motion.h2>
        </AnimatePresence>

        <TypingText>
          {typingText}
        </TypingText>

        <Subtitle>
          Создаю современные веб-приложения с использованием передовых технологий. 
          Специализируюсь на React, TypeScript и создании интерактивных пользовательских интерфейсов.
        </Subtitle>

        <CTAButton href="#contact">
          Начать проект
        </CTAButton>

        <SocialLinks>
          <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </SocialLink>
          <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </SocialLink>
          <SocialLink href="https://t.me/username" target="_blank" rel="noopener noreferrer">
            <FaTelegram />
          </SocialLink>
          <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </SocialLink>
        </SocialLinks>
      </LeftColumn>

      <RightColumn ref={rightColumnRef}>
        <Suspense fallback={
          <ModelPlaceholder>
            Загрузка 3D...<br/>
          </ModelPlaceholder>
        }>
          <Tech3DScene />
        </Suspense>
      </RightColumn>
      </HeroContent>
    </HeroSection>
  );
};

export default memo(Hero);
