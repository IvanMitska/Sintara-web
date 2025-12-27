import React, { memo, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const gradientShift = keyframes`
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4);
  }
  50% {
    box-shadow: 0 0 0 20px rgba(124, 58, 237, 0);
  }
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 120px 20px 80px;

  @media (max-width: 768px) {
    padding: 100px 20px 60px;
    min-height: calc(100vh - 60px);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 50px;
  margin-bottom: 32px;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const EyebrowDot = styled.span`
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const EyebrowText = styled.span`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.02em;
`;

const Title = styled.h1`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin: 0 0 24px;
  animation: ${fadeInUp} 0.8s ease-out 0.1s both;

  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #ffffff 40%,
    #a78bfa 60%,
    #7c3aed 80%,
    #ffffff 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeInUp} 0.8s ease-out 0.1s both, ${gradientShift} 8s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: clamp(2.5rem, 12vw, 4rem);
    margin-bottom: 20px;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 48px;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 40px;
    padding: 0 10px;
  }
`;

const CTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  animation: ${fadeInUp} 0.8s ease-out 0.3s both;
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
  padding: 18px 40px;
  border-radius: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 24px rgba(124, 58, 237, 0.4);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 40px rgba(124, 58, 237, 0.5);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 1rem;
    width: 100%;
    max-width: 280px;
  }
`;

const TrustIndicators = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-top: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.4);

  svg {
    width: 16px;
    height: 16px;
    color: #22c55e;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: ${fadeInUp} 0.8s ease-out 0.5s both;

  @media (max-width: 768px) {
    bottom: 20px;
  }
`;

const ScrollText = styled.span`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const scrollBounce = keyframes`
  0%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(8px);
    opacity: 1;
  }
`;

const ScrollArrow = styled.div`
  width: 24px;
  height: 24px;
  border-right: 2px solid rgba(255, 255, 255, 0.3);
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  transform: rotate(45deg);
  animation: ${scrollBounce} 2s ease-in-out infinite;
`;

const Hero: React.FC = memo(() => {
  return (
    <HeroSection id="hero">
      <Container>
        <Eyebrow>
          <EyebrowDot />
          <EyebrowText>Принимаем проекты на Q1 2025</EyebrowText>
        </Eyebrow>

        <Title>
          Разработка
          <br />
          без боли
        </Title>

        <Subtitle>
          Вы занимаетесь бизнесом — мы пишем код.
          <br />
          Быстро. Качественно. В срок.
        </Subtitle>

        <CTAContainer>
          <CTAButton href="#contact">
            Обсудить проект
          </CTAButton>

          <TrustIndicators>
            <TrustItem>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              50+ проектов
            </TrustItem>
            <TrustItem>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              100% в срок
            </TrustItem>
            <TrustItem>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              NDA по запросу
            </TrustItem>
          </TrustIndicators>
        </CTAContainer>
      </Container>

      <ScrollIndicator>
        <ScrollText>Scroll</ScrollText>
        <ScrollArrow />
      </ScrollIndicator>
    </HeroSection>
  );
});

Hero.displayName = 'Hero';

export default Hero;
