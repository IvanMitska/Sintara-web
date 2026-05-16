import { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Hero from '../sections/home/Hero';
import MarqueeStrip from '../sections/home/MarqueeStrip';
import Manifesto from '../sections/home/Manifesto';
import SelectedWork from '../sections/home/SelectedWork';
import ServicesTeaser from '../sections/home/ServicesTeaser';
import Process from '../sections/home/Process';
import Testimonials from '../sections/home/Testimonials';
import BigCta from '../sections/home/BigCta';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <MarqueeStrip />
        <Manifesto />
        <SelectedWork />
        <ServicesTeaser />
        <Process />
        <Testimonials />
        <BigCta />
      </main>
      <Footer />
    </>
  );
};

export default Home;
