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
    color: white;

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


const Hero: React.FC = memo(() => {
  return (
    <HeroSection id="hero">
      <Container>
        <Title>
          We automate
          <br />
          your business
        </Title>

        <Subtitle>
          From idea to working system — without the headache.
          <br />
          You grow, we handle the routine.
        </Subtitle>

        <CTAContainer>
          <CTAButton href="#contact">
            Get in touch
          </CTAButton>
        </CTAContainer>
      </Container>
    </HeroSection>
  );
});

Hero.displayName = 'Hero';

export default Hero;
