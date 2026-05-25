'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HOURS } from '@/lib/constants';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Pin SVG — ícono de ubicación monolínea ──────────────────────── */

function PinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-shrink-0 mt-0.5"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ─── ClockIcon — ícono de horario monolínea ──────────────────────── */

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/* ─── Google Maps URL ─────────────────────────────────────────────── */

const ADDRESS_ENCODED = encodeURIComponent(
  'San Lorenzo 269, San Rafael, Mendoza, Argentina'
);
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${ADDRESS_ENCODED}`;

// URL del iframe embed (sin API key — gratis, funcional)
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${ADDRESS_ENCODED}&output=embed&z=16&hl=es`;

/* ─── LocationSection ──────────────────────────────────────────────── */

/**
 * LocationSection — Ubicación + Horarios.
 *
 * id="ubicacion" para el nav anchor.
 * Layout 2 cols desktop: izquierda dirección+horarios, derecha mapa.
 * Google Maps embed (sin API key) con borde dorado 1px.
 *
 * Reveals: ScrollTrigger, columnas en stagger fade-in + translateX.
 * prefers-reduced-motion: sin animación.
 */
export function LocationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      const els = [
        eyebrowRef.current,
        headingRef.current,
        leftColRef.current,
        rightColRef.current,
      ].filter(Boolean);
      gsap.set(els, { opacity: 1, x: 0, y: 0 });
      return;
    }

    if (!sectionRef.current) return;

    // Estado inicial oculto
    gsap.set(
      [eyebrowRef.current, headingRef.current],
      { opacity: 0, y: 20 }
    );
    gsap.set(leftColRef.current, { opacity: 0, x: -24 });
    gsap.set(rightColRef.current, { opacity: 0, x: 24 });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();

        tl.to(eyebrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'expo.out',
        })
          .to(
            headingRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'expo.out',
            },
            '-=0.3'
          )
          .to(
            [leftColRef.current, rightColRef.current],
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power2.out',
              stagger: 0.12,
            },
            '-=0.4'
          );
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ubicacion"
      aria-label="Ubicación y horarios — Carlos Gañan Barbería"
      className="relative w-full"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        padding: 'var(--space-section) 0',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: 'var(--container-xl)',
          padding: '0 clamp(1.5rem, 4vw, 4rem)',
        }}
      >
        {/* ── Eyebrow + Heading ── */}
        <div className="mb-12 lg:mb-16">
          <p
            ref={eyebrowRef}
            className="text-[var(--gold)] uppercase tracking-[0.18em] font-medium mb-4"
            style={{ fontSize: 'var(--text-xs)' }}
          >
            Visitanos
          </p>
          <h2
            ref={headingRef}
            className="font-display font-light text-[var(--text-primary)]"
            style={{
              fontSize: 'var(--text-4xl)',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            San Rafael, Mendoza
            <span aria-hidden="true" style={{ color: 'var(--gold)' }}>
              .
            </span>
          </h2>
        </div>

        {/* ── Layout 2 cols desktop ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Columna izquierda — Dirección + Horarios ── */}
          <div ref={leftColRef}>

            {/* Dirección */}
            <div className="mb-10">
              <div
                className="flex items-start gap-3 mb-3"
                style={{ color: 'var(--text-secondary)' }}
              >
                <PinIcon />
                <div>
                  <p
                    className="text-[var(--text-primary)] font-medium mb-1"
                    style={{ fontSize: 'var(--text-base)' }}
                  >
                    San Lorenzo 269
                  </p>
                  <p
                    className="text-[var(--text-secondary)]"
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    M5600 San Rafael, Mendoza, Argentina
                  </p>
                </div>
              </div>

              {/* CTA Cómo llegar */}
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 mt-3"
                aria-label="Cómo llegar a Carlos Gañan — abre Google Maps"
                style={{
                  color: 'var(--gold)',
                  fontSize: 'var(--text-sm)',
                  letterSpacing: '0.04em',
                }}
              >
                <span className="relative">
                  Cómo llegar
                  {/* Underline dorado en hover */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 -bottom-0.5 h-px w-0 bg-[var(--gold)] transition-[width] duration-[var(--dur-normal)] ease-[var(--ease-out-expo)] group-hover:w-full"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-quart)] group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>

            {/* Separador */}
            <div
              className="mb-10"
              style={{ borderTop: '1px solid var(--border)' }}
            />

            {/* Horarios */}
            <div>
              <div
                className="flex items-center gap-3 mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ClockIcon />
                <p
                  className="text-[var(--text-primary)] uppercase tracking-[0.12em] font-medium"
                  style={{ fontSize: 'var(--text-xs)' }}
                >
                  Horarios de atención
                </p>
              </div>

              <ul className="space-y-0" aria-label="Horarios de la barbería">
                {HOURS.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-baseline py-4"
                    style={{
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <span
                      className="text-[var(--text-secondary)]"
                      style={{ fontSize: 'var(--text-sm)' }}
                    >
                      {item.dias}
                    </span>
                    <span
                      className={
                        item.horario === 'Cerrado'
                          ? 'text-[var(--text-secondary)] opacity-70'
                          : 'text-[var(--text-primary)]'
                      }
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontVariantNumeric: 'tabular-nums',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {item.horario}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Nota WhatsApp */}
              <p
                className="mt-6 text-[var(--text-secondary)]"
                style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.04em',
                  lineHeight: 1.7,
                }}
              >
                ¿Necesitás confirmar disponibilidad?{' '}
                <a
                  href={`https://wa.me/5492604062206?text=${encodeURIComponent('Hola Carlos, consulto sobre disponibilidad')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--gold)] hover:text-[var(--gold-hi)] transition-colors duration-[var(--dur-fast)]"
                  style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}
                  aria-label="Consultar disponibilidad por WhatsApp"
                >
                  Escribinos por WhatsApp.
                </a>
              </p>
            </div>
          </div>

          {/* ── Columna derecha — Mapa Google Maps embed ── */}
          <div ref={rightColRef}>
            <div
              className="relative overflow-hidden"
              style={{
                border: '1px solid var(--border-strong, rgba(201,169,97,0.35))',
                borderRadius: '2px',
                height: 'clamp(340px, 50vh, 500px)',
              }}
            >
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', filter: 'grayscale(30%) contrast(1.05)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Carlos Gañan Barbería — San Lorenzo 269, San Rafael, Mendoza"
                aria-label="Mapa de ubicación de la barbería"
              />

              {/* Etiqueta sobre el mapa */}
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(10,8,7,0.92) 0%, transparent 100%)',
                }}
              >
                <p
                  className="text-[var(--text-secondary)]"
                  style={{
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  San Lorenzo 269 · San Rafael, Mendoza
                </p>
              </div>
            </div>

            {/* Fallback accesible si iframe no carga */}
            <noscript>
              <p className="mt-2 text-[var(--text-secondary)] text-sm">
                Ver en{' '}
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--gold)] underline"
                >
                  Google Maps
                </a>
              </p>
            </noscript>
          </div>
        </div>
      </div>
    </section>
  );
}
