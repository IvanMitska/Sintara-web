import { createGlobalStyle } from 'styled-components';
import { colors, fonts, motion, tracking } from './theme';

const GlobalStyles = createGlobalStyle`
  :root {
    --bone: ${colors.bone};
    --bone-dim: ${colors.boneDim};
    --bone-line: ${colors.boneLine};
    --ink: ${colors.ink};
    --ink-soft: ${colors.inkSoft};
    --ink-line: ${colors.inkLine};
    --muted: ${colors.muted};
    --muted-dark: ${colors.mutedDark};
    /* Brand purple — single accent across the whole site */
    --accent: ${colors.accent};
    /* Darker purple — pressed / active state only */
    --accent-hover: ${colors.accentHover};
    --accent-soft: ${colors.accentSoft};

    --font-display: ${fonts.display};
    --font-grotesk: ${fonts.grotesk};
    --font-mono: ${fonts.mono};

    --ease-expo: ${motion.expo};
    --ease-snap: ${motion.snap};
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    scroll-behavior: auto;
    background: var(--bone);
  }

  body {
    font-family: var(--font-grotesk);
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--ink);
    background: var(--bone);
    overflow-x: hidden;
    min-height: 100vh;
    font-feature-settings: 'ss01', 'cv11';
    letter-spacing: ${tracking.normal};
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    position: relative;
  }

  /* Reset default typography — we style explicitly per component */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-grotesk);
    font-weight: 400;
    line-height: 1;
    color: inherit;
  }

  p {
    line-height: 1.55;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }

  img, svg, video {
    display: block;
    max-width: 100%;
  }

  ::selection {
    background: var(--accent);
    color: var(--bone);
  }

  /* Single-accent system: --accent is brand purple everywhere, no
     per-hover override. Hover states pick up the brand purple directly. */

  /* Focus ring — keyboard only */
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 4px;
    border-radius: 2px;
  }

  /* Scrollbar — minimal editorial */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bone);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--bone-line);
    border: 2px solid var(--bone);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--ink);
  }

  /* Utility: dark section inversion */
  [data-surface='dark'] {
    background: var(--ink);
    color: var(--bone);
  }

  [data-surface='dark'] ::selection {
    background: var(--accent);
    color: var(--ink);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  html.reduce-motion *,
  html.reduce-motion *::before,
  html.reduce-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

`;

export default GlobalStyles;
