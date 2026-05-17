import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';
import { AmbientAudioProvider } from './components/audio/AmbientAudio';
import SmoothScroll from './components/SmoothScroll';
import Cursor from './components/Cursor';

// WebGL layer is heavy (three.js) — keep it out of the initial bundle.
const GlobalCanvas = lazy(() => import('./webgl/GlobalCanvas'));

// Home is eager — first paint matters
import Home from './pages/Home';

// Inner pages lazy-loaded
const Work = lazy(() => import('./pages/Work'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Services = lazy(() => import('./pages/Services'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Brief = lazy(() => import('./pages/Brief'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LoaderShell = styled.div`
  position: fixed;
  inset: 0;
  background: var(--bone);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 1.4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(2.5); opacity: 0.3; }
  }
`;

const PageLoader = () => <LoaderShell aria-label="Loading" />;

const App = () => {
  useEffect(() => {
    // Low-end device hint → reduce motion class
    const isLowEnd =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) < 2;
    if (isLowEnd || navigator.hardwareConcurrency <= 2) {
      document.documentElement.classList.add('reduce-motion');
    }

    const handleError = (e: ErrorEvent) => {
      console.error('Global error:', e.error);
    };
    const handleRejection = (e: PromiseRejectionEvent) => {
      console.error('Unhandled rejection:', e.reason);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <LanguageProvider>
      <AmbientAudioProvider>
        <BrowserRouter>
          <GlobalStyles />
          <SmoothScroll />
          <Suspense fallback={null}>
            <GlobalCanvas />
          </Suspense>
          <Cursor />
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<ProjectDetail />} />
              {/* Keep legacy /project/:slug for backward compat */}
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/brief" element={<Brief />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </AmbientAudioProvider>
    </LanguageProvider>
  );
};

export default App;
