import { useRef } from 'react';
import type { MouseEvent, ReactNode, ComponentPropsWithoutRef } from 'react';

interface MagneticLinkProps extends ComponentPropsWithoutRef<'a'> {
  children: ReactNode;
  /** how far to shift toward the cursor (px) */
  strength?: number;
  className?: string;
}

/**
 * Tiny magnetic hover — the element drifts toward the cursor while
 * hovered. Used for nav links and CTA buttons for a premium feel.
 * Skip effect on touch / coarse pointer devices.
 */
const MagneticLink = ({
  children,
  strength = 14,
  onMouseMove,
  onMouseLeave,
  style,
  ...rest
}: MagneticLinkProps) => {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    onMouseMove?.(e);
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
  };

  const handleLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    onMouseLeave?.(e);
    const el = ref.current;
    if (el) el.style.transform = 'translate3d(0, 0, 0)';
  };

  return (
    <a
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        display: 'inline-block',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease',
        ...style,
      }}
      {...rest}
    >
      {children}
    </a>
  );
};

export default MagneticLink;
