import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaPlay, FaCode, FaEye, FaCopy, FaCheck } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

// Анимации
const typewriter = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blink = keyframes`
  from, to { border-color: transparent }
  50% { border-color: var(--color-primary) }
`;

const LiveCodeSection = styled.section`
  padding: 8rem 0;
  background: var(--gradient-background), #000;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(215, 109, 119, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(58, 28, 113, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 6rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  margin-bottom: 1.5rem;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
`;

const SectionDescription = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
  max-width: 700px;
  margin: 0 auto;
  color: #a0a0a0;
  line-height: 1.6;
`;

const DemoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CodeEditor = styled.div`
  background: #0d1117;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #30363d;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #ff5f56, #ffbd2e, #27ca3f);
  }
`;

const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #161b22;
  border-bottom: 1px solid #30363d;
`;

const EditorTabs = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditorTab = styled.div<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? 'var(--gradient-subtle)' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#7d8590'};
  border-radius: 5px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #fff;
    background: var(--gradient-subtle);
  }
`;

const EditorActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ActionButton = styled.button`
  background: transparent;
  border: 1px solid #30363d;
  color: #7d8590;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    border-color: var(--color-primary);
    background: var(--gradient-subtle);
    transform: translateY(-1px);
    filter: brightness(1.2);
  }

  &.primary {
    background: var(--gradient-button);
    color: white !important;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    span {
      color: white !important;

      svg {
        color: white !important;
      }
    }

    &:hover {
      color: white !important;
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      filter: brightness(1.1);
    }
  }
`;

const CodeContent = styled.div`
  padding: 1.5rem;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #e6edf3;
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #0d1117;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #30363d;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #484f58;
  }
`;

const CodeLine = styled.div<{ highlight?: boolean }>`
  display: flex;
  align-items: center;
  min-height: 1.5rem;
  padding: 0.1rem 0;
  background: ${props => props.highlight ? 'var(--gradient-subtle)' : 'transparent'};
  margin: 0 -1.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-left: ${props => props.highlight ? '3px solid var(--color-primary)' : '3px solid transparent'};
  transition: all 0.3s ease;
`;

const LineNumber = styled.span`
  display: inline-block;
  width: 2rem;
  color: #6e7681;
  font-size: 0.8rem;
  user-select: none;
  margin-right: 1rem;
`;

const TypedText = styled.span<{ $isTyping?: boolean }>`
  ${props => props.$isTyping && css`
    border-right: 2px solid var(--color-primary);
    animation: ${blink} 1s infinite;
  `}
`;

const PreviewContainer = styled.div`
  background: #111;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #333;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
`;

const PreviewTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-weight: 600;
`;

const PreviewContent = styled.div`
  padding: 2rem;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #111 0%, #222 100%);
  overflow: hidden;
`;

// Демо компонент для предварительного просмотра
const AnimatedCard = styled.div<{ $isActive?: boolean }>`
  width: 100%;
  max-width: 320px;
  height: 200px;
  background: var(--gradient-primary);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.$isActive ? 'scale(1.05) rotateY(5deg)' : 'scale(1)'};
  box-shadow: ${props => props.$isActive ? 
    '0 20px 40px rgba(215, 109, 119, 0.4)' : 
    '0 10px 20px rgba(0, 0, 0, 0.3)'
  };
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    transition: all 0.6s;
    opacity: ${props => props.$isActive ? 1 : 0};
  }
  
  &:hover {
    transform: scale(1.05) rotateY(10deg);
    box-shadow: 0 25px 50px rgba(215, 109, 119, 0.5);
  }
`;

const codeExamples = {
  react: `import React, { useState } from 'react';
import styled from 'styled-components';

const AnimatedCard = styled.div\`
  background: var(--gradient-primary);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.05) rotateY(10deg);
    box-shadow: 0 25px 50px rgba(215, 109, 119, 0.5);
  }
\`;

const InteractiveDemo = () => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <AnimatedCard 
      onClick={() => setIsActive(!isActive)}
      className={isActive ? 'active' : ''}
    >
      Кликни меня!
    </AnimatedCard>
  );
};

export default InteractiveDemo;`,
  
  css: `.animated-card {
  background: var(--gradient-primary);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.animated-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg, 
    transparent, 
    rgba(255, 255, 255, 0.1), 
    transparent
  );
  transform: rotate(45deg);
  transition: all 0.6s;
  opacity: 0;
}

.animated-card:hover {
  transform: scale(1.05) rotateY(10deg);
  box-shadow: 0 25px 50px rgba(142, 45, 226, 0.5);
}

.animated-card:hover::before {
  opacity: 1;
}`,
  
  js: `// Интерактивная анимация с GSAP
import { gsap } from 'gsap';

class InteractiveCard {
  constructor(element) {
    this.element = element;
    this.isActive = false;
    this.init();
  }
  
  init() {
    // Устанавливаем начальное состояние
    gsap.set(this.element, {
      scale: 1,
      rotationY: 0,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)'
    });
    
    // Добавляем обработчики событий
    this.element.addEventListener('click', () => this.toggle());
    this.element.addEventListener('mouseenter', () => this.onHover());
    this.element.addEventListener('mouseleave', () => this.onLeave());
  }
  
  toggle() {
    this.isActive = !this.isActive;
    
    gsap.to(this.element, {
      scale: this.isActive ? 1.1 : 1,
      rotationY: this.isActive ? 15 : 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  }
  
  onHover() {
    gsap.to(this.element, {
      scale: 1.05,
      rotationY: 5,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
  
  onLeave() {
    if (!this.isActive) {
      gsap.to(this.element, {
        scale: 1,
        rotationY: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }
}

// Инициализация
document.querySelectorAll('.interactive-card')
  .forEach(card => new InteractiveCard(card));`
};

const LiveCodeDemo: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [displayedCode, setDisplayedCode] = useState('');
  const [isCardActive, setIsCardActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  const mainCode = codeExamples.react;

  const typeCode = async (code: string) => {
    setIsTyping(true);
    setDisplayedCode('');
    
    for (let i = 0; i <= code.length; i++) {
      setDisplayedCode(code.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    
    setIsTyping(false);
  };

  useEffect(() => {
    typeCode(mainCode);
  }, []);

  const handleRunCode = () => {
    setIsCardActive(!isCardActive);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(mainCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const renderCodeLines = () => {
    const lines = displayedCode.split('\n');
    return lines.map((line, index) => (
      <CodeLine key={index}>
        <LineNumber>{index + 1}</LineNumber>
        <span>
          {line}
          {index === lines.length - 1 && isTyping && <TypedText $isTyping />}
        </span>
      </CodeLine>
    ));
  };

  return (
    <LiveCodeSection id="live-code" ref={sectionRef}>
      <Container>
        <SectionHeader>
          <SectionTitle>Живой код в действии</SectionTitle>
          <SectionDescription>
            Посмотрите, как создаются интерактивные элементы. Код печатается в реальном времени, а результат отображается справа.
          </SectionDescription>
        </SectionHeader>

        <DemoContainer>
          <CodeEditor>
            <EditorHeader>
              <EditorTabs>
                <EditorTab active={true}>
                  <FaCode />
                  InteractiveCard.tsx
                </EditorTab>
              </EditorTabs>
              
              <EditorActions>
                <ActionButton onClick={handleCopyCode}>
                  {copied ? <FaCheck /> : <FaCopy />}
                  {copied ? 'Скопировано!' : 'Копировать'}
                </ActionButton>
                <ActionButton className="primary" onClick={handleRunCode}>
                  <FaPlay />
                  Запустить
                </ActionButton>
              </EditorActions>
            </EditorHeader>
            
            <CodeContent ref={codeRef}>
              {renderCodeLines()}
            </CodeContent>
          </CodeEditor>

          <PreviewContainer>
            <PreviewHeader>
              <PreviewTitle>
                <FaEye />
                Предварительный просмотр
              </PreviewTitle>
            </PreviewHeader>
            
            <PreviewContent>
              <AnimatedCard 
                $isActive={isCardActive}
                onClick={() => setIsCardActive(!isCardActive)}
              >
                Кликни меня!
              </AnimatedCard>
            </PreviewContent>
          </PreviewContainer>
        </DemoContainer>
      </Container>
    </LiveCodeSection>
  );
};

export default LiveCodeDemo; 