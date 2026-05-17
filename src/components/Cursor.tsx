import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom cursor — a lagging ring + precise dot, mix-blend difference so it
 * reads on both the dark hero and the lavender body. Grows over anything
 * tagged interactive. Skipped on coarse-pointer devices.
 */

const Ring = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 38px;
  height: 38px;
  margin: -19px 0 0 -19px;
  border: 1.5px solid #fff;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9990;
  mix-blend-mode: difference;
  will-change: transform;
`;

const Dot = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  background: #fff;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9991;
  mix-blend-mode: difference;
  will-change: transform;
`;

const isInteractive = (el: Element | null): boolean => {
  let node = el;
  let depth = 0;
  while (node && depth < 5) {
    const tag = node.tagName;
    if (
      tag === 'A' ||
      tag === 'BUTTON' ||
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      (node as HTMLElement).dataset?.cursor === 'hover'
    ) {
      return true;
    }
    node = node.parentElement;
    depth++;
  }
  return false;
};

const Cursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.45 });
  const ringY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.45 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
      .matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setHovering(isInteractive(e.target as Element));
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  const ringScale = hovering ? 1.85 : down ? 0.7 : 1;

  return (
    <>
      <Ring
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: ringScale,
          opacity: visible ? (hovering ? 0.9 : 0.55) : 0,
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
      <Dot
        style={{ x, y }}
        animate={{
          scale: hovering ? 0 : down ? 1.6 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.18 }}
      />
    </>
  );
};

export default Cursor;
