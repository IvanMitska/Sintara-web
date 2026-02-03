import React, { useState, memo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaArrowRight, FaPaperPlane, FaCheck,
  FaBuilding, FaUsers, FaBullseye, FaSitemap, FaPalette,
  FaFileAlt, FaCog, FaCalendarAlt, FaCommentAlt, FaLaptopCode
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import Navigation from '../components/Navigation';
import StarField from '../components/StarField';

// ============ STYLED COMPONENTS ============

const PageWrapper = styled.div`
  min-height: 100vh;
  height: auto;
  background: transparent;
  position: relative;

  @media (max-width: 768px) {
    overflow: visible;
    touch-action: pan-y pinch-zoom;
  }
`;

const BriefContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 120px 24px 80px;
  position: relative;
  z-index: 1;
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 40px;

  &:hover {
    background: rgba(124, 58, 237, 0.1);
    border-color: rgba(124, 58, 237, 0.3);
    color: #fff;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Logo = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
`;

const Title = styled(motion.h1)`
  font-family: 'Inter', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px;
`;

const Subtitle = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

// Progress
const ProgressContainer = styled.div`
  margin-bottom: 48px;
`;

const ProgressBar = styled.div`
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const ProgressFill = styled(motion.div)<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%);
  border-radius: 2px;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0 8px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(124, 58, 237, 0.3);
    border-radius: 2px;
  }
`;

const StepItem = styled.button<{ $active: boolean; $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.$active
    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)'
    : props.$completed
      ? 'rgba(124, 58, 237, 0.1)'
      : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.$active
    ? 'rgba(124, 58, 237, 0.4)'
    : props.$completed
      ? 'rgba(124, 58, 237, 0.2)'
      : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;

  svg {
    font-size: 14px;
    color: ${props => props.$active || props.$completed ? '#a78bfa' : 'rgba(255, 255, 255, 0.3)'};
  }

  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    color: ${props => props.$active ? '#fff' : props.$completed ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.4)'};
  }

  &:hover {
    border-color: rgba(124, 58, 237, 0.3);
    background: rgba(124, 58, 237, 0.1);
  }
`;

// Form Card
const FormCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(20, 10, 40, 0.8) 0%, rgba(10, 5, 20, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  padding: 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.4), transparent);
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: #a78bfa;
  }
`;

const SectionSubtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 32px;
`;

// Form Elements
const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
`;

const RequiredMark = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 18px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #ffffff;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    border-color: rgba(124, 58, 237, 0.5);
    background: rgba(124, 58, 237, 0.05);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 18px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #ffffff;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    border-color: rgba(124, 58, 237, 0.5);
    background: rgba(124, 58, 237, 0.05);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }
`;

// Checkbox Grid
const CheckboxGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 2}, 1fr);
  gap: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const CheckboxItem = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: ${props => props.$checked
    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.08) 100%)'
    : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.$checked ? 'rgba(124, 58, 237, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(124, 58, 237, 0.3);
    background: rgba(124, 58, 237, 0.08);
  }

  input {
    display: none;
  }
`;

const Checkbox = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 2px solid ${props => props.$checked ? '#7c3aed' : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.$checked ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  svg {
    font-size: 10px;
    color: white;
    opacity: ${props => props.$checked ? 1 : 0};
  }
`;

const CheckboxLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

// Radio Group
const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const RadioItem = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: ${props => props.$checked
    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.08) 100%)'
    : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.$checked ? 'rgba(124, 58, 237, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(124, 58, 237, 0.3);
  }

  input {
    display: none;
  }
`;

const Radio = styled.div<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${props => props.$checked ? '#7c3aed' : 'rgba(255, 255, 255, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #7c3aed;
    opacity: ${props => props.$checked ? 1 : 0};
    transform: ${props => props.$checked ? 'scale(1)' : 'scale(0)'};
    transition: all 0.2s ease;
  }
`;

const RadioLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

// Navigation Buttons
const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 40px;
`;

const NavButton = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 14px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);
      color: white;
    }
  ` : `
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(124, 58, 237, 0.1);
      border-color: rgba(124, 58, 237, 0.3);
      color: #fff;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  svg {
    font-size: 14px;
  }
`;

// Success Screen
const SuccessScreen = styled(motion.div)`
  text-align: center;
  padding: 60px 40px;
`;

const SuccessIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
  border: 2px solid rgba(34, 197, 94, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;

  svg {
    font-size: 32px;
    color: #22c55e;
  }
`;

const SuccessTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 16px;
`;

const SuccessText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px;
  line-height: 1.6;
`;

const ErrorMessage = styled(motion.div)`
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #fca5a5;
  line-height: 1.5;
`;

// ============ TYPES ============

interface BriefData {
  // Product Type
  productType: string;

  // Company Info
  companyName: string;
  businessArea: string;
  contactPerson: string;
  phone: string;
  email: string;
  currentWebsite: string;
  companyDescription: string;
  competitiveAdvantages: string;

  // Target Audience
  targetAudience: string;
  problemSolved: string;

  // Goals
  siteGoals: string[];
  visitorActions: string;
  kpi: string;

  // Structure
  siteSections: string[];
  functionality: string[];

  // Design
  likedWebsites: string;
  whatLiked: string;
  whatDisliked: string;
  brandStyle: string;
  siteMood: string[];
  colorScheme: string;

  // Content
  contentProvider: string;
  mediaAssets: string[];

  // Technical
  platform: string[];
  domainHosting: string;
  domainName: string;
  technicalRequirements: string[];

  // Budget
  launchDate: string;
  budget: string;
  priority: string[];

  // Additional
  decisionMaker: string;
  preferredContact: string;
  additionalComments: string;
}

// ============ COMPONENT ============

const Brief: React.FC = memo(() => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BriefData>({
    productType: '',
    companyName: '',
    businessArea: '',
    contactPerson: '',
    phone: '',
    email: '',
    currentWebsite: '',
    companyDescription: '',
    competitiveAdvantages: '',
    targetAudience: '',
    problemSolved: '',
    siteGoals: [],
    visitorActions: '',
    kpi: '',
    siteSections: [],
    functionality: [],
    likedWebsites: '',
    whatLiked: '',
    whatDisliked: '',
    brandStyle: '',
    siteMood: [],
    colorScheme: '',
    contentProvider: '',
    mediaAssets: [],
    platform: [],
    domainHosting: '',
    domainName: '',
    technicalRequirements: [],
    launchDate: '',
    budget: '',
    priority: [],
    decisionMaker: '',
    preferredContact: '',
    additionalComments: ''
  });

  const t = language === 'ru' ? {
    back: 'Назад',
    title: 'Бриф на разработку',
    subtitle: 'Заполните форму, чтобы мы могли лучше понять ваш проект и подготовить точную оценку',
    next: 'Далее',
    prev: 'Назад',
    submit: 'Отправить бриф',

    // Steps
    step1: 'Продукт',
    step2: 'О компании',
    step3: 'Аудитория',
    step4: 'Цели',
    step5: 'Функционал',
    step6: 'Дизайн',
    step7: 'Техническое',
    step8: 'Сроки',
    step9: 'Контакты',

    // Step 1 - Product Type
    productTypeTitle: 'Тип продукта',
    productTypeSubtitle: 'Выберите, какой продукт вы хотите заказать',
    productType: 'Что вы хотите разработать?',
    productTypeOptions: [
      'Веб-сайт / Лендинг',
      'CRM / Веб-приложение',
      'Telegram бот',
      'Мобильное приложение',
      'Другое'
    ],

    // Step 2 - Company
    companyTitle: 'Информация о компании',
    companySubtitle: 'Расскажите о вашей компании, чтобы мы лучше понимали ваш бизнес',
    companyName: 'Название компании',
    businessArea: 'Сфера деятельности',
    contactPerson: 'Контактное лицо',
    phone: 'Телефон',
    email: 'Email',
    currentWebsite: 'Текущий сайт (если есть)',
    companyDescription: 'Описание компании и основных услуг/продуктов',
    competitiveAdvantages: 'Ваши конкурентные преимущества',

    // Step 2 - Audience
    audienceTitle: 'Целевая аудитория',
    audienceSubtitle: 'Опишите, для кого предназначен ваш продукт',
    targetAudience: 'Опишите целевую аудиторию (возраст, пол, интересы, география)',
    problemSolved: 'Какую проблему клиента решает ваш продукт/услуга?',

    // Step 4 - Goals
    goalsTitle: 'Цели и задачи проекта',
    goalsSubtitle: 'Определите, чего вы хотите достичь с помощью продукта',
    siteGoals: 'Основные цели проекта',
    visitorActions: 'Какие задачи должен решать продукт?',
    kpi: 'Как вы будете оценивать успешность? (KPI)',

    goalOptions: [
      'Привлечение новых клиентов',
      'Продажа товаров/услуг',
      'Автоматизация бизнес-процессов',
      'Управление клиентами (CRM)',
      'Сбор заявок/лидов',
      'Поддержка и консультирование клиентов',
      'Внутренняя автоматизация',
      'Аналитика и отчётность'
    ],

    // Step 5 - Functionality
    structureTitle: 'Функционал продукта',
    structureSubtitle: 'Выберите необходимые функции для вашего продукта',
    siteSections: 'Основные модули/разделы',
    functionality: 'Дополнительный функционал',

    sectionOptions: [
      'Главная страница / Дашборд',
      'Каталог услуг / товаров',
      'Личный кабинет',
      'Админ-панель',
      'Управление клиентами',
      'Управление заказами',
      'Статистика и аналитика',
      'Настройки и конфигурация',
      'Чат / Поддержка',
      'Уведомления'
    ],

    functionalityOptions: [
      'Форма обратной связи',
      'Онлайн-запись / бронирование',
      'Интеграция с Telegram',
      'Интеграция с CRM',
      'Интеграция с платежами',
      'Интеграция с 1C / учётными системами',
      'Онлайн-чат',
      'Push-уведомления',
      'Email-рассылки',
      'Отчёты и экспорт данных',
      'API для интеграций',
      'Мультиязычность'
    ],

    // Step 6 - Design
    designTitle: 'Дизайн и стиль',
    designSubtitle: 'Расскажите о ваших предпочтениях в дизайне',
    likedWebsites: 'Ссылки на примеры, которые вам нравятся (3-5 ссылок)',
    whatLiked: 'Что именно нравится в этих примерах?',
    whatDisliked: 'Что НЕ нравится и чего избегать?',
    brandStyle: 'Фирменный стиль',
    siteMood: 'Общее настроение продукта',
    colorScheme: 'Предпочтительная цветовая гамма',

    brandOptions: [
      'Есть брендбук',
      'Нужно разработать',
      'Только логотип',
      'Нет требований'
    ],

    moodOptions: [
      'Строгий, деловой',
      'Дружелюбный, тёплый',
      'Минималистичный',
      'Яркий, динамичный',
      'Премиальный, люксовый',
      'Современный, технологичный'
    ],

    // Step 6 - Content
    contentTitle: 'Контент',
    contentSubtitle: 'Определите источники контента для сайта',
    contentProvider: 'Кто готовит тексты для сайта?',
    mediaAssets: 'Фото и видео материалы',

    contentOptions: [
      'Заказчик предоставит',
      'Нужен копирайтер',
      'Совместная работа'
    ],

    mediaOptions: [
      'Есть готовые',
      'Нужна фотосъёмка',
      'Использовать стоковые',
      'Нужна видеосъёмка'
    ],

    // Step 7 - Technical
    technicalTitle: 'Технические требования',
    technicalSubtitle: 'Укажите технические предпочтения для проекта',
    platform: 'Предпочтения по платформе/CMS',
    domainHosting: 'Домен и хостинг',
    domainName: 'Доменное имя (если есть)',
    technicalRequirements: 'Дополнительные требования',

    platformOptions: [
      'React / Next.js',
      'Node.js',
      'Python',
      'На усмотрение разработчика'
    ],

    hostingOptions: [
      'Уже есть',
      'Нужно приобрести',
      'Нужна консультация'
    ],

    techRequirements: [
      'SEO-оптимизация',
      'Адаптив под мобильные',
      'Высокая скорость загрузки',
      'SSL-сертификат',
      'Интеграция с аналитикой',
      'Административная панель'
    ],

    // Step 8 - Timeline
    budgetTitle: 'Сроки и бюджет',
    budgetSubtitle: 'Укажите ваши ожидания по срокам',
    launchDate: 'Желаемый срок запуска проекта',
    budget: 'Бюджет проекта',
    priority: 'Приоритет проекта',

    budgetOptions: [
      'Обсуждается индивидуально'
    ],

    priorityOptions: [
      'Сроки',
      'Качество',
      'Бюджет'
    ],

    // Step 9 - Additional
    additionalTitle: 'Дополнительная информация',
    additionalSubtitle: 'Любая другая информация, которая поможет нам в работе',
    decisionMaker: 'Кто принимает решения по проекту',
    preferredContact: 'Предпочтительный способ связи',
    additionalComments: 'Дополнительные комментарии и пожелания',

    // Success
    successTitle: 'Бриф отправлен!',
    successText: 'Спасибо за заполнение брифа. Мы свяжемся с вами в ближайшее время для обсуждения деталей проекта.',
    backToHome: 'Вернуться на главную'
  } : {
    back: 'Back',
    title: 'Project Brief',
    subtitle: 'Fill out the form so we can better understand your project and provide an accurate estimate',
    next: 'Next',
    prev: 'Back',
    submit: 'Submit Brief',

    // Steps
    step1: 'Product',
    step2: 'Company',
    step3: 'Audience',
    step4: 'Goals',
    step5: 'Features',
    step6: 'Design',
    step7: 'Technical',
    step8: 'Timeline',
    step9: 'Contact',

    // Step 1 - Product Type
    productTypeTitle: 'Product Type',
    productTypeSubtitle: 'Select what product you want to order',
    productType: 'What do you want to develop?',
    productTypeOptions: [
      'Website / Landing Page',
      'CRM / Web Application',
      'Telegram Bot',
      'Mobile Application',
      'Other'
    ],

    // Step 2 - Company
    companyTitle: 'Company Information',
    companySubtitle: 'Tell us about your company so we can better understand your business',
    companyName: 'Company Name',
    businessArea: 'Business Area',
    contactPerson: 'Contact Person',
    phone: 'Phone',
    email: 'Email',
    currentWebsite: 'Current Website (if any)',
    companyDescription: 'Company description and main services/products',
    competitiveAdvantages: 'Your competitive advantages',

    // Step 2 - Audience
    audienceTitle: 'Target Audience',
    audienceSubtitle: 'Describe who your product is designed for',
    targetAudience: 'Describe your target audience (age, gender, interests, geography)',
    problemSolved: 'What problem does your product/service solve for the customer?',

    // Step 4 - Goals
    goalsTitle: 'Project Goals & Objectives',
    goalsSubtitle: 'Define what you want to achieve with the product',
    siteGoals: 'Main project goals',
    visitorActions: 'What tasks should the product solve?',
    kpi: 'How will you measure success? (KPI)',

    goalOptions: [
      'Attracting new clients',
      'Sales of goods/services',
      'Business process automation',
      'Customer management (CRM)',
      'Lead generation',
      'Customer support & consulting',
      'Internal automation',
      'Analytics & reporting'
    ],

    // Step 5 - Functionality
    structureTitle: 'Product Features',
    structureSubtitle: 'Select the required features for your product',
    siteSections: 'Main modules/sections',
    functionality: 'Additional functionality',

    sectionOptions: [
      'Home page / Dashboard',
      'Services / Products catalog',
      'Personal account',
      'Admin panel',
      'Customer management',
      'Order management',
      'Statistics & analytics',
      'Settings & configuration',
      'Chat / Support',
      'Notifications'
    ],

    functionalityOptions: [
      'Contact form',
      'Online booking',
      'Telegram integration',
      'CRM integration',
      'Payment integration',
      '1C / accounting integration',
      'Online chat',
      'Push notifications',
      'Email newsletters',
      'Reports & data export',
      'API for integrations',
      'Multi-language'
    ],

    // Step 6 - Design
    designTitle: 'Design & Style',
    designSubtitle: 'Tell us about your design preferences',
    likedWebsites: 'Links to examples you like (3-5 links)',
    whatLiked: 'What exactly do you like about these examples?',
    whatDisliked: 'What do you NOT like and what to avoid?',
    brandStyle: 'Brand style',
    siteMood: 'Overall product mood',
    colorScheme: 'Preferred color scheme',

    brandOptions: [
      'Have brand book',
      'Need to develop',
      'Logo only',
      'No requirements'
    ],

    moodOptions: [
      'Strict, business-like',
      'Friendly, warm',
      'Minimalist',
      'Bright, dynamic',
      'Premium, luxury',
      'Modern, tech-focused'
    ],

    // Step 6 - Content
    contentTitle: 'Content',
    contentSubtitle: 'Define content sources for the website',
    contentProvider: 'Who prepares the texts for the website?',
    mediaAssets: 'Photo and video materials',

    contentOptions: [
      'Client will provide',
      'Need a copywriter',
      'Joint work'
    ],

    mediaOptions: [
      'Have ready materials',
      'Need photo shooting',
      'Use stock photos',
      'Need video shooting'
    ],

    // Step 7 - Technical
    technicalTitle: 'Technical Requirements',
    technicalSubtitle: 'Specify your technical preferences for the project',
    platform: 'Platform/CMS preferences',
    domainHosting: 'Domain and hosting',
    domainName: 'Domain name (if any)',
    technicalRequirements: 'Additional requirements',

    platformOptions: [
      'React / Next.js',
      'Node.js',
      'Python',
      'Developer\'s choice'
    ],

    hostingOptions: [
      'Already have',
      'Need to purchase',
      'Need consultation'
    ],

    techRequirements: [
      'SEO optimization',
      'Mobile responsive',
      'Fast loading speed',
      'SSL certificate',
      'Analytics integration',
      'Admin panel'
    ],

    // Step 8 - Budget
    budgetTitle: 'Timeline & Budget',
    budgetSubtitle: 'Specify your timeline and budget expectations',
    launchDate: 'Desired launch date',
    budget: 'Project budget',
    priority: 'Project priority',

    budgetOptions: [
      'Negotiable'
    ],

    priorityOptions: [
      'Timeline',
      'Quality',
      'Budget'
    ],

    // Step 9 - Additional
    additionalTitle: 'Additional Information',
    additionalSubtitle: 'Any other information that will help us with the project',
    decisionMaker: 'Who makes project decisions',
    preferredContact: 'Preferred contact method',
    additionalComments: 'Additional comments and wishes',

    // Success
    successTitle: 'Brief Submitted!',
    successText: 'Thank you for filling out the brief. We will contact you shortly to discuss the project details.',
    backToHome: 'Back to Home'
  };

  const steps = [
    { icon: FaLaptopCode, label: t.step1 },  // Product Type
    { icon: FaBuilding, label: t.step2 },     // Company
    { icon: FaUsers, label: t.step3 },        // Audience
    { icon: FaBullseye, label: t.step4 },     // Goals
    { icon: FaSitemap, label: t.step5 },      // Functionality
    { icon: FaPalette, label: t.step6 },      // Design
    { icon: FaCog, label: t.step7 },          // Technical
    { icon: FaCalendarAlt, label: t.step8 },  // Timeline
    { icon: FaCommentAlt, label: t.step9 },   // Contact
  ];

  const handleInputChange = (field: keyof BriefData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof BriefData, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleRadioChange = (field: keyof BriefData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Split text into chunks respecting Telegram's 4096 char limit
  const splitIntoChunks = (text: string, maxLength: number = 4000): string[] => {
    if (text.length <= maxLength) return [text];

    const chunks: string[] = [];
    const lines = text.split('\n');
    let currentChunk = '';

    for (const line of lines) {
      // If single line exceeds max, split it by characters
      if (line.length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        // Split long line into smaller pieces
        for (let i = 0; i < line.length; i += maxLength - 50) {
          chunks.push(line.substring(i, i + maxLength - 50));
        }
        continue;
      }

      if ((currentChunk + '\n' + line).length > maxLength) {
        chunks.push(currentChunk.trim());
        currentChunk = line;
      } else {
        currentChunk = currentChunk ? currentChunk + '\n' + line : line;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  };

  const formatBriefForTelegram = (): string => {
    const sections = [];

    sections.push(`📋 *НОВЫЙ БРИФ*\n`);

    // Product Type
    if (formData.productType) sections.push(`🎯 *Тип продукта:* ${formData.productType}\n`);

    // Company Info
    sections.push(`*1. Информация о компании*`);
    if (formData.companyName) sections.push(`• Компания: ${formData.companyName}`);
    if (formData.businessArea) sections.push(`• Сфера: ${formData.businessArea}`);
    if (formData.contactPerson) sections.push(`• Контакт: ${formData.contactPerson}`);
    if (formData.phone) sections.push(`• Телефон: ${formData.phone}`);
    if (formData.email) sections.push(`• Email: ${formData.email}`);
    if (formData.currentWebsite) sections.push(`• Текущий сайт: ${formData.currentWebsite}`);
    if (formData.companyDescription) sections.push(`• Описание: ${formData.companyDescription}`);
    if (formData.competitiveAdvantages) sections.push(`• Преимущества: ${formData.competitiveAdvantages}`);

    // Target Audience
    sections.push(`\n*2. Целевая аудитория*`);
    if (formData.targetAudience) sections.push(`• ЦА: ${formData.targetAudience}`);
    if (formData.problemSolved) sections.push(`• Решаемая проблема: ${formData.problemSolved}`);

    // Goals
    sections.push(`\n*3. Цели и задачи*`);
    if (formData.siteGoals.length) sections.push(`• Цели: ${formData.siteGoals.join(', ')}`);
    if (formData.visitorActions) sections.push(`• Действия: ${formData.visitorActions}`);
    if (formData.kpi) sections.push(`• KPI: ${formData.kpi}`);

    // Structure
    sections.push(`\n*4. Структура*`);
    if (formData.siteSections.length) sections.push(`• Разделы: ${formData.siteSections.join(', ')}`);
    if (formData.functionality.length) sections.push(`• Функционал: ${formData.functionality.join(', ')}`);

    // Design
    sections.push(`\n*5. Дизайн*`);
    if (formData.likedWebsites) sections.push(`• Референсы: ${formData.likedWebsites}`);
    if (formData.whatLiked) sections.push(`• Нравится: ${formData.whatLiked}`);
    if (formData.whatDisliked) sections.push(`• Не нравится: ${formData.whatDisliked}`);
    if (formData.brandStyle) sections.push(`• Стиль: ${formData.brandStyle}`);
    if (formData.siteMood.length) sections.push(`• Настроение: ${formData.siteMood.join(', ')}`);
    if (formData.colorScheme) sections.push(`• Цвета: ${formData.colorScheme}`);

    // Technical
    sections.push(`\n*6. Техническое*`);
    if (formData.platform.length) sections.push(`• Платформа: ${formData.platform.join(', ')}`);
    if (formData.domainHosting) sections.push(`• Домен/хостинг: ${formData.domainHosting}`);
    if (formData.domainName) sections.push(`• Домен: ${formData.domainName}`);
    if (formData.technicalRequirements.length) sections.push(`• Требования: ${formData.technicalRequirements.join(', ')}`);

    // Budget
    sections.push(`\n*7. Сроки и бюджет*`);
    if (formData.launchDate) sections.push(`• Срок: ${formData.launchDate}`);
    if (formData.budget) sections.push(`• Бюджет: ${formData.budget}`);
    if (formData.priority.length) sections.push(`• Приоритет: ${formData.priority.join(', ')}`);

    // Additional
    sections.push(`\n*8. Дополнительно*`);
    if (formData.decisionMaker) sections.push(`• ЛПР: ${formData.decisionMaker}`);
    if (formData.preferredContact) sections.push(`• Связь: ${formData.preferredContact}`);
    if (formData.additionalComments) sections.push(`• Комментарии: ${formData.additionalComments}`);

    return sections.join('\n');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const message = formatBriefForTelegram();
      const chunks = splitIntoChunks(message);

      // Send to Telegram
      const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
      const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';

      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        // Send all chunks sequentially
        for (let i = 0; i < chunks.length; i++) {
          const chunkText = chunks.length > 1
            ? `${i === 0 ? '' : `📋 *БРИФ (часть ${i + 1}/${chunks.length})*\n\n`}${chunks[i]}`
            : chunks[i];

          const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: chunkText,
              parse_mode: 'Markdown'
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Telegram API error:', errorData);
            throw new Error(errorData.description || 'Failed to send to Telegram');
          }

          // Small delay between messages to avoid rate limiting
          if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        setIsSuccess(true);
      } else {
        // No Telegram config - show error
        console.error('Telegram credentials not configured');
        setSubmitError(language === 'ru'
          ? 'Ошибка конфигурации. Пожалуйста, свяжитесь с нами напрямую.'
          : 'Configuration error. Please contact us directly.');
      }
    } catch (error) {
      console.error('Error submitting brief:', error);
      setSubmitError(language === 'ru'
        ? 'Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую.'
        : 'An error occurred while sending. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Product Type
        return (
          <>
            <SectionTitle><FaLaptopCode /> {t.productTypeTitle}</SectionTitle>
            <SectionSubtitle>{t.productTypeSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.productType}<RequiredMark>*</RequiredMark></Label>
              <RadioGroup>
                {t.productTypeOptions.map((option, index) => (
                  <RadioItem
                    key={index}
                    $checked={formData.productType === option}
                  >
                    <input
                      type="radio"
                      name="productType"
                      checked={formData.productType === option}
                      onChange={() => handleRadioChange('productType', option)}
                    />
                    <Radio $checked={formData.productType === option} />
                    <RadioLabel>{option}</RadioLabel>
                  </RadioItem>
                ))}
              </RadioGroup>
            </FormGroup>
          </>
        );

      case 1: // Company Info
        return (
          <>
            <SectionTitle><FaBuilding /> {t.companyTitle}</SectionTitle>
            <SectionSubtitle>{t.companySubtitle}</SectionSubtitle>

            <FormRow>
              <FormGroup>
                <Label>{t.companyName}<RequiredMark>*</RequiredMark></Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder={language === 'ru' ? 'ООО "Компания"' : 'Company Inc.'}
                />
              </FormGroup>
              <FormGroup>
                <Label>{t.businessArea}</Label>
                <Input
                  value={formData.businessArea}
                  onChange={(e) => handleInputChange('businessArea', e.target.value)}
                  placeholder={language === 'ru' ? 'IT, Ритейл, Услуги...' : 'IT, Retail, Services...'}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>{t.contactPerson}<RequiredMark>*</RequiredMark></Label>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder={language === 'ru' ? 'Иван Иванов' : 'John Doe'}
                />
              </FormGroup>
              <FormGroup>
                <Label>{t.phone}<RequiredMark>*</RequiredMark></Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>{t.email}<RequiredMark>*</RequiredMark></Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </FormGroup>
              <FormGroup>
                <Label>{t.currentWebsite}</Label>
                <Input
                  value={formData.currentWebsite}
                  onChange={(e) => handleInputChange('currentWebsite', e.target.value)}
                  placeholder="https://..."
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>{t.companyDescription}</Label>
              <Textarea
                value={formData.companyDescription}
                onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                placeholder={language === 'ru' ? 'Расскажите о вашей компании...' : 'Tell us about your company...'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.competitiveAdvantages}</Label>
              <Textarea
                value={formData.competitiveAdvantages}
                onChange={(e) => handleInputChange('competitiveAdvantages', e.target.value)}
                placeholder={language === 'ru' ? 'Чем вы отличаетесь от конкурентов?' : 'What makes you different from competitors?'}
              />
            </FormGroup>
          </>
        );

      case 2: // Target Audience
        return (
          <>
            <SectionTitle><FaUsers /> {t.audienceTitle}</SectionTitle>
            <SectionSubtitle>{t.audienceSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.targetAudience}</Label>
              <Textarea
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Например: Мужчины 25-45 лет, предприниматели, Россия и СНГ...'
                  : 'E.g.: Men 25-45, entrepreneurs, USA and Europe...'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.problemSolved}</Label>
              <Textarea
                value={formData.problemSolved}
                onChange={(e) => handleInputChange('problemSolved', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Какую боль или потребность закрывает ваш продукт?'
                  : 'What pain point or need does your product address?'}
              />
            </FormGroup>
          </>
        );

      case 3: // Goals
        return (
          <>
            <SectionTitle><FaBullseye /> {t.goalsTitle}</SectionTitle>
            <SectionSubtitle>{t.goalsSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.siteGoals}</Label>
              <CheckboxGrid>
                {t.goalOptions.map((option, index) => (
                  <CheckboxItem
                    key={index}
                    $checked={formData.siteGoals.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.siteGoals.includes(option)}
                      onChange={() => handleCheckboxChange('siteGoals', option)}
                    />
                    <Checkbox $checked={formData.siteGoals.includes(option)}>
                      <FaCheck />
                    </Checkbox>
                    <CheckboxLabel>{option}</CheckboxLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGrid>
            </FormGroup>

            <FormGroup>
              <Label>{t.visitorActions}</Label>
              <Textarea
                value={formData.visitorActions}
                onChange={(e) => handleInputChange('visitorActions', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Оставить заявку, купить товар, позвонить...'
                  : 'Submit a request, buy a product, call...'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.kpi}</Label>
              <Textarea
                value={formData.kpi}
                onChange={(e) => handleInputChange('kpi', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Количество заявок, продаж, посещаемость...'
                  : 'Number of leads, sales, traffic...'}
              />
            </FormGroup>
          </>
        );

      case 4: // Structure
        return (
          <>
            <SectionTitle><FaSitemap /> {t.structureTitle}</SectionTitle>
            <SectionSubtitle>{t.structureSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.siteSections}</Label>
              <CheckboxGrid>
                {t.sectionOptions.map((option, index) => (
                  <CheckboxItem
                    key={index}
                    $checked={formData.siteSections.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.siteSections.includes(option)}
                      onChange={() => handleCheckboxChange('siteSections', option)}
                    />
                    <Checkbox $checked={formData.siteSections.includes(option)}>
                      <FaCheck />
                    </Checkbox>
                    <CheckboxLabel>{option}</CheckboxLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGrid>
            </FormGroup>

            <FormGroup>
              <Label>{t.functionality}</Label>
              <CheckboxGrid>
                {t.functionalityOptions.map((option, index) => (
                  <CheckboxItem
                    key={index}
                    $checked={formData.functionality.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.functionality.includes(option)}
                      onChange={() => handleCheckboxChange('functionality', option)}
                    />
                    <Checkbox $checked={formData.functionality.includes(option)}>
                      <FaCheck />
                    </Checkbox>
                    <CheckboxLabel>{option}</CheckboxLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGrid>
            </FormGroup>
          </>
        );

      case 5: // Design
        return (
          <>
            <SectionTitle><FaPalette /> {t.designTitle}</SectionTitle>
            <SectionSubtitle>{t.designSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.likedWebsites}</Label>
              <Textarea
                value={formData.likedWebsites}
                onChange={(e) => handleInputChange('likedWebsites', e.target.value)}
                placeholder={language === 'ru'
                  ? 'https://example1.com\nhttps://example2.com\nhttps://example3.com'
                  : 'https://example1.com\nhttps://example2.com\nhttps://example3.com'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.whatLiked}</Label>
              <Textarea
                value={formData.whatLiked}
                onChange={(e) => handleInputChange('whatLiked', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Анимации, цвета, структура...'
                  : 'Animations, colors, structure...'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.whatDisliked}</Label>
              <Textarea
                value={formData.whatDisliked}
                onChange={(e) => handleInputChange('whatDisliked', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Что точно не хотите видеть на сайте?'
                  : 'What do you definitely not want on the site?'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.brandStyle}</Label>
              <RadioGroup>
                {t.brandOptions.map((option, index) => (
                  <RadioItem
                    key={index}
                    $checked={formData.brandStyle === option}
                  >
                    <input
                      type="radio"
                      name="brandStyle"
                      checked={formData.brandStyle === option}
                      onChange={() => handleRadioChange('brandStyle', option)}
                    />
                    <Radio $checked={formData.brandStyle === option} />
                    <RadioLabel>{option}</RadioLabel>
                  </RadioItem>
                ))}
              </RadioGroup>
            </FormGroup>

            <FormGroup>
              <Label>{t.siteMood}</Label>
              <CheckboxGrid $columns={3}>
                {t.moodOptions.map((option, index) => (
                  <CheckboxItem
                    key={index}
                    $checked={formData.siteMood.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.siteMood.includes(option)}
                      onChange={() => handleCheckboxChange('siteMood', option)}
                    />
                    <Checkbox $checked={formData.siteMood.includes(option)}>
                      <FaCheck />
                    </Checkbox>
                    <CheckboxLabel>{option}</CheckboxLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGrid>
            </FormGroup>

            <FormGroup>
              <Label>{t.colorScheme}</Label>
              <Input
                value={formData.colorScheme}
                onChange={(e) => handleInputChange('colorScheme', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Синий, белый, серый...'
                  : 'Blue, white, gray...'}
              />
            </FormGroup>
          </>
        );

      case 6: // Technical
        const isWebsite = formData.productType.includes('Веб-сайт') || formData.productType.includes('Website');
        const isMobileApp = formData.productType.includes('Мобильное') || formData.productType.includes('Mobile');
        const isBot = formData.productType.includes('Telegram') || formData.productType.includes('бот');
        const isCRM = formData.productType.includes('CRM');

        return (
          <>
            <SectionTitle><FaCog /> {t.technicalTitle}</SectionTitle>
            <SectionSubtitle>{t.technicalSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{language === 'ru' ? 'Предпочтения по технологиям' : 'Technology preferences'}</Label>
              <CheckboxGrid $columns={3}>
                {t.platformOptions.map((option, index) => (
                  <CheckboxItem
                    key={index}
                    $checked={formData.platform.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.platform.includes(option)}
                      onChange={() => handleCheckboxChange('platform', option)}
                    />
                    <Checkbox $checked={formData.platform.includes(option)}>
                      <FaCheck />
                    </Checkbox>
                    <CheckboxLabel>{option}</CheckboxLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGrid>
            </FormGroup>

            {/* Domain & Hosting - only for websites */}
            {isWebsite && (
              <>
                <FormGroup>
                  <Label>{t.domainHosting}</Label>
                  <RadioGroup>
                    {t.hostingOptions.map((option, index) => (
                      <RadioItem
                        key={index}
                        $checked={formData.domainHosting === option}
                      >
                        <input
                          type="radio"
                          name="domainHosting"
                          checked={formData.domainHosting === option}
                          onChange={() => handleRadioChange('domainHosting', option)}
                        />
                        <Radio $checked={formData.domainHosting === option} />
                        <RadioLabel>{option}</RadioLabel>
                      </RadioItem>
                    ))}
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label>{t.domainName}</Label>
                  <Input
                    value={formData.domainName}
                    onChange={(e) => handleInputChange('domainName', e.target.value)}
                    placeholder="example.com"
                  />
                </FormGroup>
              </>
            )}

            {/* Mobile App specific */}
            {isMobileApp && (
              <FormGroup>
                <Label>{language === 'ru' ? 'Платформы' : 'Platforms'}</Label>
                <CheckboxGrid $columns={3}>
                  {(language === 'ru'
                    ? ['iOS', 'Android', 'Кроссплатформенное']
                    : ['iOS', 'Android', 'Cross-platform']
                  ).map((option, index) => (
                    <CheckboxItem
                      key={index}
                      $checked={formData.technicalRequirements.includes(option)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.technicalRequirements.includes(option)}
                        onChange={() => handleCheckboxChange('technicalRequirements', option)}
                      />
                      <Checkbox $checked={formData.technicalRequirements.includes(option)}>
                        <FaCheck />
                      </Checkbox>
                      <CheckboxLabel>{option}</CheckboxLabel>
                    </CheckboxItem>
                  ))}
                </CheckboxGrid>
              </FormGroup>
            )}

            {/* Bot specific */}
            {isBot && (
              <FormGroup>
                <Label>{language === 'ru' ? 'Интеграции бота' : 'Bot Integrations'}</Label>
                <CheckboxGrid>
                  {(language === 'ru'
                    ? ['Платежи', 'CRM система', 'Google Sheets', 'База данных', 'Уведомления', 'AI / ChatGPT']
                    : ['Payments', 'CRM system', 'Google Sheets', 'Database', 'Notifications', 'AI / ChatGPT']
                  ).map((option, index) => (
                    <CheckboxItem
                      key={index}
                      $checked={formData.technicalRequirements.includes(option)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.technicalRequirements.includes(option)}
                        onChange={() => handleCheckboxChange('technicalRequirements', option)}
                      />
                      <Checkbox $checked={formData.technicalRequirements.includes(option)}>
                        <FaCheck />
                      </Checkbox>
                      <CheckboxLabel>{option}</CheckboxLabel>
                    </CheckboxItem>
                  ))}
                </CheckboxGrid>
              </FormGroup>
            )}

            {/* CRM/Web App specific */}
            {isCRM && (
              <FormGroup>
                <Label>{language === 'ru' ? 'Требования к системе' : 'System Requirements'}</Label>
                <CheckboxGrid>
                  {(language === 'ru'
                    ? ['Облачное решение', 'Локальная установка', 'Мобильная версия', 'Офлайн режим', 'API интеграции', 'Импорт/экспорт данных']
                    : ['Cloud solution', 'Local installation', 'Mobile version', 'Offline mode', 'API integrations', 'Data import/export']
                  ).map((option, index) => (
                    <CheckboxItem
                      key={index}
                      $checked={formData.technicalRequirements.includes(option)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.technicalRequirements.includes(option)}
                        onChange={() => handleCheckboxChange('technicalRequirements', option)}
                      />
                      <Checkbox $checked={formData.technicalRequirements.includes(option)}>
                        <FaCheck />
                      </Checkbox>
                      <CheckboxLabel>{option}</CheckboxLabel>
                    </CheckboxItem>
                  ))}
                </CheckboxGrid>
              </FormGroup>
            )}

            {/* General requirements - for websites */}
            {isWebsite && (
              <FormGroup>
                <Label>{t.technicalRequirements}</Label>
                <CheckboxGrid>
                  {t.techRequirements.map((option, index) => (
                    <CheckboxItem
                      key={index}
                      $checked={formData.technicalRequirements.includes(option)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.technicalRequirements.includes(option)}
                        onChange={() => handleCheckboxChange('technicalRequirements', option)}
                      />
                      <Checkbox $checked={formData.technicalRequirements.includes(option)}>
                        <FaCheck />
                      </Checkbox>
                      <CheckboxLabel>{option}</CheckboxLabel>
                    </CheckboxItem>
                  ))}
                </CheckboxGrid>
              </FormGroup>
            )}

          </>
        );

      case 7: // Budget
        return (
          <>
            <SectionTitle><FaCalendarAlt /> {t.budgetTitle}</SectionTitle>
            <SectionSubtitle>{t.budgetSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.launchDate}</Label>
              <Input
                type="text"
                value={formData.launchDate}
                onChange={(e) => handleInputChange('launchDate', e.target.value)}
                placeholder={language === 'ru' ? 'Март 2026' : 'March 2026'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.budget}</Label>
              <RadioGroup>
                {t.budgetOptions.map((option, index) => (
                  <RadioItem
                    key={index}
                    $checked={formData.budget === option}
                  >
                    <input
                      type="radio"
                      name="budget"
                      checked={formData.budget === option}
                      onChange={() => handleRadioChange('budget', option)}
                    />
                    <Radio $checked={formData.budget === option} />
                    <RadioLabel>{option}</RadioLabel>
                  </RadioItem>
                ))}
              </RadioGroup>
            </FormGroup>

            <FormGroup>
              <Label>{t.priority}</Label>
              <CheckboxGrid $columns={3}>
                {t.priorityOptions.map((option, index) => (
                  <CheckboxItem
                    key={index}
                    $checked={formData.priority.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.priority.includes(option)}
                      onChange={() => handleCheckboxChange('priority', option)}
                    />
                    <Checkbox $checked={formData.priority.includes(option)}>
                      <FaCheck />
                    </Checkbox>
                    <CheckboxLabel>{option}</CheckboxLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGrid>
            </FormGroup>
          </>
        );

      case 8: // Additional
        return (
          <>
            <SectionTitle><FaCommentAlt /> {t.additionalTitle}</SectionTitle>
            <SectionSubtitle>{t.additionalSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.decisionMaker}</Label>
              <Input
                value={formData.decisionMaker}
                onChange={(e) => handleInputChange('decisionMaker', e.target.value)}
                placeholder={language === 'ru' ? 'Имя и должность' : 'Name and position'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.preferredContact}</Label>
              <Input
                value={formData.preferredContact}
                onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                placeholder={language === 'ru' ? 'Telegram, WhatsApp, Email...' : 'Telegram, WhatsApp, Email...'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.additionalComments}</Label>
              <Textarea
                value={formData.additionalComments}
                onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Любая дополнительная информация о проекте...'
                  : 'Any additional information about the project...'}
              />
            </FormGroup>
          </>
        );

      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <PageWrapper>
        <Navigation />
        <BriefContainer>
          <FormCard
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SuccessScreen>
              <SuccessIcon
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <FaCheck />
              </SuccessIcon>
              <SuccessTitle>{t.successTitle}</SuccessTitle>
              <SuccessText>{t.successText}</SuccessText>
              <NavButton $primary onClick={() => navigate('/')}>
                {t.backToHome}
              </NavButton>
            </SuccessScreen>
          </FormCard>
        </BriefContainer>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <StarField />
      <Navigation />
      <BriefContainer>
        <BackButton
          onClick={() => navigate('/')}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaArrowLeft /> {t.back}
        </BackButton>

        <Header>
          <Logo>SINTARA</Logo>
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t.title}
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t.subtitle}
          </Subtitle>
        </Header>

        <ProgressContainer>
          <ProgressBar>
            <ProgressFill
              $progress={(currentStep + 1) / steps.length * 100}
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep + 1) / steps.length * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </ProgressBar>
          <StepsContainer>
            {steps.map((step, index) => (
              <StepItem
                key={index}
                $active={index === currentStep}
                $completed={index < currentStep}
                onClick={() => setCurrentStep(index)}
              >
                <step.icon />
                <span>{step.label}</span>
              </StepItem>
            ))}
          </StepsContainer>
        </ProgressContainer>

        <FormCard
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {submitError && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {submitError}
            </ErrorMessage>
          )}

          <NavButtons>
            <NavButton
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <FaArrowLeft /> {t.prev}
            </NavButton>

            {currentStep === steps.length - 1 ? (
              <NavButton $primary onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? '...' : t.submit} <FaPaperPlane />
              </NavButton>
            ) : (
              <NavButton $primary onClick={nextStep}>
                {t.next} <FaArrowRight />
              </NavButton>
            )}
          </NavButtons>
        </FormCard>
      </BriefContainer>
    </PageWrapper>
  );
});

Brief.displayName = 'Brief';

export default Brief;
