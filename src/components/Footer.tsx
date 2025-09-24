import React from 'react';
import styled from 'styled-components';
import { FaTelegram, FaInstagram, FaGithub, FaHeart } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: var(--gradient-background), #000;
  padding: 4rem 0 2rem 0;
  color: #fff;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const Logo = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  
  span {
    background: var(--gradient-secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
`;

const Description = styled.p`
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 400px;
`;

const SocialContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #D76D77;
    transform: translateY(-1px);
    filter: brightness(1.2);
  }
`;

const ColumnTitle = styled.h3`
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 1.5rem;
`;

const LinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LinkItem = styled.li`
  margin-bottom: 0.8rem;
`;

const FooterLink = styled.a`
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.3s ease;
  display: inline-block;
  
  &:hover {
    color: #D76D77;
    transform: translateX(5px);
  }
`;

const BottomBar = styled.div`
  max-width: 1200px;
  margin: 3rem auto 0;
  padding: 1.5rem 2rem 0;
  border-top: 1px solid #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Copyright = styled.p`
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const MadeWithLove = styled.p`
  color: #777;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #D76D77;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <LogoContainer>
            <Logo>SV<span>MITSKA</span></Logo>
          </LogoContainer>
          <Description>
            Создаем современные и эффективные веб-решения для развития вашего бизнеса.
            От сайтов до Telegram-ботов.
          </Description>
          <SocialContainer>
            <SocialIcon href="https://t.me/username" target="_blank" rel="noopener noreferrer">
              <FaTelegram />
            </SocialIcon>
            <SocialIcon href="https://instagram.com/username" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </SocialIcon>
            <SocialIcon href="https://github.com/username" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </SocialIcon>
          </SocialContainer>
        </FooterColumn>
        
        <FooterColumn>
          <ColumnTitle>Услуги</ColumnTitle>
          <LinksList>
            <LinkItem><FooterLink href="#services">Разработка сайтов</FooterLink></LinkItem>
            <LinkItem><FooterLink href="#services">Telegram-боты</FooterLink></LinkItem>
            <LinkItem><FooterLink href="#services">Веб-приложения</FooterLink></LinkItem>
            <LinkItem><FooterLink href="#services">Техническая поддержка</FooterLink></LinkItem>
          </LinksList>
        </FooterColumn>
        
        <FooterColumn>
          <ColumnTitle>Информация</ColumnTitle>
          <LinksList>
            <LinkItem><FooterLink href="#about">О нас</FooterLink></LinkItem>
            <LinkItem><FooterLink href="#portfolio">Портфолио</FooterLink></LinkItem>
            <LinkItem><FooterLink href="#process">Процесс работы</FooterLink></LinkItem>
            <LinkItem><FooterLink href="#contact">Контакты</FooterLink></LinkItem>
          </LinksList>
        </FooterColumn>
      </FooterContent>
      
      <BottomBar>
        <Copyright>&copy; {new Date().getFullYear()} SV-MITSKA. Все права защищены.</Copyright>
        <MadeWithLove>
          Сделано с <FaHeart />
        </MadeWithLove>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer; 