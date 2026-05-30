import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentType, ReactNode } from 'react';

// Permissive props for the dynamically-chosen tag (motion.h1 / 'span' / …).
// React 19's stricter types collapse a bare `ElementType`'s props to `never`
// in JSX, so we type the resolved tag as a component that accepts anything.
type DynamicTagProps = { children?: ReactNode; [key: string]: unknown };

interface SplitWordsProps {
  text: string;
  /** extra delay before stagger kicks in */
  delay?: number;
  /** per-word stagger step */
  stagger?: number;
  /** per-word animation duration */
  duration?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

/**
 * Word-by-word reveal with a mask. The outer element is the scroll
 * trigger (its bounding box stays stable because it's not transformed);
 * children animate via framer-motion variant cascade. Fixes the bug
 * where whileInView on a transformed child never fires because its
 * post-transform bbox is outside the viewport.
 */
const SplitWords = ({
  text,
  delay = 0,
  stagger = 0.07,
  duration = 0.85,
  className,
  as = 'h2',
}: SplitWordsProps) => {
  const reduced = useReducedMotion();

  if (reduced) {
    const Tag = as as unknown as ComponentType<DynamicTagProps>;
    return <Tag className={className}>{text}</Tag>;
  }

  // `motion[as]` — motion.h1, motion.h2, motion.span, etc.
  const MotionTag = (
    motion as unknown as Record<string, ComponentType<DynamicTagProps>>
  )[as];
  const words = text.split(' ');

  return (
    <MotionTag
      // Force a full remount when the text changes. Without this,
      // routes that reuse the same component instance (e.g. /work/:slug
      // hopping between cases) leave the parent MotionTag in its
      // already-triggered "visible" state while the per-word children
      // get a fresh set of keys (\`${word}-${i}\`) on the new text.
      // The new word-children inherit the parent's variant
      // inconsistently and stay stuck at \`y: 110%\` (off-screen) — the
      // bug where the giant title disappears on next-project until F5.
      // Keying by text unmounts the whole tree on text change so
      // whileInView re-triggers cleanly from \`hidden\` to \`visible\`.
      key={text}
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: stagger,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'baseline',
            paddingBottom: '0.14em',
            paddingRight: '0.28em',
            lineHeight: 'inherit',
          }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            variants={{
              hidden: { y: '110%' },
              visible: { y: '0%' },
            }}
            transition={{
              duration,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
};

export default SplitWords;
