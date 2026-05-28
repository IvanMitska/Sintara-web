import { useState } from 'react';
import { useNavigationType } from 'react-router-dom';
import styled from 'styled-components';
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
 */
const Flow = styled.div`
  position: relative;
  background: var(--paper);
  overflow: hidden;
`;

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
        <Flow>
          <Manifesto />
          <Statement />
          <Approach />
          <FeaturedWork />
          <Products />
        </Flow>
        <Capabilities />
        <CtaFinale />
      </main>
      <Footer />
    </>
  );
};

export default Home;
