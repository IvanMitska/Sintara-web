import React, { memo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaRocket,
  FaClock,
  FaChartLine,
  FaUsers,
  FaGlobe,
  FaRobot,
  FaMobileAlt,
  FaLaptopCode
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #050208 0%, #0a0512 50%, #050208 100%);
  position: relative;
  overflow-x: hidden;

  /* Отключаем smooth scroll для нормальной прокрутки */
  scroll-behavior: auto !important;

  html & {
    scroll-behavior: auto !important;
  }

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.05) 0%, transparent 40%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 120px 0 40px;
  transition: all 0.3s ease;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #a78bfa;

    svg {
      transform: translateX(-4px);
    }
  }
`;

const HeroSection = styled.section`
  padding-bottom: 80px;
`;

const ProjectCategory = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 20px;
  color: #a78bfa;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 20px;

  svg {
    font-size: 14px;
  }
`;

const ProjectTitle = styled(motion.h1)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 0 24px;
`;

const ProjectDescription = styled(motion.p)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  max-width: 700px;
  margin: 0 0 40px;
`;

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 60px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.8) 0%, rgba(10, 5, 20, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.3), transparent);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 20px;
    color: #a78bfa;
  }
`;

const StatValue = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
`;

const Section = styled.section`
  padding: 60px 0;
`;

const SectionTitle = styled(motion.h2)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px;
`;

const SectionSubtitle = styled(motion.p)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 40px;
  max-width: 600px;
`;

const GalleryGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GalleryItem = styled(motion.div)`
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.8) 0%, rgba(10, 5, 20, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.4), transparent);
  }
`;

const GalleryMedia = styled.div`
  width: 100%;
  aspect-ratio: 16/10;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(20, 10, 40, 0.9) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GalleryPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.3);
  animation: ${float} 3s ease-in-out infinite;

  svg {
    font-size: 40px;
    color: rgba(124, 58, 237, 0.4);
  }

  span {
    font-size: 0.9rem;
  }
`;

const GalleryCaption = styled.div`
  padding: 20px;
`;

const GalleryCaptionTitle = styled.h4`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px;
`;

const GalleryCaptionText = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  line-height: 1.5;
`;

const ProblemSolutionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const Card = styled(motion.div)<{ $type?: 'problem' | 'solution' }>`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 32px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
`;

const CardIcon = styled.div<{ $type?: 'problem' | 'solution' }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${props => props.$type === 'problem'
    ? 'rgba(239, 68, 68, 0.1)'
    : 'rgba(34, 197, 94, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 20px;
    color: ${props => props.$type === 'problem' ? '#ef4444' : '#22c55e'};
  }
`;

const CardTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CardListItem = styled.li<{ $type?: 'problem' | 'solution' }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.$type === 'problem'
      ? 'rgba(239, 68, 68, 0.8)'
      : 'rgba(34, 197, 94, 0.8)'};
    flex-shrink: 0;
    margin-top: 8px;
  }
`;

const TechSection = styled.div`
  margin-top: 60px;
`;

const TechGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const TechBadge = styled.span`
  padding: 10px 20px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 10px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(124, 58, 237, 0.2);
    border-color: rgba(124, 58, 237, 0.4);
    color: #a78bfa;
  }
`;

const CTASection = styled(motion.section)`
  padding: 80px 0;
  text-align: center;
`;

const CTACard = styled.div`
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(20, 10, 40, 0.9) 100%);
  border: 1px solid rgba(124, 58, 237, 0.25);
  border-radius: 28px;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.5), transparent);
  }
`;

const CTATitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px;
`;

const CTAText = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
  padding: 16px 32px;
  border-radius: 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);

  svg {
    font-size: 14px;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);

    svg {
      transform: translateX(4px);
    }
  }
`;

// Project data
interface ProjectData {
  slug: string;
  category: string;
  categoryIcon: React.ReactNode;
  title: string;
  description: string;
  stats: { icon: React.ReactNode; value: string; labelKey: string }[];
  gallery: { title: string; description: string; media?: string }[];
  problem: string[];
  solution: string[];
  techStack: string[];
}

type Language = 'en' | 'ru';

const projectsData: Record<Language, Record<string, ProjectData>> = {
  en: {
    'kaif-crm': {
      slug: 'kaif-crm',
      category: 'Desktop CRM',
      categoryIcon: <FaLaptopCode />,
      title: 'KAIF CRM',
      description: 'Desktop CRM application for managing a multi-profile fitness complex in Phuket, Thailand. The system works offline with automatic cloud backup and Bitrix24 integration.',
      stats: [
        { icon: <FaChartLine />, value: '100+', labelKey: 'projectDetail.classesManaged' },
        { icon: <FaClock />, value: '24/7', labelKey: 'projectDetail.offlineWork' },
        { icon: <FaUsers />, value: '1000+', labelKey: 'projectDetail.clientsTracked' },
        { icon: <FaRocket />, value: '4 weeks', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Client Management', description: 'Complete client database with photos, visit history, and membership tracking', media: '/projects/kaif-crm/screen-1.PNG' },
        { title: 'Check-in System', description: 'Real-time attendance tracking with check-in/check-out functionality', media: '/projects/kaif-crm/screen-2.PNG' },
        { title: 'Memberships', description: 'Flexible membership system: single visits, monthly passes, and session packages', media: '/projects/kaif-crm/screen-4.PNG' },
        { title: 'Analytics Dashboard', description: 'Detailed reports on attendance, revenue, and client activity with PIN protection', media: '/projects/kaif-crm/screen-5.PNG' },
      ],
      problem: [
        'No centralized system for multi-profile fitness center',
        'Unstable internet connection in Thailand causing data loss',
        'Manual tracking of memberships and visits',
        'No integration with existing CRM (Bitrix24)',
      ],
      solution: [
        'Unified desktop app managing gym, dance studio, martial arts, and pool',
        'Offline-first architecture with automatic GitHub/Google Drive backup',
        'Flexible membership system: single visits, monthly, packages',
        'Seamless Bitrix24 API integration for lead management',
      ],
      techStack: ['Electron', 'React 19', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Recharts', 'Bitrix24 API'],
    },
    '3dlike': {
      slug: '3dlike',
      category: 'Corporate Website',
      categoryIcon: <FaGlobe />,
      title: '3DLike',
      description: 'Multi-page website for 3D stickers manufacturer with modern dark design, smooth animations, and full SEO optimization. Integration with WhatsApp and Telegram for instant customer communication.',
      stats: [
        { icon: <FaChartLine />, value: '88+', labelKey: 'projectDetail.lighthouseScore' },
        { icon: <FaClock />, value: '< 2s', labelKey: 'projectDetail.loadSpeed' },
        { icon: <FaUsers />, value: '5+', labelKey: 'projectDetail.pagesCreated' },
        { icon: <FaRocket />, value: '2 weeks', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Hero Section', description: 'Dark blue design with accent green elements and Russo One typography', media: '/projects/3dlike/screen-1.jpeg' },
        { title: 'Product Showcase', description: 'Interactive product gallery with smooth animations', media: '/projects/3dlike/screen-2.jpeg' },
        { title: 'Price Calculator', description: 'Interactive calculator for instant cost estimation with format and quantity options', media: '/projects/3dlike/screen-3.jpeg' },
        { title: 'Product Benefits', description: 'Key advantages presentation with 3D sticker technology explanation', media: '/projects/3dlike/screen-4.jpeg' },
      ],
      problem: [
        'No online presence for the 3D stickers manufacturer',
        'Needed modern, memorable design to stand out',
        'Required fast loading for mobile users',
        'No direct communication channel with customers',
      ],
      solution: [
        'Multi-page React website with unique dark blue design',
        'Smooth Framer Motion animations throughout the site',
        'Optimized performance with lazy loading and code splitting',
        'WhatsApp and Telegram integration for instant contact',
      ],
      techStack: ['React 18', 'Vite 5', 'Tailwind CSS', 'React Router v7', 'Framer Motion', 'Netlify'],
    },
    'unicar': {
      slug: 'unicar',
      category: 'CRM System',
      categoryIcon: <FaLaptopCode />,
      title: 'UNICAR',
      description: 'Full-featured CRM system for car rental business in Thailand. Includes interactive dashboard with real-time analytics, fleet management, booking system, customer database, and financial reporting modules.',
      stats: [
        { icon: <FaChartLine />, value: '50+', labelKey: 'projectDetail.carsManaged' },
        { icon: <FaClock />, value: '24/7', labelKey: 'projectDetail.activeRentals' },
        { icon: <FaUsers />, value: '6+', labelKey: 'projectDetail.modules' },
        { icon: <FaRocket />, value: '4 weeks', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Dashboard', description: 'Real-time analytics with active rentals, revenue, and car availability stats', media: '/projects/unicar/screen-1.jpeg' },
        { title: 'Fleet Management', description: 'Car catalog with photos, availability status, and usage history', media: '/projects/unicar/screen-2.jpeg' },
        { title: 'Booking System', description: 'Full rental cycle management with status tracking', media: '/projects/unicar/screen-3.jpeg' },
        { title: 'Dark Theme', description: 'Modern dark mode interface for comfortable work', media: '/projects/unicar/screen-4.jpeg' },
      ],
      problem: [
        'Manual tracking of rentals and car availability',
        'No centralized system for the whole team',
        'Errors in booking and financial reporting',
        'Difficult to access data from different devices',
      ],
      solution: [
        'Custom CRM with real-time dashboard and notifications',
        'Unified system accessible for all team members',
        'Automated booking with validation and conflict detection',
        'Responsive design working on any device',
      ],
      techStack: ['React 18', 'TypeScript', 'Tailwind CSS', 'React Router', 'React Hook Form', 'Zod', 'Node.js', 'Vite'],
    },
    'shiba-cars': {
      slug: 'shiba-cars',
      category: 'Telegram Bot + B2B Platform',
      categoryIcon: <FaRobot />,
      title: 'SHIBA CARS Partner System',
      description: 'Comprehensive B2B partner platform for car and motorcycle rental service in Phuket, Thailand. Telegram bot with Mini App for partner management, real-time click tracking, and analytics dashboard.',
      stats: [
        { icon: <FaUsers />, value: '50+', labelKey: 'projectDetail.partnersActive' },
        { icon: <FaChartLine />, value: '1000+', labelKey: 'projectDetail.clicksTracked' },
        { icon: <FaClock />, value: '24/7', labelKey: 'projectDetail.realTimeStats' },
        { icon: <FaRocket />, value: '3 weeks', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Telegram Mini App', description: 'Built-in web application for viewing partner statistics, click tracking, and earnings overview', media: '/projects/shiba-cars/screen-1.jpg' },
        { title: 'Partner Registration Bot', description: 'Telegram bot for partner onboarding, unique link generation, and account management', media: '/projects/shiba-cars/screen-2.jpg' },
        { title: 'Analytics Dashboard', description: 'Real-time statistics with charts showing clicks, sources (WhatsApp/Telegram), and geolocation data', media: '/projects/shiba-cars/screen-3.jpg' },
        { title: 'Messenger Landing Page', description: 'Landing page for choosing contact method with integrated tracking system', media: '/projects/shiba-cars/screen-4.jpg' },
      ],
      problem: [
        'No system to track partner referrals and their effectiveness',
        'Manual partner management without automation',
        'No visibility into which messengers bring more clients',
        'Difficult to calculate partner commissions accurately',
      ],
      solution: [
        'Telegram bot with Mini App for partner self-service and real-time statistics',
        'Automated partner registration with unique tracking links',
        'Click tracking with source detection (WhatsApp/Telegram) and GeoIP location',
        'Admin dashboard with detailed analytics and partner performance metrics',
      ],
      techStack: ['Node.js', 'Express', 'Telegraf', 'PostgreSQL', 'Sequelize', 'React 18', 'Tailwind CSS', 'Chart.js', 'Framer Motion', 'Docker', 'Railway', 'Netlify'],
    },
  },
  ru: {
    'kaif-crm': {
      slug: 'kaif-crm',
      category: 'Desktop CRM',
      categoryIcon: <FaLaptopCode />,
      title: 'KAIF CRM',
      description: 'Desktop CRM-приложение для управления многопрофильным фитнес-комплексом KAIF на Пхукете, Таиланд. Система работает офлайн с автоматическим облачным бэкапом и интеграцией Bitrix24.',
      stats: [
        { icon: <FaChartLine />, value: '100+', labelKey: 'projectDetail.classesManaged' },
        { icon: <FaClock />, value: '24/7', labelKey: 'projectDetail.offlineWork' },
        { icon: <FaUsers />, value: '1000+', labelKey: 'projectDetail.clientsTracked' },
        { icon: <FaRocket />, value: '4 недели', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Управление клиентами', description: 'Полная база клиентов с фото, историей посещений и отслеживанием абонементов', media: '/projects/kaif-crm/screen-1.PNG' },
        { title: 'Система Check-in', description: 'Отслеживание присутствия в реальном времени с функцией входа/выхода', media: '/projects/kaif-crm/screen-2.PNG' },
        { title: 'Абонементы', description: 'Гибкая система абонементов: разовые посещения, месячные и пакеты занятий', media: '/projects/kaif-crm/screen-4.PNG' },
        { title: 'Аналитика и отчёты', description: 'Детальные отчёты по посещаемости, выручке и активности клиентов с PIN-защитой', media: '/projects/kaif-crm/screen-5.PNG' },
      ],
      problem: [
        'Отсутствие централизованной системы для многопрофильного фитнес-центра',
        'Нестабильный интернет в Таиланде приводит к потере данных',
        'Ручной учёт абонементов и посещений',
        'Нет интеграции с существующей CRM (Bitrix24)',
      ],
      solution: [
        'Единое desktop-приложение для зала, танцев, единоборств и бассейна',
        'Офлайн-архитектура с автоматическим бэкапом в GitHub/Google Drive',
        'Гибкая система абонементов: разовые, месячные, по занятиям',
        'Бесшовная интеграция с Bitrix24 API для управления лидами',
      ],
      techStack: ['Electron', 'React 19', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Recharts', 'Bitrix24 API'],
    },
    '3dlike': {
      slug: '3dlike',
      category: 'Корпоративный сайт',
      categoryIcon: <FaGlobe />,
      title: '3DLike',
      description: 'Многостраничный сайт для производителя 3D стикеров с современным тёмным дизайном, плавными анимациями и полной SEO-оптимизацией. Интеграция с WhatsApp и Telegram для мгновенной связи с клиентами.',
      stats: [
        { icon: <FaChartLine />, value: '88+', labelKey: 'projectDetail.lighthouseScore' },
        { icon: <FaClock />, value: '< 2с', labelKey: 'projectDetail.loadSpeed' },
        { icon: <FaUsers />, value: '5+', labelKey: 'projectDetail.pagesCreated' },
        { icon: <FaRocket />, value: '2 недели', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Главный экран', description: 'Тёмно-синий дизайн с акцентными зелёными элементами и типографикой Russo One', media: '/projects/3dlike/screen-1.jpeg' },
        { title: 'Витрина продукции', description: 'Интерактивная галерея продуктов с плавными анимациями', media: '/projects/3dlike/screen-2.jpeg' },
        { title: 'Калькулятор цен', description: 'Интерактивный калькулятор для расчёта стоимости с выбором формата и количества', media: '/projects/3dlike/screen-3.jpeg' },
        { title: 'Преимущества', description: 'Презентация ключевых преимуществ и технологии 3D-стикеров', media: '/projects/3dlike/screen-4.jpeg' },
      ],
      problem: [
        'Отсутствие онлайн-присутствия у производителя 3D стикеров',
        'Нужен современный, запоминающийся дизайн для выделения среди конкурентов',
        'Требовалась быстрая загрузка для мобильных пользователей',
        'Не было прямого канала связи с клиентами',
      ],
      solution: [
        'Многостраничный React-сайт с уникальным тёмно-синим дизайном',
        'Плавные анимации Framer Motion по всему сайту',
        'Оптимизация производительности с lazy loading и code splitting',
        'Интеграция WhatsApp и Telegram для мгновенной связи',
      ],
      techStack: ['React 18', 'Vite 5', 'Tailwind CSS', 'React Router v7', 'Framer Motion', 'Netlify'],
    },
    'unicar': {
      slug: 'unicar',
      category: 'CRM-система',
      categoryIcon: <FaLaptopCode />,
      title: 'UNICAR',
      description: 'Полнофункциональная CRM-система для бизнеса по аренде автомобилей в Таиланде. Включает интерактивный дашборд с аналитикой в реальном времени, управление автопарком, системой бронирования, базой клиентов и финансовой отчётностью.',
      stats: [
        { icon: <FaChartLine />, value: '50+', labelKey: 'projectDetail.carsManaged' },
        { icon: <FaClock />, value: '24/7', labelKey: 'projectDetail.activeRentals' },
        { icon: <FaUsers />, value: '6+', labelKey: 'projectDetail.modules' },
        { icon: <FaRocket />, value: '4 недели', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Дашборд', description: 'Аналитика в реальном времени: активные аренды, выручка и статус автомобилей', media: '/projects/unicar/screen-1.jpeg' },
        { title: 'Управление автопарком', description: 'Каталог автомобилей с фото, статусами доступности и историей', media: '/projects/unicar/screen-2.jpeg' },
        { title: 'Система бронирования', description: 'Полный цикл управления арендами с отслеживанием статусов', media: '/projects/unicar/screen-3.jpeg' },
        { title: 'Тёмная тема', description: 'Современный тёмный интерфейс для комфортной работы', media: '/projects/unicar/screen-4.jpeg' },
      ],
      problem: [
        'Ручной учёт аренд и доступности автомобилей',
        'Отсутствие единой системы для всей команды',
        'Ошибки при оформлении и финансовой отчётности',
        'Сложный доступ к данным с разных устройств',
      ],
      solution: [
        'Кастомная CRM с дашбордом и уведомлениями в реальном времени',
        'Единая система с доступом для всей команды',
        'Автоматизация бронирования с валидацией и проверкой конфликтов',
        'Адаптивный дизайн для работы с любого устройства',
      ],
      techStack: ['React 18', 'TypeScript', 'Tailwind CSS', 'React Router', 'React Hook Form', 'Zod', 'Node.js', 'Vite'],
    },
    'shiba-cars': {
      slug: 'shiba-cars',
      category: 'Telegram-бот + B2B платформа',
      categoryIcon: <FaRobot />,
      title: 'SHIBA CARS Partner System',
      description: 'Комплексная B2B партнёрская платформа для сервиса аренды автомобилей и мотоциклов на Пхукете, Таиланд. Telegram-бот с Mini App для управления партнёрами, отслеживание переходов в реальном времени и аналитический дашборд.',
      stats: [
        { icon: <FaUsers />, value: '50+', labelKey: 'projectDetail.partnersActive' },
        { icon: <FaChartLine />, value: '1000+', labelKey: 'projectDetail.clicksTracked' },
        { icon: <FaClock />, value: '24/7', labelKey: 'projectDetail.realTimeStats' },
        { icon: <FaRocket />, value: '3 недели', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Telegram Mini App', description: 'Встроенное веб-приложение для просмотра статистики партнёра, отслеживания переходов и обзора заработка', media: '/projects/shiba-cars/screen-1.jpg' },
        { title: 'Бот регистрации партнёров', description: 'Telegram-бот для онбординга партнёров, генерации уникальных ссылок и управления аккаунтом', media: '/projects/shiba-cars/screen-2.jpg' },
        { title: 'Аналитический дашборд', description: 'Статистика в реальном времени с графиками переходов, источников (WhatsApp/Telegram) и геолокацией', media: '/projects/shiba-cars/screen-3.jpg' },
        { title: 'Лендинг выбора мессенджера', description: 'Страница выбора способа связи с интегрированной системой трекинга', media: '/projects/shiba-cars/screen-4.jpg' },
      ],
      problem: [
        'Отсутствие системы отслеживания партнёрских рефералов и их эффективности',
        'Ручное управление партнёрами без автоматизации',
        'Нет понимания, какие мессенджеры приводят больше клиентов',
        'Сложно точно рассчитывать комиссии партнёров',
      ],
      solution: [
        'Telegram-бот с Mini App для самообслуживания партнёров и real-time статистики',
        'Автоматическая регистрация партнёров с уникальными трекинг-ссылками',
        'Отслеживание переходов с определением источника (WhatsApp/Telegram) и GeoIP-локацией',
        'Админ-панель с детальной аналитикой и метриками эффективности партнёров',
      ],
      techStack: ['Node.js', 'Express', 'Telegraf', 'PostgreSQL', 'Sequelize', 'React 18', 'Tailwind CSS', 'Chart.js', 'Framer Motion', 'Docker', 'Railway', 'Netlify'],
    },
  },
};

const ProjectDetail: React.FC = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const project = slug ? projectsData[language][slug] : null;

  useEffect(() => {
    window.scrollTo(0, 0);

    // Отключаем smooth scroll на этой странице
    document.documentElement.style.scrollBehavior = 'auto';

    return () => {
      // Восстанавливаем smooth scroll при уходе со страницы
      document.documentElement.style.scrollBehavior = 'smooth';
    };
  }, [slug]);

  if (!project) {
    return (
      <PageContainer>
        <Container>
          <BackButton to="/#portfolio">
            <FaArrowLeft /> {t('projectDetail.back')}
          </BackButton>
          <HeroSection>
            <ProjectTitle>{t('projectDetail.notFound')}</ProjectTitle>
            <ProjectDescription>
              {t('projectDetail.notFoundDesc')}
            </ProjectDescription>
            <CTAButton to="/#portfolio">
              {t('projectDetail.viewAll')} <FaArrowRight />
            </CTAButton>
          </HeroSection>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <BackButton to="/#portfolio">
          <FaArrowLeft /> {t('projectDetail.back')}
        </BackButton>

        <HeroSection>
          <ProjectCategory
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {project.categoryIcon} {project.category}
          </ProjectCategory>

          <ProjectTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {project.title}
          </ProjectTitle>

          <ProjectDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {project.description}
          </ProjectDescription>

          <StatsGrid
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {project.stats.map((stat, index) => (
              <StatCard key={index}>
                <StatIcon>{stat.icon}</StatIcon>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{t(stat.labelKey)}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </HeroSection>

        <Section>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('projectDetail.howItWorks')}
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('projectDetail.howItWorksSubtitle')}
          </SectionSubtitle>

          <GalleryGrid
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {project.gallery.map((item, index) => (
              <GalleryItem
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <GalleryMedia>
                  {item.media ? (
                    <img src={item.media} alt={item.title} />
                  ) : (
                    <GalleryPlaceholder>
                      <FaLaptopCode />
                      <span>{t('projectDetail.demoGif')}</span>
                    </GalleryPlaceholder>
                  )}
                </GalleryMedia>
                <GalleryCaption>
                  <GalleryCaptionTitle>{item.title}</GalleryCaptionTitle>
                  <GalleryCaptionText>{item.description}</GalleryCaptionText>
                </GalleryCaption>
              </GalleryItem>
            ))}
          </GalleryGrid>
        </Section>

        <Section>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('projectDetail.challenge')}
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('projectDetail.challengeSubtitle')}
          </SectionSubtitle>

          <ProblemSolutionGrid>
            <Card
              $type="problem"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CardHeader>
                <CardIcon $type="problem">
                  <FaClock />
                </CardIcon>
                <CardTitle>{t('projectDetail.theChallenge')}</CardTitle>
              </CardHeader>
              <CardList>
                {project.problem.map((item, index) => (
                  <CardListItem key={index} $type="problem">{item}</CardListItem>
                ))}
              </CardList>
            </Card>

            <Card
              $type="solution"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <CardHeader>
                <CardIcon $type="solution">
                  <FaCheck />
                </CardIcon>
                <CardTitle>{t('projectDetail.ourSolution')}</CardTitle>
              </CardHeader>
              <CardList>
                {project.solution.map((item, index) => (
                  <CardListItem key={index} $type="solution">{item}</CardListItem>
                ))}
              </CardList>
            </Card>
          </ProblemSolutionGrid>

          <TechSection>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ fontSize: '1.5rem', marginBottom: '20px' }}
            >
              {t('projectDetail.techStack')}
            </SectionTitle>
            <TechGrid>
              {project.techStack.map((tech, index) => (
                <TechBadge key={index}>{tech}</TechBadge>
              ))}
            </TechGrid>
          </TechSection>
        </Section>

        <CTASection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CTACard>
            <CTATitle>{t('projectDetail.ctaTitle')}</CTATitle>
            <CTAText>
              {t('projectDetail.ctaText')}
            </CTAText>
            <CTAButton to="/#contact">
              {t('projectDetail.ctaButton')} <FaArrowRight />
            </CTAButton>
          </CTACard>
        </CTASection>
      </Container>
    </PageContainer>
  );
});

ProjectDetail.displayName = 'ProjectDetail';

export default ProjectDetail;
