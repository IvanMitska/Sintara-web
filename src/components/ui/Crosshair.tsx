import styled from 'styled-components';

/**
 * Decorative "+" crosshair marker — scattered across cinematic sections
 * the way Lusion peppers its dark scenes. Positioned by the parent.
 */
const Crosshair = styled.span<{ $size?: number; $color?: string }>`
  position: absolute;
  width: ${({ $size = 14 }) => $size}px;
  height: ${({ $size = 14 }) => $size}px;
  pointer-events: none;
  opacity: 0.6;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: ${({ $color }) => $color ?? 'currentColor'};
  }

  &::before {
    left: 50%;
    top: 0;
    width: 1px;
    height: 100%;
    transform: translateX(-50%);
  }

  &::after {
    top: 50%;
    left: 0;
    height: 1px;
    width: 100%;
    transform: translateY(-50%);
  }
`;

export default Crosshair;
