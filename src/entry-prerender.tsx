import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { LanguageProvider } from './context/LanguageContext';
import { enPath } from './routes';

// Pages are imported directly, not through React.lazy. renderToStaticMarkup
// cannot wait on a suspending component — a lazy route would render its
// Suspense fallback, and we'd bake a loading spinner into the HTML instead of
// the page. The runtime app keeps its lazy imports; only this build-time entry
// pulls everything in eagerly.
import Home from './pages/Home';
import Work from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Brief from './pages/Brief';
import RentCrmProduct from './pages/RentCrmProduct';
import NotFound from './pages/NotFound';

export { resolveSeo } from './lib/seoPages';
export { PRERENDER_PATHS } from './lib/routes';
export { withLanguage } from './lib/i18n';

const PAGES = [
  { path: '/', element: <Home /> },
  { path: '/work', element: <Work /> },
  { path: '/work/:slug', element: <ProjectDetail /> },
  { path: '/services', element: <Services /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/brief', element: <Brief /> },
  { path: '/products/sintara-rent-crm', element: <RentCrmProduct /> },
];

/**
 * Build-time renderer. Produces the static HTML a crawler sees before any
 * JavaScript runs — which, for this site, used to be an empty <div id="root">
 * on every URL.
 *
 * Deliberately NOT hydrated: createRoot replaces the container's contents on
 * its first render, so the browser throws this markup away the moment the
 * bundle boots. That means we don't have to make the whole app
 * hydration-clean — we only need each page to render once without touching
 * browser APIs. Everything that does (WebGL, Lenis, the cursor, audio) already
 * lives in effects, which never run here.
 *
 * The language is not a parameter: it comes from the URL, exactly as it does
 * in the browser. Rendering "/en/work" yields the English page because
 * LanguageProvider reads the prefix — the same code path visitors get, so the
 * static HTML cannot disagree with the live site.
 */
export const render = (url: string) => {
  const sheet = new ServerStyleSheet();
  try {
    const html = renderToStaticMarkup(
      sheet.collectStyles(
        <MemoryRouter initialEntries={[url]}>
          <LanguageProvider>
            <GlobalStyles />
            <Routes>
              {PAGES.flatMap(({ path, element }) =>
                [path, enPath(path)].map((routePath) => (
                  <Route key={routePath} path={routePath} element={element} />
                )),
              )}
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </MemoryRouter>,
      ),
    );
    return { html, css: sheet.getStyleTags() };
  } finally {
    sheet.seal();
  }
};
