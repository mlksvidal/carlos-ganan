'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealOptions = {
  /** Selector dentro del ref para animar múltiples hijos en stagger */
  selector?: string;
  /** Píxeles a desplazar verticalmente al inicio (default 30) */
  y?: number;
  /** Duración de cada elemento (default 0.9s) */
  duration?: number;
  /** Stagger entre elementos cuando hay selector (default 0.12s) */
  stagger?: number;
  /** Trigger position (default "top 85%") */
  start?: string;
  /** Delay inicial */
  delay?: number;
  /** Ease */
  ease?: string;
};

/**
 * useScrollReveal — fade + translateY suave cuando el elemento entra al viewport.
 *
 * Solo opacity + transform (sin DOM mutation). Idempotente vía ref guard.
 * Respeta prefers-reduced-motion.
 *
 * Ejemplo:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useScrollReveal(ref);
 *   <div ref={ref}>contenido</div>
 *
 *   Con stagger de hijos:
 *   useScrollReveal(ref, { selector: '.item', stagger: 0.1 });
 */
export function useScrollReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: RevealOptions = {}
) {
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    if (!ref.current) return;
    initRef.current = true;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const {
      selector,
      y = 30,
      duration = 0.9,
      stagger = 0.12,
      start = 'top 85%',
      delay = 0,
      ease = 'expo.out',
    } = options;

    const targets = selector
      ? Array.from(ref.current.querySelectorAll<HTMLElement>(selector))
      : [ref.current];

    if (targets.length === 0) return;

    if (prefersReduced) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y });

    ScrollTrigger.create({
      trigger: ref.current,
      start,
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          ease,
          stagger,
          delay,
          overwrite: 'auto',
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
