import React, { memo, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';

const ProcessSection = styled.section`
  padding: 120px 0;
  background: transparent;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    margin-bottom: 32px;
    padding: 0 20px;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 1.5rem;
`;

const SectionSubtitle = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

/* Simple 2D Carousel - no perspective/3D for performance */
const CarouselContainer = styled.div`
  position: relative;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;

  @media (max-width: 768px) {
    height: auto;
    padding: 20px 0;
  }
`;

const CarouselTrack = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: 380px;
  }
`;

const Card = styled.div<{ $offset: number; $isActive: boolean }>`
  position: absolute;
  width: 380px;
  min-height: 280px;
  background: ${props => props.$isActive
    ? 'linear-gradient(145deg, rgba(30, 20, 60, 0.95), rgba(20, 10, 45, 0.95))'
    : 'rgba(20, 10, 40, 0.7)'};
  border: 1px solid ${props => props.$isActive
    ? 'rgba(124, 58, 237, 0.4)'
    : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 24px;
  padding: 32px;
  cursor: pointer;
  transition: transform 0.4s ease, opacity 0.4s ease, box-shadow 0.4s ease;
  will-change: transform, opacity;

  transform: ${props => {
    const offset = props.$offset;
    if (offset === 0) return 'translateX(0) scale(1)';
    const direction = offset > 0 ? 1 : -1;
    const absOffset = Math.abs(offset);
    const translateX = direction * absOffset * 300;
    const scale = Math.max(1 - absOffset * 0.12, 0.7);
    return `translateX(${translateX}px) scale(${scale})`;
  }};

  opacity: ${props => {
    const absOffset = Math.abs(props.$offset);
    if (absOffset === 0) return 1;
    if (absOffset === 1) return 0.6;
    if (absOffset === 2) return 0.3;
    return 0;
  }};

  z-index: ${props => 10 - Math.abs(props.$offset)};

  box-shadow: ${props => props.$isActive
    ? '0 20px 60px rgba(124, 58, 237, 0.25)'
    : '0 10px 30px rgba(0, 0, 0, 0.2)'};

  pointer-events: ${props => Math.abs(props.$offset) <= 1 ? 'auto' : 'none'};

  @media (max-width: 768px) {
    width: calc(100% - 60px);
    max-width: 340px;
    min-height: 320px;
    padding: 24px;

    transform: ${props => {
      const offset = props.$offset;
      if (offset === 0) return 'translateX(-50%) scale(1)';
      const direction = offset > 0 ? 1 : -1;
      const absOffset = Math.abs(offset);
      const translatePercent = direction * absOffset * 80;
      const scale = Math.max(1 - absOffset * 0.1, 0.8);
      return `translateX(calc(-50% + ${translatePercent}%)) scale(${scale})`;
    }};

    left: 50%;
  }
`;

const CardInner = styled.div`
  position: relative;
  z-index: 2;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const StepNumber = styled.div<{ $isActive: boolean }>`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: ${props => props.$isActive
    ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
    : 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.$isActive ? '#ffffff' : '#a78bfa'};
  box-shadow: ${props => props.$isActive ? '0 8px 24px rgba(124, 58, 237, 0.4)' : 'none'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

const StepBadge = styled.div<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.$isActive ? 'rgba(124, 58, 237, 0.2)' : 'rgba(124, 58, 237, 0.1)'};
  border: 1px solid ${props => props.$isActive ? 'rgba(124, 58, 237, 0.3)' : 'rgba(124, 58, 237, 0.15)'};
  border-radius: 20px;
  padding: 6px 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StepTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 1.375rem;
  }
`;

const StepDescription = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const StepDuration = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.25);
  border-radius: 8px;
  padding: 8px 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #22c55e;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 48px;

  @media (max-width: 768px) {
    margin-top: 24px;
    padding: 0 20px;
  }
`;

const NavButton = styled.button<{ $disabled?: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.$disabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(124, 58, 237, 0.15)'};
  border: 1px solid ${props => props.$disabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(124, 58, 237, 0.3)'};
  color: ${props => props.$disabled ? 'rgba(255, 255, 255, 0.2)' : '#a78bfa'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(124, 58, 237, 0.25);
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }

  svg {
    width: 24px;
    height: 24px;

    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }
`;

const ProgressDots = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressDot = styled.button<{ $isActive: boolean }>`
  width: ${props => props.$isActive ? '24px' : '8px'};
  height: 8px;
  border-radius: 4px;
  border: none;
  background: ${props => props.$isActive ? 'linear-gradient(90deg, #7c3aed, #a78bfa)' : 'rgba(255, 255, 255, 0.2)'};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    background: ${props => props.$isActive ? 'linear-gradient(90deg, #7c3aed, #a78bfa)' : 'rgba(255, 255, 255, 0.4)'};
  }
`;

const ProgressText = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  min-width: 50px;
  text-align: center;
`;

const stepsData = {
  en: [
    { number: '01', title: 'Discovery call', description: 'We discuss your goals, requirements, and vision. You get a clear understanding of what\'s possible and a rough estimate.', duration: '1-2 days', badge: 'Start' },
    { number: '02', title: 'Proposal & planning', description: 'Detailed scope, fixed price, and timeline. No surprises. You approve before we write a single line of code.', duration: '2-3 days', badge: 'Planning' },
    { number: '03', title: 'Design & prototype', description: 'Interactive mockups you can click through. See exactly how your product will look and feel before development.', duration: '5-7 days', badge: 'Design' },
    { number: '04', title: 'Development', description: 'We build your product with weekly demos. You see progress in real-time and can give feedback along the way.', duration: '2-4 weeks', badge: 'Build' },
    { number: '05', title: 'Testing & QA', description: 'Rigorous testing across devices and browsers. We catch bugs before your users do.', duration: '3-5 days', badge: 'Quality' },
    { number: '06', title: 'Launch', description: 'Smooth deployment to production. We handle hosting setup, DNS, SSL — everything technical.', duration: '1-2 days', badge: 'Deploy' },
    { number: '07', title: 'Support', description: '60-day warranty included. After that, optional maintenance plans available if you need ongoing help.', duration: 'Ongoing', badge: 'Finish' }
  ],
  ru: [
    { number: '01', title: 'Знакомство', description: 'Обсуждаем ваши цели, требования и видение. Вы получаете понимание возможностей и предварительную оценку.', duration: '1-2 дня', badge: 'Старт' },
    { number: '02', title: 'Предложение и план', description: 'Детальный план, фиксированная цена и сроки. Без сюрпризов. Вы одобряете до написания кода.', duration: '2-3 дня', badge: 'План' },
    { number: '03', title: 'Дизайн и прототип', description: 'Интерактивные макеты, которые можно кликать. Увидите, как будет выглядеть продукт до разработки.', duration: '5-7 дней', badge: 'Дизайн' },
    { number: '04', title: 'Разработка', description: 'Создаём продукт с еженедельными демо. Видите прогресс в реальном времени и даёте обратную связь.', duration: '2-4 недели', badge: 'Код' },
    { number: '05', title: 'Тестирование', description: 'Тщательное тестирование на всех устройствах и браузерах. Находим баги до ваших пользователей.', duration: '3-5 дней', badge: 'QA' },
    { number: '06', title: 'Запуск', description: 'Плавный деплой в продакшн. Мы настроим хостинг, DNS, SSL — всю техническую часть.', duration: '1-2 дня', badge: 'Деплой' },
    { number: '07', title: 'Поддержка', description: 'Гарантия 60 дней включена. После этого — опциональные планы обслуживания при необходимости.', duration: 'Постоянно', badge: 'Финал' }
  ]
};

const WorkProcess: React.FC = memo(() => {
  const { language } = useLanguage();
  const steps = stepsData[language];
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartRef = useRef<number | null>(null);

  const goToNext = useCallback(() => {
    setActiveIndex(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const distance = touchStartRef.current - e.changedTouches[0].clientX;
    if (distance > 50) goToNext();
    else if (distance < -50) goToPrev();
    touchStartRef.current = null;
  }, [goToNext, goToPrev]);

  return (
    <ProcessSection id="process">
      <Container>
        <SectionHeader>
          <SectionTitle>{language === 'en' ? 'How we work' : 'Как мы работаем'}</SectionTitle>
          <SectionSubtitle>
            {language === 'en'
              ? 'A transparent process from first call to final delivery'
              : 'Прозрачный процесс от первого звонка до запуска'}
          </SectionSubtitle>
        </SectionHeader>

        <CarouselContainer onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <CarouselTrack>
            {steps.map((step, index) => {
              const offset = index - activeIndex;
              const isActive = index === activeIndex;
              if (Math.abs(offset) > 2) return null;

              return (
                <Card key={index} $offset={offset} $isActive={isActive} onClick={() => goToStep(index)}>
                  <CardInner>
                    <StepIndicator>
                      <StepNumber $isActive={isActive}>{step.number}</StepNumber>
                      <StepBadge $isActive={isActive}>{step.badge}</StepBadge>
                    </StepIndicator>
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                    <StepDuration>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {step.duration}
                    </StepDuration>
                  </CardInner>
                </Card>
              );
            })}
          </CarouselTrack>
        </CarouselContainer>

        <NavigationContainer>
          <NavButton onClick={goToPrev} $disabled={activeIndex === 0} disabled={activeIndex === 0}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </NavButton>

          <ProgressDots>
            {steps.map((_, index) => (
              <ProgressDot key={index} $isActive={index === activeIndex} onClick={() => goToStep(index)} />
            ))}
          </ProgressDots>

          <ProgressText>{activeIndex + 1} / {steps.length}</ProgressText>

          <NavButton onClick={goToNext} $disabled={activeIndex === steps.length - 1} disabled={activeIndex === steps.length - 1}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </NavButton>
        </NavigationContainer>
      </Container>
    </ProcessSection>
  );
});

WorkProcess.displayName = 'WorkProcess';

export default WorkProcess;
