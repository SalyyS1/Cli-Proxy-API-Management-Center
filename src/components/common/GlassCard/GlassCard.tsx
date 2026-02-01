import React from 'react';
import styles from './GlassCard.module.scss';
import clsx from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'interactive' | 'emerald' | 'teal';
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className,
  onClick,
  as: Component = 'div',
}) => {
  return (
    <Component
      className={clsx(
        styles.card,
        styles[variant],
        onClick && styles.clickable,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </Component>
  );
};
