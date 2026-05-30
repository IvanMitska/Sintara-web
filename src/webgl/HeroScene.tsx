import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import CrystalScene from './CrystalScene';

/**
 * Hero scene — a brand-violet crystal cluster on a dust-and-stars
 * background. The DOM Hero overlays crisp type on top. Postprocessing
 * is light: a soft bloom for the rim glow, a gentle vignette for depth.
 */

const HeroScene = () => (
  <>
    <CrystalScene />
    <EffectComposer>
      <Bloom
        mipmapBlur
        intensity={0.38}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.7}
        radius={0.75}
      />
      <Vignette offset={0.38} darkness={0.6} eskil={false} />
    </EffectComposer>
  </>
);

export default HeroScene;
