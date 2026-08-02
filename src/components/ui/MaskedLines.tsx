import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Display headings that rise out from behind a mask, line by line.
 *
 * The difference from `Reveal` is that nothing fades: each line is fully
 * opaque the whole time and simply travels out from under its own edge. On big
 * type that reads as printing rather than as appearing, which is the effect
 * every studio site is after — and it's why this is worth a second primitive
 * instead of another `Reveal` prop.
 *
 * Takes explicit lines rather than measuring rendered line boxes: the headings
 * that want this are already authored as arrays, and measuring would need a
 * layout pass per resize to stay correct.
 */

// The scroll trigger lives on the mask, never on the thing that moves. A
// transformed element starts 110% below its own box, so watching *it* would
// mean the viewport test runs against a box that is off-screen — the same
// trap SplitWords documents. The mask's box never moves, so it always fires.
const Line = styled(motion.span)`
  display: block;
  overflow: hidden;
  /* Descenders (у, р, д) sit below the baseline and would be sheared off by
     the mask. Pad the box, then pull the layout back so spacing is unchanged. */
  padding-bottom: 0.12em;
  margin-bottom: -0.12em;
`;

const Inner = styled(motion.span)`
  display: block;
  will-change: transform;
`;

const lineVariants = {
  hidden: { y: '110%' },
  show: { y: '0%' },
};

interface MaskedLinesProps {
  lines: string[];
  /** Extra delay before the first line moves. */
  delay?: number;
  /** Gap between consecutive lines. */
  stagger?: number;
  className?: string;
}

const MaskedLines = ({
  lines,
  delay = 0,
  stagger = 0.09,
  className,
}: MaskedLinesProps) => {
  const reduced = useReducedMotion();

  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={`${line}-${i}`}
          className={className}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <Inner
            variants={lineVariants}
            transition={{
              duration: 1,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </Inner>
        </Line>
      ))}
    </>
  );
};

export default MaskedLines;
