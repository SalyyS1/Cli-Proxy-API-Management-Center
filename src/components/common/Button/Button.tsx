import React from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';
import { Spinner } from '../Spinner/Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        loading && styles.loading,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" className={styles.spinner} />}
      {!loading && icon && iconPosition === 'left' && (
        <span className={styles.icon}>{icon}</span>
      )}
      <span className={styles.label}>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className={styles.icon}>{icon}</span>
      )}
    </button>
  );
};
