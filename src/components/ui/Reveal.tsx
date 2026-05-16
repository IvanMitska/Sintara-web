import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  as?: 'div' | 'span' | 'section' | 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  once?: boolean;
}

/**
 * Drop-in scroll reveal wrapper. Translates up + fades in
 * the first time it enters the viewport. Respects reduced-motion.
 */
const Reveal = ({
  children,
  delay = 0,
  y = 40,
  duration = 0.9,
  as = 'div',
  className,
  once = true,
}: RevealProps) => {
  const reduced = useReducedMotion();

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
