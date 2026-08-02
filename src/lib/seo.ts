/**
 * Per-route document metadata.
 *
 * The site is a single HTML file with client-side routing, so without this
 * every URL — /work/kaif, /services, /about — served the homepage's title,
 * description and canonical. To a crawler that reads as one page with a lot of
 * duplicate content, and the tab title never changed either.
 *
 * Why imperative DOM writes instead of React 19's metadata hoisting: index.html
 * already ships a full static head (title, description, canonical, OG, Twitter).
 * Hoisted tags are *appended*, so every route would end up with two titles and
 * two descriptions, and consumers take the first one — the static one. Updating
 * the existing tags in place keeps exactly one of each, and keeps the static
 * values as the pre-hydration fallback.
 *
 * Note what this does NOT fix: crawlers that don't run JavaScript still see the
 * static head. Google renders JS, but most messenger link previews (Telegram,
 * WhatsApp, Slack) do not — their cards still show the homepage's OG data.
 * Fixing that needs prerendered HTML per route, which is a separate job.
 */

import { withLanguage } from './i18n';

const SITE = 'https://sintara.io';

// Mirrors the value hardcoded in index.html — kept here so restoring the
// default after a noindex route doesn't quietly drop the crawl directives.
const DEFAULT_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export interface SeoMeta {
  title: string;
  description: string;
  /** Language-neutral path, e.g. "/work/kaif" — used to build the hreflang pair. */
  path: string;
  /** The actual address of this page, language prefix included ("/en/work"). */
  url: string;
  /** Absolute or root-relative image for link previews. */
  image?: string;
  /** Keep this route out of the index (404s, thin utility pages). */
  noindex?: boolean;
  lang: 'ru' | 'en';
}

/** Find a head tag by attribute, or create it if the static HTML lacks one. */
const tag = (
  selector: string,
  create: () => HTMLElement,
): HTMLElement | null => {
  if (typeof document === 'undefined') return null;
  const found = document.head.querySelector<HTMLElement>(selector);
  if (found) return found;
  const made = create();
  document.head.appendChild(made);
  return made;
};

const meta = (kind: 'name' | 'property', key: string, value: string) => {
  const el = tag(`meta[${kind}="${key}"]`, () => {
    const node = document.createElement('meta');
    node.setAttribute(kind, key);
    return node;
  });
  el?.setAttribute('content', value);
};

export const applySeo = (seo: SeoMeta) => {
  if (typeof document === 'undefined') return;

  const url = `${SITE}${seo.url === '/' ? '/' : seo.url.replace(/\/$/, '')}`;
  const image = seo.image
    ? seo.image.startsWith('http')
      ? seo.image
      : `${SITE}${seo.image}`
    : `${SITE}/og-image.png?v=4`;

  document.title = seo.title;
  document.documentElement.lang = seo.lang;

  meta('name', 'title', seo.title);
  meta('name', 'description', seo.description);
  meta('name', 'robots', seo.noindex ? 'noindex, follow' : DEFAULT_ROBOTS);

  meta('property', 'og:title', seo.title);
  meta('property', 'og:description', seo.description);
  meta('property', 'og:url', url);
  meta('property', 'og:image', image);
  meta('property', 'og:locale', seo.lang === 'ru' ? 'ru_RU' : 'en_US');
  meta(
    'property',
    'og:locale:alternate',
    seo.lang === 'ru' ? 'en_US' : 'ru_RU',
  );

  meta('name', 'twitter:title', seo.title);
  meta('name', 'twitter:description', seo.description);
  meta('name', 'twitter:image', image);

  const canonical = tag('link[rel="canonical"]', () => {
    const node = document.createElement('link');
    node.setAttribute('rel', 'canonical');
    return node;
  });
  canonical?.setAttribute('href', url);

  applyHreflang(seo.path);
};

/**
 * Declares the two language versions of a page to each other.
 *
 * These tags were once present and wrong: both languages pointed at the same
 * URL, because language was client-side state and there was no second address
 * to point at. Now /work and /en/work are genuinely different documents, so
 * the pair is true — and true hreflang is what stops the two from competing
 * as duplicates and gets the right one shown per audience.
 */
const applyHreflang = (path: string) => {
  const ru = `${SITE}${withLanguage(path, 'ru')}`;
  const en = `${SITE}${withLanguage(path, 'en')}`;
  const pairs: Array<[string, string]> = [
    ['ru', ru],
    ['en', en],
    // Russian is the default: it answers for any audience we haven't named.
    ['x-default', ru],
  ];

  for (const [hreflang, href] of pairs) {
    const el = tag(`link[rel="alternate"][hreflang="${hreflang}"]`, () => {
      const node = document.createElement('link');
      node.setAttribute('rel', 'alternate');
      node.setAttribute('hreflang', hreflang);
      return node;
    });
    el?.setAttribute('href', href);
  }
};
