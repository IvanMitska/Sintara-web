import React, { memo, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const twinkle = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

// Slow falling animation - GPU accelerated with transform
const fallingSlow = keyframes`
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0%);
  }
`;

const fallingMedium = keyframes`
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0%);
  }
`;

const fallingDeep = keyframes`
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0%);
  }
`;

const StarFieldContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #0a0515 0%,
    #050210 30%,
    #02010a 60%,
    #000005 100%
  );
`;

// Static nebula - no animation for better performance
const NebulaLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse 800px 600px at 15% 20%, rgba(88, 28, 135, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 600px 800px at 85% 30%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse 900px 500px at 50% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 55%),
    radial-gradient(ellipse 400px 600px at 5% 80%, rgba(167, 139, 250, 0.06) 0%, transparent 45%);
`;

// Soft twinkle animation for mobile - lightweight opacity change only
const mobileTwinkle = keyframes`
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
`;

// Stars layer 1 for mobile - with gentle twinkle animation
const MobileStarsLayer1 = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: ${mobileTwinkle} 4s ease-in-out infinite;
    will-change: opacity;
    background-image:
      radial-gradient(1px 1px at 5% 5%, rgba(255,255,255,0.8) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 12% 18%, rgba(255,255,255,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 20% 8%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(1px 1px at 28% 25%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 35% 12%, rgba(200,220,255,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 42% 32%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(1px 1px at 50% 5%, rgba(255,255,255,0.8) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 58% 22%, rgba(255,240,220,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 65% 15%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 72% 28%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 80% 8%, rgba(220,200,255,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 88% 18%, rgba(255,255,255,0.8) 0%, transparent 100%),
      radial-gradient(1px 1px at 95% 25%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 8% 38%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 15% 45%, rgba(255,255,255,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 22% 52%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 30% 40%, rgba(200,220,255,0.8) 0%, transparent 100%);
  }
`;

// Stars layer 2 for mobile - offset animation for depth
const MobileStarsLayer2 = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: ${mobileTwinkle} 5s ease-in-out infinite;
    animation-delay: -2s;
    will-change: opacity;
    background-image:
      radial-gradient(1.5px 1.5px at 38% 55%, rgba(255,255,255,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 45% 48%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(1px 1px at 52% 42%, rgba(255,240,220,0.8) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 60% 58%, rgba(255,255,255,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 68% 45%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 75% 52%, rgba(220,200,255,0.8) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 82% 38%, rgba(255,255,255,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 90% 55%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(1px 1px at 3% 65%, rgba(255,255,255,0.8) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 10% 72%, rgba(200,220,255,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 18% 68%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 25% 78%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 32% 62%, rgba(255,240,220,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 40% 75%, rgba(255,255,255,0.8) 0%, transparent 100%),
      radial-gradient(1px 1px at 48% 68%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 55% 82%, rgba(255,255,255,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 62% 72%, rgba(220,200,255,0.7) 0%, transparent 100%);
  }
`;

// Stars layer 3 for mobile - slowest animation
const MobileStarsLayer3 = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: ${mobileTwinkle} 6s ease-in-out infinite;
    animation-delay: -4s;
    will-change: opacity;
    background-image:
      radial-gradient(1px 1px at 70% 78%, rgba(255,255,255,0.8) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 78% 65%, rgba(255,255,255,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 85% 75%, rgba(200,220,255,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 92% 68%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(1px 1px at 6% 88%, rgba(255,255,255,0.8) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 14% 92%, rgba(255,240,220,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 22% 85%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 30% 95%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 38% 88%, rgba(255,255,255,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 45% 92%, rgba(220,200,255,0.8) 0%, transparent 100%),
      radial-gradient(1px 1px at 55% 85%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 62% 95%, rgba(255,255,255,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 70% 88%, rgba(200,220,255,0.7) 0%, transparent 100%),
      radial-gradient(1px 1px at 78% 92%, rgba(255,255,255,0.8) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 86% 85%, rgba(255,240,220,0.9) 0%, transparent 100%),
      radial-gradient(1px 1px at 94% 95%, rgba(255,255,255,0.6) 0%, transparent 100%);
  }
`;

// Milky way band - static (hidden on mobile)
const MilkyWay = styled.div`
  position: absolute;
  top: 0;
  left: -20%;
  width: 140%;
  height: 100%;
  background: linear-gradient(
    135deg,
    transparent 0%,
    transparent 35%,
    rgba(167, 139, 250, 0.03) 40%,
    rgba(139, 92, 246, 0.05) 45%,
    rgba(124, 58, 237, 0.06) 50%,
    rgba(139, 92, 246, 0.05) 55%,
    rgba(167, 139, 250, 0.03) 60%,
    transparent 65%,
    transparent 100%
  );
  transform: rotate(-20deg);

  @media (max-width: 768px) {
    display: none;
  }
`;

// Moving stars layer 1 - slow (200% height for seamless loop)
// DISABLED ON MOBILE for performance
const MovingStarsLayer1 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  animation: ${fallingSlow} 35s linear infinite;
  background-image:
    radial-gradient(1px 1px at 10% 5%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 25% 15%, rgba(255,255,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 40% 8%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 55% 22%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 70% 12%, rgba(200,220,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 85% 18%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 15% 35%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 30% 42%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 45% 38%, rgba(255,240,220,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 60% 45%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 75% 32%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 90% 48%, rgba(220,200,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 5% 55%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 20% 62%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 35% 58%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 50% 65%, rgba(200,200,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 65% 52%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 80% 68%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 95% 72%, rgba(255,240,220,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 12% 78%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 28% 85%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 42% 82%, rgba(220,200,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 58% 88%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 72% 92%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 88% 95%, rgba(255,255,255,0.6) 0%, transparent 100%);

  @media (max-width: 768px) {
    display: none;
  }
`;

// Moving stars layer 2 - medium speed (creates parallax)
// DISABLED ON MOBILE for performance
const MovingStarsLayer2 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  animation: ${fallingMedium} 25s linear infinite;
  background-image:
    radial-gradient(1.5px 1.5px at 8% 3%, rgba(255,255,255,0.9) 0%, transparent 100%),
    radial-gradient(2px 2px at 22% 12%, rgba(200,220,255,0.95) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 38% 8%, rgba(255,255,255,0.85) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 52% 18%, rgba(255,240,220,0.9) 0%, transparent 100%),
    radial-gradient(2px 2px at 68% 6%, rgba(255,255,255,0.95) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 82% 15%, rgba(220,200,255,0.85) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 18% 28%, rgba(255,255,255,0.9) 0%, transparent 100%),
    radial-gradient(2px 2px at 32% 35%, rgba(255,255,255,0.95) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 48% 32%, rgba(200,220,255,0.85) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 62% 42%, rgba(255,255,255,0.9) 0%, transparent 100%),
    radial-gradient(2px 2px at 78% 38%, rgba(255,240,220,0.95) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 92% 45%, rgba(255,255,255,0.85) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 5% 58%, rgba(220,200,255,0.9) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 28% 52%, rgba(255,255,255,0.85) 0%, transparent 100%),
    radial-gradient(2px 2px at 42% 62%, rgba(255,255,255,0.95) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 58% 55%, rgba(200,220,255,0.9) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 72% 68%, rgba(255,255,255,0.85) 0%, transparent 100%),
    radial-gradient(2px 2px at 88% 72%, rgba(255,240,220,0.95) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 15% 82%, rgba(255,255,255,0.9) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 35% 78%, rgba(220,200,255,0.85) 0%, transparent 100%),
    radial-gradient(2px 2px at 55% 85%, rgba(255,255,255,0.95) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 75% 92%, rgba(255,255,255,0.9) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 95% 88%, rgba(200,220,255,0.85) 0%, transparent 100%);

  @media (max-width: 768px) {
    display: none;
  }
`;

// Third layer - slowest for depth (distant stars)
// DISABLED ON MOBILE for performance
const MovingStarsLayer3 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  animation: ${fallingDeep} 50s linear infinite;
  background-image:
    radial-gradient(0.5px 0.5px at 10% 15%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 20% 35%, rgba(255,255,255,0.3) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 30% 10%, rgba(255,255,255,0.35) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 40% 60%, rgba(255,255,255,0.3) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 50% 25%, rgba(255,255,255,0.35) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 60% 80%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 70% 45%, rgba(255,255,255,0.3) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 80% 70%, rgba(255,255,255,0.35) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 90% 20%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 15% 85%, rgba(255,255,255,0.3) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 25% 55%, rgba(255,255,255,0.35) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 35% 90%, rgba(255,255,255,0.3) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 45% 5%, rgba(255,255,255,0.35) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 55% 40%, rgba(255,255,255,0.3) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 65% 95%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 75% 30%, rgba(255,255,255,0.3) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 85% 50%, rgba(255,255,255,0.35) 0%, transparent 100%),
    radial-gradient(0.5px 0.5px at 95% 75%, rgba(255,255,255,0.4) 0%, transparent 100%);

  @media (max-width: 768px) {
    display: none;
  }
`;

// Animated twinkling stars container
// DISABLED ON MOBILE for performance
const AnimatedStarsContainer = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.5s ease;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BrightStar = styled.div<{ $top: number; $left: number; $delay: number }>`
  position: absolute;
  top: ${props => props.$top}%;
  left: ${props => props.$left}%;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.9), 0 0 12px rgba(124, 58, 237, 0.4);
  animation: ${twinkle} 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
`;

// Pre-defined positions for bright twinkling stars
const brightStarPositions = [
  { top: 12, left: 8, delay: 0 },
  { top: 25, left: 35, delay: 0.5 },
  { top: 18, left: 72, delay: 1 },
  { top: 45, left: 15, delay: 1.5 },
  { top: 38, left: 88, delay: 2 },
  { top: 62, left: 42, delay: 0.3 },
  { top: 55, left: 68, delay: 0.8 },
  { top: 78, left: 22, delay: 1.3 },
  { top: 72, left: 55, delay: 1.8 },
  { top: 85, left: 78, delay: 0.6 },
  { top: 32, left: 52, delay: 1.1 },
  { top: 48, left: 5, delay: 1.6 },
  { top: 92, left: 38, delay: 2.1 },
  { top: 8, left: 92, delay: 0.9 },
  { top: 68, left: 95, delay: 1.4 },
];

const StarField: React.FC = memo(() => {
  const [showAnimated, setShowAnimated] = useState(false);

  useEffect(() => {
    // Delay animated elements to not block initial render
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShowAnimated(true);
      });
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <StarFieldContainer>
      <NebulaLayer />
      <MobileStarsLayer1 />
      <MobileStarsLayer2 />
      <MobileStarsLayer3 />
      <MilkyWay />
      {showAnimated && (
        <>
          <MovingStarsLayer3 />
          <MovingStarsLayer1 />
          <MovingStarsLayer2 />
        </>
      )}
      <AnimatedStarsContainer $visible={showAnimated}>
        {brightStarPositions.map((star, i) => (
          <BrightStar
            key={i}
            $top={star.top}
            $left={star.left}
            $delay={star.delay}
          />
        ))}
      </AnimatedStarsContainer>
    </StarFieldContainer>
  );
});

StarField.displayName = 'StarField';

export default StarField;
