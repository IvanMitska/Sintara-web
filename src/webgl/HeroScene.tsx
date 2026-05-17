import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import BlackHole from './BlackHole';

/**
 * Hero scene — the Interstellar-style black hole, with a bloom pass to
 * make the accretion disk glow. The wordmark is crisp DOM type (Hero).
 */

const HeroScene = () => (
  <>
    <color attach="background" args={['#000000']} />
    <BlackHole />
    <EffectComposer>
      <Bloom
        mipmapBlur
        intensity={0.55}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.6}
        radius={0.8}
      />
      <Vignette offset={0.42} darkness={0.55} eskil={false} />
    </EffectComposer>
  </>
);

export default HeroScene;
