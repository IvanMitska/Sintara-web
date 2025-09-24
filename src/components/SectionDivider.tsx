import React from 'react';
import styled from 'styled-components';

interface SectionDividerProps {
  variant?: 'default' | 'thin' | 'dot';
  className?: string;
}

const Divider = styled.div<{ variant: string }>`
  width: 100%;
  height: ${props => props.variant === 'thin' ? '1px' : props.variant === 'dot' ? '4px' : '2px'};
  background: ${props => props.variant === 'dot'
    ? 'var(--color-primary)'
    : 'var(--gradient-section-divider)'};
  margin: 0;
  border: none;
  opacity: ${props => props.variant === 'thin' ? '0.4' : '0.6'};
  transition: opacity 0.3s ease;
  position: relative;
  z-index: 1;

  ${props => props.variant === 'dot' && `
    border-radius: 50%;
    margin: 0 auto;
    width: 4px;
  `}

  /* Эффект при наведении */
  &:hover {
    opacity: ${props => props.variant === 'thin' ? '0.6' : '0.8'};
  }
`;

const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'default',
  className
}) => {
  return <Divider variant={variant} className={className} />;
};

export default SectionDivider;