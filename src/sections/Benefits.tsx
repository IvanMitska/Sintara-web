import React, { memo } from 'react';
import styled from 'styled-components';
import { FaShieldAlt, FaHandshake, FaCode, FaComments } from 'react-icons/fa';

const BenefitsSection = styled.section`
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

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const BenefitCard = styled.div`
  background: rgba(20, 10, 40, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 40px;
  display: flex;
  gap: 24px;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(124, 58, 237, 0.3);
  }

  @media (max-width: 768px) {
    padding: 28px;
    flex-direction: column;
    gap: 20px;
  }
`;

const IconBox = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    font-size: 28px;
    color: #a78bfa;
  }
`;

const BenefitContent = styled.div`
  flex: 1;
`;

const BenefitTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const BenefitDescription = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.7;
  margin-bottom: 16px;
`;

const BenefitHighlight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 8px;
  padding: 8px 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #a78bfa;
`;

const benefits = [
  {
    icon: FaShieldAlt,
    title: 'Fixed price. No surprises.',
    description: 'We agree on the final cost before starting. No hidden fees, no hourly billing tricks, no "unexpected" expenses. The price you see is the price you pay.',
    highlight: '100% transparent pricing'
  },
  {
    icon: FaCode,
    title: 'You own everything.',
    description: 'Full source code, design files, documentation — it\'s all yours. No vendor lock-in, no recurring fees for "access". Your project, your property.',
    highlight: 'Complete code ownership'
  },
  {
    icon: FaComments,
    title: 'Direct developer access.',
    description: 'Talk directly to the people building your product. No account managers, no game of telephone. Faster decisions, better results, zero miscommunication.',
    highlight: 'No middlemen'
  },
  {
    icon: FaHandshake,
    title: '60-day warranty included.',
    description: 'Found a bug after launch? We fix it free. No questions asked, no extra charges. We stand behind our work because we\'re confident in its quality.',
    highlight: 'Free bug fixes'
  }
];

const Benefits: React.FC = memo(() => {
  return (
    <BenefitsSection id="benefits">
      <Container>
        <SectionHeader>
          <SectionTitle>Why choose us</SectionTitle>
          <SectionSubtitle>
            We do things differently. Here's what sets us apart.
          </SectionSubtitle>
        </SectionHeader>

        <BenefitsGrid>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index}>
              <IconBox>
                <benefit.icon />
              </IconBox>
              <BenefitContent>
                <BenefitTitle>{benefit.title}</BenefitTitle>
                <BenefitDescription>{benefit.description}</BenefitDescription>
                <BenefitHighlight>{benefit.highlight}</BenefitHighlight>
              </BenefitContent>
            </BenefitCard>
          ))}
        </BenefitsGrid>
      </Container>
    </BenefitsSection>
  );
});

Benefits.displayName = 'Benefits';

export default Benefits;
