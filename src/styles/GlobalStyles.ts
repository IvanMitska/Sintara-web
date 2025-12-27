import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Используем системные шрифты для надежности */

  /* Определяем CSS переменные для унификации стилей */
  :root {
    /* Основные цвета - iOS 26 Purple Theme */
    --color-background: #0a0015; /* Основной фон - темно-фиолетовый */
    --color-surface: #15082a; /* Вторичный фон */
    --color-surface-light: #1a0d2e; /* Светлая поверхность */
    --color-primary: #7c3aed; /* Основной фиолетовый */
    --color-secondary: #6d28d9; /* Темно-фиолетовый */
    --color-accent: #8b5cf6; /* Светло-фиолетовый акцент */
    --color-accent-secondary: #a78bfa; /* Вторичный фиолетовый */
    --color-success: #10b981; /* Цвет успеха */
    --color-text: #ffffff;
    --color-text-secondary: #c7d2fe;
    --color-text-disabled: #6b7280;

    /* Liquid Glass Gradients & Effects - Optimized */
    --gradient-primary: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6d28d9 100%);
    --gradient-liquid: linear-gradient(45deg, rgba(124, 58, 237, 0.15) 0%, rgba(168, 85, 247, 0.2) 50%, rgba(124, 58, 237, 0.15) 100%);
    --gradient-glass: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(124, 58, 237, 0.06) 100%);
    --gradient-glass-strong: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 50%, rgba(124, 58, 237, 0.1) 100%);
    --gradient-button: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    --gradient-button-hover: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    --gradient-text: linear-gradient(135deg, #ffffff 0%, #e5e7eb 50%, #f9fafb 100%);
    --gradient-background: #050208;
    --gradient-section-divider: linear-gradient(90deg, transparent 0%, rgba(124, 58, 237, 0.4) 20%, rgba(168, 85, 247, 0.6) 50%, rgba(124, 58, 237, 0.4) 80%, transparent 100%);

    /* Liquid Glass Morphing Effects - Performance Optimized */
    --liquid-blur: blur(8px);
    --liquid-blur-heavy: blur(12px);
    --liquid-border: 1px solid rgba(255, 255, 255, 0.12);
    --liquid-border-light: 1px solid rgba(255, 255, 255, 0.08);
    --liquid-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(124, 58, 237, 0.1);
    --liquid-shadow-elevated: 0 20px 60px rgba(0, 0, 0, 0.2), 0 8px 32px rgba(124, 58, 237, 0.15);
    --liquid-glow: 0 0 40px rgba(124, 58, 237, 0.3), 0 0 80px rgba(168, 85, 247, 0.15);
    
    /* Размеры и отступы */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 2rem;
    --space-xl: 4rem;
    
    /* Тени - упрощаем для лучшей производительности */
    --shadow-sm: 0 2px 5px rgba(0, 0, 0, 0.2);
    --shadow-md: 0 5px 15px rgba(0, 0, 0, 0.2);
    --shadow-lg: 0 8px 15px rgba(142, 45, 226, 0.15);
    --shadow-accent: 0 8px 15px rgba(255, 125, 84, 0.2);
    
    /* Liquid Animations - Optimized for performance */
    --transition-liquid: 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    --transition-morph: 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    --transition-glass: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --transition-float: 0.4s ease-out;
    --transition-fast: 0.2s ease-out;
    
    /* Скругления углов */
    --radius-sm: 5px;
    --radius-md: 10px;
    --radius-lg: 20px;
    --radius-full: 9999px;
    
    /* Z-индексы */
    --z-negative: -1;
    --z-default: 1;
    --z-tooltip: 10;
    --z-fixed: 100;
    --z-modal: 1000;
    
    /* Размеры контейнеров */
    --container-max-width: 1200px;
    --container-padding: 2rem;
    
    /* Медиа-запросы */
    --breakpoint-sm: 576px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 992px;
    --breakpoint-xl: 1200px;
    
    /* Определяем фиксированные размеры для уменьшения CLS */
    --hero-height: 100vh;
    --section-padding: 8rem 0;
    
    /* Параметры анимации - могут быть отключены на слабых устройствах */
    --animation-enabled: 1;
    --effect-blur-enabled: 1;
    --hover-transform-enabled: 1;
    --parallax-enabled: 1;
  }

  /* Сбрасываем стили для всех элементов */  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent !important; /* Убираем стандартный эффект нажатия на мобильных */
  }
  
  /* Улучшенное поведение прокрутки для лучшего UX */
  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 16px;

    @media (prefers-reduced-motion: reduce) {
      scroll-behavior: auto; /* Улучшение доступности */
    }

    /* Явно задаем предпочтительные версии рендеринга */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  
  /* Класс для сильного снижения анимации на слабых устройствах */
  html.reduce-motion {
    --animation-enabled: 0;
    --effect-blur-enabled: 0;
    --hover-transform-enabled: 0;
    --parallax-enabled: 0;
    
    /* Отключаем все анимации и переходы для слабых устройств */
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
    
    /* Отключаем эффекты hover на слабых устройствах */
    *:hover {
      transform: none !important;
      box-shadow: none !important;
    }
    
    /* Отключаем фильтры и градиенты на слабых устройствах */
    [style*="filter"] {
      filter: none !important;
    }
    
    /* Отключаем 3D-трансформации */
    [style*="transform"] {
      transform: none !important;
    }
  }
  
  /* Liquid Glass Body Styling */
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
    font-weight: 400;
    line-height: 1.6;
    background: #050208;
    color: var(--color-text);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    min-height: 100vh;

    /* Оптимизируем скроллбар */
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #0a0015;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      border-radius: 3px;
    }
  }

  /* Контейнер для всего приложения */
  #root {
    width: 100%;
    margin: 0 auto;
    /* Задаем минимальную высоту для предотвращения CLS при загрузке */
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Стили для заголовков - iOS 26 style */
  h1, h2, h3, h4, h5, h6 {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
    font-weight: 700;
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    line-height: 1.1;
    letter-spacing: -0.025em;
  }

  /* Стили для различных заголовков */
  h1 {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    margin-bottom: 1.25rem;
  }

  h3 {
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    margin-bottom: 1rem;
  }

  h4 {
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    margin-bottom: 0.75rem;
  }

  h5 {
    font-size: clamp(1.25rem, 2vw, 1.5rem);
    margin-bottom: 0.5rem;
  }

  /* Стили для параграфов и ссылок */
  p {
    margin-bottom: 1rem;
    color: var(--color-text-secondary);
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: var(--transition-fast);
  }

  /* Условные стили для устройств с включенной анимацией */
  button, a, .btn {
    cursor: pointer;
    
    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
    
    /* Применяем hover эффекты только если включены анимации */
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: var(--color-accent);
        transform: translateY(calc(-3px * var(--hover-transform-enabled)));
      }
    }
  }

  /* Улучшение производительности для мобильных устройств */
  @media (max-width: 768px) {
    html {
      font-size: 14px; /* Уменьшаем базовый размер шрифта */
    }
    
    /* Уменьшаем размер секций */
    section {
      padding: 4rem 0;
    }
    
    /* Уменьшаем вложенность анимаций */
    .performance-container {
      contain: content; /* Изолируем содержимое для оптимизации */
    }
  }
  
  /* Глобальные классы для скрытия элементов по условиям */
  .hide-on-mobile {
    @media (max-width: 768px) {
      display: none !important;
    }
  }
  
  .hide-on-low-performance {
    @media (prefers-reduced-motion: reduce) {
      display: none !important;
    }
  }
  
  /* Классы для повышения производительности */
  .optimize-paint {
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
  }
  
  .performance-container {
    will-change: auto;
    contain: layout style;
  }
  
  /* Добавляем стили для лоадеров и подсказок загрузки */
  .loading-placeholder {
    background: linear-gradient(90deg, var(--color-surface) 0%, var(--color-surface-light) 50%, var(--color-surface) 100%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    
    /* Отключаем для слабых устройств */
    html.reduce-motion & {
      background: var(--color-surface-light);
      animation: none;
    }
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Класс для красивых градиентных заголовков */
  .gradient-title {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  /* Альтернативный градиент для разнообразия */
  .gradient-title-alt {
    background: var(--gradient-secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  /* Стили для разделителей секций */
  .section-divider {
    width: 100%;
    height: 2px;
    background: var(--gradient-section-divider);
    margin: 0;
    border: none;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  /* Тонкий разделитель */
  .section-divider--thin {
    height: 1px;
    opacity: 0.4;
  }

  /* Центрированная точка-разделитель */
  .section-divider--dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--gradient-primary);
    margin: 0 auto;
    transform: translateY(-50%);
  }

  /* Liquid Glass Animations - GPU Optimized */
  @keyframes liquidFlow {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    33% {
      transform: translate3d(30px, -20px, 0) scale(1.05);
    }
    66% {
      transform: translate3d(-20px, 30px, 0) scale(0.95);
    }
  }

  @keyframes liquidMorph {
    0%, 100% {
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    }
    50% {
      border-radius: 40% 60% 60% 40% / 40% 60% 40% 60%;
    }
  }

  @keyframes liquidShimmer {
    0% {
      transform: translateX(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(200%) rotate(45deg);
    }
  }

  @keyframes liquidPulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.02);
    }
  }

  @keyframes liquidFloat {
    0%, 100% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(0, -15px, 0);
    }
  }

  /* Liquid Glass Utility Classes - Optimized */
  .liquid-glass {
    background: var(--gradient-glass);
    backdrop-filter: var(--liquid-blur);
    -webkit-backdrop-filter: var(--liquid-blur);
    border: var(--liquid-border);
    box-shadow: var(--liquid-shadow);
    border-radius: 24px;
    position: relative;
    overflow: hidden;
    contain: layout style paint;
    will-change: transform;
    transform: translate3d(0, 0, 0);

    /* Surface highlight */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
      border-radius: 24px 24px 0 0;
      pointer-events: none;
    }

    &:hover {
      transform: translate3d(0, -4px, 0);
      box-shadow: var(--liquid-shadow-elevated);
    }
  }

  .liquid-glass-elevated {
    background: var(--gradient-glass-strong);
    backdrop-filter: var(--liquid-blur-heavy);
    -webkit-backdrop-filter: var(--liquid-blur-heavy);
    border: var(--liquid-border);
    box-shadow: var(--liquid-shadow-elevated);
    border-radius: 28px;
    position: relative;
    overflow: hidden;
    contain: layout style paint;
    will-change: transform;
    transform: translate3d(0, 0, 0);
  }

  .liquid-morphing {
    animation: liquidMorph 12s ease-in-out infinite;
    will-change: border-radius;
  }

  .liquid-floating {
    animation: liquidFloat 8s ease-in-out infinite;
    will-change: transform;
  }

  /* Performance utility */
  .gpu-accelerated {
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  /* Pause animations when not visible */
  .pause-animations * {
    animation-play-state: paused !important;
  }
`;

export default GlobalStyles; 