import React, { useState, useEffect, memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlay, FaCode, FaEye, FaCopy, FaCheck, FaTerminal } from 'react-icons/fa';

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const LiveCodeSection = styled.section`
  padding: 100px 0;
  background: transparent;
  position: relative;
  overflow: hidden;
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
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const DemoContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const CodeEditor = styled(motion.div)`
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.8) 0%, rgba(10, 5, 20, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  position: relative;

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

const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const EditorTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const WindowDots = styled.div`
  display: flex;
  gap: 8px;
  margin-right: 16px;
`;

const Dot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

const EditorTab = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  color: #a78bfa;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  font-weight: 500;

  svg {
    font-size: 14px;
  }
`;

const EditorActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
    }
  ` : `
    background: rgba(255, 255, 255, 0.03);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(124, 58, 237, 0.1);
      border-color: rgba(124, 58, 237, 0.3);
      color: white;
    }
  `}

  svg {
    font-size: 14px;
  }
`;

const CodeContent = styled.div`
  padding: 24px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.7;
  height: 450px;
  overflow: hidden;
`;

const CodeLine = styled.div<{ $highlight?: boolean }>`
  display: flex;
  min-height: 24px;
  padding: 2px 0;
  margin: 0 -24px;
  padding-left: 24px;
  padding-right: 24px;
  background: ${props => props.$highlight ? 'rgba(124, 58, 237, 0.1)' : 'transparent'};
  border-left: ${props => props.$highlight ? '2px solid #7c3aed' : '2px solid transparent'};
  transition: all 0.2s ease;
`;

const LineNumber = styled.span`
  display: inline-block;
  width: 32px;
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.8rem;
  user-select: none;
  text-align: right;
  margin-right: 20px;
`;

const CodeText = styled.span`
  color: rgba(255, 255, 255, 0.8);
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 16px;
  background: #7c3aed;
  margin-left: 2px;
  animation: ${blink} 1s step-end infinite;
  vertical-align: middle;
`;

const PreviewContainer = styled(motion.div)`
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.8) 0%, rgba(10, 5, 20, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  position: relative;

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

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const PreviewTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  font-weight: 500;

  svg {
    color: #a78bfa;
  }
`;

const StatusBadge = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => props.$active
    ? 'rgba(34, 197, 94, 0.15)'
    : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$active
    ? '#22c55e'
    : 'rgba(255, 255, 255, 0.5)'};
  border: 1px solid ${props => props.$active
    ? 'rgba(34, 197, 94, 0.3)'
    : 'rgba(255, 255, 255, 0.1)'};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.$active ? '#22c55e' : 'rgba(255, 255, 255, 0.3)'};
    animation: ${props => props.$active ? pulse : 'none'} 2s ease-in-out infinite;
  }
`;

const PreviewContent = styled.div`
  padding: 40px;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
`;

const DemoCard = styled(motion.div)<{ $isActive: boolean }>`
  width: 100%;
  max-width: 300px;
  padding: 32px;
  background: ${props => props.$isActive
    ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
    : 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)'};
  border: 1px solid ${props => props.$isActive
    ? 'rgba(167, 139, 250, 0.5)'
    : 'rgba(124, 58, 237, 0.3)'};
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -100%;
    left: -100%;
    width: 300%;
    height: 300%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: rotate(45deg);
    transition: all 0.6s ease;
    opacity: 0;
  }

  &:hover::before {
    opacity: 1;
    top: -50%;
    left: -50%;
  }
`;

const DemoIcon = styled.div<{ $isActive: boolean }>`
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 16px;
  background: ${props => props.$isActive
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(124, 58, 237, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 28px;
    color: ${props => props.$isActive ? '#ffffff' : '#a78bfa'};
  }
`;

const DemoTitle = styled.h3<{ $isActive: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.$isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.9)'};
  margin: 0 0 8px;
`;

const DemoText = styled.p<{ $isActive: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9rem;
  color: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)'};
  margin: 0;
`;

const syntaxHighlight = (code: string) => {
  return code
    .replace(/(import|from|export|default|const|let|var|function|return|if|else)/g, '<span style="color: #c678dd">$1</span>')
    .replace(/('.*?'|".*?")/g, '<span style="color: #98c379">$1</span>')
    .replace(/(\{|\}|\(|\)|\[|\])/g, '<span style="color: #e5c07b">$1</span>')
    .replace(/(useState|useEffect)/g, '<span style="color: #61afef">$1</span>')
    .replace(/(&lt;.*?&gt;)/g, '<span style="color: #e06c75">$1</span>')
    .replace(/(\/\/.*)/g, '<span style="color: rgba(255,255,255,0.3)">$1</span>');
};

const codeExample = `import { useState } from 'react';
import { motion } from 'framer-motion';

const InteractiveCard = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      className="card"
      animate={{
        scale: isActive ? 1.05 : 1,
        boxShadow: isActive
          ? '0 20px 40px rgba(124,58,237,0.4)'
          : '0 10px 20px rgba(0,0,0,0.2)'
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setIsActive(!isActive)}
    >
      <h3>Interactive Component</h3>
      <p>Click to activate animation</p>
    </motion.div>
  );
};

export default InteractiveCard;`;

const LiveCodeDemo: React.FC = memo(() => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isCardActive, setIsCardActive] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= codeExample.length) {
        setDisplayedCode(codeExample.slice(0, i));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 25);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRun = () => {
    setIsCardActive(!isCardActive);
  };

  const renderCodeLines = () => {
    const lines = displayedCode.split('\n');
    return lines.map((line, index) => (
      <CodeLine key={index} $highlight={index >= 7 && index <= 16}>
        <LineNumber>{index + 1}</LineNumber>
        <CodeText dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) }} />
        {index === lines.length - 1 && isTyping && <Cursor />}
      </CodeLine>
    ));
  };

  return (
    <LiveCodeSection id="live-code">
      <Container>
        <SectionHeader>
          <Title
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Live code
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Watch code come to life in real-time. Interactive preview shows exactly what gets built.
          </Subtitle>
        </SectionHeader>

        <DemoContainer
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CodeEditor>
            <EditorHeader>
              <EditorTabs>
                <WindowDots>
                  <Dot $color="#ef4444" />
                  <Dot $color="#eab308" />
                  <Dot $color="#22c55e" />
                </WindowDots>
                <EditorTab>
                  <FaTerminal />
                  InteractiveCard.tsx
                </EditorTab>
              </EditorTabs>

              <EditorActions>
                <ActionButton onClick={handleCopy}>
                  {copied ? <FaCheck /> : <FaCopy />}
                  {copied ? 'Copied!' : 'Copy'}
                </ActionButton>
                <ActionButton $primary onClick={handleRun}>
                  <FaPlay />
                  Run
                </ActionButton>
              </EditorActions>
            </EditorHeader>

            <CodeContent>
              {renderCodeLines()}
            </CodeContent>
          </CodeEditor>

          <PreviewContainer>
            <PreviewHeader>
              <PreviewTitle>
                <FaEye />
                Preview
              </PreviewTitle>
              <StatusBadge $active={isCardActive}>
                {isCardActive ? 'Active' : 'Idle'}
              </StatusBadge>
            </PreviewHeader>

            <PreviewContent>
              <DemoCard
                $isActive={isCardActive}
                onClick={() => setIsCardActive(!isCardActive)}
                animate={{
                  scale: isCardActive ? 1.05 : 1,
                  boxShadow: isCardActive
                    ? '0 25px 50px rgba(124, 58, 237, 0.4)'
                    : '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}
                whileHover={{ scale: isCardActive ? 1.08 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <DemoIcon $isActive={isCardActive}>
                  <FaCode />
                </DemoIcon>
                <DemoTitle $isActive={isCardActive}>
                  Interactive Component
                </DemoTitle>
                <DemoText $isActive={isCardActive}>
                  Click to activate animation
                </DemoText>
              </DemoCard>
            </PreviewContent>
          </PreviewContainer>
        </DemoContainer>
      </Container>
    </LiveCodeSection>
  );
});

LiveCodeDemo.displayName = 'LiveCodeDemo';

export default LiveCodeDemo;
