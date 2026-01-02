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
  }
`;

const Card = styled(motion.div)<{ $type?: 'problem' | 'solution' }>`
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.8) 0%, rgba(10, 5, 20, 0.95) 100%);
  border: 1px solid ${props => props.$type === 'problem'
    ? 'rgba(239, 68, 68, 0.2)'
    : 'rgba(34, 197, 94, 0.2)'};
  border-radius: 20px;
  padding: 32px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.$type === 'problem'
      ? 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.4), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.4), transparent)'};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const CardIcon = styled.div<{ $type?: 'problem' | 'solution' }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${props => props.$type === 'problem'
    ? 'rgba(239, 68, 68, 0.15)'
    : 'rgba(34, 197, 94, 0.15)'};
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
  font-size: 1.25rem;
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
  gap: 12px;
`;

const CardListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;

  &::before {
    content: '•';
    color: #a78bfa;
    font-weight: bold;
    flex-shrink: 0;
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
    'ecommerce-platform': {
      slug: 'ecommerce-platform',
      category: 'E-commerce',
      categoryIcon: <FaGlobe />,
      title: 'E-commerce Platform',
      description: 'A full-featured online store with payment integration, inventory management, and analytics dashboard. The platform automated order processing and reduced manual work by 80%.',
      stats: [
        { icon: <FaChartLine />, value: '+340%', labelKey: 'projectDetail.salesIncrease' },
        { icon: <FaClock />, value: '80%', labelKey: 'projectDetail.timeSaved' },
        { icon: <FaUsers />, value: '15K+', labelKey: 'projectDetail.activeUsers' },
        { icon: <FaRocket />, value: '2 weeks', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Product Catalog', description: 'Dynamic product grid with filters, search, and sorting capabilities' },
        { title: 'Shopping Cart', description: 'Real-time cart updates with discount codes and shipping calculator' },
        { title: 'Admin Dashboard', description: 'Complete order management, analytics, and inventory control' },
        { title: 'Mobile Experience', description: 'Fully responsive design optimized for mobile shopping' },
      ],
      problem: [
        'Manual order processing taking hours daily',
        'No real-time inventory tracking',
        'Poor mobile experience losing customers',
        'No analytics to understand customer behavior',
      ],
      solution: [
        'Automated order processing with instant notifications',
        'Real-time inventory sync across all channels',
        'Mobile-first responsive design',
        'Comprehensive analytics dashboard with insights',
      ],
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'AWS'],
    },
    'booking-bot': {
      slug: 'booking-bot',
      category: 'Telegram Bot',
      categoryIcon: <FaRobot />,
      title: 'Booking Automation Bot',
      description: 'Smart Telegram bot for automated appointment booking with CRM integration. The bot handles 500+ bookings daily without human intervention.',
      stats: [
        { icon: <FaChartLine />, value: '500+', labelKey: 'projectDetail.dailyBookings' },
        { icon: <FaClock />, value: '95%', labelKey: 'projectDetail.automationRate' },
        { icon: <FaUsers />, value: '10K+', labelKey: 'projectDetail.botUsers' },
        { icon: <FaRocket />, value: '3 weeks', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Booking Flow', description: 'Intuitive step-by-step booking process with date/time selection' },
        { title: 'Reminders', description: 'Automated reminders 24h and 1h before appointments' },
        { title: 'Admin Panel', description: 'Web dashboard for managing schedules and viewing analytics' },
        { title: 'CRM Integration', description: 'Seamless sync with existing CRM systems' },
      ],
      problem: [
        'Staff spending 4+ hours daily on phone bookings',
        'Double bookings and scheduling conflicts',
        'No-shows causing revenue loss',
        'No centralized booking system',
      ],
      solution: [
        '24/7 automated booking without staff involvement',
        'Smart conflict detection and resolution',
        'Automated reminders reducing no-shows by 60%',
        'Centralized system with real-time availability',
      ],
      techStack: ['Python', 'Aiogram', 'PostgreSQL', 'Redis', 'FastAPI', 'Docker'],
    },
    'saas-dashboard': {
      slug: 'saas-dashboard',
      category: 'Web Application',
      categoryIcon: <FaLaptopCode />,
      title: 'SaaS Analytics Dashboard',
      description: 'Comprehensive analytics dashboard with real-time data visualization, custom reports, and team collaboration features. The platform helped clients make data-driven decisions 3x faster.',
      stats: [
        { icon: <FaChartLine />, value: '3x', labelKey: 'projectDetail.fasterDecisions' },
        { icon: <FaClock />, value: '< 1s', labelKey: 'projectDetail.dataRefresh' },
        { icon: <FaUsers />, value: '200+', labelKey: 'projectDetail.teamsUsing' },
        { icon: <FaRocket />, value: '5 weeks', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Main Dashboard', description: 'Interactive charts and KPI widgets with drag-and-drop customization' },
        { title: 'Real-time Analytics', description: 'Live data updates with WebSocket connections' },
        { title: 'Custom Reports', description: 'Build and export custom reports in multiple formats' },
        { title: 'Team Collaboration', description: 'Share dashboards and insights with team members' },
      ],
      problem: [
        'Data scattered across multiple tools',
        'Hours spent creating manual reports',
        'No real-time visibility into metrics',
        'Difficult to share insights with team',
      ],
      solution: [
        'Unified dashboard aggregating all data sources',
        'Automated report generation saving 10+ hours weekly',
        'Real-time data streaming with instant updates',
        'Collaborative features with role-based access',
      ],
      techStack: ['Next.js', 'TypeScript', 'D3.js', 'PostgreSQL', 'Redis', 'WebSocket'],
    },
    'learning-bot': {
      slug: 'learning-bot',
      category: 'Telegram Bot',
      categoryIcon: <FaRobot />,
      title: 'Educational Platform Bot',
      description: 'Interactive learning bot with courses, quizzes, progress tracking, and gamification elements. The bot achieved 85% course completion rate, far above industry average.',
      stats: [
        { icon: <FaChartLine />, value: '85%', labelKey: 'projectDetail.completionRate' },
        { icon: <FaClock />, value: '2K+', labelKey: 'projectDetail.lessonsCompleted' },
        { icon: <FaUsers />, value: '5K+', labelKey: 'projectDetail.activeLearners' },
        { icon: <FaRocket />, value: '4 weeks', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Course Navigation', description: 'Easy-to-use menu for browsing courses and lessons' },
        { title: 'Interactive Quizzes', description: 'Engaging quizzes with instant feedback and explanations' },
        { title: 'Progress Dashboard', description: 'Visual progress tracking with achievements and badges' },
        { title: 'Leaderboard', description: 'Gamified experience with points and weekly rankings' },
      ],
      problem: [
        'Low engagement with traditional e-learning',
        'No mobile-friendly learning option',
        'Difficult to track student progress',
        'High dropout rates in online courses',
      ],
      solution: [
        'Bite-sized lessons delivered via Telegram',
        'Learn anytime directly in messenger app',
        'Detailed analytics for instructors and students',
        'Gamification increasing completion by 300%',
      ],
      techStack: ['Node.js', 'Telegraf', 'MongoDB', 'Redis', 'Express', 'Docker'],
    },
    'corporate-website': {
      slug: 'corporate-website',
      category: 'Corporate Website',
      categoryIcon: <FaLaptopCode />,
      title: 'Tech Company Website',
      description: 'Modern corporate website with stunning animations, lead generation forms, and CRM integration. The website increased lead conversion by 250%.',
      stats: [
        { icon: <FaChartLine />, value: '+250%', labelKey: 'projectDetail.leadConversion' },
        { icon: <FaClock />, value: '2.5s', labelKey: 'projectDetail.loadTime' },
        { icon: <FaUsers />, value: '50K+', labelKey: 'projectDetail.monthlyVisitors' },
        { icon: <FaRocket />, value: '4 weeks', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Hero Section', description: '3D animations and interactive elements that capture attention' },
        { title: 'Services Showcase', description: 'Dynamic service cards with smooth scroll animations' },
        { title: 'Contact Forms', description: 'Multi-step forms with validation and CRM integration' },
        { title: 'Blog Section', description: 'SEO-optimized blog with content management' },
      ],
      problem: [
        'Outdated design losing credibility',
        'Poor SEO ranking on search engines',
        'No lead capture or CRM integration',
        'Slow loading times hurting conversions',
      ],
      solution: [
        'Modern design with premium animations',
        'Technical SEO optimization for top rankings',
        'Integrated lead forms with CRM sync',
        'Performance optimization for fast loading',
      ],
      techStack: ['React', 'GSAP', 'Three.js', 'Node.js', 'Sanity CMS', 'Vercel'],
    },
    'delivery-app': {
      slug: 'delivery-app',
      category: 'Mobile App',
      categoryIcon: <FaMobileAlt />,
      title: 'Food Delivery App',
      description: 'Complete food delivery application with real-time courier tracking, loyalty program, and restaurant management panel.',
      stats: [
        { icon: <FaChartLine />, value: '1000+', labelKey: 'projectDetail.dailyOrders' },
        { icon: <FaClock />, value: '25min', labelKey: 'projectDetail.avgDelivery' },
        { icon: <FaUsers />, value: '25K+', labelKey: 'projectDetail.appDownloads' },
        { icon: <FaRocket />, value: '6 weeks', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Restaurant Menu', description: 'Beautiful menu display with categories and customization options' },
        { title: 'Live Tracking', description: 'Real-time courier location on interactive map' },
        { title: 'Order Management', description: 'Restaurant panel for managing orders and menu' },
        { title: 'Loyalty Program', description: 'Points system with rewards and special offers' },
      ],
      problem: [
        'No way to track delivery status',
        'High customer support calls',
        'No customer retention strategy',
        'Manual order management for restaurants',
      ],
      solution: [
        'Real-time GPS tracking for all deliveries',
        'Automated status updates reducing calls by 70%',
        'Gamified loyalty program increasing retention',
        'Digital restaurant panel for easy management',
      ],
      techStack: ['React Native', 'Firebase', 'Node.js', 'MongoDB', 'Socket.io', 'Google Maps'],
    },
  },
  ru: {
    'ecommerce-platform': {
      slug: 'ecommerce-platform',
      category: 'Интернет-магазин',
      categoryIcon: <FaGlobe />,
      title: 'Платформа интернет-магазина',
      description: 'Полнофункциональный интернет-магазин с интеграцией платежей, управлением запасами и аналитикой. Платформа автоматизировала обработку заказов и сократила ручную работу на 80%.',
      stats: [
        { icon: <FaChartLine />, value: '+340%', labelKey: 'projectDetail.salesIncrease' },
        { icon: <FaClock />, value: '80%', labelKey: 'projectDetail.timeSaved' },
        { icon: <FaUsers />, value: '15K+', labelKey: 'projectDetail.activeUsers' },
        { icon: <FaRocket />, value: '2 недели', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Каталог товаров', description: 'Динамичная сетка товаров с фильтрами, поиском и сортировкой' },
        { title: 'Корзина', description: 'Обновление корзины в реальном времени с промокодами и калькулятором доставки' },
        { title: 'Админ-панель', description: 'Полное управление заказами, аналитика и контроль запасов' },
        { title: 'Мобильная версия', description: 'Полностью адаптивный дизайн для мобильных покупок' },
      ],
      problem: [
        'Ручная обработка заказов занимала часы ежедневно',
        'Отсутствие отслеживания запасов в реальном времени',
        'Плохой мобильный опыт терял клиентов',
        'Нет аналитики для понимания поведения покупателей',
      ],
      solution: [
        'Автоматическая обработка заказов с мгновенными уведомлениями',
        'Синхронизация запасов в реальном времени по всем каналам',
        'Mobile-first адаптивный дизайн',
        'Комплексная аналитическая панель с инсайтами',
      ],
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'AWS'],
    },
    'booking-bot': {
      slug: 'booking-bot',
      category: 'Telegram-бот',
      categoryIcon: <FaRobot />,
      title: 'Бот автоматизации записи',
      description: 'Умный Telegram-бот для автоматического бронирования с интеграцией CRM. Бот обрабатывает 500+ записей ежедневно без участия человека.',
      stats: [
        { icon: <FaChartLine />, value: '500+', labelKey: 'projectDetail.dailyBookings' },
        { icon: <FaClock />, value: '95%', labelKey: 'projectDetail.automationRate' },
        { icon: <FaUsers />, value: '10K+', labelKey: 'projectDetail.botUsers' },
        { icon: <FaRocket />, value: '3 недели', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Процесс записи', description: 'Интуитивный пошаговый процесс бронирования с выбором даты/времени' },
        { title: 'Напоминания', description: 'Автоматические напоминания за 24ч и 1ч до визита' },
        { title: 'Админ-панель', description: 'Веб-панель для управления расписанием и просмотра аналитики' },
        { title: 'Интеграция с CRM', description: 'Бесшовная синхронизация с существующими CRM-системами' },
      ],
      problem: [
        'Персонал тратил 4+ часа в день на телефонные записи',
        'Двойные бронирования и конфликты расписания',
        'Неявки приводили к потере выручки',
        'Отсутствие централизованной системы записи',
      ],
      solution: [
        'Автоматическая запись 24/7 без участия персонала',
        'Умное обнаружение и разрешение конфликтов',
        'Автоматические напоминания снизили неявки на 60%',
        'Централизованная система с доступностью в реальном времени',
      ],
      techStack: ['Python', 'Aiogram', 'PostgreSQL', 'Redis', 'FastAPI', 'Docker'],
    },
    'saas-dashboard': {
      slug: 'saas-dashboard',
      category: 'Веб-приложение',
      categoryIcon: <FaLaptopCode />,
      title: 'SaaS-дашборд аналитики',
      description: 'Комплексная панель аналитики с визуализацией данных в реальном времени, кастомными отчётами и функциями командной работы. Платформа помогла клиентам принимать решения на основе данных в 3 раза быстрее.',
      stats: [
        { icon: <FaChartLine />, value: '3x', labelKey: 'projectDetail.fasterDecisions' },
        { icon: <FaClock />, value: '< 1с', labelKey: 'projectDetail.dataRefresh' },
        { icon: <FaUsers />, value: '200+', labelKey: 'projectDetail.teamsUsing' },
        { icon: <FaRocket />, value: '5 недель', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Главный дашборд', description: 'Интерактивные графики и KPI-виджеты с drag-and-drop настройкой' },
        { title: 'Аналитика в реальном времени', description: 'Обновление данных через WebSocket' },
        { title: 'Кастомные отчёты', description: 'Создание и экспорт отчётов в разных форматах' },
        { title: 'Командная работа', description: 'Обмен дашбордами и инсайтами с коллегами' },
      ],
      problem: [
        'Данные разбросаны по разным инструментам',
        'Часы на создание ручных отчётов',
        'Нет видимости метрик в реальном времени',
        'Сложно делиться инсайтами с командой',
      ],
      solution: [
        'Единая панель, агрегирующая все источники данных',
        'Автоматическая генерация отчётов экономит 10+ часов в неделю',
        'Стриминг данных в реальном времени',
        'Функции совместной работы с ролевым доступом',
      ],
      techStack: ['Next.js', 'TypeScript', 'D3.js', 'PostgreSQL', 'Redis', 'WebSocket'],
    },
    'learning-bot': {
      slug: 'learning-bot',
      category: 'Telegram-бот',
      categoryIcon: <FaRobot />,
      title: 'Образовательный бот',
      description: 'Интерактивный обучающий бот с курсами, тестами, отслеживанием прогресса и геймификацией. Бот достиг 85% завершаемости курсов — значительно выше среднего по отрасли.',
      stats: [
        { icon: <FaChartLine />, value: '85%', labelKey: 'projectDetail.completionRate' },
        { icon: <FaClock />, value: '2K+', labelKey: 'projectDetail.lessonsCompleted' },
        { icon: <FaUsers />, value: '5K+', labelKey: 'projectDetail.activeLearners' },
        { icon: <FaRocket />, value: '4 недели', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Навигация по курсам', description: 'Удобное меню для просмотра курсов и уроков' },
        { title: 'Интерактивные тесты', description: 'Увлекательные тесты с мгновенной обратной связью и пояснениями' },
        { title: 'Дашборд прогресса', description: 'Визуальное отслеживание прогресса с достижениями и бейджами' },
        { title: 'Таблица лидеров', description: 'Геймифицированный опыт с баллами и недельными рейтингами' },
      ],
      problem: [
        'Низкая вовлечённость в традиционное e-learning',
        'Нет мобильного варианта обучения',
        'Сложно отслеживать прогресс студентов',
        'Высокий процент отсева на онлайн-курсах',
      ],
      solution: [
        'Короткие уроки в формате Telegram',
        'Обучение в любое время прямо в мессенджере',
        'Детальная аналитика для преподавателей и студентов',
        'Геймификация увеличила завершаемость на 300%',
      ],
      techStack: ['Node.js', 'Telegraf', 'MongoDB', 'Redis', 'Express', 'Docker'],
    },
    'corporate-website': {
      slug: 'corporate-website',
      category: 'Корпоративный сайт',
      categoryIcon: <FaLaptopCode />,
      title: 'Сайт IT-компании',
      description: 'Современный корпоративный сайт с впечатляющими анимациями, формами лидогенерации и интеграцией CRM. Сайт увеличил конверсию лидов на 250%.',
      stats: [
        { icon: <FaChartLine />, value: '+250%', labelKey: 'projectDetail.leadConversion' },
        { icon: <FaClock />, value: '2.5с', labelKey: 'projectDetail.loadTime' },
        { icon: <FaUsers />, value: '50K+', labelKey: 'projectDetail.monthlyVisitors' },
        { icon: <FaRocket />, value: '4 недели', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Главный экран', description: '3D-анимации и интерактивные элементы, привлекающие внимание' },
        { title: 'Витрина услуг', description: 'Динамичные карточки услуг с плавными scroll-анимациями' },
        { title: 'Формы обратной связи', description: 'Многошаговые формы с валидацией и интеграцией CRM' },
        { title: 'Блог', description: 'SEO-оптимизированный блог с системой управления контентом' },
      ],
      problem: [
        'Устаревший дизайн терял доверие',
        'Плохие позиции в поисковых системах',
        'Нет захвата лидов и интеграции с CRM',
        'Медленная загрузка снижала конверсию',
      ],
      solution: [
        'Современный дизайн с премиальными анимациями',
        'Техническая SEO-оптимизация для топовых позиций',
        'Интегрированные формы с синхронизацией CRM',
        'Оптимизация производительности для быстрой загрузки',
      ],
      techStack: ['React', 'GSAP', 'Three.js', 'Node.js', 'Sanity CMS', 'Vercel'],
    },
    'delivery-app': {
      slug: 'delivery-app',
      category: 'Мобильное приложение',
      categoryIcon: <FaMobileAlt />,
      title: 'Приложение доставки еды',
      description: 'Полнофункциональное приложение доставки еды с отслеживанием курьера в реальном времени, программой лояльности и панелью управления рестораном.',
      stats: [
        { icon: <FaChartLine />, value: '1000+', labelKey: 'projectDetail.dailyOrders' },
        { icon: <FaClock />, value: '25мин', labelKey: 'projectDetail.avgDelivery' },
        { icon: <FaUsers />, value: '25K+', labelKey: 'projectDetail.appDownloads' },
        { icon: <FaRocket />, value: '6 недель', labelKey: 'projectDetail.development' },
      ],
      gallery: [
        { title: 'Меню ресторана', description: 'Красивое отображение меню с категориями и опциями кастомизации' },
        { title: 'Отслеживание в реальном времени', description: 'Местоположение курьера на интерактивной карте' },
        { title: 'Управление заказами', description: 'Панель ресторана для управления заказами и меню' },
        { title: 'Программа лояльности', description: 'Система баллов с наградами и спецпредложениями' },
      ],
      problem: [
        'Невозможно отследить статус доставки',
        'Много звонков в службу поддержки',
        'Нет стратегии удержания клиентов',
        'Ручное управление заказами для ресторанов',
      ],
      solution: [
        'GPS-отслеживание всех доставок в реальном времени',
        'Автоматические обновления статуса снизили звонки на 70%',
        'Геймифицированная программа лояльности для удержания',
        'Цифровая панель ресторана для удобного управления',
      ],
      techStack: ['React Native', 'Firebase', 'Node.js', 'MongoDB', 'Socket.io', 'Google Maps'],
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
                  <CardListItem key={index}>{item}</CardListItem>
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
                  <CardListItem key={index}>{item}</CardListItem>
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
