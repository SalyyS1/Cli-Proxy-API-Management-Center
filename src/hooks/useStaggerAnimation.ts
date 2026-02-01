import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface StaggerOptions {
  stagger?: number;
  duration?: number;
  from?: 'start' | 'end' | 'center' | 'edges';
  y?: number;
}

export function useStaggerAnimation(
  itemSelector: string,
  options: StaggerOptions = {}
) {
  const {
    stagger = 0.05,
    duration = 0.3,
    from = 'start',
    y = 16,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasAnimated.current) return;

    const items = container.querySelectorAll(itemSelector);
    if (items.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1 });
      hasAnimated.current = true;
      return;
    }

    gsap.set(items, { opacity: 0, y });

    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration,
      stagger: { each: stagger, from },
      ease: 'power2.out',
      onComplete: () => {
        hasAnimated.current = true;
      },
    });

    return () => {
      gsap.killTweensOf(items);
    };
  }, [itemSelector, stagger, duration, from, y]);

  return containerRef;
}
