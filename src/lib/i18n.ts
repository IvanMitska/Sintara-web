/**
 * Language in the URL.
 *
 * Russian keeps the bare paths it has always had (/work, /work/kaif) so no
 * existing address or accumulated search equity changes. English lives under
 * an /en prefix (/en/work, /en/work/kaif).
 *
 * This exists because language used to be client-side state: both languages
 * shared one URL, which meant only one of them could ever be crawled, and the
 * hreflang tags claiming otherwise were pointing at the same address. A
 * language a search engine cannot link to is a language it cannot rank.
 *
 * The URL is the single source of truth — there is no stored preference and no
 * automatic redirect. A visitor arriving from a search result lands on the
 * language that result was written in, and a shared link always opens in the
 * language the sender saw.
 */

export type Language = 'ru' | 'en';

export const DEFAULT_LANGUAGE: Language = 'ru';
export const LANGUAGES: Language[] = ['ru', 'en'];
const EN_PREFIX = '/en';

export interface ParsedPath {
  language: Language;
  /** Language-neutral path, always starting with "/" (e.g. "/work/kaif"). */
  path: string;
}

/** Split a pathname into its language and the language-neutral path. */
export const parsePath = (pathname: string): ParsedPath => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === EN_PREFIX) return { language: 'en', path: '/' };
  if (clean.startsWith(`${EN_PREFIX}/`)) {
    return { language: 'en', path: clean.slice(EN_PREFIX.length) || '/' };
  }
  return { language: 'ru', path: clean };
};

/**
 * Address of a language-neutral path in a given language.
 * Query strings and hashes are preserved — plenty of links point at
 * "/services#crm", and prefixing that naively would break the anchor.
 */
export const withLanguage = (to: string, language: Language): string => {
  if (!to.startsWith('/')) return to; // external or relative — leave alone
  const marker = to.search(/[?#]/);
  const path = marker === -1 ? to : to.slice(0, marker);
  const suffix = marker === -1 ? '' : to.slice(marker);

  const { path: neutral } = parsePath(path);
  if (language === DEFAULT_LANGUAGE) return `${neutral}${suffix}`;
  return `${neutral === '/' ? EN_PREFIX : `${EN_PREFIX}${neutral}`}${suffix}`;
};

/** The same page in the other language. */
export const otherLanguage = (language: Language): Language =>
  language === 'ru' ? 'en' : 'ru';
