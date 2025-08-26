import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TerminalContainer = styled(motion.div)`
  background: #0a0a0a;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(142, 45, 226, 0.2);
  max-width: 800px;
  margin: 2rem auto;
  font-family: 'Fira Code', 'Monaco', monospace;
`;

const TerminalHeader = styled.div`
  background: linear-gradient(90deg, #1a1a1a, #2a2a2a);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(142, 45, 226, 0.1);
`;

const TerminalButton = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const TerminalTitle = styled.div`
  flex: 1;
  text-align: center;
  color: #777;
  font-size: 0.85rem;
`;

const TerminalBody = styled.div`
  padding: 1.5rem;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  position: relative;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #8E2DE2;
    border-radius: 4px;
  }
`;

const CodeLine = styled(motion.div)<{ type?: string }>`
  margin: 0.5rem 0;
  color: ${props => {
    switch(props.type) {
      case 'comment': return '#6A9955';
      case 'keyword': return '#C586C0';
      case 'string': return '#CE9178';
      case 'function': return '#DCDCAA';
      case 'variable': return '#9CDCFE';
      case 'output': return '#00D9FF';
      case 'error': return '#F44747';
      default: return '#D4D4D4';
    }
  }};
  
  &::before {
    content: '${props => props.type === 'output' ? '>' : props.type === 'error' ? '✗' : '$'}';
    margin-right: 0.75rem;
    color: ${props => props.type === 'error' ? '#F44747' : '#8E2DE2'};
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 10px;
  height: 20px;
  background: #8E2DE2;
  animation: blink 1s infinite;
  vertical-align: text-bottom;
  
  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`;

interface CodeSnippet {
  text: string;
  type?: string;
  delay?: number;
}

const CodeTerminal: React.FC = () => {
  const [displayedLines, setDisplayedLines] = useState<CodeSnippet[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const codeSnippets: CodeSnippet[] = [
    { text: '// Инициализация AI-powered бота', type: 'comment', delay: 100 },
    { text: 'import { TelegramBot } from "@botframework/telegram"', type: 'keyword', delay: 50 },
    { text: 'import { OpenAI } from "openai"', type: 'keyword', delay: 50 },
    { text: '', delay: 300 },
    { text: 'const bot = new TelegramBot({', type: 'function', delay: 50 },
    { text: '  token: process.env.BOT_TOKEN,', type: 'variable', delay: 50 },
    { text: '  ai: new OpenAI({ apiKey: process.env.OPENAI_KEY })', type: 'variable', delay: 50 },
    { text: '})', delay: 50 },
    { text: '', delay: 300 },
    { text: 'bot.on("message", async (ctx) => {', type: 'function', delay: 50 },
    { text: '  const response = await bot.ai.complete(ctx.text)', type: 'variable', delay: 50 },
    { text: '  ctx.reply(response)', type: 'function', delay: 50 },
    { text: '})', delay: 50 },
    { text: '', delay: 300 },
    { text: 'bot.launch()', type: 'function', delay: 50 },
    { text: 'Bot started successfully! 🚀', type: 'output', delay: 1000 },
    { text: 'Listening on port 3000...', type: 'output', delay: 500 },
    { text: 'AI Model loaded: GPT-4', type: 'output', delay: 500 },
    { text: 'Connected to 1,245 users', type: 'output', delay: 500 },
  ];

  useEffect(() => {
    if (currentLineIndex < codeSnippets.length && isTyping) {
      const currentSnippet = codeSnippets[currentLineIndex];
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => [...prev, currentSnippet]);
        setCurrentLineIndex(prev => prev + 1);
        
        // Auto-scroll to bottom
        if (terminalBodyRef.current) {
          terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
      }, currentSnippet.delay || 100);

      return () => clearTimeout(timeout);
    } else if (currentLineIndex >= codeSnippets.length) {
      // Restart animation after a delay
      setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIndex(0);
      }, 3000);
    }
  }, [currentLineIndex, isTyping]);

  return (
    <TerminalContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TerminalHeader>
        <TerminalButton color="#FF5F56" />
        <TerminalButton color="#FFBD2E" />
        <TerminalButton color="#27C93F" />
        <TerminalTitle>terminal — node bot.js</TerminalTitle>
      </TerminalHeader>
      <TerminalBody ref={terminalBodyRef}>
        {displayedLines.map((line, index) => (
          <CodeLine
            key={index}
            type={line.type}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {line.text}
          </CodeLine>
        ))}
        {isTyping && currentLineIndex < codeSnippets.length && <Cursor />}
      </TerminalBody>
    </TerminalContainer>
  );
};

export default CodeTerminal;