import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { FaCheck, FaTimes, FaArrowRight, FaCrown, FaRocket, FaLeaf } from 'react-icons/fa';

const PricingSection = styled.section`
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

  /* Упрощенные фоновые градиенты */
  &::after {
    content: '';
    position: absolute;
    bottom: 10%;
    right: 10%;
    width: 30%;
    height: 30%;
    background: radial-gradient(ellipse at center, rgba(215, 109, 119, 0.04), transparent 70%);
    filter: blur(40px);
    z-index: 0;
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionTitle = styled.h2`
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;

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

const ServiceToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
  gap: 4px;
  position: relative;
  padding: 4px;
  border-radius: 12px;
  background: rgba(15, 15, 25, 0.8);
  max-width: 380px;
  margin-left: auto;
  margin-right: auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(215, 109, 119, 0.15);
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'var(--gradient-button)' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#a0a0a0'};
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  flex: 1;
  z-index: 1;

  &:hover {
    color: #fff;
    background: ${props => props.active ? 'var(--gradient-button)' : 'rgba(215, 109, 119, 0.1)'};
    filter: brightness(${props => props.active ? '1.1' : '1'});
  }
`;

const PricingCards = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2.5rem;
  max-width: 1100px;
  margin: 0 auto;
  align-items: stretch;
  position: relative;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }

  @media (min-width: 1200px) {
    gap: 3.5rem;
  }
`;

const CardContainer = styled.div<{ visible: boolean }>`
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
  position: ${props => props.visible ? 'relative' : 'absolute'};
  width: 100%;
  z-index: ${props => props.visible ? 1 : 0};
`;

const CardWrapper = styled.div`
  position: relative;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(15, 15, 25, 0.9), rgba(25, 25, 35, 0.9));
  border: 1px solid rgba(215, 109, 119, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
  min-height: 600px;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: rgba(215, 109, 119, 0.25);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const PricingCard = styled.div`
  padding: 2.5rem 2rem;
  background: transparent;
  border-radius: 16px;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

  /* Простой верхний бордер */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--color-primary);
    border-radius: 16px 16px 0 0;
    opacity: 0.8;
  }
`;

const PlanIcon = styled.div`
  margin: 0 auto 2rem;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(215, 109, 119, 0.1);
  color: var(--color-primary);
  font-size: 2rem;
  border: 1px solid rgba(215, 109, 119, 0.2);

  ${CardWrapper}:hover & {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
`;

const PlanName = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #fff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  display: inline-block;
  font-weight: 700;
  letter-spacing: 0.02em;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: var(--gradient-primary);
    border-radius: 3px;
  }
`;

const PlanPrice = styled.div`
  margin-bottom: 2rem;
`;

const Price = styled.h4`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  span {
    font-size: 1rem;
    opacity: 0.7;
  }
`;

const PriceSubtext = styled.p`
  font-size: 0.9rem;
  color: #a0a0a0;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  margin: 0 0 2rem 0;
  padding: 0;
  text-align: left;
  flex-grow: 1;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Feature = styled.li<{ available: boolean }>`
  padding: 0.8rem 0;
  color: ${props => props.available ? '#e0e0e0' : '#777'};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(26, 26, 26, 0.5);

  &:last-child {
    border-bottom: none;
  }
`;

const FeatureIcon = styled.div<{ available: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const CTAButton = styled.a`
  display: inline-block;
  background: var(--gradient-button);
  border: none;
  color: white !important;
  padding: 1.2rem 0;
  width: 100%;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.1rem;
  text-align: center;
  letter-spacing: 0.05em;
  cursor: pointer;
  position: relative;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    filter: brightness(1.1);
    color: white !important;
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
    color: white !important;

    svg {
      color: white !important;
    }
  }
`;

// Интерфейсы и данные вынесены за пределы компонента
interface FeatureItem {
  text: string;
  available: boolean;
}

interface PlanItem {
  name: string;
  price: string;
  subtext: string;
  isPopular: boolean;
  icon: React.ReactNode;
  features: FeatureItem[];
}

// Предопределенные планы для веб-сайтов
const websitePlans: PlanItem[] = [
  {
    name: 'Базовый',
    price: 'от 30 000 ₽',
    subtext: 'Простой лендинг',
    isPopular: false,
    icon: <FaLeaf />,
    features: [
      { text: 'До 5 секций', available: true },
      { text: 'Адаптивный дизайн', available: true },
      { text: 'Форма обратной связи', available: true },
      { text: 'SEO-оптимизация', available: true },
      { text: 'Интеграция с CRM', available: false },
      { text: 'Интеграция с оплатой', available: false },
      { text: 'Админ-панель', available: false },
    ],
  },
  {
    name: 'Стандарт',
    price: 'от 60 000 ₽',
    subtext: 'Многостраничный сайт',
    isPopular: true,
    icon: <FaCrown />,
    features: [
      { text: 'До 10 страниц', available: true },
      { text: 'Уникальный дизайн', available: true },
      { text: 'Адаптивная верстка', available: true },
      { text: 'Формы и калькуляторы', available: true },
      { text: 'SEO-оптимизация', available: true },
      { text: 'Интеграция с CRM', available: true },
      { text: 'Базовая админ-панель', available: true },
    ],
  },
  {
    name: 'Премиум',
    price: 'от 120 000 ₽',
    subtext: 'Интернет-магазин',
    isPopular: false,
    icon: <FaRocket />,
    features: [
      { text: 'Неограниченные страницы', available: true },
      { text: 'Премиум дизайн', available: true },
      { text: 'Адаптивная верстка', available: true },
      { text: 'Каталог и корзина', available: true },
      { text: 'Платежные системы', available: true },
      { text: 'Полная интеграция', available: true },
      { text: 'Pro админ-панель', available: true },
    ],
  },
];

// Предопределенные планы для Telegram-ботов
const botPlans: PlanItem[] = [
  {
    name: 'Базовый',
    price: 'от 25 000 ₽',
    subtext: 'Простой бот',
    isPopular: false,
    icon: <FaLeaf />,
    features: [
      { text: 'Базовая структура', available: true },
      { text: 'Обработка команд', available: true },
      { text: 'Отправка сообщений', available: true },
      { text: 'Кнопки бота', available: true },
      { text: 'Интеграция с CRM', available: false },
      { text: 'Веб-интерфейс', available: false },
      { text: 'Платежная система', available: false },
    ],
  },
  {
    name: 'Стандарт',
    price: 'от 50 000 ₽',
    subtext: 'Бот с функционалом',
    isPopular: true,
    icon: <FaCrown />,
    features: [
      { text: 'Расширенное меню', available: true },
      { text: 'Формы и опросы', available: true },
      { text: 'Уведомления', available: true },
      { text: 'Интеграция с CRM', available: true },
      { text: 'Базовый веб-интерфейс', available: true },
      { text: 'Авторизация', available: true },
      { text: 'Базовая аналитика', available: true },
    ],
  },
  {
    name: 'Премиум',
    price: 'от 100 000 ₽',
    subtext: 'Бот с веб-приложением',
    isPopular: false,
    icon: <FaRocket />,
    features: [
      { text: 'Полный функционал Telegram API', available: true },
      { text: 'Расширенный веб-интерфейс', available: true },
      { text: 'Интеграция платежей', available: true },
      { text: 'Личный кабинет', available: true },
      { text: 'Интеграция любых систем', available: true },
      { text: 'Расширенная аналитика', available: true },
      { text: 'Техническая поддержка', available: true },
    ],
  },
];

// Компонент карточки без анимаций с мемоизацией
const PlanCard: React.FC<{ plan: PlanItem; index: number; activeService: string }> = React.memo(({ plan, index, activeService }) => {
  return (
    <CardWrapper>
      <PricingCard>
        <PlanIcon>
          {plan.icon}
        </PlanIcon>
        <PlanName>{plan.name}</PlanName>
        <PlanPrice>
          <Price>{plan.price}</Price>
          <PriceSubtext>{plan.subtext}</PriceSubtext>
        </PlanPrice>
        <PlanFeatures>
          {plan.features.map((feature, idx) => (
            <Feature key={`${activeService}-${plan.name}-${idx}`} available={feature.available}>
              <FeatureIcon available={feature.available}>
                {feature.available ? <FaCheck /> : <FaTimes />}
              </FeatureIcon>
              {feature.text}
            </Feature>
          ))}
        </PlanFeatures>
        <CTAButton
          href="#contact"
        >
          <span>
            Заказать <FaArrowRight />
          </span>
        </CTAButton>
      </PricingCard>
    </CardWrapper>
  );
});

const Pricing: React.FC = () => {
  const [activeService, setActiveService] = useState<'websites' | 'bots'>('websites');

  // Простое переключение без анимаций
  const handleServiceToggle = useCallback((service: 'websites' | 'bots') => {
    if (service === activeService) return;
    setActiveService(service);
  }, [activeService]);

  // Получаем активные планы в зависимости от выбранной категории
  const activePlans = activeService === 'websites' ? websitePlans : botPlans;

  return (
    <PricingSection id="pricing">
      <Container>
        <SectionHeader>
          <SectionTitle>Тарифы и цены</SectionTitle>
          <SectionDescription>
            Выберите оптимальный тариф для вашего проекта или свяжитесь с нами для индивидуального предложения
          </SectionDescription>
        </SectionHeader>

        <ServiceToggle>
          <ToggleButton
            active={activeService === 'websites'}
            onClick={() => handleServiceToggle('websites')}
          >
            Сайты
          </ToggleButton>
          <ToggleButton
            active={activeService === 'bots'}
            onClick={() => handleServiceToggle('bots')}
          >
            Telegram-боты
          </ToggleButton>
        </ServiceToggle>

        <PricingCards>
          {/* Плавные переходы между карточками */}
          {websitePlans.map((plan, index) => (
            <CardContainer
              key={`websites-${plan.name}-${index}`}
              visible={activeService === 'websites'}
            >
              <PlanCard
                plan={plan}
                index={index}
                activeService={activeService}
              />
            </CardContainer>
          ))}
          {activeService === 'bots' && botPlans.map((plan, index) => (
            <CardContainer
              key={`bots-${plan.name}-${index}`}
              visible={activeService === 'bots'}
            >
              <PlanCard
                plan={plan}
                index={index}
                activeService={activeService}
              />
            </CardContainer>
          ))}
        </PricingCards>
      </Container>
    </PricingSection>
  );
};

export default Pricing;