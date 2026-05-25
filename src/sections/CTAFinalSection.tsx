'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WhatsAppButton } from '@/components/WhatsAppButton';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── CTAFinalSection ──────────────────────────────────────────────── */

/**
 * CTAFinalSection — cierre editorial de la landing.
 *
 * Full-width, padding muy generoso vertical.
 * Gradient noir sutil para separar del fondo.
 * Eyebrow dorado + H2 gigante + subtexto + WhatsApp CTA.
 * Línea fina dorada decorativa debajo del CTA.
 * Contacto resumido: teléfono + horario condensado.
 *
 * Reveal: stagger fade-in + translateY al entrar en viewport.
 * prefers-reduced-motion: sin animación.
 */
export function CTAFinalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const els = [
      eyebrowRef.current,
      headingRef.current,
      subtextRef.current,
      ctaRef.current,
      separatorRef.current,
      contactRef.current,
    ].filter(Boolean);

    if (prefersReduced) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    if (!sectionRef.current) return;

    // Estado inicial
    gsap.set(els, { opacity: 0, y: 28 });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          stagger: 0.12,
        });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contacto"
      aria-label="CTA final — Reservá tu turno"
      className="relative w-full text-center"
      style={{
        backgroundColor: 'var(--bg-base)',
        padding: 'clamp(6rem, 12vw, 10rem) clamp(1.5rem, 6vw, 4rem)',
        borderTop: '1px solid var(--border)',
        /* Gradient sutil de variación de profundidad — no cromático */
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(26,19,16,0.8) 0%, transparent 70%), var(--bg-base)',
      }}
    >
      <div
        className="mx-auto w-full"
        style={{ maxWidth: '720px' }}
      >
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="text-[var(--gold)] uppercase tracking-[0.18em] font-medium mb-6"
          style={{ fontSize: 'var(--text-xs)' }}
        >
          Reservá tu turno
        </p>

        {/* Heading gigante */}
        <h2
          ref={headingRef}
          className="font-display font-light text-[var(--text-primary)]"
          style={{
            fontSize: 'var(--text-5xl)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
          }}
        >
          Tu próxima visita
          <span aria-hidden="true" style={{ color: 'var(--gold)' }}>
            .
          </span>
        </h2>

        {/* Subtexto */}
        <p
          ref={subtextRef}
          className="text-[var(--text-secondary)] font-light"
          style={{
            fontSize: 'var(--text-lg)',
            lineHeight: 1.7,
            maxWidth: '52ch',
            margin: '0 auto',
            marginBottom: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          Una llamada o un mensaje. Eso es todo lo que separa una primera vez
          de una rutina.
        </p>

        {/* WhatsApp CTA */}
        <div ref={ctaRef} className="flex justify-center">
          <WhatsAppButton
            variant="primary"
            label="Reservar por WhatsApp"
            message="Hola Carlos, quisiera reservar un turno"
          />
        </div>

        {/* Línea dorada decorativa */}
        <div
          ref={separatorRef}
          className="mx-auto mt-12"
          aria-hidden="true"
          style={{
            width: '60px',
            height: '1px',
            backgroundColor: 'var(--gold)',
            opacity: 0.5,
          }}
        />

        {/* Contacto condensado */}
        <p
          ref={contactRef}
          className="text-[var(--text-secondary)] mt-6"
          style={{
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.06em',
            opacity: 0.7,
          }}
        >
          +54 9 2604 06-2206{' '}
          <span aria-hidden="true" style={{ color: 'var(--border)' }}>
            ·
          </span>{' '}
          Lunes a Sábado
        </p>
      </div>
    </section>
  );
}
