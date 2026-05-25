'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar ScrollTrigger una sola vez, client-side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LenisProviderProps {
  children: React.ReactNode;
}

/**
 * LenisProvider — smooth scroll cinematográfico global.
 *
 * Config: lerp 0.08 (más suave que default 0.1), duración 1.4s, expo out.
 * smoothTouch: false → mobile mantiene scroll nativo (UX estándar).
 *
 * CRÍTICO: Lenis llama a ScrollTrigger.update() en su RAF callback
 * para que los triggers de GSAP funcionen correctamente con smooth scroll.
 *
 * IMPORTANTE: globals.css tiene `scroll-behavior: auto` para evitar
 * conflicto con Lenis. NO cambiar a smooth en CSS.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
      smoothWheel: true,
      touchMultiplier: 0, // Desactivar en mobile — UX nativa
    });

    lenisRef.current = lenis;

    // Exponer lenis globalmente para acceso desde Nav y otros componentes
    (window as unknown as Record<string, unknown>)['lenis'] = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      // CRÍTICO: notificar a ScrollTrigger del progreso de scroll real
      // Sin esto, los triggers de GSAP no calculan bien su posición con Lenis
      ScrollTrigger.update();
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as Record<string, unknown>)['lenis'];
    };
  }, []);

  return <>{children}</>;
}
