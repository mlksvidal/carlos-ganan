'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';

/**
 * useMagneticHover — efecto magnético sutil en CTAs principales.
 *
 * El elemento sigue al cursor con desplazamiento proporcional a la
 * distancia desde el centro. Completamente CSS-transform (opacity/transform),
 * sin DOM mutation.
 *
 * - Respeta prefers-reduced-motion
 * - Idempotente vía initRef
 * - Cleanup: removeEventListener en return
 *
 * @param ref    RefObject al elemento HTML que recibe el efecto
 * @param strength  Qué tanto se desplaza (0–1). Default 0.3
 */
export function useMagneticHover<T extends HTMLElement>(
  ref: RefObject<T | null>,
  strength = 0.3
) {
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    if (!ref.current) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) return;

    initRef.current = true;
    const el = ref.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (e.clientX - centerX) * strength;
      const offsetY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: offsetX,
        y: offsetY,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
