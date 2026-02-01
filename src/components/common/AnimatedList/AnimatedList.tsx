import React from 'react';
import { useStaggerAnimation } from '@/hooks/useStaggerAnimation';

interface AnimatedListProps {
  children: React.ReactNode;
  itemSelector?: string;
  stagger?: number;
  duration?: number;
  from?: 'start' | 'end' | 'center' | 'edges';
  y?: number;
  className?: string;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  itemSelector = '> *',
  stagger = 0.05,
  duration = 0.3,
  from = 'start',
  y = 16,
  className,
}) => {
  const containerRef = useStaggerAnimation(itemSelector, {
    stagger,
    duration,
    from,
    y,
  });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
