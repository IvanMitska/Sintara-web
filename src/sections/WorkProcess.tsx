import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRegComments, 
  FaRegClipboard, 
  FaRegLightbulb, 
  FaCode, 
  FaRegCheckCircle, 
  FaRegThumbsUp, 
  FaAngleDown,
  FaToolbox,
  FaRegClock,
  FaListUl
} from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const ProcessSection = styled.section`
  padding: 8rem 0;
  background: var(--gradient-background), #0a0a0a;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 30%;
    height: 40%;
    background: radial-gradient(ellipse at center, rgba(215, 109, 119, 0.08), transparent 70%);
    filter: blur(100px);
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
  margin-bottom: 5rem;
`;

const SectionTitle = styled.h2`
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

const ProcessSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  position: relative;
  
  @media (max-width: 768px) {
    gap: 4rem;
  }
`;

// Упрощенная линия процесса для улучшения производительности
const ProcessLine = styled.div`
  position: absolute;
  left: 35px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg,
    transparent 0%,
    rgba(215, 109, 119, 0.3) 10%,
    rgba(215, 109, 119, 0.5) 50%,
    rgba(58, 28, 113, 0.3) 90%,
    transparent 100%
  );
  z-index: 0;
  transform-origin: top;
  opacity: 0.6;
  
  @media (max-width: 768px) {
    left: 25px;
  }
`;

const Step = styled(motion.div)`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const StepCircle = styled(motion.div)`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: var(--gradient-button);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  will-change: transform;
  flex-shrink: 0;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
`;

const StepContent = styled(motion.div)`
  flex: 1;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(15, 15, 25, 0.6), rgba(25, 25, 35, 0.6));
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(215, 109, 119, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  will-change: transform;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    border-color: rgba(215, 109, 119, 0.2);
    background: linear-gradient(135deg, rgba(15, 15, 25, 0.7), rgba(25, 25, 35, 0.7));
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const StepTitle = styled.h3`
  font-size: 1.4rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;

  svg {
    color: #D76D77;
    font-size: 1.2rem;
    opacity: 0.8;
  }
`;

const StepDescription = styled.p`
  font-size: 1rem;
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`;

const StepTimeframe = styled.p`
  font-size: 0.9rem;
  color: #D76D77;
  font-weight: 600;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToggleButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: #D76D77;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  transition: all 0.3s ease;
  border-radius: 50%;

  &:hover {
    transform: scale(1.1);
    background: rgba(215, 109, 119, 0.1);
    color: #FFAF7B;
  }

  svg {
    transition: transform 0.3s ease;
  }
`;

const StepDetailContent = styled(motion.div)`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(215, 109, 119, 0.15);
  overflow: hidden;
`;

const DetailsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const DetailItem = styled(motion.li)`
  margin-bottom: 0.75rem;
  color: #a0a0a0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;

  svg {
    color: #D76D77;
    font-size: 0.8rem;
    flex-shrink: 0;
    opacity: 0.7;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const TechUsed = styled.div`
  margin-top: 1rem;
  
  h4 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: white;
    font-weight: 500;
  }
`;

const TechTag = styled(motion.span)`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: rgba(215, 109, 119, 0.08);
  color: #D76D77;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(215, 109, 119, 0.15);
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    background: rgba(215, 109, 119, 0.15);
    border-color: rgba(215, 109, 119, 0.3);
    transform: translateY(-1px);
  }
`;

// Расширенная информация о каждом шаге
interface IProcessStep {
  number: number;
  icon: JSX.Element;
  title: string;
  description: string;
  timeframe: string;
  details: string[];
  technologies?: string[];
}

const WorkProcess: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  
  // Состояние для отслеживания открытых деталей
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  
  // Состояние для отслеживания видимости секции
  const [isVisible, setIsVisible] = useState(false);
  
  // Функция для переключения отображения деталей
  const toggleDetails = (stepNumber: number) => {
    if (expandedStep === stepNumber) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepNumber);
    }
  };

  useEffect(() => {
    // Настраиваем IntersectionObserver для более эффективного запуска анимаций
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Отключаем наблюдение после обнаружения
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
    // Запускаем GSAP анимации только когда секция видима
    if (!isVisible) return;

    const section = sectionRef.current;
    const header = headerRef.current;

    if (section && header) {
      // Анимация заголовка (только один раз при видимости)
      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }
      );
      
      // Анимация линии (упрощенная)
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          { 
            scaleY: 1, 
            duration: 1,
            ease: "power1.inOut"
          }
        );
      }
    }
  }, [isVisible]);

  const processSteps: IProcessStep[] = [
    {
      number: 1,
      icon: <FaRegComments className="step-icon" />,
      title: 'Консультация',
      description: 'Обсуждаем ваш проект, определяем требования, цели и задачи. Проводим анализ конкурентов и целевой аудитории.',
      timeframe: 'Продолжительность: 1-2 дня',
      details: [
        'Определение бизнес-целей и KPI проекта',
        'Анализ целевой аудитории',
        'Изучение конкурентов и отраслевых трендов',
        'Формирование предварительного бюджета и сроков'
      ]
    },
    {
      number: 2,
      icon: <FaRegClipboard className="step-icon" />,
      title: 'Подготовка ТЗ',
      description: 'Составляем подробное техническое задание с описанием всех функций, структуры и технических требований.',
      timeframe: 'Продолжительность: 2-3 дня',
      details: [
        'Разработка структуры и пользовательских сценариев',
        'Определение функциональных требований',
        'Планирование интеграций с внешними сервисами',
        'Составление детальных спецификаций'
      ],
      technologies: ['Figma', 'Miro', 'Google Docs']
    },
    {
      number: 3,
      icon: <FaRegLightbulb className="step-icon" />,
      title: 'Дизайн',
      description: 'Создаем уникальный, современный и удобный дизайн, соответствующий вашему бренду и целям проекта.',
      timeframe: 'Продолжительность: 3-7 дней',
      details: [
        'Разработка концепции дизайна и стилистики',
        'Создание мудбордов и цветовых палитр',
        'Проектирование UI/UX для всех страниц и экранов',
        'Анимации и интерактивные элементы интерфейса'
      ],
      technologies: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator']
    },
    {
      number: 4,
      icon: <FaCode className="step-icon" />,
      title: 'Разработка',
      description: 'Приступаем к программированию сайта или бота, интегрируем все необходимые функции и системы.',
      timeframe: 'Продолжительность: 7-14 дней',
      details: [
        'Верстка всех страниц и компонентов',
        'Программирование функциональности на стороне клиента',
        'Разработка серверной части и API',
        'Интеграция с внешними сервисами и системами'
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Telegram API']
    },
    {
      number: 5,
      icon: <FaRegCheckCircle className="step-icon" />,
      title: 'Тестирование',
      description: 'Проводим комплексное тестирование на разных устройствах и в разных браузерах, проверяем производительность.',
      timeframe: 'Продолжительность: 2-4 дня',
      details: [
        'Функциональное тестирование всех компонентов',
        'Проверка адаптивности и кроссбраузерности',
        'Тестирование производительности и оптимизация',
        'Проверка безопасности и стресс-тесты'
      ],
      technologies: ['Lighthouse', 'Jest', 'Cypress', 'BrowserStack']
    },
    {
      number: 6,
      icon: <FaRegThumbsUp className="step-icon" />,
      title: 'Запуск',
      description: 'Размещаем проект на хостинге, проводим финальные настройки и передаем вам все доступы и инструкции.',
      timeframe: 'Продолжительность: 1-2 дня',
      details: [
        'Настройка окружения на сервере',
        'Установка мониторинга и аналитики',
        'Подготовка технической документации',
        'Обучение команды заказчика работе с системой'
      ],
      technologies: ['AWS', 'Vercel', 'Google Analytics', 'Sentry']
    },
  ];

  // Варианты анимации для Framer Motion (оптимизированные)
  const stepVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  return (
    <ProcessSection id="process" ref={sectionRef}>
      <Container>
        <SectionHeader ref={headerRef}>
          <SectionTitle>Процесс работы</SectionTitle>
          <SectionDescription>
            Прозрачный и эффективный процесс разработки от первой консультации до запуска проекта
          </SectionDescription>
        </SectionHeader>

        <ProcessSteps ref={stepsRef}>
          <ProcessLine ref={lineRef} />
          
          {processSteps.map((step, index) => (
            <Step 
              key={step.number}
              className="process-step"
              custom={index}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={stepVariants}
            >
              <StepCircle
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {step.number}
              </StepCircle>
              <StepContent onClick={() => toggleDetails(step.number)}>
                <StepHeader>
                  <StepTitle>{step.icon} {step.title}</StepTitle>
                  <ToggleButton
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaAngleDown
                      style={{
                        transform: expandedStep === step.number ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  </ToggleButton>
                </StepHeader>
                
                <StepDescription>{step.description}</StepDescription>
                <StepTimeframe>
                  <FaRegClock /> {step.timeframe}
                </StepTimeframe>
                
                <AnimatePresence mode="wait">
                  {expandedStep === step.number && (
                    <StepDetailContent
                      key={`detail-${step.number}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                        opacity: { duration: 0.3, delay: 0.1 }
                      }}
                    >
                      <DetailsList>
                        {step.details.map((detail, index) => (
                          <DetailItem
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: index * 0.05,
                              duration: 0.3,
                              ease: [0.4, 0, 0.2, 1]
                            }}
                          >
                            <FaListUl />
                            {detail}
                          </DetailItem>
                        ))}
                      </DetailsList>
                      
                      {step.technologies && (
                        <TechUsed>
                          <h4>
                            <FaToolbox style={{ marginRight: '8px' }} />
                            Используемые технологии:
                          </h4>
                          <div>
                            {step.technologies.map((tech, index) => (
                              <TechTag
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: 0.2 + index * 0.05,
                                  duration: 0.3,
                                  ease: [0.4, 0, 0.2, 1]
                                }}
                                whileHover={{ scale: 1.05 }}
                              >
                                {tech}
                              </TechTag>
                            ))}
                          </div>
                        </TechUsed>
                      )}
                    </StepDetailContent>
                  )}
                </AnimatePresence>
              </StepContent>
            </Step>
          ))}
        </ProcessSteps>
      </Container>
    </ProcessSection>
  );
};

export default WorkProcess; 