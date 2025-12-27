import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

const ProcessSection = styled.section`
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
    padding: 0;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    margin-bottom: 32px;
    padding: 0 20px;
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
    font-size: 1rem;
  }
`;

/* Desktop 3D Carousel */
const DesktopCarousel = styled.div`
  position: relative;
  perspective: 1200px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const CarouselTrack = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div<{ $offset: number; $isActive: boolean }>`
  position: absolute;
  width: 380px;
  min-height: 280px;
  background: ${props => props.$isActive
    ? 'linear-gradient(145deg, rgba(30, 20, 60, 0.95), rgba(20, 10, 45, 0.95))'
    : 'rgba(20, 10, 40, 0.7)'};
  border: 1px solid ${props => props.$isActive
    ? 'rgba(124, 58, 237, 0.4)'
    : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 24px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  backface-visibility: hidden;

  transform: ${props => {
    const offset = props.$offset;
    if (offset === 0) {
      return 'translateX(0) translateZ(100px) rotateY(0deg) scale(1)';
    }
    const direction = offset > 0 ? 1 : -1;
    const absOffset = Math.abs(offset);
    const translateX = direction * absOffset * 320;
    const translateZ = -absOffset * 150;
    const rotateY = -direction * Math.min(absOffset * 25, 45);
    const scale = Math.max(1 - absOffset * 0.15, 0.6);
    return `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
  }};

  opacity: ${props => {
    const absOffset = Math.abs(props.$offset);
    if (absOffset === 0) return 1;
    if (absOffset === 1) return 0.7;
    if (absOffset === 2) return 0.4;
    return 0.2;
  }};

  z-index: ${props => 10 - Math.abs(props.$offset)};

  box-shadow: ${props => props.$isActive
    ? '0 25px 80px rgba(124, 58, 237, 0.3), 0 0 0 1px rgba(124, 58, 237, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    : '0 10px 40px rgba(0, 0, 0, 0.3)'};

  pointer-events: ${props => Math.abs(props.$offset) <= 2 ? 'auto' : 'none'};

  &:hover {
    border-color: rgba(124, 58, 237, 0.5);
  }
`;

/* Mobile Swipe Carousel */
const MobileCarousel = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: relative;
    overflow: hidden;
  }
`;

const MobileTrack = styled.div<{ $activeIndex: number }>`
  display: flex;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateX(calc(-${props => props.$activeIndex * 100}% - ${props => props.$activeIndex * 16}px));
  padding: 0 20px;
  gap: 16px;
`;

const MobileCard = styled.div<{ $isActive: boolean }>`
  flex: 0 0 calc(100% - 40px);
  min-height: 320px;
  background: linear-gradient(145deg, rgba(30, 20, 60, 0.95), rgba(20, 10, 45, 0.95));
  border: 1px solid ${props => props.$isActive
    ? 'rgba(124, 58, 237, 0.5)'
    : 'rgba(124, 58, 237, 0.2)'};
  border-radius: 24px;
  padding: 28px;
  transition: all 0.4s ease;
  box-shadow: ${props => props.$isActive
    ? '0 20px 60px rgba(124, 58, 237, 0.3), 0 0 0 1px rgba(124, 58, 237, 0.2)'
    : '0 10px 40px rgba(0, 0, 0, 0.3)'};
  transform: ${props => props.$isActive ? 'scale(1)' : 'scale(0.95)'};
  opacity: ${props => props.$isActive ? 1 : 0.6};
`;

const MobileNavigation = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 24px;
    padding: 0 20px;
  }
`;

const MobileDot = styled.button<{ $isActive: boolean }>`
  width: ${props => props.$isActive ? '24px' : '8px'};
  height: 8px;
  border-radius: 4px;
  border: none;
  background: ${props => props.$isActive
    ? 'linear-gradient(90deg, #7c3aed, #a78bfa)'
    : 'rgba(255, 255, 255, 0.2)'};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    background: ${props => props.$isActive
      ? 'linear-gradient(90deg, #7c3aed, #a78bfa)'
      : 'rgba(255, 255, 255, 0.4)'};
  }
`;

const MobileArrows = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    margin-top: 16px;
  }
`;

const MobileArrowButton = styled.button<{ $disabled?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.$disabled
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(124, 58, 237, 0.2)'};
  border: 1px solid ${props => props.$disabled
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(124, 58, 237, 0.3)'};
  color: ${props => props.$disabled
    ? 'rgba(255, 255, 255, 0.2)'
    : '#a78bfa'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:active:not(:disabled) {
    transform: scale(0.9);
    background: rgba(124, 58, 237, 0.3);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MobileProgress = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
`;

const CardInner = styled.div`
  position: relative;
  z-index: 2;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const StepNumber = styled.div<{ $isActive: boolean }>`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: ${props => props.$isActive
    ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
    : 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.$isActive ? '#ffffff' : '#a78bfa'};
  box-shadow: ${props => props.$isActive
    ? '0 8px 24px rgba(124, 58, 237, 0.4)'
    : 'none'};
  transition: all 0.4s ease;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

const StepBadge = styled.div<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.$isActive
    ? 'rgba(124, 58, 237, 0.2)'
    : 'rgba(124, 58, 237, 0.1)'};
  border: 1px solid ${props => props.$isActive
    ? 'rgba(124, 58, 237, 0.3)'
    : 'rgba(124, 58, 237, 0.15)'};
  border-radius: 20px;
  padding: 6px 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StepTitle = styled.h3<{ $isActive: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: ${props => props.$isActive ? '1.5rem' : '1.25rem'};
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
  transition: font-size 0.4s ease;

  @media (max-width: 768px) {
    font-size: 1.375rem;
  }
`;

const StepDescription = styled.p<{ $isActive: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  color: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.5)'};
  line-height: 1.7;
  margin-bottom: 20px;
  transition: color 0.4s ease;

  @media (max-width: 768px) {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
`;

const StepDuration = styled.div<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.$isActive
    ? 'rgba(34, 197, 94, 0.15)'
    : 'rgba(124, 58, 237, 0.1)'};
  border: 1px solid ${props => props.$isActive
    ? 'rgba(34, 197, 94, 0.25)'
    : 'rgba(124, 58, 237, 0.15)'};
  border-radius: 8px;
  padding: 8px 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => props.$isActive ? '#22c55e' : '#a78bfa'};
  transition: all 0.4s ease;

  @media (max-width: 768px) {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.25);
    color: #22c55e;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 48px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavButton = styled.button<{ $disabled?: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.$disabled
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(124, 58, 237, 0.15)'};
  border: 1px solid ${props => props.$disabled
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(124, 58, 237, 0.3)'};
  color: ${props => props.$disabled
    ? 'rgba(255, 255, 255, 0.2)'
    : '#a78bfa'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: rgba(124, 58, 237, 0.25);
    border-color: rgba(124, 58, 237, 0.5);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ProgressDots = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressDot = styled.button<{ $isActive: boolean; $isPast: boolean }>`
  width: ${props => props.$isActive ? '32px' : '10px'};
  height: 10px;
  border-radius: 5px;
  border: none;
  background: ${props => {
    if (props.$isActive) return 'linear-gradient(90deg, #7c3aed, #a78bfa)';
    if (props.$isPast) return 'rgba(124, 58, 237, 0.5)';
    return 'rgba(255, 255, 255, 0.15)';
  }};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$isActive
      ? 'linear-gradient(90deg, #7c3aed, #a78bfa)'
      : 'rgba(124, 58, 237, 0.4)'};
  }
`;

const ProgressText = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  min-width: 60px;
  text-align: center;
`;

const steps = [
  {
    number: '01',
    title: 'Discovery call',
    description: 'We discuss your goals, requirements, and vision. You get a clear understanding of what\'s possible and a rough estimate.',
    duration: '1-2 days',
    badge: 'Start'
  },
  {
    number: '02',
    title: 'Proposal & planning',
    description: 'Detailed scope, fixed price, and timeline. No surprises. You approve before we write a single line of code.',
    duration: '2-3 days',
    badge: 'Planning'
  },
  {
    number: '03',
    title: 'Design & prototype',
    description: 'Interactive mockups you can click through. See exactly how your product will look and feel before development.',
    duration: '5-7 days',
    badge: 'Design'
  },
  {
    number: '04',
    title: 'Development',
    description: 'We build your product with weekly demos. You see progress in real-time and can give feedback along the way.',
    duration: '2-4 weeks',
    badge: 'Build'
  },
  {
    number: '05',
    title: 'Testing & QA',
    description: 'Rigorous testing across devices and browsers. We catch bugs before your users do.',
    duration: '3-5 days',
    badge: 'Quality'
  },
  {
    number: '06',
    title: 'Launch',
    description: 'Smooth deployment to production. We handle hosting setup, DNS, SSL — everything technical.',
    duration: '1-2 days',
    badge: 'Deploy'
  },
  {
    number: '07',
    title: 'Support',
    description: '60-day warranty included. After that, optional maintenance plans available if you need ongoing help.',
    duration: 'Ongoing',
    badge: 'Finish'
  }
];

const WorkProcess: React.FC = memo(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const goToNext = useCallback(() => {
    setActiveIndex(prev => Math.min(prev + 1, steps.length - 1));
  }, []);

  const goToPrev = useCallback(() => {
    setActiveIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  return (
    <ProcessSection id="process">
      <Container>
        <SectionHeader>
          <SectionTitle>How we work</SectionTitle>
          <SectionSubtitle>
            A transparent process from first call to final delivery
          </SectionSubtitle>
        </SectionHeader>

        {/* Desktop 3D Carousel */}
        <DesktopCarousel>
          <CarouselTrack>
            {steps.map((step, index) => {
              const offset = index - activeIndex;
              const isActive = index === activeIndex;

              return (
                <Card
                  key={index}
                  $offset={offset}
                  $isActive={isActive}
                  onClick={() => goToStep(index)}
                >
                  <CardInner>
                    <StepIndicator>
                      <StepNumber $isActive={isActive}>{step.number}</StepNumber>
                      <StepBadge $isActive={isActive}>{step.badge}</StepBadge>
                    </StepIndicator>
                    <StepTitle $isActive={isActive}>{step.title}</StepTitle>
                    <StepDescription $isActive={isActive}>
                      {step.description}
                    </StepDescription>
                    <StepDuration $isActive={isActive}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {step.duration}
                    </StepDuration>
                  </CardInner>
                </Card>
              );
            })}
          </CarouselTrack>
        </DesktopCarousel>

        {/* Mobile Swipe Carousel */}
        <MobileCarousel
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <MobileTrack $activeIndex={activeIndex} ref={trackRef}>
            {steps.map((step, index) => {
              const isActive = index === activeIndex;

              return (
                <MobileCard key={index} $isActive={isActive}>
                  <CardInner>
                    <StepIndicator>
                      <StepNumber $isActive={true}>{step.number}</StepNumber>
                      <StepBadge $isActive={true}>{step.badge}</StepBadge>
                    </StepIndicator>
                    <StepTitle $isActive={true}>{step.title}</StepTitle>
                    <StepDescription $isActive={true}>
                      {step.description}
                    </StepDescription>
                    <StepDuration $isActive={true}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {step.duration}
                    </StepDuration>
                  </CardInner>
                </MobileCard>
              );
            })}
          </MobileTrack>
        </MobileCarousel>

        {/* Mobile Navigation */}
        <MobileArrows>
          <MobileArrowButton onClick={goToPrev} $disabled={activeIndex === 0}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </MobileArrowButton>

          <MobileProgress>
            {activeIndex + 1} / {steps.length}
          </MobileProgress>

          <MobileArrowButton onClick={goToNext} $disabled={activeIndex === steps.length - 1}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </MobileArrowButton>
        </MobileArrows>

        <MobileNavigation>
          {steps.map((_, index) => (
            <MobileDot
              key={index}
              $isActive={index === activeIndex}
              onClick={() => goToStep(index)}
            />
          ))}
        </MobileNavigation>

        {/* Desktop Navigation */}
        <NavigationContainer>
          <NavButton onClick={goToPrev} $disabled={activeIndex === 0}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </NavButton>

          <ProgressDots>
            {steps.map((_, index) => (
              <ProgressDot
                key={index}
                $isActive={index === activeIndex}
                $isPast={index < activeIndex}
                onClick={() => goToStep(index)}
              />
            ))}
          </ProgressDots>

          <ProgressText>
            {activeIndex + 1} / {steps.length}
          </ProgressText>

          <NavButton onClick={goToNext} $disabled={activeIndex === steps.length - 1}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </NavButton>
        </NavigationContainer>
      </Container>
    </ProcessSection>
  );
});

WorkProcess.displayName = 'WorkProcess';

export default WorkProcess;
