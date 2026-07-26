// Design tokens — Sintara v2 (Lusion-inspired editorial relaunch)
// Palette: lavender paper, deep ink, brand violet (single accent).
// Typography: Schibsted Grotesk — one tight neo-grotesk for everything.

export const colors = {
  // Surfaces
  bone: '#ECEBF3',         // primary background — lavender paper
  boneDim: '#E3E2ED',      // subtle surface variant
  boneLine: '#D2D1DE',     // hairlines on lavender
  paper: '#ECEBF3',        // alias of bone
  white: '#FFFFFF',

  // Ink / dark
  ink: '#0A0A0C',          // primary foreground — near-black
  inkSoft: '#101014',      // alt dark surface
  inkLine: '#23232A',      // hairlines on dark
  black: '#000000',        // cinematic hero background

  muted: '#6A6A78',        // secondary text on lavender
  mutedDark: '#8E8E9C',    // secondary text on dark

  // ─── Accent system ────────────────────────────────────────────────
  //  accent       : brand violet (matches Sintara CRM) — wordmark dot,
  //                 CTAs, hover, accents on light backgrounds.
  //  accentBright : lighter violet for accents on dark backgrounds.
  accent: '#7C3AED',       // brand violet (violet-600 — a touch darker)
  accentHover: '#6D28D9',  // pressed violet (violet-700)
  accentSoft: '#EDE9FE',   // violet tint (violet-100)
  accentBright: '#A78BFA', // lighter violet for accents on dark bg (violet-400)
  success: '#1F6B3A',
} as const;

export const fonts = {
  // Display — PP Neue Montreal (Pangram Pangram). Drop the .woff2 files into
  // /public/fonts and the @font-face in GlobalStyles picks them up. Until then
  // it falls back to Schibsted Grotesk, so nothing breaks.
  // The '* Fallback' faces are metric-adjusted local fonts (see index.css) so
  // text laid out before the web font arrives wraps the same way — no jump on
  // swap. They cover latin only; cyrillic falls through to the system stack.
  display:
    "'PP Neue Montreal', 'PP Neue Montreal Fallback', 'Schibsted Grotesk', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  grotesk:
    "'Schibsted Grotesk', 'Schibsted Grotesk Fallback', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
} as const;

export const fontSize = {
  // fluid display — massive editorial headlines
  displayXxl: 'clamp(4.5rem, 17vw, 19rem)',
  displayXl: 'clamp(3.5rem, 12vw, 13rem)',
  displayLg: 'clamp(2.75rem, 8.5vw, 8.5rem)',
  displayMd: 'clamp(2.25rem, 6vw, 5.5rem)',
  displaySm: 'clamp(1.875rem, 4.5vw, 3.75rem)',
  // editorial body
  h1: 'clamp(2rem, 4.5vw, 3.75rem)',
  h2: 'clamp(1.75rem, 3.5vw, 2.75rem)',
  h3: 'clamp(1.375rem, 2.25vw, 2rem)',
  bodyLg: 'clamp(1.0625rem, 1.2vw, 1.3125rem)',
  body: '1rem',
  small: '0.875rem',
  caption: '0.75rem',
  micro: '0.6875rem',
} as const;

export const tracking = {
  tight: '-0.045em',
  displayTight: '-0.04em',
  normal: '-0.011em',
  wide: '0.04em',
  widest: '0.2em',
} as const;

export const space = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '48px',
  8: '64px',
  9: '96px',
  10: '128px',
  11: '160px',
  12: '208px',
  13: '256px',
} as const;

export const radii = {
  none: '0',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  pill: '9999px',
} as const;

export const motion = {
  fast: '0.25s',
  mid: '0.5s',
  slow: '0.85s',
  slower: '1.2s',
  // "Expo out" — signature ease for reveals
  expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  // Sharp — for button presses
  snap: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const layout = {
  containerMax: '1680px',
  containerPad: '40px',
  containerPadMobile: '20px',
  gridCols: 12,
  gridGap: '24px',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
} as const;

export const mq = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  belowMd: `@media (max-width: ${breakpoints.md})`,
  belowLg: `@media (max-width: ${breakpoints.lg})`,
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  nav: 100,
  overlay: 500,
  cursor: 900,
  modal: 1000,
  preloader: 9000,
  toast: 2000,
} as const;

export const theme = {
  colors,
  fonts,
  fontSize,
  tracking,
  space,
  radii,
  motion,
  layout,
  breakpoints,
  mq,
  zIndex,
} as const;

export type Theme = typeof theme;
export default theme;
