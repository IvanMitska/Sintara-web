import type { ReactNode } from 'react';

/**
 * The site's pages, once. App renders this list twice — bare for Russian and
 * under /en for English — and the prerender walks the same list. Writing the
 * routes out per language would mean every new page has to be added in three
 * places, and the one that gets forgotten is silently unreachable.
 */
export interface PageRoute {
  /** Language-neutral path, exactly as it appears in Russian. */
  path: string;
  element: ReactNode;
}

/** Prefix a language-neutral path for the English route tree. */
export const enPath = (path: string): string =>
  path === '/' ? '/en' : `/en${path}`;
