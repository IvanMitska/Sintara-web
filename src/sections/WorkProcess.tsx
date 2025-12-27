import React, { memo } from 'react';
import styled from 'styled-components';

const ProcessSection = styled.section`
  padding: 120px 0;
  background: transparent;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    margin-bottom: 50px;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 1.5rem;
`;

const SectionSubtitle = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  position: relative;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const StepCard = styled.div`
  background: rgba(20, 10, 40, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 32px;
  position: relative;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(124, 58, 237, 0.3);
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #a78bfa;
`;

const StepTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
`;

const StepDescription = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin-bottom: 16px;
`;

const StepDuration = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 6px;
  padding: 6px 10px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: #a78bfa;
`;

const steps = [
  {
    number: '01',
    title: 'Discovery call',
    description: 'We discuss your goals, requirements, and vision. You get a clear understanding of what\'s possible and a rough estimate.',
    duration: '1-2 days'
  },
  {
    number: '02',
    title: 'Proposal & planning',
    description: 'Detailed scope, fixed price, and timeline. No surprises. You approve before we write a single line of code.',
    duration: '2-3 days'
  },
  {
    number: '03',
    title: 'Design & prototype',
    description: 'Interactive mockups you can click through. See exactly how your product will look and feel before development.',
    duration: '5-7 days'
  },
  {
    number: '04',
    title: 'Development',
    description: 'We build your product with weekly demos. You see progress in real-time and can give feedback along the way.',
    duration: '2-4 weeks'
  },
  {
    number: '05',
    title: 'Testing & QA',
    description: 'Rigorous testing across devices and browsers. We catch bugs before your users do.',
    duration: '3-5 days'
  },
  {
    number: '06',
    title: 'Launch',
    description: 'Smooth deployment to production. We handle hosting setup, DNS, SSL — everything technical.',
    duration: '1-2 days'
  },
  {
    number: '07',
    title: 'Handover',
    description: 'Full source code, documentation, and training. You\'re in complete control of your product.',
    duration: '1 day'
  },
  {
    number: '08',
    title: 'Support',
    description: '60-day warranty included. After that, optional maintenance plans available if you need ongoing help.',
    duration: 'Ongoing'
  }
];

const WorkProcess: React.FC = memo(() => {
  return (
    <ProcessSection id="process">
      <Container>
        <SectionHeader>
          <SectionTitle>How we work</SectionTitle>
          <SectionSubtitle>
            A transparent process from first call to final delivery
          </SectionSubtitle>
        </SectionHeader>

        <StepsContainer>
          {steps.map((step, index) => (
            <StepCard key={index}>
              <StepNumber>{step.number}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
              <StepDuration>{step.duration}</StepDuration>
            </StepCard>
          ))}
        </StepsContainer>
      </Container>
    </ProcessSection>
  );
});

WorkProcess.displayName = 'WorkProcess';

export default WorkProcess;
