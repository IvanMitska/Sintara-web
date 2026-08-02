import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { parsePath, withLanguage } from '../lib/i18n';
import { resolveSeo } from '../lib/seoPages';
import { applySeo } from '../lib/seo';

/**
 * Keeps the document head correct as the user navigates client-side.
 *
 * The first load already arrives with the right head baked in by the build's
 * prerender step (scripts/prerender.mjs) — this handles everything after that:
 * route changes that never touch the server, and the language toggle, which
 * rewrites every title and description without changing the URL.
 *
 * Both read the same table (lib/seoPages), so what a crawler sees in the static
 * HTML and what a visitor ends up with cannot drift apart.
 */
const RouteSeo = () => {
  const { pathname } = useLocation();
  // Language comes from the URL, not from context — the same parse the router
  // and the prerender use, so all three agree on what page this is.
  const { language, path } = parsePath(pathname);

  useLayoutEffect(() => {
    const seo = resolveSeo(path, language);

    applySeo({
      title: seo.title,
      description: seo.description,
      path,
      url: withLanguage(path, language),
      image: seo.image,
      noindex: seo.noindex,
      lang: language,
    });
  }, [path, language]);

  return null;
};

export default RouteSeo;
