import {
  EffectComposer,
  Bloom,
  Vignette,
} from '@react-three/postprocessing';
import { useScrollProgress } from '../../hooks/useScrollProgress';

interface PostEffectsProps {
  enabled?: boolean;
}

export function PostEffects({ enabled = true }: PostEffectsProps) {
  const { progress } = useScrollProgress();

  if (!enabled) return null;

  // Dynamic effects based on scroll
  const bloomIntensity = 0.4 + progress * 0.2;

  return (
    <EffectComposer>
      {/* Bloom for neon glow effect */}
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />

      {/* Vignette - darken edges for focus */}
      <Vignette
        eskil={false}
        offset={0.1}
        darkness={0.4}
      />
    </EffectComposer>
  );
}

export default PostEffects;
