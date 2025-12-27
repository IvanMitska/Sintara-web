import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotateY(0deg) rotateX(0deg);
  }
  to {
    transform: rotateY(360deg) rotateX(10deg);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const SphereContainer = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 8s ease-in-out infinite;

  @media (max-width: 768px) {
    width: 350px;
    height: 350px;
  }

  @media (max-width: 480px) {
    width: 280px;
    height: 280px;
  }
`;

const GlassSphere = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  animation: ${rotate} 30s linear infinite;
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const SphereInner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 20%,
    rgba(147, 51, 234, 0.03) 40%,
    rgba(255, 255, 255, 0.01) 60%,
    rgba(147, 51, 234, 0.05) 100%
  );
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 25px 100px rgba(147, 51, 234, 0.2),
    inset 0 0 40px rgba(255, 255, 255, 0.05),
    inset 0 -20px 40px rgba(147, 51, 234, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: 10%;
    right: 20%;
    width: 25%;
    height: 25%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.7) 0%,
      rgba(255, 255, 255, 0.3) 30%,
      transparent 60%
    );
    filter: blur(8px);
    border-radius: 50%;
    transform: rotate(-20deg);
  }

  &::after {
    content: '';
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 90%;
    border-radius: 50%;
    background: radial-gradient(
      ellipse at top,
      transparent 0%,
      rgba(138, 43, 226, 0.05) 50%,
      rgba(138, 43, 226, 0.1) 100%
    );
  }
`;

const Ring = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(80deg);
  width: 115%;
  height: 115%;
  border: 1px solid rgba(147, 51, 234, 0.15);
  border-radius: 50%;
  box-shadow:
    0 0 30px rgba(147, 51, 234, 0.2),
    inset 0 0 15px rgba(147, 51, 234, 0.05);
`;

const InnerRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(80deg) rotateZ(45deg);
  width: 95%;
  height: 95%;
  border: 0.5px solid rgba(255, 255, 255, 0.05);
  border-radius: 50%;
`;

const Particles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  span {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: particle 10s linear infinite;

    @keyframes particle {
      from {
        transform: translateZ(0px);
        opacity: 1;
      }
      to {
        transform: translateZ(300px);
        opacity: 0;
      }
    }

    &:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
    &:nth-child(2) { top: 80%; left: 80%; animation-delay: 1s; }
    &:nth-child(3) { top: 40%; left: 60%; animation-delay: 2s; }
    &:nth-child(4) { top: 60%; left: 40%; animation-delay: 3s; }
    &:nth-child(5) { top: 30%; left: 70%; animation-delay: 4s; }
  }
`;

const CenterContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;

  svg {
    width: 100px;
    height: 100px;
    color: rgba(255, 255, 255, 0.8);
    filter: drop-shadow(0 0 30px rgba(147, 51, 234, 0.4));
    opacity: 0.9;

    @media (max-width: 768px) {
      width: 70px;
      height: 70px;
    }
  }
`;

interface Glass3DSphereProps {
  children?: React.ReactNode;
}

const Glass3DSphere: React.FC<Glass3DSphereProps> = ({ children }) => {
  return (
    <SphereContainer>
      <GlassSphere>
        <SphereInner />
        <Ring />
        <InnerRing />
        <Particles>
          <span />
          <span />
          <span />
          <span />
          <span />
        </Particles>
        <CenterContent>
          {children}
        </CenterContent>
      </GlassSphere>
    </SphereContainer>
  );
};

export default Glass3DSphere;