import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { FaCheck, FaTimes, FaArrowRight, FaCrown, FaRocket, FaLeaf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PricingSection = styled.section`
  padding: 8rem 0;
  background-color: #000;
  position: relative;
  overflow: hidden;
  
  /* Упрощаем фоновые градиенты для повышения производительности */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 40%;
    height: 40%;
    background: radial-gradient(ellipse at center, rgba(142, 45, 226, 0.05), transparent 70%);
    filter: blur(60px);
    z-index: 0;
    pointer-events: none;
    will-change: transform;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40%;
    height: 40%;
    background: radial-gradient(ellipse at center, rgba(74, 0, 224, 0.05), transparent 70%);
    filter: blur(60px);
    z-index: 0;
    pointer-events: none;
    will-change: transform;
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
  margin-bottom: 5rem;
`;

const SectionTitle = styled.h2`
  background: linear-gradient(90deg, #8E2DE2, #4A00E0, #FF7D54);
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

const ServiceToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 1rem;
  position: relative;
  padding: 5px;
  border-radius: 10px;
  background: rgba(20, 20, 20, 0.5);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: 11px;
    background: linear-gradient(135deg, rgba(142, 45, 226, 0.3), rgba(74, 0, 224, 0.3));
    z-index: -1;
    opacity: 0.4;
  }
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'linear-gradient(90deg, #8E2DE2, #4A00E0)' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#a0a0a0'};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  flex: 1;
  z-index: 1;
  
  &:hover {
    color: ${props => props.active ? '#fff' : '#fff'};
    background: ${props => props.active ? 'linear-gradient(90deg, #8E2DE2, #4A00E0)' : 'rgba(142, 45, 226, 0.1)'};
  }
`;

const PricingCards = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// Упрощенная обертка для карточки популярного плана
const PopularCardWrapper = styled(motion.div)`
  position: relative;
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(142, 45, 226, 0.2), rgba(74, 0, 224, 0.2));
  padding: 2px;
  z-index: 2;
  
  /* Статичная рамка вместо анимированной */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(135deg, #8E2DE2, #4A00E0);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-10px);
  }
`;

// Упрощенная обертка для обычных карточек
const RegularCardWrapper = styled(motion.div)`
  position: relative;
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(142, 45, 226, 0.05), rgba(74, 0, 224, 0.05));
  padding: 2px;
  transition: transform 0.3s ease;
  
  /* Упрощенная рамка */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(142, 45, 226, 0.3), rgba(74, 0, 224, 0.3));
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.3;
    transition: opacity 0.3s ease;
  }
  
  /* При наведении усиливаем эффекты */
  &:hover {
    transform: translateY(-10px);
    
    &::before {
      opacity: 1;
    }
  }
`;

const PricingCard = styled.div<{ isPopular: boolean }>`
  padding: 3rem 2rem;
  background-color: rgba(10, 10, 10, 0.8);
  border-radius: 13px;
  text-align: center;
  position: relative;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, ${props => props.isPopular ? '#8E2DE2, #4A00E0' : 'rgba(142, 45, 226, 0.5), rgba(74, 0, 224, 0.5)'});
    transition: opacity 0.3s ease;
    opacity: ${props => props.isPopular ? 1 : 0.5};
  }
`;

const PlanIcon = styled.div`
  margin: 0 auto 1.5rem;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(142, 45, 226, 0.1), rgba(74, 0, 224, 0.1));
  color: #8E2DE2;
  font-size: 2rem;
  position: relative;
`;

const PopularTag = styled.div`
  position: absolute;
  top: -14px;
  right: 2rem;
  background: linear-gradient(90deg, #8E2DE2, #4A00E0);
  color: white;
  padding: 0.5rem 1.2rem;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -8px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-right: 8px solid #8E2DE2;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -8px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-left: 8px solid #4A00E0;
  }
`;

const PlanName = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: #fff;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #8E2DE2, #4A00E0);
    border-radius: 2px;
  }
`;

const PlanPrice = styled.div`
  margin-bottom: 2rem;
`;

const Price = styled.h4`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #8E2DE2, #4A00E0);
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

const CTAButton = styled(motion.a)<{ isPrimary: boolean }>`
  display: inline-block;
  background: ${props => props.isPrimary ? 'linear-gradient(90deg, #8E2DE2, #4A00E0)' : 'transparent'};
  border: ${props => props.isPrimary ? 'none' : '2px solid #8E2DE2'};
  color: white;
  padding: 1rem 0;
  width: 100%;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.1rem;
  text-align: center;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    background: ${props => props.isPrimary ? 'linear-gradient(90deg, #8E2DE2, #4A00E0)' : 'rgba(142, 45, 226, 0.15)'};
  }
  
  span {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      transition: transform 0.3s ease;
    }
  }
  
  &:hover span svg {
    transform: translateX(5px);
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
      { text: 'Неограниченное число страниц', available: true },
      { text: 'Премиум дизайн', available: true },
      { text: 'Адаптивная верстка', available: true },
      { text: 'Каталог товаров', available: true },
      { text: 'Корзина и оплата', available: true },
      { text: 'Интеграция со всеми сервисами', available: true },
      { text: 'Расширенная админ-панель', available: true },
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

// Мемоизированный компонент карточки для улучшения производительности
const PlanCard: React.FC<{ plan: PlanItem; index: number; activeService: string }> = React.memo(({ plan, index, activeService }) => {
  // Упрощенные варианты анимации
  const commonVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.1 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const Wrapper = plan.isPopular ? PopularCardWrapper : RegularCardWrapper;
  
  return (
    <Wrapper 
      key={`${activeService}-${index}`}
      variants={commonVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <PricingCard isPopular={plan.isPopular}>
        {plan.isPopular && <PopularTag>Популярный</PopularTag>}
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
            <Feature key={idx} available={feature.available}>
              <FeatureIcon available={feature.available}>
                {feature.available ? <FaCheck /> : <FaTimes />}
              </FeatureIcon>
              {feature.text}
            </Feature>
          ))}
        </PlanFeatures>
        <CTAButton 
          href="#contact" 
          isPrimary={plan.isPopular}
          whileHover={{ y: -3 }}
        >
          <span>
            Заказать <FaArrowRight />
          </span>
        </CTAButton>
      </PricingCard>
    </Wrapper>
  );
});

const Pricing: React.FC = () => {
  const [activeService, setActiveService] = useState<'websites' | 'bots'>('websites');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Используем IntersectionObserver для эффективного отслеживания видимости
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Анимации запускаем только когда секция видима
    if (!isVisible) return;
    
    const header = headerRef.current;
    const toggle = toggleRef.current;

    if (header && toggle) {
      // Упрощенная анимация заголовка
      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }
      );

      // Упрощенная анимация переключателя
      gsap.fromTo(
        toggle,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.2,
          ease: 'power2.out'
        }
      );
    }
  }, [isVisible]);
  
  // Получаем активные планы в зависимости от выбранной категории
  const activePlans = activeService === 'websites' ? websitePlans : botPlans;

  return (
    <PricingSection id="pricing" ref={sectionRef}>
      <Container>
        <SectionHeader ref={headerRef}>
          <SectionTitle>Тарифы и цены</SectionTitle>
          <SectionDescription>
            Выберите оптимальный тариф для вашего проекта или свяжитесь с нами для индивидуального предложения
          </SectionDescription>
        </SectionHeader>

        <ServiceToggle ref={toggleRef}>
          <ToggleButton
            active={activeService === 'websites'}
            onClick={() => setActiveService('websites')}
          >
            Сайты
          </ToggleButton>
          <ToggleButton
            active={activeService === 'bots'}
            onClick={() => setActiveService('bots')}
          >
            Telegram-боты
          </ToggleButton>
        </ServiceToggle>

        <PricingCards ref={cardsRef}>
          <AnimatePresence mode="wait">
            {activePlans.map((plan, index) => (
              <PlanCard
                key={`${activeService}-${plan.name}`}
                plan={plan}
                index={index}
                activeService={activeService}
              />
            ))}
          </AnimatePresence>
        </PricingCards>
      </Container>
    </PricingSection>
  );
};

export default Pricing; 