import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaChevronDown } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const FAQSection = styled.section`
  padding: 8rem 0;
  background: var(--gradient-background), #000;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
`;

const SectionTitle = styled.h2`
  background: var(--gradient-text);
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

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FAQItem = styled.div`
  background-color: #0a0a0a;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const FAQQuestion = styled.div<{ isOpen: boolean }>`
  padding: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #111;
  }
  
  svg {
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    color: ${props => props.isOpen ? '#D76D77' : '#a0a0a0'};
  }
`;

const FAQAnswer = styled.div<{ isOpen: boolean }>`
  padding: ${props => props.isOpen ? '1rem 1.5rem 1.5rem' : '0 1.5rem'};
  color: #a0a0a0;
  line-height: 1.6;
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const CTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 5rem;
  padding: 3rem;
  background-color: #0a0a0a;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const CTATitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const CTADescription = styled.p`
  font-size: 1rem;
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 500px;
`;

const CTAButton = styled.a`
  display: inline-block;
  background: var(--gradient-button);
  color: white !important;
  padding: 0.9rem 2.5rem;
  border-radius: 5px;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  text-decoration: none;

  span {
    color: white !important;

    svg {
      color: white !important;
    }
  }

  &:hover {
    color: white !important;
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    filter: brightness(1.1);
  }
`;

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const faqs = faqsRef.current;
    const cta = ctaRef.current;

    if (section && header && faqs && cta) {
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

      // Анимация вопросов
      gsap.fromTo(
        faqs.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: faqs,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Анимация CTA
      gsap.fromTo(
        cta,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: cta,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const faqItems = [
    {
      question: 'Сколько времени займет разработка сайта?',
      answer: 'Сроки разработки зависят от сложности и объема проекта. Простой лендинг может быть готов за 1-2 недели, интернет-магазин — от 3 до 6 недель. После изучения ваших требований мы сможем предоставить точные сроки.'
    },
    {
      question: 'Какие способы оплаты вы принимаете?',
      answer: 'Мы работаем по предоплате 50% и поэтапной оплате для крупных проектов. Принимаем оплату по безналичному расчету для юридических лиц, а также переводы на карту и электронные платежи для физических лиц.'
    },
    {
      question: 'Можете ли вы доработать уже существующий сайт?',
      answer: 'Да, мы занимаемся доработкой и модернизацией существующих сайтов. После анализа текущего состояния проекта мы предложим оптимальные решения для улучшения функциональности, дизайна или производительности.'
    },
    {
      question: 'Как происходит процесс разработки Telegram-бота?',
      answer: 'Процесс включает: анализ требований, проектирование структуры бота, разработку функционала, интеграцию с нужными системами, создание админ-панели (если требуется), тестирование и запуск. Мы постоянно держим вас в курсе прогресса работ.'
    },
    {
      question: 'Предоставляете ли вы техническую поддержку после запуска проекта?',
      answer: 'Да, мы предлагаем техническую поддержку после запуска проекта. Вы можете выбрать подходящий вам пакет поддержки, который может включать мониторинг работы сайта, исправление ошибок, обновление контента и консультации.'
    },
    {
      question: 'Занимаетесь ли вы SEO-оптимизацией сайтов?',
      answer: 'Да, мы занимаемся базовой SEO-оптимизацией при разработке сайта. Это включает правильную структуру, метатеги, семантическую разметку и оптимизацию скорости. Также мы предлагаем отдельные услуги по комплексному продвижению сайтов.'
    }
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <FAQSection id="faq" ref={sectionRef}>
      <Container>
        <SectionHeader ref={headerRef}>
          <SectionTitle>Часто задаваемые вопросы</SectionTitle>
          <SectionDescription>
            Ответы на распространенные вопросы о наших услугах, процессе работы и условиях сотрудничества
          </SectionDescription>
        </SectionHeader>

        <FAQContainer ref={faqsRef}>
          {faqItems.map((item, index) => (
            <FAQItem key={index}>
              <FAQQuestion 
                isOpen={openIndex === index}
                onClick={() => toggleQuestion(index)}
              >
                {item.question}
                <FaChevronDown />
              </FAQQuestion>
              <FAQAnswer isOpen={openIndex === index}>
                {item.answer}
              </FAQAnswer>
            </FAQItem>
          ))}
        </FAQContainer>

        <CTAContainer ref={ctaRef}>
          <CTATitle>Остались вопросы?</CTATitle>
          <CTADescription>
            Если вы не нашли ответа на свой вопрос, свяжитесь с нами для получения бесплатной консультации
          </CTADescription>
          <CTAButton href="#contact">Задать вопрос</CTAButton>
        </CTAContainer>
      </Container>
    </FAQSection>
  );
};

export default FAQ; 