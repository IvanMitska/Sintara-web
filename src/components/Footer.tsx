import React from 'react';
import styled from 'styled-components';
import { FaTelegram, FaInstagram, FaGithub } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const FooterContainer = styled.footer`
  background: transparent;
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

const Logo = styled.img`
  height: 160px;
  width: auto;
  margin-left: -45px;
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
    background-color: #7c3aed;
    transform: translateY(-1px);
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
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    color: #a78bfa;
    transform: translateX(3px);
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


const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <LogoContainer>
            <Logo src="/logo-sintara-futer.png" alt="Sintara" />
          </LogoContainer>
          <Description>
            {language === 'en'
              ? 'We build modern and effective web solutions for your business. From websites to Telegram bots.'
              : 'Мы создаём современные и эффективные веб-решения для вашего бизнеса. От сайтов до Telegram-ботов.'}
          </Description>
          <SocialContainer>
            <SocialIcon href="https://t.me/IvanMitska" target="_blank" rel="noopener noreferrer">
              <FaTelegram />
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/sintara_studio/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </SocialIcon>
            <SocialIcon href="https://github.com/username" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </SocialIcon>
          </SocialContainer>
        </FooterColumn>

        <FooterColumn>
          <ColumnTitle>{language === 'en' ? 'Services' : 'Услуги'}</ColumnTitle>
          <LinksList>
            <LinkItem><FooterLink href="#services">{language === 'en' ? 'Web Development' : 'Веб-разработка'}</FooterLink></LinkItem>
            <LinkItem><FooterLink href="#services">{language === 'en' ? 'Telegram Bots' : 'Telegram-боты'}</FooterLink></LinkItem>
            <LinkItem><FooterLink href="#services">{language === 'en' ? 'Web Applications' : 'Веб-приложения'}</FooterLink></LinkItem>
            <LinkItem><FooterLink href="#services">{language === 'en' ? 'Technical Support' : 'Техподдержка'}</FooterLink></LinkItem>
          </LinksList>
        </FooterColumn>

        <FooterColumn>
          <ColumnTitle>{language === 'en' ? 'Company' : 'Компания'}</ColumnTitle>
          <LinksList>
            <LinkItem><FooterLink href="#about">{language === 'en' ? 'About' : 'О нас'}</FooterLink></LinkItem>
            <LinkItem><FooterLink href="#portfolio">{language === 'en' ? 'Portfolio' : 'Портфолио'}</FooterLink></LinkItem>
            <LinkItem><FooterLink href="#process">{language === 'en' ? 'Process' : 'Процесс'}</FooterLink></LinkItem>
            <LinkItem><FooterLink href="#contact">{language === 'en' ? 'Contact' : 'Контакты'}</FooterLink></LinkItem>
          </LinksList>
        </FooterColumn>
      </FooterContent>

      <BottomBar>
        <Copyright>&copy; {new Date().getFullYear()} Sintara. {language === 'en' ? 'All rights reserved.' : 'Все права защищены.'}</Copyright>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer; 