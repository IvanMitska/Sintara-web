import React from 'react';
import styled from 'styled-components';
import AnimatedMetrics from '../components/AnimatedMetrics';

const StatsSection = styled.section`
  padding: 8rem 0;
  background: transparent;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #8E2DE2, #4A00E0, #FF7D54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -10px;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #8E2DE2, #4A00E0);
  }
`;

const SectionDescription = styled.p`
  font-size: clamp(1rem, 2vw, 1.1rem);
  max-width: 600px;
  margin: 0 auto;
  color: #a0a0a0;
  line-height: 1.6;
`;

const Stats: React.FC = () => {
  return (
    <StatsSection id="stats">
      <Container>
        <SectionHeader>
          <SectionTitle>Наши достижения</SectionTitle>
          <SectionDescription>
            Цифры говорят сами за себя. Мы гордимся нашими результатами и постоянно развиваемся
          </SectionDescription>
        </SectionHeader>
        <AnimatedMetrics />
      </Container>
    </StatsSection>
  );
};

export default Stats;