import { useState } from 'react';
import { useNavigationType } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import useSeam from '../hooks/useSeam';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import Hero from '../sections/home/Hero';
import Manifesto from '../sections/home/Manifesto';
import Statement from '../sections/home/Statement';
import Approach from '../sections/home/Approach';
import FeaturedWork from '../sections/home/FeaturedWork';
import Products from '../sections/home/Products';
import Capabilities from '../sections/home/Capabilities';
import CtaFinale from '../sections/home/CtaFinale';

/**
 * The light run (Manifesto → FeaturedWork) shares one continuous surface,
 * so the sections read as one flowing page rather than stacked blocks.
 *
 * It also opens over the hero with a rounded lip, so the page unrolls over the
 * video rather than the video simply ending.
 *
 * No negative margin at this seam, unlike the others: the hero's meta block and
 * scroll cue sit close to its bottom edge, and even 40px of overlap clipped
 * them. The radius and shadow carry the effect on their own here.
 */
const Flow = styled(motion.div)`
  position: relative;
  z-index: 1;
  background: var(--paper);
  overflow: hidden;
  box-shadow: 0 -24px 60px rgba(10, 8, 20, 0.28);
`;

// NOTE: the closing 3D scene deliberately gets NO exit transition. Pinning it
// and letting the footer climb over it was tried and reverted — the astronaut
// is the site's signature shot, and covering it trades the page's best moment
// for a scroll effect. Whatever lands here has to frame that section, not
// consume it.

// Has the preloader played at least once this session? Module-scoped so it
// survives Home unmount/remount during SPA navigation.
let hasBooted = false;

const Home = () => {
  const navType = useNavigationType();
  // Preloader plays on the first load and on forward navigation here
  // (e.g. clicking the wordmark), but is skipped on back/forward (POP)
  // returns so the page can restore its previous scroll position instead
  // of snapping back to the hero.
  const [loaded, setLoaded] = useState(hasBooted && navType === 'POP');
  // Smaller lip than the other seams: this one opens the page over the hero
  // video, where a heavy radius would read as a rounded box rather than a
  // surface unrolling.
  const seam = useSeam<HTMLDivElement>(40);

  return (
    <>
      {!loaded && (
        <Preloader
          onComplete={() => {
            hasBooted = true;
            setLoaded(true);
          }}
        />
      )}
      <NavBar />
      <main>
        <Hero ready={loaded} />
        <Flow ref={seam.ref} style={seam.style}>
          <Manifesto />
          <Statement />
          <Approach />
          <FeaturedWork />
          <Products />
        </Flow>
        <Capabilities />
        <CtaFinale booted={loaded} />
      </main>
      <Footer />
    </>
  );
};

export default Home;
