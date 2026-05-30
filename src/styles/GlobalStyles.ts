import { createGlobalStyle } from 'styled-components';
import { colors, fonts, motion, tracking } from './theme';

const GlobalStyles = createGlobalStyle`
  /* PP Neue Montreal — display typeface (Pangram Pangram), licensed via the
     studio's Pangram Pangram account. Keep the licence confirmation email as
     proof of usage rights. font-display: swap keeps the Schibsted Grotesk
     fallback visible until the faces load. woff2 first (~57% smaller than the
     .otf); the .otf stays as a fallback for any engine without woff2. */
  @font-face {
    font-family: 'PP Neue Montreal';
    src: url('/fonts/PPNeueMontreal-Regular.woff2') format('woff2'),
         url('/fonts/PPNeueMontreal-Regular.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'PP Neue Montreal';
    src: url('/fonts/PPNeueMontreal-Semibold.woff2') format('woff2'),
         url('/fonts/PPNeueMontreal-Semibold.otf') format('opentype');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'PP Neue Montreal';
    src: url('/fonts/PPNeueMontreal-Extrabold.woff2') format('woff2'),
         url('/fonts/PPNeueMontreal-Extrabold.otf') format('opentype');
    font-weight: 800;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --bone: ${colors.bone};
    --bone-dim: ${colors.boneDim};
    --bone-line: ${colors.boneLine};
    --paper: ${colors.paper};
    --white: ${colors.white};
    --ink: ${colors.ink};
    --ink-soft: ${colors.inkSoft};
    --ink-line: ${colors.inkLine};
    --black: ${colors.black};
    --muted: ${colors.muted};
    --muted-dark: ${colors.mutedDark};

    /* Accent — brand violet everywhere */
    --accent: ${colors.accent};
    --accent-hover: ${colors.accentHover};
    --accent-soft: ${colors.accentSoft};
    --accent-bright: ${colors.accentBright};
    --blue: ${colors.accent};

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
    background: var(--paper);
    /* Keep the scrollbar always present so the scrollport width is constant.
       Without this the page reflows sideways whenever the bar appears or
       disappears — on route changes, short pages, or the preloader/menu
       toggling overflow:hidden. The custom webkit track is transparent, so
       on non-scrolling pages this reserved 9px reads as empty space, not a
       visible bar. Scroll-lock (see lib/scrollLock) compensates the bar
       width with padding so even overflow:hidden never shifts the layout. */
    overflow-y: scroll;
  }

  /* Lenis smooth scroll */
  html.lenis,
  html.lenis body {
    height: auto;
  }
  .lenis.lenis-smooth {
    scroll-behavior: auto !important;
  }
  .lenis.lenis-smooth [data-lenis-prevent] {
    overscroll-behavior: contain;
  }
  .lenis.lenis-stopped {
    overflow: hidden;
  }

  body {
    font-family: var(--font-grotesk);
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--ink);
    background: var(--paper);
    overflow-x: hidden;
    min-height: 100vh;
    letter-spacing: ${tracking.normal};
  }

  /* #root sits above the fixed GlobalCanvas (z-index 0) so the DOM
     paints over the WebGL layer; transparent sections reveal it. */
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    position: relative;
    z-index: 1;
    background: transparent;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 500;
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

  img, svg, video, canvas {
    display: block;
    max-width: 100%;
  }

  ::selection {
    background: var(--accent);
    color: #fff;
  }

  /* Custom cursor — hide native pointer on fine-pointer devices */
  @media (hover: hover) and (pointer: fine) {
    html.has-cursor,
    html.has-cursor * {
      cursor: none !important;
    }
  }

  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 4px;
    border-radius: 2px;
  }

  /* Scrollbar — minimal */
  ::-webkit-scrollbar {
    width: 9px;
    height: 9px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(10, 10, 12, 0.22);
    border-radius: 99px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--ink);
  }

  [data-surface='dark'] {
    background: var(--ink);
    color: #fff;
  }
  [data-surface='dark'] ::selection {
    background: var(--accent-bright);
    color: var(--ink);
  }

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
