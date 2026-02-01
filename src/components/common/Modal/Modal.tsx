import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Modal.module.scss';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showClose?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus the modal
      modalRef.current?.focus();
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus to previously focused element
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // GSAP entrance animation
  useEffect(() => {
    if (!isOpen || !overlayRef.current || !contentRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(overlayRef.current, { opacity: 1 });
      gsap.set(contentRef.current, { opacity: 1, scale: 1, y: 0 });
      return;
    }

    // Overlay fade in
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' }
    );

    // Content slide up + scale
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.95, y: 24 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power3.out', delay: 0.05 }
    );

    return () => {
      gsap.killTweensOf([overlayRef.current, contentRef.current]);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} className={styles.overlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={clsx(styles.modal, styles[size])}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div ref={contentRef}>
          <div className={styles.header}>
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
            {showClose && (
              <button
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Close modal"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
};
