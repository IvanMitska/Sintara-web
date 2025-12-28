import React, { memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaShieldAlt, FaHandshake, FaCode, FaComments } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

// Анимации только при hover - без постоянных анимаций для производительности
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
`;

const rotate = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const BenefitsSection = styled.section`
  padding: 120px 0;
  background: transparent;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 80px 0;
  }

  /* Отключаем анимации для пользователей с настройкой reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    margin-bottom: 50px;
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
    font-size: 1.1rem;
  }
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const IconRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px dashed rgba(124, 58, 237, 0.3);
  opacity: 0;
  transition: opacity 0.4s ease;
  will-change: transform;
`;

const IconGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
`;

const BenefitCard = styled.div`
  background: linear-gradient(145deg, rgba(20, 10, 40, 0.8), rgba(15, 5, 30, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 28px;
  padding: 40px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.5), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #7c3aed, #a78bfa);
    transition: width 0.4s ease;
  }

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(124, 58, 237, 0.3);
    box-shadow: 0 20px 50px rgba(124, 58, 237, 0.12);

    &::before {
      opacity: 1;
    }

    &::after {
      width: 50%;
    }

    ${IconRing} {
      opacity: 1;
      animation: ${rotate} 10s linear infinite;
    }

    ${IconGlow} {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const IconContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
`;

const IconBox = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%);
  border: 1px solid rgba(124, 58, 237, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  transition: transform 0.4s ease, background 0.4s ease, border-color 0.4s ease;

  svg {
    font-size: 40px;
    color: #a78bfa;
    transition: transform 0.4s ease, color 0.4s ease;
  }

  ${BenefitCard}:hover & {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(168, 85, 247, 0.1) 100%);
    border-color: rgba(124, 58, 237, 0.35);
    animation: ${pulse} 1.5s ease-in-out infinite;

    svg {
      color: #c4b5fd;
      transform: scale(1.15);
    }
  }

  @media (max-width: 768px) {
    width: 88px;
    height: 88px;
    border-radius: 24px;

    svg {
      font-size: 34px;
    }
  }
`;

const BenefitTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.15rem;
  }
`;

const BenefitDescription = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.7;
  margin-bottom: 20px;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const BenefitHighlight = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.05) 100%);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 100px;
  padding: 10px 18px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  transition: all 0.3s ease;

  ${BenefitCard}:hover & {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(124, 58, 237, 0.1) 100%);
    border-color: rgba(124, 58, 237, 0.4);
    color: #c4b5fd;
  }
`;

const benefitsData = {
  en: [
    {
      icon: FaShieldAlt,
      title: 'Fixed price. No surprises.',
      description: 'We agree on the final cost before starting. No hidden fees, no hourly billing tricks.',
      highlight: 'Transparent pricing'
    },
    {
      icon: FaCode,
      title: 'You own everything.',
      description: 'Full source code, design files, documentation — it\'s all yours. No vendor lock-in.',
      highlight: 'Code ownership'
    },
    {
      icon: FaComments,
      title: 'Direct developer access.',
      description: 'Talk directly to the people building your product. No account managers.',
      highlight: 'No middlemen'
    },
    {
      icon: FaHandshake,
      title: '60-day warranty.',
      description: 'Found a bug after launch? We fix it free. No questions asked, no extra charges.',
      highlight: 'Free bug fixes'
    }
  ],
  ru: [
    {
      icon: FaShieldAlt,
      title: 'Фиксированная цена.',
      description: 'Договариваемся о стоимости до начала работ. Никаких скрытых платежей.',
      highlight: 'Прозрачные цены'
    },
    {
      icon: FaCode,
      title: 'Всё ваше.',
      description: 'Исходный код, дизайн-файлы, документация — всё принадлежит вам.',
      highlight: 'Владение кодом'
    },
    {
      icon: FaComments,
      title: 'Прямой контакт.',
      description: 'Общаетесь напрямую с разработчиками. Без менеджеров-посредников.',
      highlight: 'Без посредников'
    },
    {
      icon: FaHandshake,
      title: 'Гарантия 60 дней.',
      description: 'Нашли баг после запуска? Исправим бесплатно. Без вопросов.',
      highlight: 'Бесплатные исправления'
    }
  ]
};

const Benefits: React.FC = memo(() => {
  const { language } = useLanguage();
  const benefits = benefitsData[language];

  return (
    <BenefitsSection id="benefits">
      <Container>
        <SectionHeader>
          <SectionTitle>{language === 'en' ? 'Why choose us' : 'Почему мы'}</SectionTitle>
          <SectionSubtitle>
            {language === 'en'
              ? "We do things differently. Here's what sets us apart."
              : 'Мы работаем иначе. Вот что нас отличает.'}
          </SectionSubtitle>
        </SectionHeader>

        <BenefitsGrid>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index}>
              <IconContainer>
                <IconGlow />
                <IconRing />
                <IconBox>
                  <benefit.icon />
                </IconBox>
              </IconContainer>
              <BenefitTitle>{benefit.title}</BenefitTitle>
              <BenefitDescription>{benefit.description}</BenefitDescription>
              <BenefitHighlight>{benefit.highlight}</BenefitHighlight>
            </BenefitCard>
          ))}
        </BenefitsGrid>
      </Container>
    </BenefitsSection>
  );
});

Benefits.displayName = 'Benefits';

export default Benefits;
