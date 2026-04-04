import { Html } from '@react-three/drei';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { planetStations, getCurrentStationIndex, getStationInterpolation } from '../../data/cameraPath';
import styled from 'styled-components';
import { Suspense, lazy } from 'react';
import { LanguageProvider } from '../../context/LanguageContext';

// Lazy load sections
const Hero = lazy(() => import('../../sections/Hero'));
const Services = lazy(() => import('../../sections/Services'));
const Portfolio = lazy(() => import('../../sections/Portfolio'));
const Benefits = lazy(() => import('../../sections/Benefits'));
const WorkProcess = lazy(() => import('../../sections/WorkProcess'));
const Pricing = lazy(() => import('../../sections/Pricing'));
const Testimonials = lazy(() => import('../../sections/Testimonials'));
const Contact = lazy(() => import('../../sections/Contact'));
const FAQ = lazy(() => import('../../sections/FAQ'));

const sectionComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  hero: Hero,
  services: Services,
  portfolio: Portfolio,
  benefits: Benefits,
  process: WorkProcess,
  pricing: Pricing,
  testimonials: Testimonials,
  contact: Contact,
  faq: FAQ,
};

// Content container styled
const ContentWrapper = styled.div<{ $opacity: number }>`
  width: 900px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgba(8, 4, 20, 0.92);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(124, 58, 237, 0.4);
  box-shadow:
    0 0 100px rgba(124, 58, 237, 0.3),
    0 40px 80px rgba(0, 0, 0, 0.7);
  opacity: ${props => props.$opacity};
  transition: opacity 0.5s ease;
  pointer-events: ${props => props.$opacity > 0.5 ? 'auto' : 'none'};

  /* Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(124, 58, 237, 0.5);
    border-radius: 3px;
  }

  /* Reset section styles */
  section {
    background: transparent !important;
    min-height: auto !important;
    padding: 30px 20px !important;
  }

  @media (max-width: 768px) {
    width: 340px;
  }
`;

const Loading = styled.div`
  padding: 40px;
  text-align: center;
  color: rgba(255,255,255,0.5);
`;

function StationContent({ stationIndex, opacity }: { stationIndex: number; opacity: number }) {
  const station = planetStations[stationIndex];

  if (!station || opacity < 0.1) return null;

  return (
    <group position={station.contentPosition} rotation={station.contentRotation}>
      <Html
        transform
        distanceFactor={15}
        style={{ pointerEvents: opacity > 0.5 ? 'auto' : 'none' }}
        center
      >
        <LanguageProvider>
          <ContentWrapper $opacity={opacity}>
            <Suspense fallback={<Loading>Loading...</Loading>}>
              {station.sections.map((sectionName) => {
                const Component = sectionComponents[sectionName];
                return Component ? <Component key={sectionName} /> : null;
              })}
            </Suspense>
          </ContentWrapper>
        </LanguageProvider>
      </Html>
    </group>
  );
}

export function PlanetContent() {
  const { progress } = useScrollProgress();
  const currentIndex = getCurrentStationIndex(progress);
  const t = getStationInterpolation(progress);

  // Simple opacity: current station visible, fades during transition
  const getOpacity = (index: number) => {
    if (index === currentIndex) {
      return t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
    }
    if (index === currentIndex + 1) {
      return t > 0.7 ? (t - 0.7) / 0.3 : 0;
    }
    return 0;
  };

  return (
    <>
      {planetStations.map((_, i) => (
        <StationContent key={i} stationIndex={i} opacity={getOpacity(i)} />
      ))}
    </>
  );
}

export default PlanetContent;
