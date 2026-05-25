'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { BUSINESS_EYEBROW, WHATSAPP_NUMBER } from '@/lib/constants';

/* ─── GSAP register ────────────────────────────────────────────────── */
// Se registra client-side — no hay riesgo de SSR
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────────────────────────────
   splitWords — helper propio (sin SplitText plugin paid)
   Envuelve cada palabra en:
     <span class="word-wrapper" aria-hidden="true">
       <span class="word-inner">...</span>
     </span>
   El wrapper tiene overflow:hidden para el clip-from-below.
   El texto original (accesible) queda en un <span class="sr-only">.
──────────────────────────────────────────────────────────────────── */

/**
 * Divide el innerHTML de un elemento en spans por palabra.
 * Preserva elementos HTML internos (como <em>, <span>) agrupando
 * la salida correctamente.
 *
 * IMPORTANTE: solo dividir textContent — mantener los spans de React
 * fuera de este proceso. Por eso usamos refs y manipulamos el DOM
 * directamente en useEffect.
 */
function splitWordsDom(el: HTMLElement): HTMLElement[] {
  const originalText = el.textContent ?? '';
  const originalHTML = el.innerHTML;

  // Crear el span accesible
  const srSpan = document.createElement('span');
  srSpan.className = 'sr-only';
  srSpan.textContent = originalText;

  // Dividir en palabras — manejar el innerHTML (puede tener <em>, <span>)
  // Estrategia: renderizar el HTML original como nodos, extraer palabras
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = originalHTML;

  // Obtener nodos de texto plano
  const words: string[] = [];
  const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT);
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    const parts = node.textContent?.split(/\s+/).filter(Boolean) ?? [];
    words.push(...parts);
  }

  // Limpiar el elemento
  el.innerHTML = '';
  el.appendChild(srSpan);

  // Crear spans para cada palabra
  const wordEls: HTMLElement[] = [];
  words.forEach((word, i) => {
    const wrapper = document.createElement('span');
    wrapper.className = 'word-wrapper';
    wrapper.style.cssText =
      'display: inline-block; overflow: hidden; vertical-align: bottom;';
    wrapper.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('span');
    inner.className = 'word-inner';
    inner.style.cssText = 'display: inline-block; will-change: transform;';
    inner.textContent = word;

    wrapper.appendChild(inner);
    el.appendChild(wrapper);

    // Espacio entre palabras (no al final)
    if (i < words.length - 1) {
      el.appendChild(document.createTextNode(' '));
    }

    wordEls.push(inner);
  });

  return wordEls;
}

/* ─── Scissors SVG — placeholder elegante ─────────────────────────── */

function ScissorsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
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

/* ─── HeroSection ──────────────────────────────────────────────────── */

/**
 * HeroSection — layout asimétrico cinematográfico.
 *
 * Desktop: split 45% texto / 55% foto, imagen sangra al borde derecho.
 * Mobile: foto full-bleed arriba, texto abajo.
 *
 * Animaciones:
 * - SplitText manual (helper propio, sin plugin paid) clip-from-below
 * - Eyebrow / lead / CTA: fade + translateY staggered
 * - Foto: parallax ScrollTrigger solo en desktop (gsap.matchMedia)
 * - prefers-reduced-motion: sin SplitText, solo opacity instantáneo
 */
export function HeroSection() {
  /* Refs para GSAP */
  const sectionRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detectar preferencia de movimiento reducido
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      /* ── Modo reducido — aparecer instantáneo ── */
      const els = [
        eyebrowRef.current,
        h1Ref.current,
        leadRef.current,
        ctaRef.current,
        subtextRef.current,
      ].filter(Boolean);
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    /* ── Ocultar todos los elementos antes de animar ── */
    gsap.set(
      [
        eyebrowRef.current,
        leadRef.current,
        ctaRef.current,
        subtextRef.current,
      ],
      { opacity: 0, y: 20 }
    );

    /* ── SplitText manual en H1 ── */
    let wordInners: HTMLElement[] = [];
    if (h1Ref.current) {
      wordInners = splitWordsDom(h1Ref.current);
      // Posición inicial: translateY(100%) — clip desde abajo
      gsap.set(wordInners, { y: '100%' });
      // Restaurar el color dorado del punto — splitWordsDom destruye el <span> original
      if (wordInners.length > 0) {
        wordInners[wordInners.length - 1].style.color = 'var(--gold)';
      }
    }

    /* ── Timeline principal — page load ── */
    const tl = gsap.timeline({ delay: 0.3 });

    // Eyebrow — fade in
    tl.to(eyebrowRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'expo.out',
    });

    // H1 words — clip-from-below con stagger 60ms
    if (wordInners.length > 0) {
      tl.to(
        wordInners,
        {
          y: '0%',
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.06,
        },
        '-=0.3' // Solapado con eyebrow
      );
    }

    // Lead paragraph
    tl.to(
      leadRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
      },
      '-=0.6'
    );

    // CTA button
    tl.to(
      ctaRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.4'
    );

    // Subtext
    tl.to(
      subtextRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    /* ── Parallax imagen — solo desktop ── */
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      if (!photoRef.current || !sectionRef.current) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          if (photoRef.current) {
            // Imagen sube más lento que el scroll — translateY -15% al final
            gsap.set(photoRef.current, {
              y: `${self.progress * -15}%`,
            });
          }
        },
      });

      // Cleanup retornado por matchMedia callback
      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    });

    return () => {
      tl.kill();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex"
      aria-label="Hero — Carlos Gañan Barbería Premium"
    >
      {/* ─────────────────────────────────────────────────────
          MOBILE: foto full-bleed de fondo (visible solo en mobile)
      ──────────────────────────────────────────────────────── */}
      <div className="lg:hidden absolute inset-0 z-0" aria-hidden="true">
        {/* TODO: usuario reemplazará con /public/images/hero.jpg */}
        <div className="relative w-full h-full placeholder-img">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--text-secondary)] opacity-30">
            <ScissorsIcon />
          </div>
          {/* Overlay gradiente para legibilidad del texto */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(10,8,7,0.95) 40%, rgba(10,8,7,0.6) 70%, rgba(10,8,7,0.3) 100%)',
            }}
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────
          DESKTOP: grid asimétrico 45/55
      ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full flex flex-col lg:grid lg:grid-cols-[45fr_55fr]">

        {/* ── Columna izquierda — TEXTO ── */}
        {/*
          paddingTop inline (clamp) → compensa nav 72px en mobile + espacio respiro.
          Se usa style inline para garantizar que Tailwind 4 no ignore el arbitrary value.
          clamp(5rem, 12vw, 6rem) = 80px min en mobile, hasta 96px en pantallas medianas.
          lg:pt-0 queda en className para que desktop no herede el padding.
        */}
        <div
          className="flex flex-col justify-center px-6 md:px-8 lg:px-12 xl:px-16 pb-16 lg:pt-0 lg:pb-0"
          style={{ paddingTop: 'clamp(5rem, 12vw, 6rem)' }}
        >
          <div className="max-w-[520px]">

            {/* Eyebrow */}
            <p
              ref={eyebrowRef}
              className="text-[var(--gold)] text-[0.6875rem] tracking-[0.18em] uppercase font-medium mb-6 lg:mb-8"
            >
              {BUSINESS_EYEBROW}
            </p>

            {/* H1 — Headline principal */}
            {/*
              El punto final en dorado es parte intencional del diseño.
              splitWordsDom() tomará el textContent del h1 tal cual.
              El <span aria-hidden> con el punto dorado se añade manualmente
              en el texto — como el split trabaja sobre el DOM, inyectamos
              el punto como parte del último word.
              Solución: H1 tiene el texto base, el punto dorado está
              en un hermano <span> con aria-hidden para no duplicar
              la semántica (el lector de pantallas lee el h1 completo).
            */}
            <h1
              ref={h1Ref}
              className="font-display font-light text-[var(--text-primary)]"
              style={{
                fontSize: 'var(--text-hero)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-tight)',
              }}
            >
              El detalle también comunica
              {/* Punto en dorado — microdetalle intencional del diseño */}
              <span
                aria-hidden="true"
                style={{ color: 'var(--gold)' }}
              >
                .
              </span>
            </h1>

            {/* Lead paragraph */}
            <p
              ref={leadRef}
              className="mt-6 lg:mt-8 text-[var(--text-secondary)] font-light leading-[1.7]"
              style={{ fontSize: 'var(--text-lg)', maxWidth: '45ch' }}
            >
              Cada corte es una conversación silenciosa entre la tijera y tu presencia.
            </p>

            {/* CTA */}
            <div ref={ctaRef} className="mt-8 lg:mt-10">
              <WhatsAppButton variant="primary" label="Reservar turno" />
            </div>

            {/* Subtext — número directo */}
            <p
              ref={subtextRef}
              className="mt-4 text-[var(--text-secondary)] opacity-60"
              style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}
            >
              También por WhatsApp · +54 9 {WHATSAPP_NUMBER.slice(2, 6)} {WHATSAPP_NUMBER.slice(6, 8)}-{WHATSAPP_NUMBER.slice(8)}
            </p>

          </div>
        </div>

        {/* ── Columna derecha — FOTO (solo desktop) ── */}
        <div
          className="hidden lg:block relative overflow-hidden"
          aria-hidden="true"
        >
          {/* Contenedor de la foto — parallax en este elemento */}
          <div
            ref={photoRef}
            className="absolute inset-0 will-change-transform"
            style={{
              // Overscan para que el parallax no deje bordes vacíos
              top: '-10%',
              bottom: '-10%',
            }}
          >
            {/* TODO: usuario reemplazará con /public/images/hero.jpg */}
            {/* Placeholder elegante con shimmer dorado */}
            <div className="placeholder-img w-full h-full">
              <div
                className="flex flex-col items-center justify-center gap-3 text-[var(--text-secondary)]"
                style={{ opacity: 0.2 }}
              >
                <ScissorsIcon />
                <span
                  className="text-[0.6875rem] tracking-[0.18em] uppercase"
                  style={{ letterSpacing: '0.18em' }}
                >
                  hero.jpg
                </span>
              </div>

              {/* Gradiente overlay — transición suave del texto al borde */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, rgba(10,8,7,0.85) 0%, rgba(10,8,7,0.2) 30%, transparent 60%)',
                }}
              />
            </div>
          </div>

          {/*
            NOTA PARA IMPLEMENTACIÓN:
            Cuando tengas la foto real, reemplazar el placeholder por:
            (importar Image de 'next/image')

            <Image
              src="/images/hero.jpg"
              alt="Barbero Carlos Gañan trabajando con precisión artesanal"
              fill
              priority
              className="object-cover object-center will-change-transform"
              sizes="55vw"
            />
          */}
        </div>

      </div>

      {/* ─── Línea decorativa inferior — ancla visual ─── */}
      <div
        className="absolute bottom-8 left-6 md:left-8 lg:left-12 xl:left-16 z-10"
        aria-hidden="true"
        role="presentation"
      >
        <div
          className="flex items-center gap-3"
          style={{ color: 'var(--text-secondary)', opacity: 0.65 }}
        >
          <div
            className="w-8 h-px bg-current"
          />
          <span
            className="text-[0.625rem] tracking-[0.18em] uppercase"
            style={{ letterSpacing: '0.18em' }}
          >
            Scroll
          </span>
        </div>
      </div>

    </section>
  );
}

