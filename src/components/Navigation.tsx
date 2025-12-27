import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav<{ $isScrolled: boolean }>`
  position: fixed;
  top: ${props => props.$isScrolled ? '12px' : '20px'};
  left: 50%;
  transform: translateX(-50%);
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
    padding: 12px 20px;
    left: 50%;
    transform: translateX(-50%);
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
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: fixed;
    top: 70px;
    left: 12px;
    right: 12px;
    width: auto;
    background: rgba(10, 5, 25, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 24px;
    gap: 1rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const NavLink = styled.a`
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
    font-size: 1rem;
    padding: 12px 16px;
    width: 100%;
    text-align: center;
  }
`;

const CTAButton = styled.a`
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
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
    width: 100%;
    text-align: center;
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
    background: rgba(0, 0, 0, 0.5);
    opacity: ${props => props.$isOpen ? 1 : 0};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 998;
  }
`;

const MobileMenuButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  background: rgba(124, 58, 237, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  width: 36px;
  height: 36px;
  z-index: 1001;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    position: absolute;
    left: 50%;
    width: 16px;
    height: 2px;
    background: white;
    border-radius: 2px;
    transition: all 0.3s ease;

    &:nth-child(1) {
      transform: ${props => props.$isOpen
        ? 'translateX(-50%) translateY(7px) rotate(45deg)'
        : 'translateX(-50%) translateY(0) rotate(0)'};
      top: 10px;
    }

    &:nth-child(2) {
      opacity: ${props => props.$isOpen ? '0' : '1'};
      transform: translateX(-50%);
      top: 17px;
    }

    &:nth-child(3) {
      transform: ${props => props.$isOpen
        ? 'translateX(-50%) translateY(-7px) rotate(-45deg)'
        : 'translateX(-50%) translateY(0) rotate(0)'};
      top: 24px;
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
        <NavLink href="#about" onClick={closeMenu}>About</NavLink>
        <NavLink href="#services" onClick={closeMenu}>Our cases</NavLink>
        <NavLink href="#pricing" onClick={closeMenu}>Services</NavLink>
        <NavLink href="#portfolio" onClick={closeMenu}>Prices</NavLink>
        <CTAButton href="#contact" onClick={closeMenu}>
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