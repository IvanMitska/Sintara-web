import { useRef } from 'react';
import { useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * The seam between two sections: a panel arrives with a rounded lip that
 * flattens as it takes the screen, so the incoming block reads as sliding
 * *over* the outgoing one instead of following it in a stack.
 *
 * Pair it with a negative top margin and a shadow in the section's own CSS —
 * those do the overlap statically. This hook only animates the corner radius.
 *
 * That split is deliberate: everything scroll-driven here is cosmetic, so if
 * the animation never runs (frozen tab, JS error, an old browser) the section
 * still sits exactly where it belongs with a rounded top. A seam can't hide
 * content the way an opacity- or clip-based reveal can.
 */
export const useSeam = <T extends HTMLElement>(from = 56) => {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // From the moment the panel's top edge reaches the bottom of the viewport
    // until it has climbed a third of the way up the screen.
    offset: ['start end', 'start 0.35'],
  });
  const radius = useTransform(scrollYProgress, [0, 1], [from, 0]);

  const style = reduced
    ? {
        borderTopLeftRadius: Math.round(from / 2),
        borderTopRightRadius: Math.round(from / 2),
      }
    : { borderTopLeftRadius: radius, borderTopRightRadius: radius };

  return { ref, style };
};

export default useSeam;
