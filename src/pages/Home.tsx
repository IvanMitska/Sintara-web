import { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import Hero from '../sections/home/Hero';
import Manifesto from '../sections/home/Manifesto';
import Statement from '../sections/home/Statement';
import Approach from '../sections/home/Approach';
import FeaturedWork from '../sections/home/FeaturedWork';
import Capabilities from '../sections/home/Capabilities';
import CtaFinale from '../sections/home/CtaFinale';

const Home = () => {
  // Preloader plays on every entry to the home page — full load,
  // reload, or SPA navigation back (e.g. clicking the wordmark).
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <NavBar />
      <main>
        <Hero ready={loaded} />
        <Manifesto />
        <Statement />
        <Approach />
        <FeaturedWork />
        <Capabilities />
        <CtaFinale />
      </main>
      <Footer />
    </>
  );
};

export default Home;
