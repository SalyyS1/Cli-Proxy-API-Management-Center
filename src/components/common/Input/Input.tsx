import React, { useState, useId } from 'react';
import styles from './Input.module.scss';
import clsx from 'clsx';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password' | 'email' | 'number';
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  error,
  placeholder,
  disabled = false,
  className
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();
  const errorId = useId();

  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className={clsx(styles.container, className)}>
      <div
        className={clsx(
          styles.inputWrapper,
          isFloating && styles.floating,
          isFocused && styles.focused,
          error && styles.error,
          disabled && styles.disabled
        )}
      >
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          className={styles.input}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
        />
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      </div>
      {error && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
