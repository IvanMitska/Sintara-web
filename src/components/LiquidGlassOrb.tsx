import React, { memo } from 'react';
import styled, { keyframes, css } from 'styled-components';

// GPU-optimized keyframes
const float = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -20px, 0); }
`;

const morphing = keyframes`
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  50% {
    border-radius: 40% 60% 60% 40% / 40% 60% 40% 60%;
  }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(200%) rotate(45deg); }
`;

const OrbContainer = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 350px;
    height: 350px;
  }

  @media (max-width: 480px) {
    width: 280px;
    height: 280px;
  }
`;

const GlassOrb = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(124, 58, 237, 0.2) 0%,
    rgba(168, 85, 247, 0.15) 50%,
    rgba(139, 92, 246, 0.2) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    0 8px 32px rgba(124, 58, 237, 0.25),
    inset 0 0 60px rgba(255, 255, 255, 0.08);
  animation:
    ${float} 8s ease-in-out infinite,
    ${morphing} 12s ease-in-out infinite;
  overflow: hidden;
  will-change: transform, border-radius;
  backface-visibility: hidden;

  /* Glass highlight */
  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 15%;
    width: 40%;
    height: 30%;
    background: radial-gradient(
      ellipse,
      rgba(255, 255, 255, 0.5) 0%,
      transparent 70%
    );
    filter: blur(15px);
    border-radius: 50%;
    pointer-events: none;
  }

  /* Secondary glow */
  &::after {
    content: '';
    position: absolute;
    bottom: 20%;
    right: 15%;
    width: 35%;
    height: 25%;
    background: radial-gradient(
      circle,
      rgba(124, 58, 237, 0.4) 0%,
      transparent 70%
    );
    filter: blur(20px);
    border-radius: 50%;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const InnerGlow = styled.div`
  position: absolute;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.3),
    transparent 60%
  );
  border-radius: 50%;
  filter: blur(10px);
`;

const RingEffect = styled.div`
  position: absolute;
  width: 120%;
  height: 120%;
  top: -10%;
  left: -10%;
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 50%;
  animation: ${float} 10s ease-in-out infinite reverse;
  will-change: transform;
  backface-visibility: hidden;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const CenterIcon = styled.div`
  position: absolute;
  font-size: 120px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 30px rgba(155, 81, 224, 0.8);
  z-index: 10;

  @media (max-width: 768px) {
    font-size: 80px;
  }

  @media (max-width: 480px) {
    font-size: 60px;
  }
`;

interface LiquidGlassOrbProps {
  icon?: React.ReactNode;
}

const LiquidGlassOrb: React.FC<LiquidGlassOrbProps> = memo(({ icon }) => {
  return (
    <OrbContainer>
      <RingEffect />
      <GlassOrb>
        <InnerGlow />
      </GlassOrb>
      {icon && <CenterIcon>{icon}</CenterIcon>}
    </OrbContainer>
  );
});

LiquidGlassOrb.displayName = 'LiquidGlassOrb';

export default LiquidGlassOrb;