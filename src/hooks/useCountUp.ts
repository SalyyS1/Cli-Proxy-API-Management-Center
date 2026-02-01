import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface CountUpOptions {
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
}

export function useCountUp(
  endValue: number,
  options: CountUpOptions = {}
) {
  const {
    duration = 1,
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
  } = options;

  const [displayValue, setDisplayValue] = useState(0);
  const valueRef = useRef({ value: 0 });
  const prevEndValue = useRef(endValue);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setDisplayValue(endValue);
      valueRef.current.value = endValue;
      return;
    }

    // Only animate if value changed
    if (prevEndValue.current === endValue) return;

    gsap.to(valueRef.current, {
      value: endValue,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayValue(valueRef.current.value);
      },
    });

    prevEndValue.current = endValue;

    return () => {
      gsap.killTweensOf(valueRef.current);
    };
  }, [endValue, duration]);

  // Format the display value
  const formattedValue = formatNumber(displayValue, decimals, separator);

  return `${prefix}${formattedValue}${suffix}`;
}

function formatNumber(
  value: number,
  decimals: number,
  separator: string
): string {
  const fixed = value.toFixed(decimals);
  const [integer, decimal] = fixed.split('.');

  const withSeparator = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return decimal ? `${withSeparator}.${decimal}` : withSeparator;
}
