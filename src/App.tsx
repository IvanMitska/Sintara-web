import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';
import { AmbientAudioProvider } from './components/audio/AmbientAudio';
import SmoothScroll from './components/SmoothScroll';
import RouteMount from './components/RouteMount';
import Cursor from './components/Cursor';

// GlobalCanvas (Three.js) was the host for the WebGL hero. Now that the
// hero is a <video>, mounting an idle Canvas still allocates a WebGL
// context + framebuffers + the CrystalScene/Bloom/Vignette graph in GPU
// memory, competing with the video decoder for the same screen. Removed
// from the tree; the files in src/webgl/ are kept for future scenes.

// Home is eager — first paint matters
import Home from './pages/Home';

// Inner-page imports are held as plain factories so we can both lazy-load them
// for React.lazy AND warm them up on idle. Without the warm-up the first click
// from Home into an inner page has to wait on the chunk fetch + parse during
// the React commit — which shows up as a brief freeze on the still-visible
// home page right before the route swaps in.
const workImport = () => import('./pages/Work');
const projectDetailImport = () => import('./pages/ProjectDetail');
const servicesImport = () => import('./pages/Services');
const aboutImport = () => import('./pages/About');
const contactImport = () => import('./pages/Contact');
const briefImport = () => import('./pages/Brief');
const sintaraCrmImport = () => import('./pages/SintaraCrmProduct');
const notFoundImport = () => import('./pages/NotFound');

const Work = lazy(workImport);
const ProjectDetail = lazy(projectDetailImport);
const Services = lazy(servicesImport);
const About = lazy(aboutImport);
const Contact = lazy(contactImport);
const Brief = lazy(briefImport);
const SintaraCrmProduct = lazy(sintaraCrmImport);
const NotFound = lazy(notFoundImport);

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

    // Warm the inner-page chunks during browser idle time so the first
    // navigation from Home doesn't pay the fetch+parse tax mid-commit.
    const warm = () => {
      void workImport();
      void projectDetailImport();
      void servicesImport();
      void aboutImport();
      void contactImport();
      void briefImport();
      void sintaraCrmImport();
      void notFoundImport();
    };
    const win = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    let idleHandle = 0;
    let timeoutHandle = 0;
    if (win.requestIdleCallback) {
      idleHandle = win.requestIdleCallback(warm, { timeout: 4000 });
    } else {
      timeoutHandle = window.setTimeout(warm, 1500);
    }

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      if (idleHandle && win.cancelIdleCallback) win.cancelIdleCallback(idleHandle);
      if (timeoutHandle) window.clearTimeout(timeoutHandle);
    };
  }, []);

  return (
    <LanguageProvider>
      <AmbientAudioProvider>
        <BrowserRouter>
          <GlobalStyles />
          <SmoothScroll />
          <Cursor />
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              {/* Each RouteMount gets a key tied to its route so React doesn't
                  reuse a single instance across navigations — without it
                  React keeps the same RouteMount mounted across route swaps
                  (same component, same position) and our mount-only scroll
                  reset never refires on the new route. */}
              <Routes>
              <Route path="/" element={<><RouteMount key="r:/" /><Home /></>} />
              <Route path="/work" element={<><RouteMount key="r:/work" /><Work /></>} />
              <Route path="/work/:slug" element={<><RouteMount key="r:/work/:slug" /><ProjectDetail /></>} />
              {/* Keep legacy /project/:slug for backward compat */}
              <Route path="/project/:slug" element={<><RouteMount key="r:/project/:slug" /><ProjectDetail /></>} />
              <Route path="/services" element={<><RouteMount key="r:/services" /><Services /></>} />
              <Route path="/about" element={<><RouteMount key="r:/about" /><About /></>} />
              <Route path="/contact" element={<><RouteMount key="r:/contact" /><Contact /></>} />
              <Route path="/brief" element={<><RouteMount key="r:/brief" /><Brief /></>} />
              <Route path="/products/sintara-crm" element={<><RouteMount key="r:/products/sintara-crm" /><SintaraCrmProduct /></>} />
              <Route path="*" element={<><RouteMount key="r:404" /><NotFound /></>} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </AmbientAudioProvider>
    </LanguageProvider>
  );
};

export default App;
