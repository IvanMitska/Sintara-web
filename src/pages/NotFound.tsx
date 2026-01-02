import React, { useState, useEffect, memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FaHome, FaRedo, FaTerminal } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const glitch = keyframes`
  0%, 100% {
    text-shadow:
      -2px 0 #7c3aed,
      2px 0 #06b6d4;
  }
  25% {
    text-shadow:
      2px 0 #7c3aed,
      -2px 0 #06b6d4;
  }
  50% {
    text-shadow:
      -2px -2px #7c3aed,
      2px 2px #06b6d4;
  }
  75% {
    text-shadow:
      2px -2px #7c3aed,
      -2px 2px #06b6d4;
  }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #050208 0%, #0a0512 50%, #050208 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 30%, rgba(124, 58, 237, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 40%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(124, 58, 237, 0.5);
    animation: ${scanline} 4s linear infinite;
    pointer-events: none;
    opacity: 0.3;
  }
`;

const Content = styled(motion.div)`
  text-align: center;
  position: relative;
  z-index: 2;
  max-width: 700px;
`;

const ErrorCode = styled(motion.h1)`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: clamp(8rem, 25vw, 14rem);
  font-weight: 900;
  color: transparent;
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  line-height: 1;
  margin: 0;
  animation: ${glitch} 2s infinite;
  position: relative;

  &::before,
  &::after {
    content: '404';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #06b6d4 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  &::before {
    animation: ${glitch} 3s infinite reverse;
    clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  }

  &::after {
    animation: ${glitch} 2s infinite;
    clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  }
`;

const Terminal = styled(motion.div)`
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.9) 0%, rgba(10, 5, 20, 0.95) 100%);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 16px;
  padding: 24px;
  margin: 40px auto;
  max-width: 500px;
  text-align: left;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.5), transparent);
  }
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TerminalDot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

const TerminalTitle = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    font-size: 12px;
  }
`;

const TerminalLine = styled.div<{ $delay?: number }>`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 8px;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
  animation-delay: ${props => props.$delay || 0}s;

  @keyframes fadeIn {
    to { opacity: 1; }
  }
`;

const TerminalPrompt = styled.span`
  color: #7c3aed;
  margin-right: 8px;
`;

const TerminalError = styled.span`
  color: #ef4444;
`;

const TerminalSuccess = styled.span`
  color: #22c55e;
`;

const TerminalPath = styled.span`
  color: #06b6d4;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 10px;
  height: 18px;
  background: #7c3aed;
  margin-left: 4px;
  animation: ${blink} 1s step-end infinite;
  vertical-align: middle;
`;

const Message = styled(motion.p)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 24px 0;
  line-height: 1.6;
`;

const ButtonsContainer = styled(motion.div)`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 32px;
`;

const Button = styled(motion.a)<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
    }
  ` : `
    background: rgba(255, 255, 255, 0.03);
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(124, 58, 237, 0.1);
      border-color: rgba(124, 58, 237, 0.3);
      transform: translateY(-2px);
      color: white;
    }
  `}

  svg {
    font-size: 16px;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
`;

const FloatingCode = styled.div<{ $top: string; $left: string; $delay: number }>`
  position: absolute;
  top: ${props => props.$top};
  left: ${props => props.$left};
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: rgba(124, 58, 237, 0.15);
  animation: ${float} ${props => 3 + props.$delay}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NotFound: React.FC = memo(() => {
  const [typedText, setTypedText] = useState('');
  const { t } = useLanguage();
  const fullText = 'searching_for_page...';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const codeSnippets = [
    '{ status: 404 }',
    'throw new Error()',
    'page !== found',
    'return null;',
    '// TODO: fix',
    'catch (err) {}',
    'undefined',
    'NaN',
    '!exist',
    'void 0',
  ];

  return (
    <PageContainer>
      <FloatingElements>
        {codeSnippets.map((code, i) => (
          <FloatingCode
            key={i}
            $top={`${10 + (i * 9)}%`}
            $left={i % 2 === 0 ? `${5 + (i * 3)}%` : `${70 + (i * 2)}%`}
            $delay={i * 0.5}
          >
            {code}
          </FloatingCode>
        ))}
      </FloatingElements>

      <Content
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ErrorCode
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          404
        </ErrorCode>

        <Terminal
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TerminalHeader>
            <TerminalDot $color="#ef4444" />
            <TerminalDot $color="#eab308" />
            <TerminalDot $color="#22c55e" />
            <TerminalTitle>
              <FaTerminal /> terminal
            </TerminalTitle>
          </TerminalHeader>

          <TerminalLine $delay={0.5}>
            <TerminalPrompt>$</TerminalPrompt>
            cd <TerminalPath>/pages/{typedText}</TerminalPath>
            <Cursor />
          </TerminalLine>

          <TerminalLine $delay={1.2}>
            <TerminalError>Error: ENOENT: page not found</TerminalError>
          </TerminalLine>

          <TerminalLine $delay={1.8}>
            <TerminalPrompt>$</TerminalPrompt>
            git status
          </TerminalLine>

          <TerminalLine $delay={2.2}>
            <TerminalSuccess>suggestion:</TerminalSuccess> return to homepage
          </TerminalLine>
        </Terminal>

        <Message
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {t('notFound.message')}
          <br />
          {t('notFound.submessage')}
        </Message>

        <ButtonsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Button href="/" $primary>
            <FaHome /> {t('notFound.home')}
          </Button>
          <Button onClick={() => window.history.back()}>
            <FaRedo /> {t('notFound.back')}
          </Button>
        </ButtonsContainer>
      </Content>
    </PageContainer>
  );
});

NotFound.displayName = 'NotFound';

export default NotFound;
