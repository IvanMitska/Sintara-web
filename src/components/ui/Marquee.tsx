import styled, { keyframes } from 'styled-components';
import type { ReactNode } from 'react';

const scroll = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
`;

const MarqueeTrack = styled.div<{ $duration: number; $reverse: boolean }>`
  display: flex;
  width: max-content;
  animation: ${scroll} ${({ $duration }) => $duration}s linear infinite;
  animation-direction: ${({ $reverse }) => ($reverse ? 'reverse' : 'normal')};
  will-change: transform;
`;

const MarqueeWrap = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;

  &:hover ${MarqueeTrack} {
    animation-play-state: paused;
  }
`;

const MarqueeItem = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding-right: 48px;
`;

interface MarqueeProps {
  children: ReactNode;
  /** seconds for one full loop */
  duration?: number;
  reverse?: boolean;
  className?: string;
}

const Marquee = ({
  children,
  duration = 40,
  reverse = false,
  className,
}: MarqueeProps) => {
  return (
    <MarqueeWrap className={className}>
      <MarqueeTrack $duration={duration} $reverse={reverse}>
        <MarqueeItem>{children}</MarqueeItem>
        <MarqueeItem aria-hidden="true">{children}</MarqueeItem>
      </MarqueeTrack>
    </MarqueeWrap>
  );
};

export default Marquee;
