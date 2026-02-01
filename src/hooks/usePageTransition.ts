import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PageTransitionOptions {
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
}

export function usePageTransition(options: PageTransitionOptions = {}) {
  const {
    direction = 'up',
    duration = 0.4,
    delay = 0,
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(element, { opacity: 1 });
      hasAnimated.current = true;
      return;
    }

    // Set initial state based on direction
    const initialState = {
      opacity: 0,
      y: direction === 'up' ? 24 : direction === 'down' ? -24 : 0,
      x: direction === 'left' ? 24 : direction === 'right' ? -24 : 0,
    };

    gsap.set(element, initialState);

    // Animate to final state
    gsap.to(element, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      ease: 'power2.out',
      onComplete: () => {
        hasAnimated.current = true;
      },
    });

    return () => {
      gsap.killTweensOf(element);
    };
  }, [direction, duration, delay]);

  return elementRef;
}

// Exit animation for route changes
export function animatePageExit(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      resolve();
      return;
    }

    gsap.to(element, {
      opacity: 0,
      y: -16,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: resolve,
    });
  });
}
