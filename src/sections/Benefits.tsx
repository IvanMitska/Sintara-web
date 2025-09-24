import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaClock, FaCode, FaUserFriends, FaRocket, FaAward, FaHeadset } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const BenefitsSection = styled.section`
  padding: 8rem 0;
  background: var(--gradient-background), var(--color-background);
  position: relative;
  overflow: hidden;

  /* Добавляем разделитель сверху */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--gradient-section-divider);
    z-index: 1;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -10px;
    width: 80px;
    height: 4px;
    background: var(--gradient-secondary);
  }
`;

const SectionDescription = styled.p`
  font-size: clamp(1rem, 2vw, 1.1rem);
  max-width: 600px;
  margin: 0 auto;
  color: #a0a0a0;
  line-height: 1.6;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2.5rem;
  
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BenefitCard = styled.div`
  padding: 2.5rem 2rem;
  background: linear-gradient(135deg, rgba(15, 15, 25, 0.8), rgba(25, 25, 35, 0.8));
  border-radius: 16px;
  border: 1px solid rgba(215, 109, 119, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  /* Тонкий верхний бордер */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--gradient-primary);
    opacity: 0.6;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(215, 109, 119, 0.25);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);

    &::before {
      opacity: 1;
    }
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
  transition: all 0.3s ease;

  /* Тонкий светящийся ободок */
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: var(--gradient-card);
    -webkit-mask: radial-gradient(circle, transparent 38px, black 40px);
    mask: radial-gradient(circle, transparent 38px, black 40px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${BenefitCard}:hover & {
    transform: scale(1.05);
    background: var(--gradient-button-hover);

    &::before {
      opacity: 1;
    }
  }

  svg {
    font-size: 2.2rem;
    color: white;
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.2));
  }
`;

const BenefitTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.3;

  ${BenefitCard}:hover & {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
`;

const BenefitDescription = styled.p`
  font-size: 1rem;
  color: #a0a0a0;
  line-height: 1.7;
  transition: color 0.3s ease;

  ${BenefitCard}:hover & {
    color: #b8b8b8;
  }
`;

const Benefits: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const benefits = benefitsRef.current;

    if (section && header && benefits) {
      // Анимация заголовка
      gsap.fromTo(
        header,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Анимация карточек преимуществ
      gsap.fromTo(
        benefits.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: benefits,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const benefitsData = [
    {
      icon: <FaRocket />,
      title: 'Быстрая разработка',
      description: 'Оперативная реализация проектов в кратчайшие сроки без потери качества.'
    },
    {
      icon: <FaCode />,
      title: 'Современные технологии',
      description: 'Используем передовые технологии и фреймворки для создания эффективных решений.'
    },
    {
      icon: <FaUserFriends />,
      title: 'Индивидуальный подход',
      description: 'Учитываем особенности вашего бизнеса и целевой аудитории при разработке.'
    },
    {
      icon: <FaAward />,
      title: 'Высокое качество',
      description: 'Гарантируем качественную реализацию и тщательное тестирование всех элементов.'
    },
    {
      icon: <FaClock />,
      title: 'Соблюдение сроков',
      description: 'Всегда сдаем проекты в установленные сроки согласно договоренностям.'
    },
    {
      icon: <FaHeadset />,
      title: 'Поддержка 24/7',
      description: 'Обеспечиваем техническую поддержку и консультации по любым вопросам.'
    }
  ];

  return (
    <BenefitsSection id="benefits" ref={sectionRef}>
      <Container>
        <SectionHeader ref={headerRef}>
          <SectionTitle>Почему выбирают нас</SectionTitle>
          <SectionDescription>
            Мы стремимся обеспечить нашим клиентам лучший сервис и результат, превосходящий ожидания
          </SectionDescription>
        </SectionHeader>

        <BenefitsGrid ref={benefitsRef}>
          {benefitsData.map((benefit, index) => (
            <BenefitCard key={index}>
              <IconContainer>
                {benefit.icon}
              </IconContainer>
              <BenefitTitle>{benefit.title}</BenefitTitle>
              <BenefitDescription>{benefit.description}</BenefitDescription>
            </BenefitCard>
          ))}
        </BenefitsGrid>
      </Container>
    </BenefitsSection>
  );
};

export default Benefits; 