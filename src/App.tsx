import { useEffect, lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import { lazyLoad, LazyLoadSection } from './components/LazyLoader';
import ErrorBoundary from './components/ErrorBoundary';
import styled from 'styled-components';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import { LanguageProvider } from './context/LanguageContext';
import { planetStations } from './data/cameraPath';

// Lazy load 3D scene for better initial load
const ImmersiveScene = lazy(() => import('./components/3d/ImmersiveScene'));

// Device detection
const isLowEndDevice =
  navigator.hardwareConcurrency <= 2 ||
  (navigator as any).deviceMemory < 2;

// Layout for content sections
const Layout = styled.div`
  position: relative;
  z-index: 1;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

// Scroll zone for each planet station
const ScrollZone = styled.section<{ $height: string }>`
  min-height: ${props => props.$height};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

// Main loader
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

// 3D scene loader background
const SceneLoader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #050208;
  z-index: 0;
`;

// Lazy loaded sections
const Services = lazyLoad(() => import('./sections/Services'));
const Benefits = lazyLoad(() => import('./sections/Benefits'));
const WorkProcess = lazyLoad(() => import('./sections/WorkProcess'));
const Testimonials = lazyLoad(() => import('./sections/Testimonials'));
const LiveCodeDemo = lazyLoad(() => import('./sections/LiveCodeDemo'));
const Pricing = lazyLoad(() => import('./sections/Pricing'));
const Portfolio = lazyLoad(() => import('./sections/Portfolio'));
const FAQ = lazyLoad(() => import('./sections/FAQ'));
const Contact = lazyLoad(() => import('./sections/Contact'));
const Footer = lazyLoad(() => import('./components/Footer'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Brief = lazy(() => import('./pages/Brief'));

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const stationIndex = planetStations.findIndex(station =>
        station.sections.includes(elementId)
      );

      if (stationIndex >= 0) {
        const scrollPerStation = window.innerHeight * 1.2;
        const targetScroll = stationIndex * scrollPerStation;

        setTimeout(() => {
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname);
          }, 500);
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      {/* 3D Background */}
      <Suspense fallback={<SceneLoader />}>
        <ImmersiveScene />
      </Suspense>

      {/* Navigation */}
      <Navigation />

      {/* Content sections */}
      <Layout>
        {/* Station 1: Hero (Moon) */}
        <ScrollZone id="hero" $height="120vh">
          <Hero />
        </ScrollZone>

        {/* Station 2: Services (Jupiter) */}
        <ScrollZone id="services" $height="120vh">
          <LazyLoadSection priority>
            <Services />
          </LazyLoadSection>
        </ScrollZone>

        {/* Station 3: Portfolio (Saturn) */}
        <ScrollZone id="portfolio" $height="120vh">
          <LazyLoadSection priority>
            <Portfolio />
          </LazyLoadSection>
        </ScrollZone>

        {/* Station 4: Benefits & Process (Mars) */}
        <ScrollZone id="benefits" $height="150vh">
          <LazyLoadSection priority>
            <Benefits />
          </LazyLoadSection>
          <LazyLoadSection priority>
            <WorkProcess />
          </LazyLoadSection>
        </ScrollZone>

        {/* Station 5: Pricing & Testimonials (Uranus) */}
        <ScrollZone id="pricing" $height="150vh">
          <LazyLoadSection threshold={isLowEndDevice ? 0.01 : 0.05}>
            <Pricing />
          </LazyLoadSection>
          <LazyLoadSection threshold={isLowEndDevice ? 0.01 : 0.05}>
            <Testimonials />
          </LazyLoadSection>
        </ScrollZone>

        {/* Station 6: Contact & FAQ (Neptune) */}
        <ScrollZone id="contact" $height="150vh">
          <LazyLoadSection threshold={isLowEndDevice ? 0.01 : 0.05}>
            <LiveCodeDemo />
          </LazyLoadSection>
          <LazyLoadSection threshold={0.01}>
            <FAQ />
          </LazyLoadSection>
          <LazyLoadSection threshold={0.01}>
            <Contact />
          </LazyLoadSection>
        </ScrollZone>

        {/* Footer */}
        <LazyLoadSection threshold={0.1}>
          <Footer />
        </LazyLoadSection>
      </Layout>
    </>
  );
}

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLowEndDevice) {
      document.documentElement.classList.add('reduce-motion');
    }

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

    document.documentElement.style.setProperty('--hero-height', `${window.innerHeight}px`);
    setIsReady(true);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <GlobalStyles />
        <ErrorBoundary>
          <Suspense fallback={<MainLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="/brief" element={<Brief />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
