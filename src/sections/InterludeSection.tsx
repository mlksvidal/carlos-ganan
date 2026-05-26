'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── ScissorsIcon — placeholder elegante ─────────────────────────── */

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

/* ─── splitCharsDom — helper char-by-char reveal ──────────────────── */

/**
 * Lee el textContent del elemento, lo convierte en spans por carácter.
 * Preserva un <span class="sr-only"> con el texto completo para accesibilidad.
 * Los espacios se mantienen como texto plano (no se animan).
 *
 * El último carácter visible (el punto final "." de la frase) recibe
 * color dorado después del split.
 *
 * @returns Array de HTMLElement spans animables (sin espacios)
 */
function splitCharsDom(el: HTMLElement): HTMLElement[] {
  /* Idempotencia: si ya se splitó, devolver los .char-span existentes */
  if (el.dataset.splitDone === 'true') {
    return Array.from(el.querySelectorAll<HTMLElement>('.char-span'));
  }

  const originalText = el.textContent ?? '';

  // Guardar accesibilidad — lector de pantalla lee el texto completo
  const srSpan = document.createElement('span');
  srSpan.className = 'sr-only';
  srSpan.textContent = originalText;

  el.innerHTML = '';
  el.appendChild(srSpan);

  const charEls: HTMLElement[] = [];

  for (let i = 0; i < originalText.length; i++) {
    const char = originalText[i];

    if (char === ' ') {
      el.appendChild(document.createTextNode(' ')); // Non-breaking space
    } else {
      const span = document.createElement('span');
      span.className = 'char-span';
      span.setAttribute('aria-hidden', 'true');
      span.style.cssText =
        'display: inline-block; will-change: transform, opacity;';
      span.textContent = char;
      el.appendChild(span);
      charEls.push(span);
    }
  }

  el.dataset.splitDone = 'true';
  return charEls;
}

/* ─── Componente ───────────────────────────────────────────────────── */

/**
 * InterludeSection — sección dramática full-bleed.
 *
 * "No es solo un corte. Es tu presencia."
 *
 * - Desktop: min-height 80vh
 * - Mobile:  min-height 60vh
 * - Fondo: placeholder dark con shimmer dorado + ScissorsIcon
 * - Overlay: degradé negro 0% top → 70% bottom
 * - Frase: Cormorant Garamond italic, centrada, char-by-char reveal
 *   cuando entra en viewport (ScrollTrigger, once: true)
 * - Punto final: dorado (coloreado post-split)
 * - prefers-reduced-motion: mostrar visible instantáneamente
 */
export function InterludeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const phraseRef = useRef<HTMLHeadingElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;

    const ctx = gsap.context(() => {
      const phraseEl = phraseRef.current;
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReduced) {
        if (phraseEl) gsap.set(phraseEl, { opacity: 1 });
        return;
      }

      if (!phraseEl || !sectionRef.current) return;

      /* splitCharsDom es idempotente — guard data-split-done */
      const charEls = splitCharsDom(phraseEl);

      if (charEls.length > 0) {
        charEls[charEls.length - 1].style.color = 'var(--gold)';
      }

      gsap.set(charEls, { opacity: 0, y: 40 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.to(charEls, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.03,
          });
        },
      });
    }, sectionRef);

    void ctx;
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="No es solo un corte. Es tu presencia."
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        minHeight: 'clamp(60vh, 80vh, 80vh)',
      }}
    >
      {/* ── Fondo placeholder — dark con shimmer dorado ── */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)',
        }}
      >
        {/* Shimmer dorado — animación definida en globals.css */}
        <div
          className="shimmer-gold absolute inset-0 pointer-events-none"
          aria-hidden="true"
        />

        {/* Ícono central decorativo */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ color: 'var(--border)', opacity: 0.3 }}
        >
          <ScissorsIcon />
        </div>

        {/*
          NOTA PARA IMPLEMENTACIÓN CON FOTO REAL:
          Reemplazar el div de fondo completo con:

          <Image
            src="/images/interlude.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        */}
      </div>

      {/* ── Overlay degradé negro — legibilidad del texto ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,8,7,0) 0%, rgba(10,8,7,0.70) 100%)',
        }}
      />

      {/* ── Frase principal — centrada con padding generoso ── */}
      <div
        className="relative z-[2] w-full text-center"
        style={{
          padding:
            'clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 6rem)',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/*
          El h2 contiene el texto completo de la frase.
          splitCharsDom() en useEffect reemplazará su contenido
          por spans animables + un sr-only con el texto original.
          Por eso ponemos el texto como string plano aquí —
          no hay spans de React dentro, el DOM se manipula después.
        */}
        <h2
          ref={phraseRef}
          className="font-display font-light italic text-[var(--text-primary)]"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {/* Texto plano — splitCharsDom lo manipulará en useEffect */}
          No es solo un corte. Es tu presencia.
        </h2>
      </div>
    </section>
  );
}
