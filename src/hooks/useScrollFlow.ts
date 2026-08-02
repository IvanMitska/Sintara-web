import { useEffect, useRef } from 'react';
import { registerFlow } from '../lib/scrollFlow';

/**
 * Elastic squash driven by scroll speed. Attach to a wrapper that owns no
 * transform of its own — putting it on an image would collide with hover
 * zooms, which are transforms too.
 *
 *   const ref = useScrollFlow<HTMLDivElement>();
 *   <div className="frame" ref={ref}>…</div>
 */
export const useScrollFlow = <T extends HTMLElement>(intensity = 1) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerFlow(el, intensity);
  }, [intensity]);

  return ref;
};

export default useScrollFlow;
