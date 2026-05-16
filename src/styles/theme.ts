// Editorial design tokens — Sintara redesign
// Palette: warm bone cream vs. deep ink, tomato accent
// Typography: Instrument Serif (display) + Inter Tight (grotesk)

export const colors = {
  // Keep the "bone" token name for backwards compat inside the codebase,
  // but the value is now pure white.
  bone: '#FFFFFF',         // primary background
  boneDim: '#F5F5F5',      // subtle surface variant
  boneLine: '#E6E6E6',     // hairlines on white
  ink: '#0A0A0A',          // primary foreground
  inkSoft: '#141414',      // alt dark bg
  inkLine: '#262626',      // hairlines on dark
  muted: '#6B6B6B',        // secondary text on white
  mutedDark: '#8C8C8C',    // secondary text on dark

  // ─── Single accent system ─────────────────────────────────────────
  //  accent        : Sintara brand purple. Used everywhere: wordmark
  //                  dot, eyebrow dots, hero line accent, BigCta,
  //                  hover states, etc.
  //  accentHover   : Slightly darker purple for pressed / active states.
  accent: '#7C3AED',       // brand purple
  accentHover: '#6D28D9',  // darker purple (pressed)
  accentSoft: '#EFE4FF',   // purple tint
  success: '#1F6B3A',
} as const;

export const fonts = {
  // Single tight grotesk family for everything — no more serif italic.
  // Display uses the same face, just bigger and heavier.
  display:
    "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, sans-serif",
  grotesk:
    "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, sans-serif",
  mono: "'JetBrains Mono', 'IBM Plex Mono', monospace",
} as const;

export const fontSize = {
  // fluid display — for massive editorial headlines
  displayXxl: 'clamp(4.5rem, 16vw, 18rem)',
  displayXl: 'clamp(3.75rem, 12vw, 13rem)',
  displayLg: 'clamp(3rem, 9vw, 8.5rem)',
  displayMd: 'clamp(2.5rem, 7vw, 6rem)',
  displaySm: 'clamp(2rem, 5.5vw, 4.5rem)',
  // editorial body
  h1: 'clamp(2rem, 4.5vw, 3.75rem)',
  h2: 'clamp(1.75rem, 3.5vw, 2.75rem)',
  h3: 'clamp(1.375rem, 2.25vw, 2rem)',
  bodyLg: 'clamp(1.125rem, 1.35vw, 1.375rem)',
  body: '1rem',
  small: '0.875rem',
  caption: '0.75rem',
} as const;

export const tracking = {
  tight: '-0.04em',
  displayTight: '-0.035em',
  normal: '-0.01em',
  wide: '0.02em',
  widest: '0.18em',
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
  // "Expo out" — our signature ease for reveals
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
  modal: 1000,
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
