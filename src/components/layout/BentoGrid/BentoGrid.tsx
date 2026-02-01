import React from 'react';
import styles from './BentoGrid.module.scss';
import clsx from 'clsx';

interface BentoGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface BentoItemProps {
  children: React.ReactNode;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className,
}) => {
  return (
    <div
      className={clsx(
        styles.grid,
        styles[`cols-${columns}`],
        styles[`gap-${gap}`],
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoItem: React.FC<BentoItemProps> = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  className,
}) => {
  return (
    <div
      className={clsx(
        styles.item,
        colSpan > 1 && styles[`col-span-${colSpan}`],
        rowSpan > 1 && styles[`row-span-${rowSpan}`],
        className
      )}
    >
      {children}
    </div>
  );
};
