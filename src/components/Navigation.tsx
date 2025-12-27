import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(124, 58, 237, 0.3), 0 0 10px rgba(124, 58, 237, 0.2);
  }
  50% {
    box-shadow: 0 0 10px rgba(124, 58, 237, 0.5), 0 0 20px rgba(124, 58, 237, 0.3);
  }
`;

const NavContainer = styled.nav<{ $isScrolled: boolean }>`
  position: fixed;
  top: ${props => props.$isScrolled ? '12px' : '20px'};
  left: 0;
  right: 0;
  margin: 0 auto;
  width: ${props => props.$isScrolled ? '95%' : '90%'};
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.$isScrolled ? '12px 24px' : '16px 32px'};
  z-index: 1000;
  background: ${props => props.$isScrolled
    ? 'rgba(10, 5, 25, 0.9)'
    : 'rgba(10, 5, 25, 0.7)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.$isScrolled ? '20px' : '24px'};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: top 0.3s ease, width 0.3s ease, padding 0.3s ease, background 0.3s ease, border-radius 0.3s ease;

  @media (max-width: 768px) {
    width: calc(100% - 24px);
    padding: 12px 16px;
    top: 12px;
  }
`;

const Logo = styled.a`
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  font-weight: 600;
  font-size: 1.375rem;
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  letter-spacing: -0.02em;
  position: relative;
  z-index: 2;

  span {
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &::after {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    background: #7c3aed;
    border-radius: 50%;
    margin-left: 4px;
    animation: liquidPulse 3s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(124, 58, 237, 0.6);
  }

  @keyframes liquidPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.7; }
  }
`;

const NavLinks = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 90px;
    left: 12px;
    right: 12px;
    width: auto;
    background: linear-gradient(145deg, rgba(15, 10, 35, 0.98), rgba(10, 5, 25, 0.98));
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 24px;
    padding: 28px 24px;
    gap: 0;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(124, 58, 237, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    z-index: 999;

    opacity: ${props => props.$isOpen ? 1 : 0};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transform: ${props => props.$isOpen ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)'};
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const NavLink = styled.a<{ $index?: number; $isOpen?: boolean }>`
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  font-weight: 400;
  font-size: 0.9375rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  transition: color 0.2s ease;
  letter-spacing: -0.01em;
  padding: 8px 16px;

  &:hover {
    color: white;
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
    font-weight: 500;
    padding: 16px 20px;
    width: 100%;
    text-align: center;
    border-radius: 16px;
    position: relative;
    overflow: hidden;

    opacity: ${props => props.$isOpen ? 1 : 0};
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-20px)'};
    transition:
      color 0.2s ease,
      background 0.3s ease,
      opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: ${props => props.$isOpen ? `${(props.$index || 0) * 0.05 + 0.1}s` : '0s'};

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.05));
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 16px;
    }

    &:hover {
      color: white;

      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

const MenuDivider = styled.div<{ $isOpen?: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: block;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.3), transparent);
    margin: 8px 20px;
    opacity: ${props => props.$isOpen ? 1 : 0};
    transform: ${props => props.$isOpen ? 'scaleX(1)' : 'scaleX(0)'};
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: ${props => props.$isOpen ? '0.3s' : '0s'};
  }
`;

const CTAButton = styled.a<{ $isOpen?: boolean }>`
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  letter-spacing: -0.01em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  border: none;
  z-index: 2;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
    color: white;
  }

  @media (max-width: 768px) {
    margin-top: 12px;
    width: 100%;
    text-align: center;
    padding: 16px 20px;
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: 16px;
    box-shadow:
      0 4px 20px rgba(124, 58, 237, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);

    opacity: ${props => props.$isOpen ? 1 : 0};
    transform: ${props => props.$isOpen ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)'};
    transition:
      opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.2s ease;
    transition-delay: ${props => props.$isOpen ? '0.35s' : '0s'};

    &:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow:
        0 8px 30px rgba(124, 58, 237, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    opacity: ${props => props.$isOpen ? 1 : 0};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: opacity 0.4s ease, visibility 0.4s ease;
    z-index: 998;
  }
`;

const MobileMenuButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  background: ${props => props.$isOpen
    ? 'rgba(124, 58, 237, 0.3)'
    : 'rgba(124, 58, 237, 0.15)'};
  border: 1px solid ${props => props.$isOpen
    ? 'rgba(124, 58, 237, 0.4)'
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  width: 44px;
  height: 44px;
  z-index: 1001;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  ${props => props.$isOpen && css`
    animation: ${glowPulse} 2s ease-in-out infinite;
  `}

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background: rgba(124, 58, 237, 0.25);
    border-color: rgba(124, 58, 237, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  span {
    position: absolute;
    left: 50%;
    width: 18px;
    height: 2px;
    background: ${props => props.$isOpen ? '#a78bfa' : 'white'};
    border-radius: 2px;
    transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
    box-shadow: ${props => props.$isOpen ? '0 0 8px rgba(167, 139, 250, 0.5)' : 'none'};

    &:nth-child(1) {
      transform: ${props => props.$isOpen
        ? 'translateX(-50%) rotate(45deg)'
        : 'translateX(-50%) rotate(0)'};
      top: ${props => props.$isOpen ? '21px' : '14px'};
      width: ${props => props.$isOpen ? '20px' : '18px'};
    }

    &:nth-child(2) {
      opacity: ${props => props.$isOpen ? '0' : '1'};
      transform: ${props => props.$isOpen
        ? 'translateX(-50%) scaleX(0)'
        : 'translateX(-50%) scaleX(1)'};
      top: 21px;
    }

    &:nth-child(3) {
      transform: ${props => props.$isOpen
        ? 'translateX(-50%) rotate(-45deg)'
        : 'translateX(-50%) rotate(0)'};
      top: ${props => props.$isOpen ? '21px' : '28px'};
      width: ${props => props.$isOpen ? '20px' : '18px'};
    }
  }
`;

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <MobileOverlay $isOpen={isOpen} onClick={closeMenu} />
      <NavContainer $isScrolled={isScrolled}>
        <Logo href="#hero" onClick={closeMenu}>
          Sintara
        </Logo>

        <NavLinks $isOpen={isOpen}>
          <NavLink href="#about" onClick={closeMenu} $index={0} $isOpen={isOpen}>About</NavLink>
          <NavLink href="#services" onClick={closeMenu} $index={1} $isOpen={isOpen}>Our cases</NavLink>
          <NavLink href="#pricing" onClick={closeMenu} $index={2} $isOpen={isOpen}>Services</NavLink>
          <NavLink href="#portfolio" onClick={closeMenu} $index={3} $isOpen={isOpen}>Prices</NavLink>
          <MenuDivider $isOpen={isOpen} />
          <CTAButton href="#contact" onClick={closeMenu} $isOpen={isOpen}>
            Hire us
          </CTAButton>
        </NavLinks>

        <MobileMenuButton
          $isOpen={isOpen}
          onClick={toggleMenu}
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </MobileMenuButton>
      </NavContainer>
    </>
  );
};

export default Navigation;
