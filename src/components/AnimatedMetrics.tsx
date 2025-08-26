import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { FaCode, FaRocket, FaCoffee, FaUsers } from 'react-icons/fa';

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 4rem 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const MetricCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(142, 45, 226, 0.1), rgba(74, 0, 224, 0.05));
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(142, 45, 226, 0.2);
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(142, 45, 226, 0.1),
      transparent
    );
    animation: shimmer 3s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
  
  &:hover {
    transform: translateY(-10px);
    border-color: rgba(142, 45, 226, 0.5);
    box-shadow: 0 20px 40px rgba(142, 45, 226, 0.3);
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8E2DE2, #4A00E0);
  border-radius: 50%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #8E2DE2, #4A00E0);
    filter: blur(20px);
    opacity: 0.5;
    z-index: -1;
  }
  
  svg {
    font-size: 2.5rem;
    color: white;
  }
`;

const MetricValue = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.5rem;
  font-family: 'Space Mono', monospace;
  position: relative;
  
  span {
    font-size: 1.5rem;
    color: #8E2DE2;
  }
`;

const MetricLabel = styled.div`
  font-size: 1.1rem;
  color: #a0a0a0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

interface MetricData {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  duration: number;
}

const AnimatedMetrics: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const metrics: MetricData[] = [
    {
      icon: <FaCode />,
      value: 500000,
      suffix: '+',
      label: 'Строк кода',
      duration: 2
    },
    {
      icon: <FaRocket />,
      value: 150,
      suffix: '+',
      label: 'Проектов запущено',
      duration: 2.5
    },
    {
      icon: <FaCoffee />,
      value: 9999,
      suffix: '+',
      label: 'Чашек кофе',
      duration: 3
    },
    {
      icon: <FaUsers />,
      value: 98,
      suffix: '%',
      label: 'Довольных клиентов',
      duration: 2.2
    }
  ];

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    }
  }, [isInView]);

  const AnimatedNumber = ({ value, duration, suffix }: { value: number; duration: number; suffix: string }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      if (!isVisible) return;
      
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;
      
      const updateValue = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(value * easeOutQuart);
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };
      
      requestAnimationFrame(updateValue);
    }, [isVisible, value, duration]);
    
    return (
      <>
        {displayValue.toLocaleString()}
        <span>{suffix}</span>
      </>
    );
  };

  return (
    <MetricsContainer ref={containerRef}>
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <IconWrapper>{metric.icon}</IconWrapper>
          <MetricValue>
            <AnimatedNumber 
              value={metric.value} 
              duration={metric.duration} 
              suffix={metric.suffix}
            />
          </MetricValue>
          <MetricLabel>{metric.label}</MetricLabel>
        </MetricCard>
      ))}
    </MetricsContainer>
  );
};

export default AnimatedMetrics;