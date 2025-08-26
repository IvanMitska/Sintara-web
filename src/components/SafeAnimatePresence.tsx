import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface SafeAnimatePresenceProps {
  children: React.ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
  initial?: boolean;
  exitBeforeEnter?: boolean;
}

const SafeAnimatePresence: React.FC<SafeAnimatePresenceProps> = ({ 
  children, 
  mode = 'wait',
  initial = true,
  exitBeforeEnter = false 
}) => {
  // Проверяем, есть ли множественные дети
  const childrenArray = React.Children.toArray(children);
  
  // Если режим "wait" и несколько детей, используем только первого ребенка
  if (mode === 'wait' && childrenArray.length > 1) {
    return (
      <AnimatePresence mode="wait" initial={initial}>
        {childrenArray[0]}
      </AnimatePresence>
    );
  }

  // Если один ребенок или режим не "wait", используем обычный AnimatePresence
  return (
    <AnimatePresence mode={mode} initial={initial}>
      {children}
    </AnimatePresence>
  );
};

export default SafeAnimatePresence; 