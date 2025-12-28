import React, { memo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaStar, FaCheck } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const TestimonialsSection = styled.section`
  padding: 120px 40px;
  background: transparent;
  position: relative;

  @media (max-width: 768px) {
    padding: 70px 20px;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const SectionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #a78bfa;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 100px;
  padding: 10px 20px;
  margin-bottom: 24px;

  svg {
    font-size: 12px;
    color: #fbbf24;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 8px 16px;
    margin-bottom: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 768px) {
    gap: 24px;
  }
`;

const ChatMessage = styled(motion.div)<{ $isRight?: boolean }>`
  display: flex;
  gap: 16px;
  max-width: 85%;
  align-self: ${props => props.$isRight ? 'flex-end' : 'flex-start'};
  flex-direction: ${props => props.$isRight ? 'row-reverse' : 'row'};

  @media (max-width: 768px) {
    max-width: 95%;
    gap: 12px;
  }
`;

const Avatar = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
  position: relative;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 0.85rem;
  }
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #22c55e;
  border: 2px solid #0a0510;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

const BubbleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Bubble = styled.div<{ $isRight?: boolean }>`
  background: ${props => props.$isRight
    ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$isRight
    ? 'rgba(124, 58, 237, 0.3)'
    : 'rgba(255, 255, 255, 0.08)'};
  border-radius: ${props => props.$isRight
    ? '20px 20px 4px 20px'
    : '20px 20px 20px 4px'};
  padding: 18px 22px;
  position: relative;

  @media (max-width: 768px) {
    padding: 14px 16px;
    border-radius: ${props => props.$isRight
      ? '16px 16px 4px 16px'
      : '16px 16px 16px 4px'};
  }
`;

const MessageText = styled.p<{ $isRight?: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  color: ${props => props.$isRight ? '#ffffff' : 'rgba(255, 255, 255, 0.85)'};
  line-height: 1.6;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const MessageMeta = styled.div<{ $isRight?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 4px;
  flex-direction: ${props => props.$isRight ? 'row-reverse' : 'row'};

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const ClientName = styled.span`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: #7c3aed;
  border-radius: 50%;

  svg {
    font-size: 8px;
    color: #ffffff;
  }

  @media (max-width: 768px) {
    width: 14px;
    height: 14px;

    svg {
      font-size: 7px;
    }
  }
`;

const ClientRole = styled.span`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const Divider = styled.span`
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.75rem;
`;

const ProjectTag = styled.span`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  color: #a78bfa;
  background: rgba(124, 58, 237, 0.15);
  border-radius: 4px;
  padding: 3px 8px;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 2px 6px;
  }
`;

const RatingInline = styled.div`
  display: flex;
  gap: 2px;
  margin-left: auto;

  svg {
    font-size: 11px;
    color: #fbbf24;

    @media (max-width: 768px) {
      font-size: 10px;
    }
  }
`;

const testimonialsData = {
  en: [
    {
      text: "Was skeptical at first — small team, thought there'd be delays. But they built our store in 2.5 weeks, faster than Shopify. Conversion up 34% in the first month",
      name: "Denis V.",
      role: "VeloShop",
      avatar: "D",
      color: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
      tag: "E-commerce",
      isRight: false
    },
    {
      text: "Bot handles 400+ orders daily. Running 8 months with zero downtime. Paid for itself in 3 weeks 🔥",
      name: "Anna K.",
      role: "EasyFood",
      avatar: "A",
      color: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
      tag: "Telegram Bot",
      isRight: true
    },
    {
      text: "They redesigned our 2019 website. Now we're not embarrassed to show it to clients. Leads doubled, without any ads",
      name: "Igor P.",
      role: "StroyMaster",
      avatar: "I",
      color: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
      tag: "Redesign",
      isRight: false
    },
    {
      text: "Working together for a year, completed 3 projects. Always available, always on time. That's rare, trust me",
      name: "Michael S.",
      role: "Digital Solutions",
      avatar: "M",
      color: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
      tag: "Web + Mobile",
      isRight: true
    },
    {
      text: "Custom CRM for our processes — night and day compared to Bitrix. Team learned it in a day, not a week",
      name: "Elena N.",
      role: "AutoTrade",
      avatar: "E",
      color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      tag: "CRM",
      isRight: false
    },
    {
      text: "Built a bot + client portal. Orders are now automated, managers don't waste time on routine. Saved ~80 hours per month",
      name: "Artem L.",
      role: "PrintExpress",
      avatar: "A",
      color: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      tag: "Bot + Web App",
      isRight: true
    }
  ],
  ru: [
    {
      text: "Сначала сомневался — маленькая команда, думал будут срывы. Но ребята сделали магазин за 2.5 недели, работает быстрее чем Shopify. Конверсия +34% за первый месяц",
      name: "Денис В.",
      role: "VeloShop",
      avatar: "Д",
      color: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
      tag: "E-commerce",
      isRight: false
    },
    {
      text: "Бот обрабатывает 400+ заказов в день. Работает 8 месяцев без сбоев. Окупился за 3 недели 🔥",
      name: "Анна К.",
      role: "EasyFood",
      avatar: "А",
      color: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
      tag: "Telegram Bot",
      isRight: true
    },
    {
      text: "Переделали сайт 2019 года. Теперь не стыдно показывать клиентам. Заявок стало в 2 раза больше, и это без рекламы",
      name: "Игорь П.",
      role: "StroyMaster",
      avatar: "И",
      color: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
      tag: "Redesign",
      isRight: false
    },
    {
      text: "Работаем год, сделали 3 проекта вместе. Всегда на связи, всегда в срок. Это редкость, поверьте",
      name: "Михаил С.",
      role: "Digital Solutions",
      avatar: "М",
      color: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
      tag: "Web + Mobile",
      isRight: true
    },
    {
      text: "CRM под наши процессы — небо и земля по сравнению с Битрикс. Менеджеры освоили за день, не за неделю",
      name: "Елена Н.",
      role: "АвтоТрейд",
      avatar: "Е",
      color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      tag: "CRM",
      isRight: false
    },
    {
      text: "Сделали бота + личный кабинет для клиентов. Теперь заказы идут автоматом, менеджеры не тратят время на рутину. За месяц сэкономили ~80 часов",
      name: "Артём Л.",
      role: "PrintExpress",
      avatar: "А",
      color: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      tag: "Bot + Web App",
      isRight: true
    }
  ]
};

const Testimonials: React.FC = memo(() => {
  const { language } = useLanguage();
  const testimonials = testimonialsData[language];

  return (
    <TestimonialsSection id="testimonials">
      <Container>
        <Header>
          <SectionLabel>
            <FaStar /> {language === 'en' ? '4.7 — average rating' : '4.7 — средняя оценка'}
          </SectionLabel>
          <SectionTitle>{language === 'en' ? 'What clients say' : 'Что пишут клиенты'}</SectionTitle>
        </Header>

        <ChatContainer>
          {testimonials.map((testimonial, index) => (
            <ChatMessage
              key={index}
              $isRight={testimonial.isRight}
              initial={{ opacity: 0, y: 20, x: testimonial.isRight ? 20 : -20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Avatar $color={testimonial.color}>
                {testimonial.avatar}
                <OnlineIndicator />
              </Avatar>

              <BubbleWrapper>
                <Bubble $isRight={testimonial.isRight}>
                  <MessageText $isRight={testimonial.isRight}>
                    {testimonial.text}
                  </MessageText>
                </Bubble>

                <MessageMeta $isRight={testimonial.isRight}>
                  <ClientName>
                    {testimonial.name}
                    <VerifiedBadge>
                      <FaCheck />
                    </VerifiedBadge>
                  </ClientName>
                  <Divider>•</Divider>
                  <ClientRole>{testimonial.role}</ClientRole>
                  <ProjectTag>{testimonial.tag}</ProjectTag>
                  <RatingInline>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </RatingInline>
                </MessageMeta>
              </BubbleWrapper>
            </ChatMessage>
          ))}
        </ChatContainer>
      </Container>
    </TestimonialsSection>
  );
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;
