import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaClock, FaCode, FaUserFriends, FaRocket, FaAward, FaHeadset } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const BenefitsSection = styled.section`
  padding: 8rem 0;
  background-color: #000;
  position: relative;
  overflow: hidden;
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
  background: linear-gradient(90deg, #8E2DE2, #4A00E0, #FF7D54);
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
    background: linear-gradient(90deg, #8E2DE2, #4A00E0);
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
  padding: 2rem;
  background-color: #0a0a0a;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    font-size: 2.5rem;
    color: white;
  }
`;

const BenefitTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const BenefitDescription = styled.p`
  font-size: 1rem;
  color: #a0a0a0;
  line-height: 1.6;
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