import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger); // Регистрируем плагин

const AboutSectionContainer = styled.section`
  padding: 6rem 2rem; /* Отступы сверху/снизу и по бокам */
  background-color: #0a0a0a; /* Чуть отличный от чисто черного фон для разнообразия, или можно #000 */
  display: flex;
  flex-direction: column;
  align-items: center; /* Центрируем контент */
  text-align: center; /* Текст по центру на мобильных */
  overflow: hidden; // Предотвращаем возможные проблемы с overflow из-за анимаций

  @media (min-width: 768px) {
    text-align: left; /* Текст по левому краю на десктопах */
    flex-direction: row; /* Располагаем элементы в ряд */
    justify-content: center; /* Центрируем группу элементов */
    align-items: flex-start; /* Выравниваем по верху */
  }
`;

const TextContent = styled.div`
  max-width: 600px; /* Ограничиваем ширину текстового блока */
  
  @media (min-width: 768px) {
    margin-left: 2rem; /* Отступ от возможного визуального элемента слева */
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem); /* Адаптивный размер заголовка */
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block; /* Чтобы подчеркивание было по ширине текста */

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px; /* Расположение линии под текстом */
    width: 60%; /* Длина линии */
    height: 4px;
    background-color: #9d4edd; /* Фиолетовый акцент */
    
    @media (max-width: 768px) { // Центрируем линию на мобильных
        left: 50%;
        transform: translateX(-50%);
    }
  }
`;

const DescriptionText = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  line-height: 1.8;
  color: #e0e0e0; /* Слегка светлее основного белого для контраста */
  margin-bottom: 0; // Убираем нижний отступ у последнего параграфа
`;

// TODO: Анимации при скролле (GSAP ScrollTrigger)

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const titleEl = titleRef.current;
    const textEl = textRef.current;

    if (sectionEl && titleEl && textEl) {
      // Анимация для заголовка
      gsap.fromTo(
        titleEl,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 80%', // Начинаем анимацию, когда 80% секции видно
            toggleActions: 'play none none none', // Проиграть один раз
          },
        }
      );

      // Анимация для текста описания
      gsap.fromTo(
        textEl,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3, // Небольшая задержка после заголовка
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 75%', // Чуть позже, чем заголовок
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  return (
    <AboutSectionContainer id="about" ref={sectionRef}>
      {/* Потенциально здесь может быть левая часть с изображением или графикой */}
      <TextContent>
        <SectionTitle ref={titleRef}>ABOUT ME</SectionTitle>
        <DescriptionText ref={textRef}>
          I'm a creative developer & designer with a passion for blending technical
          expertise with creative edge. Driven by curiosity, I always try to
          explore and learn new skills.
        </DescriptionText>
        {/* Можно добавить еще параграфы */}
      </TextContent>
    </AboutSectionContainer>
  );
};

export default About;
