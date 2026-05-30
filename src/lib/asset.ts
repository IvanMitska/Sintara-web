/**
 * Cache-bust helper for /projects/* assets.
 *
 * Project covers and screens live under /public/projects with stable
 * filenames (e.g. `/projects/kaif/cover.webp`). When we replace a file,
 * the URL doesn't change — so browsers that cached the old bytes keep
 * showing them. Netlify's `must-revalidate` rule on /projects/* (see
 * netlify.toml) fixes this going forward, but won't touch entries that
 * were cached without an explicit Cache-Control header.
 *
 * Bumping ASSET_VERSION below changes the URL (`?v=N`), so the browser
 * treats it as a fresh resource and fetches it. Bump whenever an existing
 * cover/screen has been replaced in place and you want every visitor —
 * including those with stale heuristic caches — to see the new image.
 */
const ASSET_VERSION = '2';

export const v = (url: string): string => {
  // Only stamp project assets — fonts/models/icons/Vite hashed bundles
  // are already cache-busted by their own paths or hashes.
  if (!url.startsWith('/projects/')) return url;
  if (url.includes('?')) return url; // don't double-stamp
  return `${url}?v=${ASSET_VERSION}`;
};
