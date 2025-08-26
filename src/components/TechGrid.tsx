import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const GridContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
`;

const GridLine = styled(motion.div)<{ horizontal?: boolean }>`
  position: absolute;
  background: linear-gradient(
    ${props => props.horizontal ? '90deg' : '0deg'},
    transparent,
    rgba(142, 45, 226, 0.1),
    transparent
  );
  ${props => props.horizontal ? `
    width: 100%;
    height: 1px;
    left: 0;
  ` : `
    width: 1px;
    height: 100%;
    top: 0;
  `}
`;

const TechGrid: React.FC = () => {
  const horizontalLines = Array.from({ length: 10 }, (_, i) => i);
  const verticalLines = Array.from({ length: 15 }, (_, i) => i);

  return (
    <GridContainer>
      {horizontalLines.map((_, index) => (
        <GridLine
          key={`h-${index}`}
          horizontal
          style={{ top: `${(index + 1) * 10}%` }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scaleX: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            delay: index * 0.1,
            repeat: Infinity,
            repeatDelay: 5
          }}
        />
      ))}
      
      {verticalLines.map((_, index) => (
        <GridLine
          key={`v-${index}`}
          style={{ left: `${(index + 1) * 6.66}%` }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ 
            opacity: [0, 0.2, 0],
            scaleY: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            delay: index * 0.08,
            repeat: Infinity,
            repeatDelay: 5
          }}
        />
      ))}
    </GridContainer>
  );
};

export default TechGrid;