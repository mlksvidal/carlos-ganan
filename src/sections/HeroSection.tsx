'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { BUSINESS_EYEBROW, WHATSAPP_NUMBER } from '@/lib/constants';

/* ─── GSAP register ────────────────────────────────────────────────── */
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

function splitWordsDom(el: HTMLElement): HTMLElement[] {
  /* Idempotencia: si ya se splitó, devolver los .word-inner existentes.
     Evita duplicación cuando useEffect re-ejecuta (strict mode, HMR, re-render). */
  if (el.dataset.splitDone === 'true') {
    return Array.from(el.querySelectorAll<HTMLElement>('.word-inner'));
  }

  const originalText = el.textContent ?? '';
  const originalHTML = el.innerHTML;

  const srSpan = document.createElement('span');
  srSpan.className = 'sr-only';
  srSpan.textContent = originalText;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = originalHTML;

  const words: string[] = [];
  const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT);
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    const parts = node.textContent?.split(/\s+/).filter(Boolean) ?? [];
    words.push(...parts);
  }

  el.innerHTML = '';
  el.appendChild(srSpan);

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

    if (i < words.length - 1) {
      el.appendChild(document.createTextNode(' '));
    }

    wordEls.push(inner);
  });

  el.dataset.splitDone = 'true';
  return wordEls;
}

/* ─── HeroSection ──────────────────────────────────────────────────── */

/**
 * HeroSection — foto full-bleed 100vw × 100vh como background.
 *
 * Desktop: hero.png como bg absoluto inset-0, overlay gradient
 *          negro→transparente de izquierda a derecha (25-40% del ancho)
 *          para que el texto sea legible y la foto respire a la derecha.
 *
 * Mobile:  hero-mobile.png (vertical), overlay oscuro abajo para
 *          que el texto quede legible sobre la foto.
 *
 * Texto: position relative z-20, alineado bottom-left en desktop,
 *        bottom-center en mobile, max-width ~600px.
 *
 * Parallax: ScrollTrigger sobre el wrapper de la foto (translateY -15%)
 *           solo en desktop via gsap.matchMedia.
 *
 * Animaciones GSAP: SplitText reveal H1, fade+translateY staggered
 * para eyebrow / lead / CTA / subtext. Sin modificar.
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
  /* Flag que garantiza que el setup de animaciones se ejecuta UNA VEZ */
  const animatedRef = useRef(false);

  useEffect(() => {
    /* Hard guard contra ejecución doble (strict mode, HMR, re-renders) */
    if (animatedRef.current) return;
    animatedRef.current = true;

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReduced) {
        const els = [
          eyebrowRef.current,
          h1Ref.current,
          leadRef.current,
          ctaRef.current,
          subtextRef.current,
        ].filter(Boolean);
        gsap.set(els, { opacity: 1, y: 0 });
        if (h1Ref.current) {
          const wIs = h1Ref.current.querySelectorAll<HTMLElement>('.word-inner');
          gsap.set(wIs, { y: '0%' });
        }
        return;
      }

      /* SplitText manual — idempotente (data-split-done="true" guard) */
      let wordInners: HTMLElement[] = [];
      if (h1Ref.current) {
        wordInners = splitWordsDom(h1Ref.current);
        if (wordInners.length > 0) {
          wordInners[wordInners.length - 1].style.color = 'var(--gold)';
        }
      }

      /* Estado inicial de TODOS los elementos animables */
      gsap.set(
        [
          eyebrowRef.current,
          leadRef.current,
          ctaRef.current,
          subtextRef.current,
        ],
        { opacity: 0, y: 20 }
      );
      if (wordInners.length > 0) {
        gsap.set(wordInners, { y: '100%' });
      }

      /* Timeline principal */
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'expo.out',
      });

      if (wordInners.length > 0) {
        tl.to(
          wordInners,
          { y: '0%', duration: 1.2, ease: 'expo.out', stagger: 0.06 },
          '-=0.3'
        );
      }

      tl.to(
        leadRef.current,
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.6'
      );
      tl.to(
        ctaRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );
      tl.to(
        subtextRef.current,
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );

      /* Parallax imagen — solo desktop ≥1024px */
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
              gsap.set(photoRef.current, { y: `${self.progress * -15}%` });
            }
          },
        });
      });
    }, sectionRef);

    /* NO cleanup — el ref flag garantiza que solo se ejecuta una vez.
       En unmount real (navegación SPA), GSAP cancela animaciones huérfanas. */
    void ctx;
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] w-full overflow-hidden"
      aria-label="Hero — Carlos Gañan Barbería de autor en San Rafael"
    >

      {/* ─────────────────────────────────────────────────────
          FOTO BACKGROUND — full-bleed absolute inset-0
          Desktop: hero.png (horizontal)
          Mobile: hero-mobile.png (vertical)
      ──────────────────────────────────────────────────────── */}
      <div
        ref={photoRef}
        className="absolute will-change-transform"
        aria-hidden="true"
        style={{
          /* Overscan para parallax sin bordes vacíos */
          inset: '-10% 0',
        }}
      >
        {/* Desktop: hero horizontal */}
        <Image
          src="/images/hero.png"
          alt="Carlos Gañan cortando con tijera y máquina en su barbería"
          fill
          priority
          sizes="100vw"
          className="hidden md:block object-cover"
          style={{ objectPosition: 'center center' }}
        />
        {/* Mobile: hero vertical */}
        <Image
          src="/images/hero-mobile.png"
          alt="Carlos Gañan cortando con tijera y máquina en su barbería"
          fill
          priority
          sizes="100vw"
          className="block md:hidden object-cover object-top"
        />
      </div>

      {/* ─────────────────────────────────────────────────────
          OVERLAY — gradiente para legibilidad del texto
          Desktop: negro desde la izquierda, se abre a la derecha
                   (~40% ancho cubierto, foto respira al centro/derecha)
          Mobile:  oscuro en la parte inferior donde va el texto
      ──────────────────────────────────────────────────────── */}

      {/* Desktop overlay */}
      <div
        className="hidden md:block absolute inset-0 z-10"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to right, rgba(10,8,7,0.92) 0%, rgba(10,8,7,0.75) 25%, rgba(10,8,7,0.40) 48%, rgba(10,8,7,0.08) 65%, transparent 80%)',
        }}
      />

      {/* Mobile overlay — oscuro abajo donde vive el texto */}
      <div
        className="block md:hidden absolute inset-0 z-10"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to top, rgba(10,8,7,0.97) 0%, rgba(10,8,7,0.88) 35%, rgba(10,8,7,0.55) 60%, rgba(10,8,7,0.20) 80%, rgba(10,8,7,0.05) 100%)',
        }}
      />

      {/* ─────────────────────────────────────────────────────
          CONTENIDO OVERLAID — z-20, texto sobre la foto
          Desktop: alineado bottom-left, max-width 600px
          Mobile:  alineado bottom-center / bottom con padding
      ──────────────────────────────────────────────────────── */}
      <div
        className="relative z-20 flex flex-col justify-end min-h-[100dvh] pb-16 md:pb-20 lg:pb-24"
        style={{
          paddingTop: 'clamp(5rem, 12vw, 6rem)',
          paddingInline: 'clamp(1.5rem, 6vw, 6rem)',
        }}
      >
        <div className="max-w-[600px]">

          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            className="text-[var(--gold)] text-[0.6875rem] tracking-[0.18em] uppercase font-medium mb-6 lg:mb-8"
          >
            {BUSINESS_EYEBROW}
          </p>

          {/* H1 — Headline principal */}
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

      {/* ─── Línea decorativa inferior — ancla visual ─── */}
      <div
        className="absolute bottom-8 right-6 md:right-10 lg:right-16 xl:right-20 z-20"
        aria-hidden="true"
        role="presentation"
      >
        <div
          className="flex items-center gap-3"
          style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
        >
          <div className="w-8 h-px bg-current" />
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
