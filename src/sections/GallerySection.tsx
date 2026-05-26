'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── GallerySection — Instagram embed ──────────────────────────────────
   Reemplaza la galería bento por el feed oficial de Instagram del cliente.
   URL del perfil: https://www.instagram.com/carlosganan.charly/

   Estructura:
   - Eyebrow dorado "EN INSTAGRAM"
   - H2 Cormorant: "El trabajo dice más que las palabras."
   - Subtexto Inter
   - iframe embed oficial de Instagram (sin token, gratis)
   - Fallback si el iframe no carga (ad blocker / privacy mode)
   - CTA link "Seguinos en Instagram →"

   CSP: vercel.json tiene frame-src con https://www.instagram.com
──────────────────────────────────────────────────────────────────────── */

const INSTAGRAM_HANDLE = 'carlosganan.charly';
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
const INSTAGRAM_EMBED_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/embed`;

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const [iframeError, setIframeError] = useState(false);

  /* ── Scroll reveal — heading + embed ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      gsap.set(headingRef.current, { opacity: 0, y: 24 });
      gsap.set(embedRef.current, { opacity: 0, y: 32 });

      ScrollTrigger.create({
        trigger: headingRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(headingRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
          });
          gsap.to(embedRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            delay: 0.2,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Fallback: si el iframe tarda >6s y no envió señal, detectar bloqueador ── */
  useEffect(() => {
    /*
     * Los iframes de Instagram no disparan onError cuando son bloqueados
     * por extensiones (uBlock, Privacy Badger). Detectamos el estado via
     * window.addEventListener('message') — Instagram envía postMessage al cargar.
     * Si en 8s no recibimos mensaje, mostramos el fallback.
     */
    let loaded = false;

    const handleMessage = (e: MessageEvent) => {
      if (
        typeof e.data === 'string' &&
        e.data.includes('instagram') ||
        (e.origin && e.origin.includes('instagram.com'))
      ) {
        loaded = true;
      }
    };

    window.addEventListener('message', handleMessage);

    const timeout = setTimeout(() => {
      if (!loaded) {
        // Solo mostrar fallback si el iframe aún no está visible/cargado
        // Verificamos si el iframe tiene contenido accesible
        const iframe = sectionRef.current?.querySelector('iframe');
        if (iframe) {
          try {
            // Si podemos acceder al contentDocument, cargó bien
            void iframe.contentDocument;
          } catch {
            // Cross-origin blocked = cargó bien (es esperado)
            loaded = true;
          }
        }
        if (!loaded) {
          setIframeError(true);
        }
      }
    }, 8000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="galeria"
      aria-label="Instagram de Carlos Gañan"
      style={{
        background: 'var(--bg-base)',
        padding: 'var(--space-section) 0',
      }}
    >
      {/* ── Header editorial — centrado ── */}
      <div
        ref={headingRef}
        className="container-xl"
        style={{
          marginBottom: 'var(--space-10)',
          textAlign: 'center',
          maxWidth: '720px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {/* Eyebrow */}
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
          En Instagram
        </p>

        {/* H2 Cormorant */}
        <h2
          className="font-display font-light"
          style={{
            fontSize: 'var(--text-4xl)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
          }}
        >
          El trabajo dice más que las palabras
          <span aria-hidden="true" style={{ color: 'var(--gold)' }}>
            .
          </span>
        </h2>

        {/* Subtexto */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)',
            fontWeight: 300,
            lineHeight: 1.7,
            maxWidth: '42ch',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Cada corte, cada detalle, cada cliente. Mirá el día a día.
        </p>
      </div>

      {/* ── Embed de Instagram ── */}
      <div
        ref={embedRef}
        className="container-xl"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)' }}
      >
        {/* Iframe embed — visible cuando no hay error */}
        {!iframeError ? (
          <div
            style={{
              width: '100%',
              maxWidth: '430px',
              border: '1px solid var(--gold)',
              lineHeight: 0, /* evitar espacio blanco debajo del iframe */
            }}
          >
            <iframe
              src={INSTAGRAM_EMBED_URL}
              width="430"
              height="560"
              frameBorder="0"
              scrolling="no"
              allowTransparency
              title="Instagram de Carlos Gañan"
              loading="lazy"
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '430px',
                height: '560px',
                border: 'none',
              }}
              onError={() => setIframeError(true)}
            />
          </div>
        ) : (
          /* ── Fallback — visible si ad blocker / privacy mode bloquea el iframe ── */
          <div
            role="img"
            aria-label="Feed de Instagram de Carlos Gañan — ver perfil para las fotos completas"
            style={{
              width: '100%',
              maxWidth: '430px',
              border: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              padding: '3rem 2rem',
              textAlign: 'center',
            }}
          >
            {/* Logo circular como elemento visual */}
            <div style={{ opacity: 0.85 }}>
              <Image
                src="/images/logo-clean.png"
                alt="Carlos Gañan"
                width={120}
                height={50}
                style={{ objectFit: 'contain', filter: 'brightness(0.9)' }}
              />
            </div>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                fontWeight: 300,
                lineHeight: 1.6,
                maxWidth: '28ch',
              }}
            >
              El contenido de Instagram no pudo cargarse.
              <br />
              Visitá el perfil directamente.
            </p>
          </div>
        )}

        {/* ── CTA — link a Instagram ── */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--gold)',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(201, 169, 97, 0.4)',
            textUnderlineOffset: '4px',
            letterSpacing: '0.04em',
            transition: 'text-decoration-color 200ms ease, opacity 200ms ease',
          }}
          aria-label="Ver perfil de Instagram de Carlos Gañan — se abre en nueva pestaña"
        >
          Seguinos en Instagram
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </div>

      {/* ── Accesibilidad: noscript fallback ── */}
      <noscript>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          <p>
            Para ver el feed de Instagram,{' '}
            <a href={INSTAGRAM_URL} rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>
              visitá el perfil de @{INSTAGRAM_HANDLE}
            </a>
            .
          </p>
        </div>
      </noscript>
    </section>
  );
}
