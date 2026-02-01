import React from 'react';
import styles from './Spinner.module.scss';
import clsx from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className
}) => {
  return (
    <div
      className={clsx(styles.spinner, styles[size], className)}
      role="status"
      aria-label="Loading"
    >
      <div className={styles.circle}></div>
    </div>
  );
};
