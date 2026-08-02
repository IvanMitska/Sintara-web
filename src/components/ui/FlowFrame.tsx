import type { ReactNode } from 'react';
import useScrollFlow from '../../hooks/useScrollFlow';

interface FlowFrameProps {
  children: ReactNode;
  /** Defaults to "frame" — the class the card styles already hang off. */
  className?: string;
  /** Scales the effect; 0.6 for large media, 1 for small cards. */
  intensity?: number;
}

/**
 * A media frame that squashes with scroll speed. Exists as a component (rather
 * than a hook used inline) because these live inside `.map()` calls, where a
 * hook per item isn't an option.
 */
const FlowFrame = ({
  children,
  className = 'frame',
  intensity = 1,
}: FlowFrameProps) => {
  const ref = useScrollFlow<HTMLDivElement>(intensity);
  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default FlowFrame;
