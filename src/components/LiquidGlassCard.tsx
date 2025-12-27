import React, { useRef, useState, useCallback, memo } from 'react';
import styled, { css, keyframes } from 'styled-components';

// Subtle liquid shimmer animation
const liquidShimmer = keyframes`
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(200%) rotate(45deg);
  }
`;

const liquidGlow = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.02);
  }
`;

interface CardContainerProps {
  $variant: 'default' | 'elevated' | 'interactive';
  $glowOnHover: boolean;
  $isHovered: boolean;
  $mouseX: number;
  $mouseY: number;
}

const CardContainer = styled.div<CardContainerProps>`
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.03) 50%,
    rgba(124, 58, 237, 0.05) 100%
  );
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  overflow: hidden;
  contain: layout style paint;
  will-change: transform, box-shadow;
  transform: translate3d(0, 0, 0);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1),
              box-shadow 0.4s cubic-bezier(0.23, 1, 0.32, 1),
              border-color 0.3s ease;

  /* Base shadow */
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 4px 16px rgba(124, 58, 237, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  /* Variant: elevated */
  ${props => props.$variant === 'elevated' && css`
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.2),
      0 8px 32px rgba(124, 58, 237, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  `}

  /* Hover states */
  ${props => props.$isHovered && css`
    transform: translate3d(0, -4px, 0);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.15),
      0 8px 32px rgba(124, 58, 237, 0.2),
      0 0 60px rgba(124, 58, 237, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  `}

  /* Liquid glass surface highlight */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 100%
    );
    border-radius: 24px 24px 0 0;
    pointer-events: none;
  }

  /* Interactive glow following mouse */
  ${props => props.$variant === 'interactive' && props.$isHovered && css`
    &::after {
      content: '';
      position: absolute;
      top: ${props.$mouseY}px;
      left: ${props.$mouseX}px;
      width: 300px;
      height: 300px;
      background: radial-gradient(
        circle,
        rgba(124, 58, 237, 0.25) 0%,
        transparent 70%
      );
      transform: translate(-50%, -50%);
      pointer-events: none;
      filter: blur(40px);
      opacity: 0.8;
    }
  `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &::after {
      display: none;
    }
  }
`;

const ShimmerEffect = styled.div<{ $isHovered: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
  pointer-events: none;
  opacity: 0;
  transform: translateX(-100%) rotate(45deg);

  ${props => props.$isHovered && css`
    opacity: 1;
    animation: ${liquidShimmer} 1.2s ease-out;
  `}

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const GlowPulse = styled.div<{ $glowOnHover: boolean; $isHovered: boolean }>`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(124, 58, 237, 0.08) 0%,
    transparent 50%
  );
  pointer-events: none;
  opacity: 0;

  ${props => props.$glowOnHover && props.$isHovered && css`
    opacity: 1;
    animation: ${liquidGlow} 3s ease-in-out infinite;
  `}

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

interface LiquidGlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'interactive';
  glowOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const LiquidGlassCard: React.FC<LiquidGlassCardProps> = memo(({
  children,
  variant = 'default',
  glowOnHover = true,
  className,
  style,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (variant !== 'interactive' || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [variant]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <CardContainer
      ref={cardRef}
      $variant={variant}
      $glowOnHover={glowOnHover}
      $isHovered={isHovered}
      $mouseX={mousePos.x}
      $mouseY={mousePos.y}
      className={className}
      style={style}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <GlowPulse $glowOnHover={glowOnHover} $isHovered={isHovered} />
      <ShimmerEffect $isHovered={isHovered} />
      <ContentWrapper>{children}</ContentWrapper>
    </CardContainer>
  );
});

LiquidGlassCard.displayName = 'LiquidGlassCard';

export default LiquidGlassCard;
