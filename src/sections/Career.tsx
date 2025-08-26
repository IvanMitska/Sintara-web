import React, { useEffect, useRef, createRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CareerSectionContainer = styled.section`
  padding: 6rem 2rem;
  background-color: #0a0a0a; /* Можно чередовать фон секций */
  color: #fff;
  text-align: center;
  overflow: hidden; /* Для анимаций */
`;

const SectionTitleStyled = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 4rem; /* Больше отступ для таймлайна */
`;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* На мобильных элементы по центру */
  position: relative; /* Для линии таймлайна */
  margin: 0 auto;
  max-width: 800px; /* Ограничиваем ширину таймлайна */

  /* Вертикальная линия таймлайна */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: #333; /* Цвет линии */
    z-index: 0;
  }

  @media (max-width: 767px) { // На мобильных линия слева
    align-items: flex-start; /* Карточки будут справа от линии */
    &::before {
      left: 20px; /* Отступ линии слева */
      transform: none;
    }
  }
`;

const TimelineItem = styled.div`
  background-color: #111;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  margin-bottom: 3rem; 
  width: calc(50% - 2rem); /* Половина ширины минус отступ от линии */
  text-align: left;
  position: relative;
  border: 1px solid #222;
  z-index: 1; /* Чтобы карточки были над линией */

  /* Точка на таймлайне */
  &::before {
    content: '';
    position: absolute;
    top: 20px; 
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #9d4edd; /* Цвет точки */
    border: 3px solid #0a0a0a; /* Обводка в цвет фона секции */
    z-index: 2;
  }

  /* Чередование элементов */
  &:nth-child(odd) {
    align-self: flex-start;
    left: 0;
    &::before {
      right: -2rem; /* Позиция точки относительно карточки */
      margin-right: -11px; /* Компенсация ширины точки и половины линии */
    }
  }

  &:nth-child(even) {
    align-self: flex-end;
    right: 0;
    &::before {
      left: -2rem;
      margin-left: -11px;
    }
  }

  @media (max-width: 767px) { // Стили для мобильных
    width: calc(100% - 40px); /* Ширина карточки с учетом отступа от линии */
    align-self: flex-end; /* Все карточки справа от линии */
    margin-left: 40px; /* Отступ от линии */
    left: auto;
    right: auto;

    &:nth-child(odd), &:nth-child(even) {
      align-self: flex-end;
      left: auto;
      right: auto;
       &::before {
        left: -20px; /* Позиция точки слева от карточки */
        margin-left: -11px; /* Компенсация */
        right: auto;
      }
    }
  }
`;

const JobTitle = styled.h3`
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  color: #9d4edd;
  margin-bottom: 0.5rem;
`;

const CompanyAndDate = styled.p`
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: #bbb;
  margin-bottom: 1rem;
  font-family: 'Space Mono', monospace;
`;

const JobDescription = styled.p`
  font-size: clamp(0.9rem, 2vw, 1rem);
  line-height: 1.7;
  color: #ccc;
`;

// Данные для таймлайна (позже можно вынести или получать из props/CMS)
const careerData = [
  {
    title: 'Associate Solution Leader',
    company: 'Briana Enterprises',
    date: '2021 - PRESENT', // На сайте "2021", "PRESENT" нет, но по ТЗ "NOW" было
    description: 'Leading a team of developers, working on product development and project management, ensuring high-quality deliverables and effective team collaboration.',
  },
  {
    title: 'Senior Web Developer',
    company: 'Blue Collar Digital',
    date: '2019 - 2021', // На сайте "2019"
    description: 'Developed and maintained various client websites and internal tools using modern web technologies like React, Node.js, and GraphQL.',
  },
  {
    title: 'Freelance Web Developer',
    company: 'Self-Employed',
    date: '2017 - 2019',
    description: 'Provided freelance web development services to various clients, focusing on custom WordPress themes and e-commerce solutions.',
  },
  // По ТЗ еще "Freelance & Upskilling (NOW)", но на сайте moncy.dev этого нет.
  // Решил пока ориентироваться на moncy.dev для контента.
];


// TODO: Детальная стилизация таймлайна (линии, точек)
// TODO: Анимации при скролле (GSAP ScrollTrigger) для линии и элементов

const Career: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  
  const timelineItemsRefs = useRef(careerData.map(() => createRef<HTMLDivElement>()));

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const titleEl = titleRef.current;
    const timelineContainerEl = timelineContainerRef.current;
    
    // Анимация заголовка
    if (sectionEl && titleEl) {
      gsap.fromTo(titleEl,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionEl, start: 'top 80%', toggleActions: 'play none none none' }
        }
      );
    }

    // Анимация "рисования" линии и появления элементов
    if (timelineContainerEl && timelineItemsRefs.current.length > 0) {
        const validItems = timelineItemsRefs.current.map(ref => ref.current).filter(el => el !== null) as HTMLDivElement[];
        
        validItems.forEach((item) => {
            gsap.fromTo(item,
                { opacity: 0, y: 50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out',
                  scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' }
                }
            );
        });
    }

  }, []);

  return (
    <CareerSectionContainer id="career" ref={sectionRef}>
      <SectionTitleStyled ref={titleRef}>My Career & Experience</SectionTitleStyled>
      <TimelineContainer ref={timelineContainerRef}>
        {careerData.map((job, index) => (
          <TimelineItem key={index} ref={timelineItemsRefs.current[index]}>
            <JobTitle>{job.title}</JobTitle>
            <CompanyAndDate>{job.company} • {job.date}</CompanyAndDate>
            <JobDescription>{job.description}</JobDescription>
          </TimelineItem>
        ))}
      </TimelineContainer>
    </CareerSectionContainer>
  );
};

export default Career;
