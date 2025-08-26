import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Используем системные шрифты для надежности */
  
  /* Определяем CSS переменные для унификации стилей */
  :root {
    /* Основные цвета */
    --color-background: #000000; /* Основной фон - черный */
    --color-surface: #0a0a0a; /* Вторичный фон */
    --color-surface-light: #111111; /* Светлая поверхность */
    --color-primary: #8E2DE2; /* Основной фиолетовый */
    --color-primary-gradient: linear-gradient(90deg, #8E2DE2, #4A00E0);
    --color-secondary: #4A00E0; /* Фиолетовый вторичный */
    --color-accent: #FF7D54; /* Теплый акцентный цвет */
    --color-accent-secondary: #FFB443; /* Вторичный теплый акцент */
    --color-accent-gradient: linear-gradient(90deg, #FF7D54, #FFB443);
    --color-success: #4CD964; /* Цвет успеха */
    --color-text: #ffffff;
    --color-text-secondary: #a0a0a0;
    --color-text-disabled: #777777;
    
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
    
    /* Анимации - упрощаем для лучшей производительности */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    --transition-bounce: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    
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
    font-size: 16px;
    
    @media (prefers-reduced-motion: reduce) {
      scroll-behavior: auto; /* Улучшение доступности */
    }
    
    /* Явно задаем предпочтительные версии рендеринга */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    
    /* Упрощаем обработку touch-событий */
    touch-action: manipulation;
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
  
  /* Задаем основной фон и цвет текста */
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 400;
    line-height: 1.6;
    background-color: var(--color-background);
    color: var(--color-text);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    
    /* Задаем минимальную высоту для предотвращения CLS при загрузке */
    min-height: 100vh;
    
    /* Оптимизируем скроллбар */
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--color-surface);
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--color-primary);
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

  /* Стили для заголовков */
  h1, h2, h3, h4, h5, h6 {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 700;
    background: linear-gradient(90deg, #8E2DE2, #4A00E0, #FF7D54);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    line-height: 1.3;
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
    background: linear-gradient(90deg, #8E2DE2, #4A00E0, #FF7D54);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  /* Альтернативный градиент для разнообразия */
  .gradient-title-alt {
    background: linear-gradient(135deg, #8E2DE2, #4A00E0, #FF7D54, #FFB443);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
`;

export default GlobalStyles; 