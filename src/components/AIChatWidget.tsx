import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const ChatButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8E2DE2, #4A00E0);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  box-shadow: 0 10px 30px rgba(142, 45, 226, 0.4);
  animation: ${pulse} 2s infinite;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 15px 40px rgba(142, 45, 226, 0.5);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #8E2DE2, #4A00E0);
    filter: blur(15px);
    opacity: 0.5;
    z-index: -1;
  }
`;

const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  width: 380px;
  height: 500px;
  background: #0a0a0a;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(142, 45, 226, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 998;
  overflow: hidden;
  
  @media (max-width: 480px) {
    width: calc(100vw - 2rem);
    right: 1rem;
    bottom: 5rem;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #8E2DE2, #4A00E0);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
`;

const ChatTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: white;
  }
  
  span {
    font-size: 0.85rem;
    opacity: 0.9;
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00FF88;
  animation: ${pulse} 1.5s infinite;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: rotate(90deg);
  }
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #8E2DE2;
    border-radius: 3px;
  }
`;

const Message = styled(motion.div)<{ isBot: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex-direction: ${props => props.isBot ? 'row' : 'row-reverse'};
`;

const MessageAvatar = styled.div<{ isBot: boolean }>`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${props => props.isBot ? 'linear-gradient(135deg, #8E2DE2, #4A00E0)' : '#2a2a2a'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const MessageContent = styled.div<{ isBot: boolean }>`
  background: ${props => props.isBot ? 'rgba(142, 45, 226, 0.1)' : '#1a1a1a'};
  border: 1px solid ${props => props.isBot ? 'rgba(142, 45, 226, 0.3)' : '#2a2a2a'};
  border-radius: ${props => props.isBot ? '0 15px 15px 15px' : '15px 0 15px 15px'};
  padding: 0.75rem 1rem;
  max-width: 70%;
  color: #e0e0e0;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 0.3rem;
  padding: 0.75rem 1rem;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #8E2DE2;
    animation: typing 1.5s infinite;
    
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
  
  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-10px); }
  }
`;

const ChatInput = styled.div`
  padding: 1rem;
  background: #0a0a0a;
  border-top: 1px solid rgba(142, 45, 226, 0.2);
  display: flex;
  gap: 0.75rem;
`;

const Input = styled.input`
  flex: 1;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 25px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: #8E2DE2;
  }
  
  &::placeholder {
    color: #666;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8E2DE2, #4A00E0);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
}

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: 'Привет! Я AI-ассистент. Чем могу помочь? 🚀', isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const botResponses = [
    'Я могу помочь вам с созданием современного сайта или Telegram-бота!',
    'Наши технологии включают React, Node.js, TypeScript и AI интеграции.',
    'Мы создаем решения, которые помогают бизнесу расти в digital-среде.',
    'Хотите узнать больше о наших услугах? Я расскажу подробнее!',
    'Мы используем передовые технологии для создания быстрых и масштабируемых решений.',
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: messages.length + 2,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        isBot: true
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatContainer
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ChatHeader>
              <ChatTitle>
                <FaRobot />
                <div>
                  <h3>AI Assistant</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StatusDot />
                    <span>Online</span>
                  </div>
                </div>
              </ChatTitle>
              <CloseButton onClick={() => setIsOpen(false)}>
                <FaTimes />
              </CloseButton>
            </ChatHeader>
            
            <ChatBody ref={chatBodyRef}>
              {messages.map(message => (
                <Message
                  key={message.id}
                  isBot={message.isBot}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageAvatar isBot={message.isBot}>
                    {message.isBot ? <FaRobot /> : 'U'}
                  </MessageAvatar>
                  <MessageContent isBot={message.isBot}>
                    {message.text}
                  </MessageContent>
                </Message>
              ))}
              {isTyping && (
                <Message isBot={true}>
                  <MessageAvatar isBot={true}>
                    <FaRobot />
                  </MessageAvatar>
                  <TypingIndicator>
                    <span />
                    <span />
                    <span />
                  </TypingIndicator>
                </Message>
              )}
            </ChatBody>
            
            <ChatInput>
              <Input
                type="text"
                placeholder="Напишите сообщение..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <SendButton onClick={handleSend}>
                <FaPaperPlane />
              </SendButton>
            </ChatInput>
          </ChatContainer>
        )}
      </AnimatePresence>
      
      <ChatButton
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </ChatButton>
    </>
  );
};

export default AIChatWidget;