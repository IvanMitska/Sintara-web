import { useEffect, useRef } from 'react';
import { registerMagnetic, type MagneticOptions } from '../lib/magnetic';

/**
 * Makes an element lean toward the cursor. Attach the returned ref:
 *
 *   const ref = useMagnetic({ strength: 0.3 });
 *   <button ref={ref}>…</button>
 *
 * Touch devices and reduced-motion users get a plain, static element — the
 * guard lives in registerMagnetic, so there's nothing to check here.
 */
export const useMagnetic = <T extends HTMLElement>(
  options: MagneticOptions = {},
) => {
  const ref = useRef<T>(null);
  // Keep the latest options without making them a dependency: callers pass an
  // object literal, which would otherwise re-register on every render.
  const opts = useRef(options);
  opts.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerMagnetic(el, opts.current);
  }, []);

  return ref;
};

export default useMagnetic;
