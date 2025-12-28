import React, { memo, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useInView } from 'framer-motion';
import {
  FaLaptopCode,
  FaMobileAlt,
  FaShoppingCart,
  FaSearch,
  FaSync,
  FaHeadset,
  FaRobot,
  FaDatabase,
  FaArrowRight
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

// Optimized keyframes - no blur, using transform and opacity only
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatUp = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

const ServicesSection = styled.section`
  background: transparent;
  position: relative;
  overflow: hidden;
  contain: layout style paint;
`;

// Hero header
const ServicesHero = styled.div`
  min-height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 40px 40px;
  position: relative;

  @media (max-width: 768px) {
    padding: 60px 20px 30px;
  }
`;

// Glow orb removed for cleaner section transitions

const _GlowOrbUnused = styled.div`
  display: none;

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
    top: -150px;
  }
`;

const HeroTitle = styled(motion.h2)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(3.5rem, 8vw, 6rem);
  font-weight: 700;
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #e0e0e0 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 24px;
  position: relative;
  z-index: 2;
`;

const HeroSubtitle = styled(motion.p)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  color: rgba(255, 255, 255, 0.5);
  max-width: 550px;
  line-height: 1.6;
  margin: 0;
  position: relative;
  z-index: 2;
`;

// Service showcase
const ServiceShowcase = styled.div`
  position: relative;
`;

const FullScreenService = styled.div`
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  contain: layout style;

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 40px 20px;
  }
`;

const ServiceContent = styled(motion.div)`
  flex: 1;
  max-width: 550px;
  padding-right: 60px;
  position: relative;
  z-index: 2;

  @media (max-width: 1024px) {
    padding-right: 0;
    text-align: center;
    margin-bottom: 60px;
  }
`;

const ServiceNumber = styled.span`
  display: inline-block;
  font-family: 'Inter', monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.15);
  padding: 8px 18px;
  border-radius: 100px;
  border: 1px solid rgba(124, 58, 237, 0.3);
  margin-bottom: 28px;
`;

const ServiceTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.04em;
  line-height: 1;
  margin: 0 0 20px;
`;

const ServiceDescription = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.7;
  margin: 0 0 32px;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const TechBadge = styled.span`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 18px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(124, 58, 237, 0.2);
    border-color: rgba(124, 58, 237, 0.4);
    color: #a78bfa;
  }
`;

// 3D Visual
const VisualContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 550px;

  @media (max-width: 1024px) {
    width: 100%;
    max-width: 450px;
  }
`;

const Visual3D = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
`;

// Floating cards - optimized
const FloatingCard = styled(motion.div)<{ $delay: number }>`
  position: absolute;
  width: 240px;
  height: 170px;
  background: linear-gradient(
    135deg,
    rgba(124, 58, 237, 0.12) 0%,
    rgba(20, 10, 40, 0.95) 100%
  );
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  animation: ${floatUp} ${props => 5 + props.$delay}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  overflow: hidden;
  will-change: transform;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.08),
      transparent
    );
    animation: ${shimmer} 4s ease-in-out infinite;
    animation-delay: ${props => props.$delay}s;
  }

  @media (max-width: 768px) {
    width: 180px;
    height: 130px;
    padding: 18px;
  }
`;

const Card1 = styled(FloatingCard)`
  top: 5%;
  left: 0;
  transform: rotateY(-12deg) rotateX(8deg);
`;

const Card2 = styled(FloatingCard)`
  top: 20%;
  right: -5%;
  transform: rotateY(12deg) rotateX(-5deg);

  @media (max-width: 768px) {
    right: 0;
  }
`;

const Card3 = styled(FloatingCard)`
  bottom: 10%;
  left: 10%;
  transform: rotateY(-8deg) rotateX(5deg);
`;

const CardLine = styled.div<{ $width: string; $accent?: boolean }>`
  height: 10px;
  width: ${props => props.$width};
  background: ${props => props.$accent ? 'rgba(124, 58, 237, 0.4)' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 5px;
  margin-bottom: 10px;
`;

const CardDots = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
`;

const CardDot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

// Orbiting icons - optimized with will-change
const OrbitContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  margin: -100px;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    margin: -75px;
  }
`;

const OrbitingIcon = styled.div<{ $duration: number; $delay: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  margin: -25px;
  animation: ${orbit} ${props => props.$duration}s linear infinite;
  animation-delay: ${props => props.$delay}s;
  will-change: transform;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin: -20px;
  }
`;

const IconBubble = styled.div<{ $gradient: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${props => props.$gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);

  svg {
    font-size: 20px;
    color: white;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

// Central icon
const CentralIcon = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 60px rgba(124, 58, 237, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 10;

  svg {
    font-size: 56px;
    color: white;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;

    svg {
      font-size: 40px;
    }
  }
`;

// Glow ring
const GlowRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 240px;
  height: 240px;
  border-radius: 50%;
  border: 2px solid rgba(124, 58, 237, 0.25);
  box-shadow: 0 0 40px rgba(124, 58, 237, 0.15);
  animation: ${pulse} 4s ease-in-out infinite;

  @media (max-width: 768px) {
    width: 180px;
    height: 180px;
  }
`;

// Additional services with Bento Grid
const AdditionalServices = styled.div`
  padding: 100px 40px;
  position: relative;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const AdditionalTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin: 0 0 50px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const BentoCard = styled(motion.a)<{ $large?: boolean }>`
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.8) 0%, rgba(10, 5, 20, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: ${props => props.$large ? '36px' : '28px'};
  text-decoration: none;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;

  /* Большие карточки занимают 2 колонки */
  ${props => props.$large && `
    grid-column: span 2;

    @media (max-width: 600px) {
      grid-column: span 1;
    }
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.5), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(124, 58, 237, 0.3);
    box-shadow: 0 20px 50px rgba(124, 58, 237, 0.12);

    &::before {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const BentoCardIcon = styled.div<{ $large?: boolean }>`
  width: ${props => props.$large ? '64px' : '52px'};
  height: ${props => props.$large ? '64px' : '52px'};
  border-radius: ${props => props.$large ? '18px' : '14px'};
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(124, 58, 237, 0.05) 100%);
  border: 1px solid rgba(124, 58, 237, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.$large ? '20px' : '16px'};

  svg {
    font-size: ${props => props.$large ? '28px' : '22px'};
    color: #a78bfa;
  }

  @media (max-width: 768px) {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    margin-bottom: 16px;

    svg {
      font-size: 22px;
    }
  }
`;

const BentoCardTitle = styled.span<{ $large?: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: ${props => props.$large ? '1.5rem' : '1.15rem'};
  font-weight: 600;
  color: #ffffff;
  margin-bottom: ${props => props.$large ? '12px' : '8px'};
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.15rem;
    margin-bottom: 8px;
  }
`;

const BentoCardDescription = styled.span<{ $large?: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: ${props => props.$large ? '1rem' : '0.9rem'};
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const BentoCardArrow = styled.div`
  position: absolute;
  bottom: 28px;
  right: 28px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(124, 58, 237, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.3s ease, transform 0.3s ease;

  svg {
    font-size: 14px;
    color: #a78bfa;
  }

  ${BentoCard}:hover & {
    opacity: 1;
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    bottom: 24px;
    right: 24px;
    width: 36px;
    height: 36px;
  }
`;

const mainServicesData = {
  en: [
    {
      icon: FaLaptopCode,
      number: '01',
      title: 'Web Development',
      description: 'We craft digital experiences that captivate and convert. From blazing-fast landing pages to complex web applications.',
      tech: ['React', 'Next.js', 'TypeScript', 'Node.js']
    },
    {
      icon: FaMobileAlt,
      number: '02',
      title: 'Mobile Apps',
      description: 'Native performance meets cross-platform efficiency. Apps that feel at home on any device with fluid animations.',
      tech: ['iOS', 'Android', 'React Native', 'Flutter']
    }
  ],
  ru: [
    {
      icon: FaLaptopCode,
      number: '01',
      title: 'Веб-разработка',
      description: 'Создаём цифровые решения, которые привлекают и конвертируют. От быстрых лендингов до сложных веб-приложений.',
      tech: ['React', 'Next.js', 'TypeScript', 'Node.js']
    },
    {
      icon: FaMobileAlt,
      number: '02',
      title: 'Мобильные приложения',
      description: 'Нативная производительность и кроссплатформенность. Приложения с плавными анимациями для любых устройств.',
      tech: ['iOS', 'Android', 'React Native', 'Flutter']
    }
  ]
};

const additionalServicesData = {
  en: [
    {
      icon: FaRobot,
      title: 'Telegram Bots',
      description: 'Custom bots for automation, customer service, and business processes'
    },
    {
      icon: FaShoppingCart,
      title: 'E-commerce',
      description: 'Full-featured online stores with payment integration'
    },
    {
      icon: FaDatabase,
      title: 'CRM Systems',
      description: 'Tailored solutions to streamline your sales'
    },
    {
      icon: FaSearch,
      title: 'SEO Optimization',
      description: 'Data-driven strategies to improve rankings'
    },
    {
      icon: FaSync,
      title: 'Redesign',
      description: 'Transform outdated websites into modern experiences'
    },
    {
      icon: FaHeadset,
      title: 'Tech Support',
      description: 'Ongoing maintenance and 24/7 support'
    }
  ],
  ru: [
    {
      icon: FaRobot,
      title: 'Telegram-боты',
      description: 'Боты для автоматизации, поддержки клиентов и бизнес-процессов'
    },
    {
      icon: FaShoppingCart,
      title: 'Интернет-магазины',
      description: 'Полнофункциональные магазины с интеграцией оплаты'
    },
    {
      icon: FaDatabase,
      title: 'CRM-системы',
      description: 'Решения под ваши процессы продаж'
    },
    {
      icon: FaSearch,
      title: 'SEO-оптимизация',
      description: 'Стратегии продвижения на основе данных'
    },
    {
      icon: FaSync,
      title: 'Редизайн',
      description: 'Превращаем устаревшие сайты в современные'
    },
    {
      icon: FaHeadset,
      title: 'Техподдержка',
      description: 'Обслуживание и поддержка 24/7'
    }
  ]
};

const ServiceVisual: React.FC<{ icon: typeof FaLaptopCode }> = ({ icon: Icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Visual3D ref={ref}>
      <GlowRing />

      <Card1
        $delay={0}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <CardDots>
          <CardDot $color="#ef4444" />
          <CardDot $color="#eab308" />
          <CardDot $color="#22c55e" />
        </CardDots>
        <CardLine $width="60%" $accent />
        <CardLine $width="100%" />
        <CardLine $width="80%" />
        <CardLine $width="50%" />
      </Card1>

      <Card2
        $delay={1.5}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <CardDots>
          <CardDot $color="#ef4444" />
          <CardDot $color="#eab308" />
          <CardDot $color="#22c55e" />
        </CardDots>
        <CardLine $width="45%" $accent />
        <CardLine $width="90%" />
        <CardLine $width="70%" />
        <CardLine $width="35%" />
      </Card2>

      <Card3
        $delay={3}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <CardDots>
          <CardDot $color="#ef4444" />
          <CardDot $color="#eab308" />
          <CardDot $color="#22c55e" />
        </CardDots>
        <CardLine $width="75%" $accent />
        <CardLine $width="55%" />
        <CardLine $width="100%" />
        <CardLine $width="40%" />
      </Card3>

      <OrbitContainer>
        <OrbitingIcon $duration={18} $delay={0}>
          <IconBubble $gradient="linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)">
            <FaDatabase />
          </IconBubble>
        </OrbitingIcon>

        <OrbitingIcon $duration={24} $delay={-8}>
          <IconBubble $gradient="linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)">
            <FaSync />
          </IconBubble>
        </OrbitingIcon>

        <OrbitingIcon $duration={30} $delay={-16}>
          <IconBubble $gradient="linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)">
            <FaSearch />
          </IconBubble>
        </OrbitingIcon>
      </OrbitContainer>

      <CentralIcon
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
      >
        <Icon />
      </CentralIcon>
    </Visual3D>
  );
};

const Services: React.FC = memo(() => {
  const { language } = useLanguage();
  const mainServices = mainServicesData[language];
  const additionalServices = additionalServicesData[language];

  return (
    <ServicesSection id="services">
      {/* Hero */}
      <ServicesHero>
        <HeroTitle
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {language === 'en' ? (
            <>What we<br />build</>
          ) : (
            <>Что мы<br />создаём</>
          )}
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {language === 'en'
            ? 'We turn ambitious ideas into digital products that people actually want to use'
            : 'Превращаем амбициозные идеи в цифровые продукты, которыми хочется пользоваться'}
        </HeroSubtitle>
      </ServicesHero>

      {/* Main services */}
      <ServiceShowcase>
        {mainServices.map((service, index) => (
          <FullScreenService key={index}>
            <ServiceContent
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <ServiceNumber>{service.number}</ServiceNumber>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
              <TechStack>
                {service.tech.map((tech, idx) => (
                  <TechBadge key={idx}>{tech}</TechBadge>
                ))}
              </TechStack>
            </ServiceContent>

            <VisualContainer
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ServiceVisual icon={service.icon} />
            </VisualContainer>
          </FullScreenService>
        ))}
      </ServiceShowcase>

      {/* Additional services - Bento Grid */}
      <AdditionalServices>
        <AdditionalTitle>
          {language === 'en' ? 'Plus everything else you need' : 'И всё остальное, что вам нужно'}
        </AdditionalTitle>
        <BentoGrid>
          {additionalServices.map((service, index) => {
            // Первые 2 карточки большие (занимают 2 колонки)
            const isLarge = index < 2;
            return (
              <BentoCard
                key={index}
                href="#contact"
                $large={isLarge}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <BentoCardIcon $large={isLarge}>
                  <service.icon />
                </BentoCardIcon>
                <BentoCardTitle $large={isLarge}>{service.title}</BentoCardTitle>
                <BentoCardDescription $large={isLarge}>{service.description}</BentoCardDescription>
                <BentoCardArrow>
                  <FaArrowRight />
                </BentoCardArrow>
              </BentoCard>
            );
          })}
        </BentoGrid>
      </AdditionalServices>
    </ServicesSection>
  );
});

Services.displayName = 'Services';

export default Services;
