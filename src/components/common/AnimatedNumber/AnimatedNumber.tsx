import React from 'react';
import { useCountUp } from '@/hooks/useCountUp';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}) => {
  const displayValue = useCountUp(value, { duration, decimals, prefix, suffix });

  return <span className={className}>{displayValue}</span>;
};
