import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TelegramBotSection = styled.section`
  background: var(--gradient-background), var(--color-background);
  padding: 8rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(142, 45, 226, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 6rem 1.5rem;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  position: relative;
  z-index: 1;
  
  @media (min-width: 992px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const InfoContainer = styled.div`
  width: 100%;
  max-width: 600px;
  text-align: center;
  
  @media (min-width: 992px) {
    width: 45%;
    text-align: left;
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 4rem;
    height: 4px;
    background: var(--color-primary);
    border-radius: 2px;
    
    @media (min-width: 992px) {
      left: 0;
      transform: none;
    }
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: inline-block;
  text-align: left;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  color: var(--color-text);
  
  &::before {
    content: '';
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    background-color: var(--color-primary);
    border-radius: 50%;
    margin-right: 1rem;
    flex-shrink: 0;
    background-image: url('/icons/check.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 0.7rem;
  }
`;

const TryButton = styled.a`
  display: inline-flex;
  align-items: center;
  background: var(--gradient-button);
  color: white !important;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

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

  &:active {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const PhoneContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 350px;
  height: 700px;
  margin: 0 auto;
  
  @media (min-width: 992px) {
    width: 50%;
    display: flex;
    justify-content: flex-end;
  }
`;

const PhoneFrame = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 280px;
  height: 580px;
  background: #1C1C1E;
  border-radius: 54px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border: 1px solid #3A3A3C;
`;

const PhoneScreen = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 52px;
  overflow: hidden;
  background: #000000;
`;

const DynamicIsland = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 125px;
  height: 35px;
  background: #000000;
  border-radius: 20px;
  z-index: 10;
`;

const StatusBar = styled.div`
  position: absolute;
  top: 16px;
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  color: white;
  font-weight: 600;
  z-index: 5;
`;

const Time = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const StatusIcons = styled.div`
  display: flex;
  gap: 7px;
  align-items: center;
`;

const StatusIcon = styled.div`
  width: 16px;
  height: 10px;
  background-color: white;
  clip-path: ${props => 
    props.type === 'signal' ? 'polygon(0 100%, 20% 60%, 40% 80%, 60% 40%, 80% 60%, 100% 20%, 100% 100%, 0 100%)' :
    props.type === 'wifi' ? 'path("M0 6.5Q2.5 4.5 5 2.5Q7.5 0.5 10 0.5Q12.5 0.5 15 2.5Q17.5 4.5 20 6.5 M2.5 9Q5 7 7.5 5Q10 3 12.5 3Q15 3 17.5 5Q20 7 22.5 9 M5 11.5Q7.5 9.5 10 7.5Q12.5 5.5 15 7.5Q17.5 9.5 20 11.5")' :
    'none'};
  
  ${props => props.type === 'battery' && `
    width: 22px;
    height: 11px;
    background-color: transparent;
    border: 1.5px solid white;
    border-radius: 3px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      right: -3px;
      top: 50%;
      transform: translateY(-50%);
      width: 2px;
      height: 4px;
      background: white;
      border-radius: 0 1px 1px 0;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 1.5px;
      left: 1.5px;
      bottom: 1.5px;
      width: 70%;
      background: white;
      border-radius: 1px;
    }
  `}
`;

const PhoneContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 50px;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: white;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-left: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(45deg);
    margin-right: 14px;
  }
`;

const BotScreen = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #000000;
`;

const BotHeader = styled.div`
  background: #6519b3;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BotName = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
`;

const BotMessages = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div<{ isBot?: boolean; isUser?: boolean }>`
  max-width: ${props => props.isUser ? '70%' : '80%'};
  align-self: ${props => props.isBot ? 'flex-start' : 'flex-end'};
  background: ${props => props.isBot ? '#1e1e1e' : '#6519b3'};
  padding: 0.75rem 1rem;
  border-radius: 16px;
  color: #ffffff;
  font-size: 0.9rem;
`;

const BotCommandList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const BotCommand = styled.button`
  background: #6519b3;
  color: white;
  border: none;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.2);
  }
`;

const BotInputBar = styled.div`
  background: #000000;
  padding: 1rem;
  display: flex;
  align-items: center;
`;

const BotInput = styled.div`
  flex: 1;
  background: #1e1e1e;
  border-radius: 20px;
  padding: 0.6rem 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 1px;
    background: #ffffff;
    opacity: 0.5;
  }
`;

const HomeIndicator = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 135px;
  height: 5px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 100px;
  z-index: 10;
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
`;

const FloatingCircle = styled(motion.div)`
  position: absolute;
  width: ${props => props.size || '80px'};
  height: ${props => props.size || '80px'};
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  opacity: 0.15;
`;

const FloatingGlowLarge = styled(motion.div)`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: var(--color-primary);
  filter: blur(150px);
  opacity: 0.1;
  z-index: -1;
`;

const DecorativeCode = styled.div`
  position: absolute;
  font-family: 'Space Mono', monospace;
  color: rgba(142, 45, 226, 0.15);
  font-size: 0.8rem;
  line-height: 1.4;
  z-index: 0;
  display: none;
  
  @media (min-width: 992px) {
    display: block;
  }
`;

const TopCode = styled(DecorativeCode)`
  top: 10%;
  left: -5%;
  transform: rotate(-5deg);
`;

const BottomCode = styled(DecorativeCode)`
  bottom: 15%;
  right: -5%;
  transform: rotate(5deg);
`;

const TopLeftDots = styled.div`
  position: absolute;
  top: 5%;
  left: -5%;
  transform: rotate(15deg);
`;

const BottomRightDots = styled.div`
  position: absolute;
  bottom: 5%;
  right: -5%;
  transform: rotate(-15deg);
`;

const TelegramBot = () => {
  return (
    <TelegramBotSection id="telegram-bot">
      <TopLeftDots />
      <BottomRightDots />
      
      <TopCode>{`function sendMessage(text) {
  bot.sendMessage({
    chat_id: userId,
    text: text,
    parse_mode: 'Markdown'
  });
}`}</TopCode>
      
      <BottomCode>{`async function getOrders() {
  const orders = await db.collection('orders')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(3)
    .get();
  return orders.docs.map(doc => ({id: doc.id, ...doc.data()}));
}`}</BottomCode>
      
      <ContentContainer>
        <InfoContainer>
          <Title>Telegram Бот для доставки еды UMAY</Title>
          <Description>
            Современный Telegram бот для заказа и доставки еды. Заказывайте блюда, отслеживайте доставку и получайте специальные предложения - всё в одном месте.
          </Description>
          <FeatureList>
            <FeatureItem>Быстрый заказ любимых блюд в один клик</FeatureItem>
            <FeatureItem>Отслеживание статуса доставки в реальном времени</FeatureItem>
            <FeatureItem>Бонусная программа и персональные скидки</FeatureItem>
            <FeatureItem>Возможность повторить предыдущие заказы</FeatureItem>
          </FeatureList>
          <TryButton href="#contact">Попробовать бесплатно</TryButton>
        </InfoContainer>
        
        <PhoneContainer>
          <PhoneFrame
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
          >
            <PhoneScreen>
              <DynamicIsland />
              <StatusBar>
                <Time>13:37</Time>
                <StatusIcons>
                  <StatusIcon type="signal" />
                  <StatusIcon type="wifi" />
                  <StatusIcon type="battery" />
                </StatusIcons>
              </StatusBar>
              
              <PhoneContent>
                <BotScreen>
                  <BotHeader>
                    <BackButton />
                    <BotName>UMAY Доставка</BotName>
                  </BotHeader>
                  <BotMessages>
                    <Message isBot>
                      Привет! Я бот доставки еды UMAY. Что желаете заказать сегодня?
                    </Message>
                    <Message isBot>
                      Вот что я могу предложить:
                      <BotCommandList>
                        <BotCommand>/menu</BotCommand>
                        <BotCommand>/акции</BotCommand>
                        <BotCommand>/заказы</BotCommand>
                        <BotCommand>/доставка</BotCommand>
                      </BotCommandList>
                    </Message>
                    <Message isUser>
                      Покажи мои последние заказы
                    </Message>
                  </BotMessages>
                  <BotInputBar>
                    <BotInput>Введите сообщение...</BotInput>
                  </BotInputBar>
                </BotScreen>
                <HomeIndicator />
              </PhoneContent>
            </PhoneScreen>
          </PhoneFrame>
        </PhoneContainer>
      </ContentContainer>
      
      <FloatingElements>
        <FloatingGlowLarge 
          initial={{ x: "0%", y: "0%" }}
          animate={{ x: "5%", y: "5%" }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
          style={{ top: "-20%", right: "-10%" }}
        />
        <FloatingCircle 
          size="80px"
          initial={{ x: 0, y: 0 }}
          animate={{ x: 30, y: -20 }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
          style={{ top: "15%", left: "10%" }}
        />
        <FloatingCircle 
          size="120px"
          initial={{ x: 0, y: 0 }}
          animate={{ x: -20, y: 30 }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
          style={{ bottom: "15%", right: "10%" }}
        />
      </FloatingElements>
    </TelegramBotSection>
  );
};

export default TelegramBot; 