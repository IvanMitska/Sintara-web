import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import ErrorBoundary from '../components/ErrorBoundary';
import HeroScene from './HeroScene';
import { flux } from './flux';
import { markReady } from '../lib/loadManager';

/**
 * GlobalCanvas — the single persistent WebGL surface for the whole site.
 * Fixed, full-viewport, behind the DOM (#root sits above via z-index),
 * and pointer-transparent. DOM sections that want 3D simply render with
 * a transparent background; opaque sections cover it. This is the spine
 * the cinematic scenes and section transitions are built on.
 */

const FALLBACK_BG =
  'radial-gradient(closest-side at 50% 42%, rgba(207,224,255,0.5),' +
  ' rgba(120,140,190,0.1) 55%, transparent 72%), #000';

const GlobalCanvas = () => {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const lowEnd =
      navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency <= 4;
    setCapable(!reduced && !lowEnd);
    // no WebGL scene to wait for → release the preloader's webgl gate
    if (reduced || lowEnd) markReady('webgl');

    // ── input bridge → flux ────────────────────────────────────────
    const onMove = (e: PointerEvent) => {
      flux.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      flux.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      flux.pointerInside = true;
    };
    const onLeave = () => {
      flux.pointerInside = false;
    };
    const onDown = () => {
      if (flux.heroVisible) flux.burst += 1;
    };
    const onResize = () => {
      flux.viewportW = window.innerWidth;
      flux.viewportH = window.innerHeight;
    };
    onResize();

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => {
    flux.route = pathname;
  }, [pathname]);

  if (!mounted) return null;

  // Freeze the render loop on routes that never reveal the canvas.
  const frameloop = pathname === '/' ? 'always' : 'never';

  const layer = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: capable ? '#000' : FALLBACK_BG,
        // only revealed on the home route; inner pages are opaque
        display: pathname === '/' ? 'block' : 'none',
      }}
      aria-hidden="true"
    >
      {capable && (
        <ErrorBoundary fallback={null}>
          <Canvas
            dpr={[1, 1.4]}
            frameloop={frameloop}
            camera={{ position: [0, 0, 7], fov: 42 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <HeroScene />
          </Canvas>
        </ErrorBoundary>
      )}
    </div>
  );

  return createPortal(layer, document.body);
};

export default GlobalCanvas;
