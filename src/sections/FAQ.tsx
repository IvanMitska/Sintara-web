import React, { useState, memo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaArrowRight, FaQuestionCircle } from 'react-icons/fa';

const FAQSection = styled.section`
  padding: 100px 0;
  background: transparent;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled(motion.h2)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 20px;
`;

const Subtitle = styled(motion.p)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FAQContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled(motion.div)<{ $isOpen: boolean }>`
  background: ${props => props.$isOpen
    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(20, 10, 40, 0.9) 100%)'
    : 'linear-gradient(135deg, rgba(20, 10, 40, 0.6) 0%, rgba(10, 5, 20, 0.8) 100%)'};
  border: 1px solid ${props => props.$isOpen
    ? 'rgba(124, 58, 237, 0.3)'
    : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(124, 58, 237, 0.3);
    background: ${props => props.$isOpen
      ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(20, 10, 40, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(20, 10, 40, 0.8) 100%)'};
  }
`;

const FAQQuestion = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 24px 28px;
  background: transparent;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  text-align: left;
`;

const QuestionText = styled.span<{ $isOpen: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.$isOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.9)'};
  line-height: 1.4;
  transition: color 0.3s ease;

  ${FAQQuestion}:hover & {
    color: #ffffff;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const IconWrapper = styled.div<{ $isOpen: boolean }>`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${props => props.$isOpen
    ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$isOpen
    ? 'transparent'
    : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  svg {
    font-size: 14px;
    color: ${props => props.$isOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'};
    transition: color 0.3s ease;
  }

  ${FAQQuestion}:hover & {
    background: ${props => props.$isOpen
      ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
      : 'rgba(124, 58, 237, 0.2)'};
    border-color: ${props => props.$isOpen ? 'transparent' : 'rgba(124, 58, 237, 0.3)'};

    svg {
      color: ${props => props.$isOpen ? '#ffffff' : '#a78bfa'};
    }
  }
`;

const FAQAnswer = styled(motion.div)`
  overflow: hidden;
`;

const AnswerContent = styled.div`
  padding: 0 28px 24px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const CTAContainer = styled(motion.div)`
  margin-top: 60px;
  padding: 40px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(20, 10, 40, 0.8) 100%);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 32px 24px;
  }
`;

const CTAContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CTAIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    font-size: 24px;
    color: #a78bfa;
  }
`;

const CTAText = styled.div``;

const CTATitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 6px;
`;

const CTADescription = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  line-height: 1.5;
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
  white-space: nowrap;

  svg {
    font-size: 14px;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);

    svg {
      transform: translateX(4px);
    }
  }
`;

const faqItems = [
  {
    question: 'How long does it take to develop a website?',
    answer: 'Development timelines depend on the complexity and scope of the project. A simple landing page can be ready in 1-2 weeks, while an e-commerce store takes 3-6 weeks. After reviewing your requirements, we\'ll provide accurate estimates.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We work with 50% upfront payment and milestone-based payments for larger projects. We accept bank transfers for businesses, as well as card payments and electronic transfers for individuals.'
  },
  {
    question: 'Can you improve an existing website?',
    answer: 'Yes, we handle website improvements and modernization. After analyzing your current project, we\'ll suggest optimal solutions for improving functionality, design, or performance.'
  },
  {
    question: 'How does the Telegram bot development process work?',
    answer: 'The process includes: requirements analysis, bot structure design, functionality development, integration with necessary systems, admin panel creation (if required), testing, and launch. We keep you updated on progress throughout.'
  },
  {
    question: 'Do you provide technical support after launch?',
    answer: 'Yes, we offer technical support after project launch. You can choose a support package that includes site monitoring, bug fixes, content updates, and consultations.'
  },
  {
    question: 'Do you handle SEO optimization?',
    answer: 'Yes, we include basic SEO optimization during development. This covers proper structure, meta tags, semantic markup, and speed optimization. We also offer comprehensive SEO promotion services separately.'
  }
];

const FAQ: React.FC = memo(() => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <FAQSection id="faq">
      <Container>
        <SectionHeader>
          <Title
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            FAQ
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Answers to common questions about our services and process
          </Subtitle>
        </SectionHeader>

        <FAQContainer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              $isOpen={openIndex === index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <FAQQuestion
                $isOpen={openIndex === index}
                onClick={() => toggleQuestion(index)}
              >
                <QuestionText $isOpen={openIndex === index}>
                  {item.question}
                </QuestionText>
                <IconWrapper $isOpen={openIndex === index}>
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </IconWrapper>
              </FAQQuestion>

              <AnimatePresence>
                {openIndex === index && (
                  <FAQAnswer
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <AnswerContent>
                      {item.answer}
                    </AnswerContent>
                  </FAQAnswer>
                )}
              </AnimatePresence>
            </FAQItem>
          ))}
        </FAQContainer>

        <CTAContainer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CTAContent>
            <CTAIcon>
              <FaQuestionCircle />
            </CTAIcon>
            <CTAText>
              <CTATitle>Still have questions?</CTATitle>
              <CTADescription>
                Get in touch for a free consultation
              </CTADescription>
            </CTAText>
          </CTAContent>
          <CTAButton href="#contact">
            Contact us <FaArrowRight />
          </CTAButton>
        </CTAContainer>
      </Container>
    </FAQSection>
  );
});

FAQ.displayName = 'FAQ';

export default FAQ;
