import { Suspense, useEffect, useState, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import styled from 'styled-components';
import { SpaceScene } from './SpaceScene';
import { ScrollCamera } from './ScrollCamera';
import { PostEffects } from './PostEffects';

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background: #050208;
`;

const LoadingFallback = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #050208;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Inter', sans-serif;
`;

interface ImmersiveCanvasProps {
  enablePostProcessing?: boolean;
}

// Detect device capabilities
function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isLowEnd: false,
    pixelRatio: 1,
  });

  useEffect(() => {
    const isMobile = window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const isLowEnd =
      navigator.hardwareConcurrency <= 2 ||
      (navigator as any).deviceMemory < 4;

    const pixelRatio = isLowEnd || isMobile
      ? 1
      : Math.min(window.devicePixelRatio, 2);

    setCapabilities({ isMobile, isLowEnd, pixelRatio });
  }, []);

  return capabilities;
}

function ImmersiveCanvasInner({ enablePostProcessing = true }: ImmersiveCanvasProps) {
  const { isMobile, isLowEnd, pixelRatio } = useDeviceCapabilities();

  // Reduced quality settings for weaker devices
  const shouldReduceEffects = isMobile || isLowEnd;
  const starCount = shouldReduceEffects ? 2000 : 5000;

  return (
    <CanvasContainer>
      <Canvas
        camera={{
          fov: 60,
          near: 0.1,
          far: 1000,
          position: [0, 20, 100], // Starting position - viewing the solar system
        }}
        dpr={pixelRatio}
        performance={{ min: 0.5 }}
        gl={{
          antialias: !shouldReduceEffects,
          powerPreference: shouldReduceEffects ? 'low-power' : 'high-performance',
          alpha: false,
        }}
      >
        <color attach="background" args={['#050208']} />

        <Suspense fallback={null}>
          {/* Space scene with all 3D elements */}
          <SpaceScene
            starCount={starCount}
            enablePlanets={!shouldReduceEffects}
            enableNebulae={true}
            enableNeon={!shouldReduceEffects}
          />

          {/* Scroll-driven camera */}
          <ScrollCamera />

          {/* Post-processing effects */}
          {enablePostProcessing && !shouldReduceEffects && (
            <PostEffects />
          )}

          {/* Preload resources */}
          <Preload all />
        </Suspense>
      </Canvas>
    </CanvasContainer>
  );
}

// Memoize to prevent unnecessary re-renders
export const ImmersiveCanvas = memo(ImmersiveCanvasInner);

export default ImmersiveCanvas;
