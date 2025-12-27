import React, { memo, useRef, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';

// GPU-optimized keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const liquidFloat = keyframes`
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -20px, 0);
  }
`;

const orbPulse = keyframes`
  0%, 100% {
    transform: translate3d(-50%, -50%, 0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translate3d(-50%, -50%, 0) scale(1.1);
    opacity: 0.2;
  }
`;

const HeroSection = styled.section<{ $isVisible: boolean }>`
  min-height: 100vh;
  padding-top: 120px;
  background: transparent;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding-top: 100px;
  }
`;

// Liquid glass floating orbs - simplified for performance
const LiquidOrb = styled.div<{ $size: number; $top: string; $left: string; $delay: number }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  top: ${props => props.$top};
  left: ${props => props.$left};
  background: radial-gradient(
    circle,
    rgba(124, 58, 237, 0.12) 0%,
    rgba(168, 85, 247, 0.06) 50%,
    transparent 70%
  );
  border-radius: 50%;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

// Central glow effect - simplified for performance
const CentralGlow = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(124, 58, 237, 0.15) 0%,
    rgba(168, 85, 247, 0.08) 40%,
    transparent 70%
  );
  pointer-events: none;

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

// Decorative glass sphere - simplified for performance
const GlassSphere = styled.div<{ $position: 'left' | 'right' }>`
  position: absolute;
  width: 150px;
  height: 150px;
  ${props => props.$position === 'left' ? 'left: 8%; top: 25%;' : 'right: 8%; top: 60%;'}
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(124, 58, 237, 0.04) 50%,
    rgba(168, 85, 247, 0.03) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
`;

const Header = styled.div`
  margin-bottom: -100px;
  z-index: 10;
  position: relative;
`;

const Title = styled.h1`
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
  margin: 0;
  animation: ${fadeIn} 1s ease-out;
  text-align: center;

  @media (max-width: 768px) {
    font-size: clamp(2.5rem, 7vw, 4rem);
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 1.5rem 0 0;
  font-weight: 400;
  letter-spacing: 0;
  animation: ${fadeIn} 1s ease-out 0.2s both;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;



const InfoWindowsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  margin-bottom: 3rem;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
`;

const InfoWindow = styled(motion.div)`
  background: rgba(20, 10, 40, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const CardNumber = styled.span`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(124, 58, 237, 0.8);
  margin-bottom: 0.5rem;
  font-family: 'Inter', -apple-system, sans-serif;
  letter-spacing: 0.05em;
`;

const CardTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.5rem;
  letter-spacing: -0.01em;
`;

const CardText = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  line-height: 1.5;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  animation: ${fadeIn} 1s ease-out 0.6s both;
  position: relative;
  z-index: 10;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    margin-top: 1rem;
  }
`;

const TeamText = styled.div`
  text-align: left;
  max-width: 400px;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const TeamTitle = styled.h2`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 0.5rem;
  font-weight: 600;
`;

const TeamDescription = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  }
`;

const Hero: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Pause animations when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <HeroSection id="hero" ref={sectionRef} $isVisible={isVisible}>
      {/* Background effects removed for cleaner section transitions */}

      <Container>
        <ContentWrapper>
          <Header>
            <Title>
              Outsourced
              <br />
              development
              <br />
              team
            </Title>
            <Subtitle>Built off-site. Feels in-house.</Subtitle>
          </Header>

          <Container style={{ marginTop: '4rem' }}>
            <InfoWindowsContainer>
              <InfoWindow
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <CardNumber>01</CardNumber>
                <CardTitle>Smart development</CardTitle>
                <CardText>
                  We're not just coders — we solve problems.
                  Expect fast, scalable, future-proof solutions tailored to your needs.
                </CardText>
              </InfoWindow>

              <InfoWindow
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <CardNumber>02</CardNumber>
                <CardTitle>Super-fast delivery</CardTitle>
                <CardText>
                  We deliver MVPs in weeks, not months.
                  Agile workflows and zero overhead mean you move faster than your competitors.
                </CardText>
              </InfoWindow>

              <InfoWindow
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <CardNumber>03</CardNumber>
                <CardTitle>Global & synced</CardTitle>
                <CardText>
                  Remote doesn't mean distant. Our team works across time zones with seamless communication.
                </CardText>
              </InfoWindow>
            </InfoWindowsContainer>
          </Container>

          <BottomSection>
            <TeamText>
              <TeamTitle>About our team</TeamTitle>
              <TeamDescription>
                We're a remote-first dev team that speaks the language
                of both startups and enterprise. From rapid prototyping to
                scalable architecture — we translate your vision into clean,
                elegant code. Always on time. Always in style.
              </TeamDescription>
            </TeamText>
            <CTAButton href="#contact">
              Work with us
            </CTAButton>
          </BottomSection>
        </ContentWrapper>
      </Container>
    </HeroSection>
  );
});

Hero.displayName = 'Hero';

export default Hero;