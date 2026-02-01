import React from 'react';
import styles from './Badge.module.scss';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className
}) => {
  return (
    <span
      className={clsx(
        styles.badge,
        styles[variant],
        styles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
