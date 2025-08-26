import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaLaptopCode, FaRobot, FaMobileAlt, FaShoppingCart, FaDesktop, FaTools, FaAngleRight, FaAngleDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = styled.section`
  padding: 8rem 0;
  background-color: #0a0a0a;
  position: relative;
  overflow: hidden;
  
  /* Упрощаем градиенты фона для лучшей производительности */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 30%;
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
    width: 30%;
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

const ServiceTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const TabButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'linear-gradient(90deg, #8E2DE2, #4A00E0)' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#a0a0a0'};
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  flex: 1;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.active ? '80%' : '0'};
    height: 3px;
    background: var(--color-primary-gradient);
    transition: width 0.3s ease;
    border-radius: 3px;
  }
  
  &:hover {
    color: #ffffff;
    
    &::after {
      width: 40%;
    }
  }
`;

const ServiceCategories = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem;
`;

const ServiceCategory = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 4rem;
  }

  &:nth-child(even) {
    @media (min-width: 768px) {
      flex-direction: row-reverse;
    }
  }
`;

// Возвращаем более сбалансированные размеры для левого блока
const CategoryImage = styled(motion.div)`
  width: 100%;
  max-width: 350px;
  height: 280px;
  background-color: rgba(17, 17, 17, 0.8);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  border: 1px solid rgba(142, 45, 226, 0.2);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  will-change: transform;
  
  /* Упрощаем градиент фона */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(142, 45, 226, 0.05), rgba(74, 0, 224, 0.05));
    z-index: 0;
  }
  
  &:hover {
    transform: translateY(-5px);
  }
  
  svg {
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 0 5px rgba(142, 45, 226, 0.5));
  }
  
  @media (min-width: 768px) {
    margin-bottom: 0;
    width: 40%;
    flex-shrink: 0;
  }
`;

const CategoryContent = styled.div`
  @media (min-width: 768px) {
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const CategoryTitle = styled.h3`
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 1.5rem;
  color: #fff;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const CategoryDescription = styled.p`
  font-size: 1rem;
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const ToggleViewButton = styled.button`
  background: transparent;
  border: none;
  color: #8E2DE2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #4A00E0;
    transform: translateX(5px);
  }
  
  @media (max-width: 768px) {
    margin: 0 auto 2rem auto;
  }
`;

const ServicesList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
`;

// Улучшаем дизайн карточек для лучшей симметрии
const ServiceItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  background: rgba(17, 17, 17, 0.5);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  will-change: transform;
  
  /* Упрощаем эффект бордера */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(to bottom, #8E2DE2, #4A00E0);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(142, 45, 226, 0.3);
    background: rgba(25, 25, 25, 0.8);
    
    &::before {
      opacity: 1;
    }
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  will-change: transform;
  
  ${ServiceItem}:hover & {
    transform: scale(1.1);
  }
  
  svg {
    font-size: 1.6rem;
    color: white;
  }
`;

const ServiceText = styled.div`
  flex: 1;
`;

const ServiceTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #fff;
  transition: color 0.3s ease;
  
  ${ServiceItem}:hover & {
    color: #8E2DE2;
  }
`;

const ServiceDescription = styled.p`
  font-size: 0.9rem;
  color: #888;
  line-height: 1.5;
`;

const ServiceDescriptionFull = styled(motion.div)`
  font-size: 0.9rem;
  color: #a0a0a0;
  line-height: 1.6;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
`;

const TechHighlight = styled.span`
  color: #8E2DE2;
  font-weight: 500;
`;

const CTAContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 4rem;
`;

const CTAButton = styled(motion.a)`
  display: inline-block;
  background: linear-gradient(90deg, #8E2DE2, #4A00E0);
  color: white;
  padding: 1rem 3rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(142, 45, 226, 0.3);
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

// Интерфейс для сервиса
interface ServiceItemType {
  icon: React.ElementType;
  title: string;
  shortDescription: string;
  fullDescription: string;
  tech?: string[];
}

// Данные о сервисах - вынесены за пределы компонента для предотвращения повторного создания
const webServices: ServiceItemType[] = [
  {
    icon: FaDesktop,
    title: "Лендинги",
    shortDescription: "Продающие одностраничные сайты с высокой конверсией",
    fullDescription: "Разрабатываем эффективные лендинги, заточенные на конверсию. Оптимизируем скорость загрузки, уделяем внимание структуре и визуальной подаче. Интегрируем аналитику для отслеживания эффективности.",
    tech: ["React", "NextJS", "GSAP", "Framer Motion"]
  },
  {
    icon: FaShoppingCart,
    title: "Интернет-магазины",
    shortDescription: "Современные e-commerce решения с удобной админ-панелью",
    fullDescription: "Создаем функциональные интернет-магазины с интуитивным интерфейсом. Реализуем гибкие системы фильтрации, личные кабинеты, интеграцию с CRM и системами оплаты.",
    tech: ["React", "NextJS", "Redux", "Strapi", "Postgres"]
  },
  {
    icon: FaMobileAlt,
    title: "Адаптивный дизайн",
    shortDescription: "Сайты, которые отлично выглядят на всех устройствах",
    fullDescription: "Обеспечиваем идеальное отображение на любых устройствах, от мобильных телефонов до больших экранов. Применяем прогрессивное улучшение для оптимального пользовательского опыта.",
    tech: ["CSS Grid", "Flexbox", "Media Queries", "Progressive Enhancement"]
  },
  {
    icon: FaTools,
    title: "Поддержка и развитие",
    shortDescription: "Техническая поддержка и развитие вашего сайта",
    fullDescription: "Предоставляем долгосрочную поддержку проектов. Регулярно обновляем функционал, внедряем новые технологии, исправляем ошибки и улучшаем производительность.",
    tech: ["Git", "CI/CD", "Monitoring", "Performance Optimization"]
  }
];

const botServices: ServiceItemType[] = [
  {
    icon: FaRobot,
    title: "Чат-боты",
    shortDescription: "Интерактивные чат-боты для общения с клиентами и автоматизации",
    fullDescription: "Разрабатываем интеллектуальных ботов для автоматизации клиентского сервиса. Настраиваем сценарии диалогов, обработку естественного языка и интеграцию с внешними API.",
    tech: ["Node.js", "Telegraf", "NLP", "DialogFlow"]
  },
  {
    icon: FaShoppingCart,
    title: "Боты для продаж",
    shortDescription: "Автоматизированные системы приема и обработки заказов",
    fullDescription: "Создаем ботов для автоматизации продаж и приема заказов. Реализуем каталоги, корзины, системы оплаты, отслеживание заказов и интеграцию с CRM-системами.",
    tech: ["Node.js", "Telegraf", "MongoDB", "Payment APIs"]
  },
  {
    icon: FaLaptopCode,
    title: "Веб-интерфейс для ботов",
    shortDescription: "Удобные панели управления ботами через веб-интерфейс",
    fullDescription: "Разрабатываем современные веб-интерфейсы для управления ботами. Создаем дашборды с аналитикой, настройками сценариев, управлением контентом и базой пользователей.",
    tech: ["React", "Redux", "Chart.js", "Socket.io"]
  },
  {
    icon: FaTools,
    title: "Интеграции",
    shortDescription: "Подключение к CRM, платежным системам и другим сервисам",
    fullDescription: "Выполняем интеграцию с внешними сервисами и API: CRM-системы, платежные шлюзы, сервисы доставки, API социальных сетей и другие бизнес-системы.",
    tech: ["REST API", "GraphQL", "OAuth", "Webhook"]
  }
];

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Состояние для отслеживания видимости секции
  const [isVisible, setIsVisible] = useState(false);
  
  // Состояние для отслеживания выбранной категории услуг
  const [activeTab, setActiveTab] = useState<string>('web');
  
  // Состояние для отслеживания открытых детальных описаний
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  
  // Состояние для переключения между кратким и полным описанием категории
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  
  // Функция для переключения расширенного описания сервиса
  const toggleExpand = useCallback((index: number) => {
    setExpandedItems(prev => 
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  }, []);

  useEffect(() => {
    // Используем IntersectionObserver для более эффективного отслеживания видимости
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Отключаем наблюдатель после однократного срабатывания
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
    const categories = categoriesRef.current;
    const cta = ctaRef.current;

    if (header && categories && cta) {
      // Анимация заголовка - упрощена
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

      // Анимация категорий - упрощена 
      gsap.fromTo(
        categories.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out'
        }
      );

      // Анимация CTA - упрощена
      gsap.fromTo(
        cta,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.4
        }
      );
    }
  }, [isVisible, activeTab]); // Перезапускаем анимации при изменении таба

  // Получаем текущий список сервисов в зависимости от выбранной категории
  const currentServices = activeTab === 'web' ? webServices : botServices;

  // Оптимизированные варианты анимации
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <ServicesSection id="services" ref={sectionRef}>
      <Container>
        <SectionHeader ref={headerRef}>
          <SectionTitle>Наши услуги</SectionTitle>
          <SectionDescription>
            Мы предлагаем комплексные решения для вашего бизнеса, 
            от создания сайтов до разработки Telegram-ботов с веб-интерфейсом
          </SectionDescription>
        </SectionHeader>
        
        <ServiceTabs>
          <TabButton 
            active={activeTab === 'web'} 
            onClick={() => setActiveTab('web')}
          >
            Веб-разработка
          </TabButton>
          <TabButton 
            active={activeTab === 'bot'} 
            onClick={() => setActiveTab('bot')}
          >
            Telegram-боты
          </TabButton>
        </ServiceTabs>

        <ServiceCategories ref={categoriesRef}>
          <AnimatePresence mode="wait">
            <ServiceCategory
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInVariants}
            >
              <CategoryImage>
                {activeTab === 'web' ? (
                  <FaLaptopCode size={70} color="#8E2DE2" />
                ) : (
                  <FaRobot size={70} color="#8E2DE2" />
                )}
              </CategoryImage>
              <CategoryContent>
                <CategoryTitle>
                  {activeTab === 'web' ? 'Разработка сайтов' : 'Telegram-боты и веб-приложения'}
                </CategoryTitle>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}-${showFullDescription}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CategoryDescription>
                      {activeTab === 'web'
                        ? showFullDescription 
                          ? "Создаем современные, быстрые и отзывчивые веб-сайты для вашего бизнеса с фокусом на конверсию и удобство использования. Мы уделяем особое внимание деталям, используем современные технологии и следуем лучшим практикам разработки, чтобы создать сайты, которые не только хорошо выглядят, но и эффективно работают."
                          : "Создаем современные, быстрые и отзывчивые веб-сайты для вашего бизнеса с фокусом на конверсию и удобство использования."
                        : showFullDescription
                          ? "Разрабатываем функциональных Telegram-ботов с веб-интерфейсом для автоматизации бизнес-процессов и взаимодействия с клиентами. Наши решения помогают автоматизировать рутинные задачи, повысить качество обслуживания клиентов и увеличить продажи благодаря интеграции с вашими бизнес-процессами."
                          : "Разрабатываем функциональных Telegram-ботов с веб-интерфейсом для автоматизации бизнес-процессов и взаимодействия с клиентами."
                      }
                    </CategoryDescription>
                  </motion.div>
                </AnimatePresence>
                
                <ToggleViewButton onClick={() => setShowFullDescription(!showFullDescription)}>
                  {showFullDescription ? "Свернуть описание" : "Развернуть описание"} 
                  {showFullDescription ? <FaAngleDown /> : <FaAngleRight />}
                </ToggleViewButton>
                
                <ServicesList>
                  {currentServices.map((service, index) => (
                    <ServiceItem 
                      key={index}
                      onClick={() => toggleExpand(index)}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IconWrapper>
                        <service.icon />
                      </IconWrapper>
                      <ServiceText>
                        <ServiceTitle>{service.title}</ServiceTitle>
                        <ServiceDescription>
                          {service.shortDescription}
                        </ServiceDescription>
                        
                        <AnimatePresence>
                          {expandedItems.includes(index) && (
                            <ServiceDescriptionFull
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {service.fullDescription}
                              {service.tech && (
                                <p style={{ marginTop: '0.5rem' }}>
                                  <strong>Технологии: </strong> 
                                  {service.tech.map((tech, i) => (
                                    <React.Fragment key={i}>
                                      <TechHighlight>{tech}</TechHighlight>
                                      {i < service.tech!.length - 1 ? ', ' : ''}
                                    </React.Fragment>
                                  ))}
                                </p>
                              )}
                            </ServiceDescriptionFull>
                          )}
                        </AnimatePresence>
                      </ServiceText>
                    </ServiceItem>
                  ))}
                </ServicesList>
              </CategoryContent>
            </ServiceCategory>
          </AnimatePresence>
        </ServiceCategories>

        <CTAContainer ref={ctaRef}>
          <CTAButton 
            href="#contact"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Обсудить проект
          </CTAButton>
        </CTAContainer>
      </Container>
    </ServicesSection>
  );
};

export default Services; 