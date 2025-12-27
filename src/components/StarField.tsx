import React, { memo, useMemo, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Animations - simplified
const twinkle = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
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

// Static stars layer using CSS background - much more performant
const StaticStarsLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 20% 35%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 30% 10%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 40% 60%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 50% 25%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 60% 80%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 70% 45%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 80% 70%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 90% 20%, rgba(255,255,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 15% 85%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 25% 55%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 35% 90%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 45% 5%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 55% 40%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 65% 95%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 75% 30%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 85% 50%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 95% 75%, rgba(255,255,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 5% 65%, rgba(200,200,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 12% 42%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 22% 78%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 32% 28%, rgba(200,220,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 42% 92%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 52% 18%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 62% 58%, rgba(255,240,220,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 72% 82%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 82% 12%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 92% 48%, rgba(220,200,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 8% 32%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 18% 68%, rgba(255,255,255,0.6) 0%, transparent 100%);
`;

// Second layer of static stars
const StaticStarsLayer2 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(1px 1px at 3% 8%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 13% 22%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 23% 48%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 33% 72%, rgba(200,200,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 43% 38%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 53% 88%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 63% 15%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 73% 55%, rgba(255,240,220,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 83% 85%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 93% 35%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 7% 95%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 17% 5%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 27% 62%, rgba(220,200,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 37% 18%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 47% 78%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 57% 52%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 67% 28%, rgba(200,220,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 77% 98%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 87% 42%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 97% 65%, rgba(255,255,255,0.6) 0%, transparent 100%);
`;

// Only a few animated "bright" stars for effect
const AnimatedStarsContainer = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.5s ease;
`;

const BrightStar = styled.div<{ $top: number; $left: number; $delay: number }>`
  position: absolute;
  top: ${props => props.$top}%;
  left: ${props => props.$left}%;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  animation: ${twinkle} 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  will-change: opacity;
`;

// Pre-defined positions for bright stars (only 15 animated stars)
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
    // Delay animated stars to not block initial render
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
      <MilkyWay />
      <StaticStarsLayer />
      <StaticStarsLayer2 />
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
