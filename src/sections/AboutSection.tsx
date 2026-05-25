'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STATS } from '@/lib/constants';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── ScissorsIcon — placeholder foto ─────────────────────────────── */

function ScissorsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

/* ─── AboutSection ─────────────────────────────────────────────────── */

/**
 * AboutSection — "Un espacio de confianza y precisión"
 *
 * Desktop: 2 columnas — texto izquierda, foto-placeholder derecha.
 * Stats grid 4 columnas (2x2 en mobile) debajo.
 *
 * Animaciones:
 * - Columnas: fade + translateX desde sus lados, trigger ScrollTrigger "top 75%"
 * - Stats row: fade + translateY, trigger "top 70%"
 * - CountUp GSAP ticker, stagger 200ms entre stats
 * - Sufijo aparece al 95% del countup
 * - prefers-reduced-motion: mostrar valores finales, sin animación
 */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const photoColRef = useRef<HTMLDivElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  // Refs para los spans de los números (uno por stat)
  const numSpansRef = useRef<HTMLSpanElement[]>([]);
  // Refs para los sufijos
  const suffixSpansRef = useRef<HTMLSpanElement[]>([]);

  // Callback refs para poblar el array
  const setNumRef = useCallback((el: HTMLSpanElement | null, index: number) => {
    if (el) numSpansRef.current[index] = el;
  }, []);

  const setSuffixRef = useCallback((el: HTMLSpanElement | null, index: number) => {
    if (el) suffixSpansRef.current[index] = el;
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Mostrar todo instantáneamente
      gsap.set([textColRef.current, photoColRef.current, statsRowRef.current], {
        opacity: 1,
        x: 0,
        y: 0,
      });
      // Mostrar valores finales + sufijos visibles
      STATS.forEach((stat, i) => {
        const numEl = numSpansRef.current[i];
        if (numEl) {
          numEl.textContent =
            stat.valor % 1 !== 0 ? stat.valor.toFixed(1) : String(stat.valor);
        }
        const suffixEl = suffixSpansRef.current[i];
        if (suffixEl) gsap.set(suffixEl, { opacity: 1 });
      });
      return;
    }

    /* ── Estado inicial — ocultar todo ── */
    gsap.set(textColRef.current, { opacity: 0, x: -24 });
    gsap.set(photoColRef.current, { opacity: 0, x: 24 });
    gsap.set(statsRowRef.current, { opacity: 0, y: 20 });

    // Sufijos empiezan invisibles
    suffixSpansRef.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0 });
    });

    /* ── Reveal columnas — scroll trigger ── */
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to([textColRef.current, photoColRef.current], {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.12,
        });
      },
    });

    /* ── Stats reveal + CountUp — scroll trigger ── */
    ScrollTrigger.create({
      trigger: statsRowRef.current,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        // Fade in del row
        gsap.to(statsRowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
        });

        // CountUp por cada stat
        STATS.forEach((stat, i) => {
          const numEl = numSpansRef.current[i];
          if (!numEl) return;

          const isDecimal = stat.valor % 1 !== 0;
          const suffixEl = suffixSpansRef.current[i];
          const counter = { value: 0 };

          gsap.to(counter, {
            value: stat.valor,
            duration: 1.4,
            ease: 'power2.out',
            delay: i * 0.2,
            onUpdate: () => {
              numEl.textContent = isDecimal
                ? counter.value.toFixed(1)
                : String(Math.round(counter.value));

              // Revelar sufijo al 95% del recorrido
              if (suffixEl && counter.value >= stat.valor * 0.95) {
                gsap.to(suffixEl, {
                  opacity: 1,
                  duration: 0.15,
                  ease: 'power1.out',
                  overwrite: 'auto',
                });
              }
            },
            onComplete: () => {
              // Valor final exacto
              numEl.textContent = isDecimal
                ? stat.valor.toFixed(1)
                : String(stat.valor);
              if (suffixEl) gsap.set(suffixEl, { opacity: 1 });
            },
          });
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="confianza"
      className="bg-[var(--bg-base)]"
      style={{ padding: 'var(--space-section) 0' }}
      aria-label="Un espacio de confianza"
    >
      <div className="container-xl">

        {/* ── Grid 2 columnas: texto / foto ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Columna izquierda — texto */}
          <div ref={textColRef}>

            {/* Eyebrow dorado */}
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.18em',
                color: 'var(--gold)',
                marginBottom: 'var(--space-6)',
              }}
            >
              La barbería
            </p>

            {/* Título display */}
            <h2
              className="font-display font-light"
              style={{
                fontSize: 'var(--text-4xl)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-tight)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-6)',
              }}
            >
              Un espacio de confianza{' '}
              <em className="font-light not-italic" style={{ color: 'var(--gold)' }}>
                y precisión
              </em>
              .
            </h2>

            {/* Párrafo lead */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-lg)',
                lineHeight: '1.75',
                color: 'var(--text-secondary)',
                maxWidth: '52ch',
                marginBottom: 'var(--space-8)',
              }}
            >
              Cada cliente cruza una puerta antigua y entra a un ritual.
              Doce años perfeccionando el oficio en San Rafael, donde el detalle
              no es un extra — es la promesa.
            </p>

            {/* Firma */}
            <p
              className="font-display italic font-light"
              style={{
                fontSize: 'var(--text-xl)',
                color: 'var(--text-accent)',
                letterSpacing: '0.02em',
              }}
            >
              — Carlos Gañan
            </p>
          </div>

          {/* Columna derecha — foto placeholder 4:5 con frame dorado */}
          <div ref={photoColRef} className="relative" aria-hidden="true">
            <div className="relative" style={{ paddingBottom: '125%' /* 4:5 ratio */ }}>

              {/* Frame dorado decorativo — offset 8px */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: '-8px',
                  left: '-8px',
                  right: '8px',
                  bottom: '8px',
                  border: '1px solid var(--gold)',
                  opacity: 0.4,
                  zIndex: 1,
                }}
                aria-hidden="true"
              />

              {/* Placeholder con shimmer dorado */}
              <div className="absolute inset-0 placeholder-img">
                <div
                  className="flex flex-col items-center justify-center gap-3 text-[var(--text-secondary)]"
                  style={{ opacity: 0.2 }}
                >
                  <ScissorsIcon />
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-xs)',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                    }}
                  >
                    foto del barber
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── Separador + Stats grid ── */}
        <div
          style={{
            marginTop: 'var(--space-16)',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 'var(--space-12)',
          }}
        >
          <div
            ref={statsRowRef}
            className="grid grid-cols-2 sm:grid-cols-4"
            role="list"
            aria-label="Métricas de confianza"
          >
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                role="listitem"
                aria-label={stat.ariaLabel}
                className="relative flex flex-col items-center text-center px-4 py-8 lg:py-10"
              >
                {/* Número oversized + sufijo */}
                <div
                  className="font-display font-light leading-none"
                  style={{
                    fontSize: 'clamp(3.5rem, 7vw, 6rem)',
                    letterSpacing: '-0.03em',
                    color: 'var(--text-primary)',
                  }}
                  aria-hidden="true"
                >
                  <span
                    ref={(el) => setNumRef(el, index)}
                    className="tabular-nums"
                  >
                    {stat.valor % 1 !== 0 ? stat.valor.toFixed(1) : stat.valor}
                  </span>
                  {stat.sufijo && (
                    <span
                      ref={(el) => setSuffixRef(el, index)}
                      style={{
                        color: 'var(--gold)',
                        fontSize: '0.65em',
                      }}
                      aria-hidden="true"
                    >
                      {stat.sufijo}
                    </span>
                  )}
                </div>

                {/* Label */}
                <p
                  className="mt-3 uppercase"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.14em',
                    color: 'var(--text-secondary)',
                  }}
                  aria-hidden="true"
                >
                  {stat.label}
                </p>

                {/* Separador vertical — excepto el último */}
                {index < STATS.length - 1 && (
                  <div
                    className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                    style={{
                      width: '1px',
                      height: '40%',
                      background: 'rgba(201, 169, 97, 0.35)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
