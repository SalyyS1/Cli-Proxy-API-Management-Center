import React from 'react';
import styles from './Skeleton.module.scss';
import clsx from 'clsx';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'rectangular',
  className
}) => {
  const style: React.CSSProperties = {};

  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }

  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <div
      className={clsx(styles.skeleton, styles[variant], className)}
      style={style}
      aria-busy="true"
      aria-label="Loading"
    />
  );
};
