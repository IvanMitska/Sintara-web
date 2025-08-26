import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';

const MagneticContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const MagneticElement = styled.div`
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  will-change: transform;
`;

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  strength = 0.3, 
  className,
  onClick 
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const magneticRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const magnetic = magneticRef.current;
    
    if (!button || !magnetic) return;

    const handleMouseMove = (e: MouseEvent) => {
      const buttonRect = button.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;
      
      const deltaX = (e.clientX - buttonCenterX) * strength;
      const deltaY = (e.clientY - buttonCenterY) * strength;
      
      gsap.to(magnetic, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(magnetic, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <MagneticContainer ref={buttonRef} className={className} onClick={onClick}>
      <MagneticElement ref={magneticRef}>
        {children}
      </MagneticElement>
    </MagneticContainer>
  );
};

export default MagneticButton; 