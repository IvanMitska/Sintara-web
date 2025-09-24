import React, { useState, useEffect } from 'react';
import styled from 'styled-components';


const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem clamp(1.5rem, 5vw, 4rem);
  z-index: var(--z-fixed);
  background: var(--color-surface);
  box-sizing: border-box;
  box-shadow: 0 1px 0 rgba(4,4,5,0.2), 0 1.5px 0 rgba(6,6,7,0.05), 0 2px 0 rgba(4,4,5,0.05);
  transition: all var(--transition-normal);

  /* Уменьшаем размер при скролле */
  &.scrolled {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    background: var(--color-surface);
  }

  @media (max-width: 768px) {
    justify-content: space-between;
    padding: 1rem 1.5rem;
  }
`;

// Логотип для навигации
const Logo = styled.a`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-text);
  margin-right: auto;
  text-decoration: none;
  display: flex;
  align-items: center;
  position: relative;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  span {
    color: var(--color-text);
    -webkit-text-fill-color: var(--color-text);
    transition: color var(--transition-normal);
  }
  
  &:hover {
    span {
      color: #D76D77;
      -webkit-text-fill-color: #D76D77;
    }
  }
  
  /* Анимированная точка после логотипа */
  &::after {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #D76D77;
    border-radius: 50%;
    margin-left: 5px;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

// Контейнер для навигационных ссылок
const NavLinks = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--gradient-background), rgba(0, 0, 0, 0.95);
    padding: 1rem 0;
    border-top: 1px solid rgba(215, 109, 119, 0.2);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
    gap: 0.5rem;
  }
`;

// Улучшенная навигационная ссылка с индикатором активности и эффектами
const NavLink = styled.a<{ $active: boolean }>`
  color: ${props => props.$active ? 'var(--color-text)' : 'var(--color-text-secondary)'};
  text-decoration: none;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.6rem 1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal);
  border-radius: var(--radius-sm);

  /* Технологичный эффект подсветки */
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.$active ? 'var(--gradient-primary)' : 'transparent'};
    transform: ${props => props.$active ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform var(--transition-normal), background var(--transition-normal);
  }

  &:hover {
    color: var(--color-text);
    background: var(--gradient-subtle);
    
    &::before {
      transform: translateX(0);
      background: ${props => props.$active ? 'var(--gradient-primary)' : 'var(--gradient-secondary)'};
    }
  }

  @media (max-width: 768px) {
    padding: 0.8rem 0.75rem;
    font-size: 1.1rem;
    width: 100%;
    text-align: center;
    font-weight: 600;
  }
`;

// Кнопка с фиолетовым градиентом
const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-button);
  color: white !important;
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

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

  &:active {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 0.5rem;
    width: calc(100% - 3rem);
    align-self: center;
  }
`;

// Кнопка гамбургера
const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.5rem;
  cursor: pointer;
  z-index: var(--z-modal);

  @media (max-width: 768px) {
    display: block;
  }
`;

// Стили для иконки гамбургера
const HamburgerIcon = styled.div<{ $isOpen: boolean }>`
  width: 28px;
  height: 20px;
  position: relative;
  transform: rotate(0deg);
  transition: .5s ease-in-out;
  cursor: pointer;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: var(--color-text);
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
  }

  span:nth-child(1) {
    top: ${props => props.$isOpen ? '8.5px' : '0px'};
    transform: ${props => props.$isOpen ? 'rotate(45deg)' : 'rotate(0deg)'};
  }

  span:nth-child(2) {
    top: 8.5px;
    opacity: ${props => props.$isOpen ? '0' : '1'};
    transform: ${props => props.$isOpen ? 'translateX(-100%)' : 'translateX(0)'};
  }

  span:nth-child(3) {
    top: ${props => props.$isOpen ? '8.5px' : '17px'};
    transform: ${props => props.$isOpen ? 'rotate(-45deg)' : 'rotate(0deg)'};
  }
`;

interface NavLinkItem {
  id: string;
  label: string;
}

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('#hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinksData: NavLinkItem[] = [
    { id: '#hero', label: 'Главная' },
    { id: '#services', label: 'Услуги' },
    { id: '#pricing', label: 'Тарифы' },
    { id: '#portfolio', label: 'Портфолио' },
    { id: '#faq', label: 'FAQ' },
    { id: '#contact', label: 'Связаться' }
  ];

  const checkScroll = () => {
    setIsScrolled(window.scrollY > 50);
    
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = (section as HTMLElement).offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id') || '';
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        setActiveLink(sectionId);
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScroll);
    checkScroll();

    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetElement.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveLink(targetId);
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const sections = navLinksData.map(link => document.querySelector(link.id));

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const intersectingLink = navLinksData.find(link => link.id === `#${entry.target.id}`);
          if (intersectingLink) {
            setActiveLink(intersectingLink.id);
          }
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, [navLinksData]);

  return (
    <NavContainer className={isScrolled ? 'scrolled' : ''}>
      <Logo href="#hero" onClick={(e) => handleScroll(e, '#hero')}>
        MI<span>TSKA</span>
      </Logo>
      
      <HamburgerButton 
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
      >
        <HamburgerIcon $isOpen={isMobileMenuOpen}>
          <span />
          <span />
          <span />
        </HamburgerIcon>
      </HamburgerButton>

      <NavLinks $isOpen={isMobileMenuOpen}>
        {navLinksData.slice(1, -1).map((link) => (
          <NavLink
            key={link.id}
            href={link.id}
            onClick={(e) => handleScroll(e, link.id)}
            $active={activeLink === link.id}
          >
            {link.label}
          </NavLink>
        ))}
        <ActionButton href={navLinksData[navLinksData.length - 1].id} onClick={(e) => handleScroll(e, navLinksData[navLinksData.length - 1].id)}>
          {navLinksData[navLinksData.length - 1].label}
        </ActionButton>
      </NavLinks>
    </NavContainer>
  );
};

export default Navigation;
