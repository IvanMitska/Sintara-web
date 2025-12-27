import { useEffect, lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import { lazyLoad, LazyLoadSection } from './components/LazyLoader';
import ErrorBoundary from './components/ErrorBoundary';
import styled from 'styled-components';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import AIChatWidget from './components/AIChatWidget';
import StarField from './components/StarField';

// Определяем производительность устройства при загрузке
const isMobile = window.innerWidth < 768;
const isLowEndDevice = isMobile ||
  navigator.hardwareConcurrency <= 4 ||
  (navigator as any).deviceMemory < 4 ||
  /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

// Минимальный компонент Layout без лишней логики
const Layout = styled.div`
  overflow-x: hidden;
  background: transparent;
  min-height: 100vh;
  position: relative;
  z-index: 1;
`;

// Базовый лоадер для основного контента
const MainLoader = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #050208;

  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 2px solid rgba(124, 58, 237, 0.2);
    border-radius: 50%;
    border-top-color: var(--color-primary);
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Ленивая загрузка остальных секций
const Services = lazyLoad(() => import('./sections/Services'));
const Benefits = lazyLoad(() => import('./sections/Benefits'));
const WorkProcess = lazyLoad(() => import('./sections/WorkProcess'));
const LiveCodeDemo = lazyLoad(() => import('./sections/LiveCodeDemo'));
const Pricing = lazyLoad(() => import('./sections/Pricing'));
const Portfolio = lazyLoad(() => import('./sections/Portfolio'));
const ProjectShowcase = lazyLoad(() => import('./sections/ProjectShowcase'));
const FAQ = lazyLoad(() => import('./sections/FAQ'));
const Contact = lazyLoad(() => import('./sections/Contact'));
const Footer = lazyLoad(() => import('./components/Footer'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

function HomePage({ isReady }: { isReady: boolean }) {
  const location = useLocation();

  // Обработка hash для прокрутки к секции
  useEffect(() => {
    // Если есть hash - прокручиваем к нужной секции
    if (location.hash) {
      const elementId = location.hash.replace('#', '');

      const scrollToElement = (attempts = 0) => {
        const element = document.getElementById(elementId);
        if (element) {
          // Используем setTimeout чтобы дать странице стабилизироваться
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Очищаем hash из URL после прокрутки
            setTimeout(() => {
              window.history.replaceState(null, '', window.location.pathname);
            }, 500);
          }, 50);
        } else if (attempts < 25) {
          // Элемент ещё не загружен, прокручиваем вниз чтобы триггернуть lazy loading
          // Постепенно увеличиваем позицию скролла
          const scrollProgress = Math.min(0.5 + (attempts * 0.05), 0.95);
          window.scrollTo({ top: document.body.scrollHeight * scrollProgress, behavior: 'auto' });
          // Повторяем попытку
          setTimeout(() => scrollToElement(attempts + 1), 80);
        }
      };

      // Начинаем сразу
      scrollToElement();
    } else {
      // Без hash - прокручиваем к началу страницы
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      {/* Starfield background - показываем на всех устройствах */}
      <StarField />

      <Navigation />
      <AIChatWidget />
      <Layout>
        <Hero />

        {/* Остальные секции загружаются лениво при скролле */}
        <LazyLoadSection threshold={isLowEndDevice ? 0.01 : 0.05} rootMargin={isLowEndDevice ? '100px' : '300px'}>
          <Services />
        </LazyLoadSection>

        <LazyLoadSection threshold={isLowEndDevice ? 0.01 : 0.05} rootMargin={isLowEndDevice ? '100px' : '300px'}>
          <Benefits />
        </LazyLoadSection>

        <LazyLoadSection threshold={isLowEndDevice ? 0.01 : 0.05} rootMargin={isLowEndDevice ? '100px' : '300px'}>
          <WorkProcess />
        </LazyLoadSection>

        <LazyLoadSection threshold={isLowEndDevice ? 0.01 : 0.05} rootMargin={isLowEndDevice ? '100px' : '300px'}>
          <Pricing />
        </LazyLoadSection>

        <LazyLoadSection threshold={isLowEndDevice ? 0.01 : 0.05} rootMargin={isLowEndDevice ? '100px' : '300px'}>
          <LiveCodeDemo />
        </LazyLoadSection>

        <LazyLoadSection threshold={0.01} rootMargin={isLowEndDevice ? '50px' : '200px'}>
          <ProjectShowcase />
        </LazyLoadSection>

        <LazyLoadSection threshold={0.01} rootMargin={isLowEndDevice ? '50px' : '200px'}>
          <Portfolio />
        </LazyLoadSection>

        <LazyLoadSection threshold={0.01} rootMargin={isLowEndDevice ? '50px' : '200px'}>
          <FAQ />
        </LazyLoadSection>

        <LazyLoadSection threshold={0.01} rootMargin={isLowEndDevice ? '50px' : '200px'}>
          <Contact />
        </LazyLoadSection>
      </Layout>

      {/* Футер */}
      <LazyLoadSection threshold={0.1} rootMargin={isLowEndDevice ? '10px' : '50px'}>
        <Footer />
      </LazyLoadSection>

    </>
  );
}

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Отключаем все анимации на слабых устройствах
    if (isLowEndDevice) {
      document.documentElement.classList.add('reduce-motion');
    }

    // Глобальный обработчик ошибок для предотвращения белого экрана
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      event.preventDefault();
      return true;
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Предварительное определение размеров для предотвращения CLS
    document.documentElement.style.setProperty('--hero-height', `${window.innerHeight}px`);

    // Устанавливаем статус готовности
    setIsReady(true);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <BrowserRouter>
      <GlobalStyles />
      <ErrorBoundary>
        <Suspense fallback={<MainLoader />}>
          <Routes>
            <Route path="/" element={<HomePage isReady={isReady} />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
