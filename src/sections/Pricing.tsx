import React, { memo } from 'react';
import styled from 'styled-components';
import { FaCheck, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const PricingSection = styled.section`
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

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 60px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    gap: 24px;
  }
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: ${props => props.$featured
    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(20, 10, 40, 0.8) 100%)'
    : 'rgba(20, 10, 40, 0.6)'};
  border: 1px solid ${props => props.$featured
    ? 'rgba(124, 58, 237, 0.3)'
    : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 24px;
  padding: 40px;
  position: relative;
  transition: transform 0.2s ease, border-color 0.2s ease;

  ${props => props.$featured && `
    transform: scale(1.02);

    @media (max-width: 1000px) {
      transform: none;
    }
  `}

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(124, 58, 237, 0.4);
  }

  @media (max-width: 768px) {
    padding: 32px;
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PlanName = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
`;

const PlanDescription = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 24px;
`;

const PriceContainer = styled.div`
  margin-bottom: 32px;
`;

const Price = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 4px;

  span {
    font-size: 1rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
  }
`;

const PriceNote = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.4);
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }

  svg {
    color: #a78bfa;
    font-size: 0.875rem;
    margin-top: 3px;
    flex-shrink: 0;
  }
`;

const CTAButton = styled.a<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px 24px;
  border-radius: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    color: white;
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);
    }
  ` : `
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
  `}
`;

const CustomSection = styled.div`
  text-align: center;
  background: rgba(20, 10, 40, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 48px;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const CustomTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
`;

const CustomDescription = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  max-width: 500px;
  margin: 0 auto 24px;
  line-height: 1.6;
`;

const CustomButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid rgba(124, 58, 237, 0.4);
  color: #a78bfa;
  padding: 14px 28px;
  border-radius: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(124, 58, 237, 0.1);
    border-color: rgba(124, 58, 237, 0.6);
  }
`;

const plansData = {
  en: [
    {
      name: 'Starter',
      description: 'Perfect for landing pages and small projects',
      price: '$2,500',
      priceNote: 'Fixed price',
      features: [
        'Landing page (up to 5 sections)',
        'Mobile-responsive design',
        'Contact form integration',
        'Basic SEO setup',
        '2 rounds of revisions',
        '30-day support'
      ],
      featured: false
    },
    {
      name: 'Professional',
      description: 'For businesses that need more functionality',
      price: '$5,000',
      priceNote: 'Starting from',
      features: [
        'Multi-page website (up to 10 pages)',
        'Custom UI/UX design',
        'CMS integration',
        'Advanced SEO optimization',
        'Analytics setup',
        '60-day support & warranty'
      ],
      featured: true
    },
    {
      name: 'Enterprise',
      description: 'Complex apps and e-commerce solutions',
      price: '$10,000',
      priceNote: 'Starting from',
      features: [
        'Web application or e-commerce',
        'Custom functionality',
        'Payment integration',
        'Admin dashboard',
        'API development',
        '90-day support & warranty'
      ],
      featured: false
    }
  ],
  ru: [
    {
      name: 'Стартовый',
      description: 'Идеально для лендингов и небольших проектов',
      price: '$2,500',
      priceNote: 'Фиксированная цена',
      features: [
        'Лендинг (до 5 секций)',
        'Адаптивный дизайн',
        'Форма обратной связи',
        'Базовая SEO-настройка',
        '2 раунда правок',
        'Поддержка 30 дней'
      ],
      featured: false
    },
    {
      name: 'Профессиональный',
      description: 'Для бизнеса, которому нужно больше функций',
      price: '$5,000',
      priceNote: 'От',
      features: [
        'Многостраничный сайт (до 10 страниц)',
        'Уникальный UI/UX дизайн',
        'Интеграция CMS',
        'Продвинутая SEO-оптимизация',
        'Настройка аналитики',
        'Поддержка и гарантия 60 дней'
      ],
      featured: true
    },
    {
      name: 'Корпоративный',
      description: 'Сложные приложения и e-commerce решения',
      price: '$10,000',
      priceNote: 'От',
      features: [
        'Веб-приложение или интернет-магазин',
        'Кастомный функционал',
        'Интеграция оплаты',
        'Админ-панель',
        'Разработка API',
        'Поддержка и гарантия 90 дней'
      ],
      featured: false
    }
  ]
};

const Pricing: React.FC = memo(() => {
  const { language } = useLanguage();
  const plans = plansData[language];

  return (
    <PricingSection id="pricing">
      <Container>
        <SectionHeader>
          <SectionTitle>{language === 'en' ? 'Simple pricing' : 'Простые цены'}</SectionTitle>
          <SectionSubtitle>
            {language === 'en'
              ? 'Transparent pricing with no hidden fees. Choose a plan or get a custom quote.'
              : 'Прозрачные цены без скрытых платежей. Выберите план или получите индивидуальное предложение.'}
          </SectionSubtitle>
        </SectionHeader>

        <PricingGrid>
          {plans.map((plan, index) => (
            <PricingCard key={index} $featured={plan.featured}>
              {plan.featured && <PopularBadge>{language === 'en' ? 'Most Popular' : 'Популярный'}</PopularBadge>}
              <PlanName>{plan.name}</PlanName>
              <PlanDescription>{plan.description}</PlanDescription>
              <PriceContainer>
                <Price>{plan.price} <span>USD</span></Price>
                <PriceNote>{plan.priceNote}</PriceNote>
              </PriceContainer>
              <FeaturesList>
                {plan.features.map((feature, idx) => (
                  <FeatureItem key={idx}>
                    <FaCheck />
                    {feature}
                  </FeatureItem>
                ))}
              </FeaturesList>
              <CTAButton href="#contact" $primary={plan.featured}>
                {language === 'en' ? 'Get started' : 'Начать'} <FaArrowRight />
              </CTAButton>
            </PricingCard>
          ))}
        </PricingGrid>

        <CustomSection>
          <CustomTitle>{language === 'en' ? 'Need something custom?' : 'Нужно что-то особенное?'}</CustomTitle>
          <CustomDescription>
            {language === 'en'
              ? "Have a unique project in mind? Let's discuss your requirements and create a tailored solution."
              : 'Есть уникальный проект? Давайте обсудим ваши требования и создадим индивидуальное решение.'}
          </CustomDescription>
          <CustomButton href="#contact">
            {language === 'en' ? 'Contact us' : 'Связаться'} <FaArrowRight />
          </CustomButton>
        </CustomSection>
      </Container>
    </PricingSection>
  );
});

Pricing.displayName = 'Pricing';

export default Pricing;
