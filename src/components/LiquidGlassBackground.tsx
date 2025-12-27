import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

// GPU-optimized keyframes - use transform and opacity only
const liquidFlow = keyframes`
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.15;
  }
  33% {
    transform: translate3d(30px, -20px, 0) scale(1.1);
    opacity: 0.2;
  }
  66% {
    transform: translate3d(-20px, 30px, 0) scale(0.95);
    opacity: 0.12;
  }
`;

const liquidPulse = keyframes`
  0%, 100% {
    transform: translate3d(-50%, -50%, 0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate3d(-50%, -50%, 0) scale(1.15);
    opacity: 0.15;
  }
`;

const orbFloat = keyframes`
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -30px, 0);
  }
`;

const BackgroundContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
  contain: strict;

  /* Pause animations when not visible */
  ${props => !props.$isVisible && css`
    * {
      animation-play-state: paused !important;
    }
  `}
`;

// Main gradient orbs with GPU acceleration
const GradientOrb = styled.div<{
  $size: number;
  $top: string;
  $left: string;
  $color: string;
  $delay: number;
  $duration: number;
}>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  top: ${props => props.$top};
  left: ${props => props.$left};
  background: ${props => props.$color};
  border-radius: 50%;
  filter: blur(80px);
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);
  animation: ${liquidFlow} ${props => props.$duration}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  backface-visibility: hidden;
  perspective: 1000px;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (max-width: 768px) {
    width: ${props => props.$size * 0.6}px;
    height: ${props => props.$size * 0.6}px;
    filter: blur(60px);
  }
`;

// Central liquid pulse effect
const CentralPulse = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(124, 58, 237, 0.15) 0%,
    rgba(168, 85, 247, 0.08) 40%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(100px);
  will-change: transform, opacity;
  animation: ${liquidPulse} 15s ease-in-out infinite;
  backface-visibility: hidden;

  @media (max-width: 768px) {
    width: 400px;
    height: 400px;
    filter: blur(60px);
  }
`;

// Floating liquid glass orb
const FloatingOrb = styled.div<{ $position: 'left' | 'right' }>`
  position: absolute;
  width: 300px;
  height: 300px;
  ${props => props.$position === 'left' ? 'left: 5%;' : 'right: 5%;'}
  top: 30%;
  background: linear-gradient(
    135deg,
    rgba(124, 58, 237, 0.1) 0%,
    rgba(168, 85, 247, 0.15) 50%,
    rgba(139, 92, 246, 0.1) 100%
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  will-change: transform;
  animation: ${orbFloat} 12s ease-in-out infinite;
  animation-delay: ${props => props.$position === 'left' ? '0s' : '6s'};
  backface-visibility: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 20%;
    width: 40%;
    height: 30%;
    background: radial-gradient(
      ellipse,
      rgba(255, 255, 255, 0.4) 0%,
      transparent 70%
    );
    border-radius: 50%;
    filter: blur(10px);
  }

  @media (max-width: 768px) {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// Liquid mesh grid overlay
const LiquidMesh = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(124, 58, 237, 0.03) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.02) 2px, transparent 2px);
  background-size: 60px 60px;
  opacity: 0.5;

  @media (max-width: 768px) {
    background-size: 40px 40px;
    opacity: 0.3;
  }
`;

interface LiquidGlassBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  showOrbs?: boolean;
  showMesh?: boolean;
}

const LiquidGlassBackground: React.FC<LiquidGlassBackgroundProps> = ({
  intensity = 'medium',
  showOrbs = true,
  showMesh = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pause animations when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Adjust orb settings based on intensity
  const getIntensityMultiplier = () => {
    switch (intensity) {
      case 'low': return 0.5;
      case 'high': return 1.5;
      default: return 1;
    }
  };

  const mult = getIntensityMultiplier();

  return (
    <BackgroundContainer ref={containerRef} $isVisible={isVisible}>
      {/* Primary gradient orbs */}
      <GradientOrb
        $size={600 * mult}
        $top="10%"
        $left="70%"
        $color="radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)"
        $delay={0}
        $duration={20}
      />
      <GradientOrb
        $size={500 * mult}
        $top="60%"
        $left="10%"
        $color="radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)"
        $delay={5}
        $duration={25}
      />
      <GradientOrb
        $size={400 * mult}
        $top="40%"
        $left="50%"
        $color="radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)"
        $delay={10}
        $duration={30}
      />

      {/* Central pulsing effect */}
      <CentralPulse />

      {/* Floating glass orbs */}
      {showOrbs && (
        <>
          <FloatingOrb $position="left" />
          <FloatingOrb $position="right" />
        </>
      )}

      {/* Subtle mesh overlay */}
      {showMesh && <LiquidMesh />}
    </BackgroundContainer>
  );
};

export default LiquidGlassBackground;
