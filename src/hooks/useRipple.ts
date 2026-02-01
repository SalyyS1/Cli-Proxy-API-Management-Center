import { useCallback, useRef } from 'react';
import { gsap } from 'gsap';

interface RippleOptions {
  color?: string;
  duration?: number;
}

export function useRipple(options: RippleOptions = {}) {
  const { color = 'rgba(255, 255, 255, 0.3)', duration = 0.6 } = options;
  const containerRef = useRef<HTMLElement>(null);

  const createRipple = useCallback(
    (event: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) return;

      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: ${color};
        pointer-events: none;
        transform: scale(0);
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        margin-left: -5px;
        margin-top: -5px;
      `;

      container.style.position = 'relative';
      container.style.overflow = 'hidden';
      container.appendChild(ripple);

      const size = Math.max(rect.width, rect.height) * 2.5;

      gsap.to(ripple, {
        scale: size / 10,
        opacity: 0,
        duration,
        ease: 'power2.out',
        onComplete: () => {
          ripple.remove();
        },
      });
    },
    [color, duration]
  );

  return { containerRef, createRipple };
}
