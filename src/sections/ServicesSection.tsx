'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '@/lib/constants';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── ServiceRow — fila editorial individual ───────────────────────── */

interface ServiceRowProps {
  numeral: string;
  nombre: string;
  descripcion: string;
  isLast: boolean;
  rowRef: (el: HTMLDivElement | null) => void;
  numeralRef: (el: HTMLSpanElement | null) => void;
  separatorRef: (el: HTMLDivElement | null) => void;
}

function ServiceRow({
  numeral,
  nombre,
  descripcion,
  isLast,
  rowRef,
  numeralRef,
  separatorRef,
}: ServiceRowProps) {
  return (
    <div
      ref={rowRef}
      className="service-row group relative flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8"
      style={{
        padding: 'var(--space-8) 0',
        cursor: 'default',
      }}
    >
      {/* Fondo hover sutil — via CSS group */}
      {/*
        El background en hover se logra con la clase group y una pseudo-layer
        posicionada absolutamente para no afectar el layout.
        Se hace con CSS inline + transición porque GSAP se encarga de la
        entrada (stagger), pero el hover es CSS puro para no conflictuar.
      */}
      <div
        className="absolute inset-0 -mx-4 lg:-mx-6 pointer-events-none transition-opacity duration-300"
        style={{
          background: 'var(--gold-bg-subtle)',
          opacity: 0,
          borderRadius: 'var(--radius-base)',
        }}
        aria-hidden="true"
        // El grupo parent activa este via CSS — ver clase en padre
        // Se usa JS para el hover porque necesitamos targeting preciso
      />

      {/* Numeral romano — izquierda */}
      <span
        ref={numeralRef}
        className="font-display italic font-light shrink-0 select-none transition-transform duration-300"
        style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: 'var(--gold)',
          letterSpacing: '-0.02em',
          lineHeight: '1',
          // En mobile: numeral arriba; en desktop: alineado con el texto
          paddingTop: '0.1em', // compensar baseline del serif
          width: '3rem',
          display: 'inline-block',
          willChange: 'transform',
        }}
        aria-hidden="true"
      >
        {numeral}
      </span>

      {/* Contenido — nombre + descripción */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-display font-light"
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
            lineHeight: '1.05',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-3)',
          }}
        >
          {nombre}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            lineHeight: '1.65',
            color: 'var(--text-secondary)',
            maxWidth: '500px',
          }}
        >
          {descripcion}
        </p>
      </div>

      {/* Separador horizontal — con animación dorada en hover */}
      {!isLast && (
        <div
          className="absolute bottom-0 left-0 right-0"
          aria-hidden="true"
          style={{ height: '1px', overflow: 'hidden' }}
        >
          {/* Base line */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--border)',
            }}
          />
          {/* Gold line — scaleX 0→1 en hover, transform-origin left */}
          <div
            ref={separatorRef}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--gold)',
              transformOrigin: 'left center',
              transform: 'scaleX(0)',
              // La transición la maneja GSAP o CSS según si es hover
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ─── ServicesSection ──────────────────────────────────────────────── */

/**
 * ServicesSection — lista vertical editorial con numerales romanos.
 *
 * T9: Layout, content, tipografía editorial.
 * T10: Stagger entrance + hover interacciones.
 *
 * Hover por fila:
 * - Separador: scaleX 0→1 gold desde la izquierda (CSS transition)
 * - Numeral: translateX(+8px) sutil (CSS transition)
 * - Background: gold-bg-subtle fade (CSS transition)
 *
 * Entrance (ScrollTrigger):
 * - Cada fila: fade + translateY(40px)→0, stagger 120ms, ease expo.out
 * - Trigger: "top 85%" por fila (batch con stagger)
 * - prefers-reduced-motion: skip entrance, hover funciona sin transforms
 */
export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingAreaRef = useRef<HTMLDivElement>(null);

  // Refs para las filas, numerales y separadores
  const rowRefs = useRef<HTMLDivElement[]>([]);
  const numeralRefs = useRef<HTMLSpanElement[]>([]);
  const separatorRefs = useRef<HTMLDivElement[]>([]);

  const setRowRef = useCallback((el: HTMLDivElement | null, i: number) => {
    if (el) rowRefs.current[i] = el;
  }, []);

  const setNumeralRef = useCallback((el: HTMLSpanElement | null, i: number) => {
    if (el) numeralRefs.current[i] = el;
  }, []);

  const setSeparatorRef = useCallback((el: HTMLDivElement | null, i: number) => {
    if (el) separatorRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Hover handlers — JS para targeting preciso de separador + numeral ── */
    const cleanupHandlers: (() => void)[] = [];

    rowRefs.current.forEach((row, i) => {
      if (!row) return;

      const numEl = numeralRefs.current[i];
      const sepEl = separatorRefs.current[i];
      // La capa de fondo es el primer hijo
      const bgLayer = row.querySelector('[aria-hidden="true"]') as HTMLElement | null;

      const onMouseEnter = () => {
        // Fondo sutil
        if (bgLayer) gsap.to(bgLayer, { opacity: 1, duration: 0.3, ease: 'power1.out' });

        // Numeral translateX — solo si no hay preferencia de movimiento reducido
        if (numEl && !prefersReduced) {
          gsap.to(numEl, { x: 8, duration: 0.35, ease: 'power2.out' });
        }

        // Separador scaleX 0→1 — funciona incluso con reduced motion (solo CSS)
        if (sepEl) {
          gsap.to(sepEl, {
            scaleX: 1,
            duration: prefersReduced ? 0.001 : 0.45,
            ease: 'power2.out',
          });
        }
      };

      const onMouseLeave = () => {
        if (bgLayer) gsap.to(bgLayer, { opacity: 0, duration: 0.25, ease: 'power1.in' });

        if (numEl && !prefersReduced) {
          gsap.to(numEl, { x: 0, duration: 0.35, ease: 'power2.inOut' });
        }

        if (sepEl) {
          gsap.to(sepEl, {
            scaleX: 0,
            duration: prefersReduced ? 0.001 : 0.35,
            ease: 'power2.in',
          });
        }
      };

      row.addEventListener('mouseenter', onMouseEnter);
      row.addEventListener('mouseleave', onMouseLeave);

      cleanupHandlers.push(() => {
        row.removeEventListener('mouseenter', onMouseEnter);
        row.removeEventListener('mouseleave', onMouseLeave);
      });
    });

    if (prefersReduced) {
      // Sin entrance animations — todo visible desde el inicio
      gsap.set(headingAreaRef.current, { opacity: 1, y: 0 });
      gsap.set(rowRefs.current, { opacity: 1, y: 0 });
      return () => cleanupHandlers.forEach((fn) => fn());
    }

    /* ── Estado inicial ── */
    gsap.set(headingAreaRef.current, { opacity: 0, y: 24 });
    gsap.set(rowRefs.current, { opacity: 0, y: 40 });

    /* ── Heading reveal ── */
    ScrollTrigger.create({
      trigger: headingAreaRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(headingAreaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
        });
      },
    });

    /* ── Filas: stagger entrance por ScrollTrigger batch ── */
    // Usamos ScrollTrigger por fila con delay acumulado para el stagger
    rowRefs.current.forEach((row, i) => {
      if (!row) return;

      ScrollTrigger.create({
        trigger: row,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(row, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            // Stagger acumulado de 120ms respecto al orden de la lista
            delay: i * 0.12,
          });
        },
      });
    });

    return () => {
      cleanupHandlers.forEach((fn) => fn());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className="bg-[var(--bg-elevated)]"
      style={{ padding: 'var(--space-section) 0' }}
      aria-label="Nuestros servicios"
    >
      <div className="container-xl">

        {/* ── Heading area ── */}
        <div ref={headingAreaRef} style={{ marginBottom: 'var(--space-12)' }}>

          {/* Eyebrow dorado */}
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.18em',
              color: 'var(--gold)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Nuestros servicios
          </p>

          {/* H2 display */}
          <h2
            className="font-display font-light"
            style={{
              fontSize: 'var(--text-4xl)',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)',
              color: 'var(--text-primary)',
              maxWidth: '18ch',
            }}
          >
            Más que un corte,{' '}
            <em className="font-light" style={{ color: 'var(--gold)' }}>
              un detalle
            </em>
            .
          </h2>
        </div>

        {/* ── Lista vertical editorial ── */}
        <div
          role="list"
          aria-label="Lista de servicios"
          // Padding top — la primera fila tiene su propio padding-top
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {SERVICES.map((servicio, index) => (
            <div key={servicio.id} role="listitem">
              <ServiceRow
                numeral={servicio.numeral}
                nombre={servicio.nombre}
                descripcion={servicio.descripcionEditorial}
                isLast={index === SERVICES.length - 1}
                rowRef={(el) => setRowRef(el, index)}
                numeralRef={(el) => setNumeralRef(el, index)}
                separatorRef={(el) => setSeparatorRef(el, index)}
              />
            </div>
          ))}
        </div>

        {/* ── CTA final — bajo la lista ── */}
        <div
          style={{
            marginTop: 'var(--space-12)',
            paddingTop: 'var(--space-8)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}
          >
            Sin turno obligatorio. Consulta por WhatsApp.
          </p>
          <a
            href={`https://wa.me/5492604062206?text=${encodeURIComponent('Hola Carlos, quisiera reservar un turno')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center uppercase transition-colors duration-200"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.14em',
              color: 'var(--gold)',
              gap: 'var(--space-2)',
            }}
            aria-label="Reservar turno por WhatsApp"
          >
            Reservar ahora
            {/* Flecha decorativa */}
            <span aria-hidden="true" style={{ fontSize: '1.1em' }}>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}
