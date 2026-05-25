'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Scissors icon — inline SVG, monolínea 1.5px ───────────────────── */
function ScissorsIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
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

/* ─── Tipos y datos de galería ───────────────────────────────────────── */

interface GalleryItem {
  /** Número 1-based para el futuro src de la imagen */
  num: number;
  /** Columnas en grid de 12 (desktop) */
  colSpan: number;
  /** Filas en grid de 6 (desktop) */
  rowSpan: number;
  /** Alt descriptivo para accesibilidad */
  alt: string;
  /** Solo primera imagen carga sin lazy */
  priority: boolean;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { num: 1, colSpan: 5, rowSpan: 2, alt: 'Trabajo de barbería — corte clásico', priority: true },
  { num: 2, colSpan: 4, rowSpan: 3, alt: 'Detalle de fade perfecto', priority: false },
  { num: 3, colSpan: 3, rowSpan: 4, alt: 'Texturizado y acabado', priority: false },
  { num: 4, colSpan: 4, rowSpan: 3, alt: 'Barba perfilada con precisión', priority: false },
  { num: 5, colSpan: 5, rowSpan: 4, alt: 'Corte moderno con degradé', priority: false },
  { num: 6, colSpan: 3, rowSpan: 2, alt: 'Acabado final — resultado definitivo', priority: false },
];

/* ─── GalleryPlaceholder — elegante, no "roto" ───────────────────────── */

function GalleryPlaceholder({
  num,
  alt,
}: {
  num: number;
  alt: string;
}) {
  return (
    /*
     * TODO: cuando el usuario provea las fotos en /public/images/gallery/,
     * reemplazar este placeholder por:
     *
     * import Image from 'next/image'
     * <Image
     *   src={`/images/gallery/0${num}.jpg`}
     *   fill
     *   alt={alt}
     *   className="object-cover object-center transition-transform duration-[600ms] ease-[var(--ease-hover)] group-hover:scale-[1.03]"
     *   sizes="(max-width: 768px) 50vw, 33vw"
     * />
     *
     * Dejar el wrapper <div className="gallery-cell ..."> intacto — el parallax
     * y el hover están aplicados en el contenedor, no en la imagen.
     */
    <div
      className="absolute inset-0 placeholder-img flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 60%)' }}
      role="img"
      aria-label={alt}
    >
      {/* Ícono central sutil */}
      <span
        style={{
          color: 'var(--border-subtle)',
          opacity: 0.5,
          /* El shimmer ::after ya viene de la clase .placeholder-img en globals.css */
        }}
      >
        <ScissorsIcon size={26} />
      </span>

      {/* Número de foto — debug/orientación, invisible en prod por opacidad mínima */}
      <span
        className="absolute bottom-3 right-3 font-display italic"
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--border-subtle)',
          letterSpacing: '0.08em',
          opacity: 0.4,
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        0{num}
      </span>
    </div>
  );
}

/* ─── GalleryCell — wrapper de cada ítem del bento ──────────────────── */

interface GalleryCellProps {
  item: GalleryItem;
  /** ref callback para el parallax */
  cellRef: (el: HTMLDivElement | null) => void;
}

function GalleryCell({ item, cellRef }: GalleryCellProps) {
  return (
    <div
      ref={cellRef}
      className="gallery-cell group relative overflow-hidden"
      style={{
        background: 'var(--bg-elevated)',
        /* grid-column / grid-row se aplican solo en desktop via <style> nth-child */
        cursor: 'default',
      }}
    >
      {/* Contenido — placeholder (reemplazar con Image en producción) */}
      <GalleryPlaceholder num={item.num} alt={item.alt} />

      {/* Overlay oscuro en hover — CSS, no JS */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: 'rgba(10, 8, 7, 0.30)',
          opacity: 0,
          zIndex: 2,
        }}
        aria-hidden="true"
        data-gallery-overlay
      />
    </div>
  );
}

/* ─── GallerySection ─────────────────────────────────────────────────── */

/**
 * GallerySection — galería bento asimétrica con parallax sutil.
 *
 * T11: Grid CSS 12 cols × 6 rows con alturas asimétricas según diseño.
 *      Desktop: 3 cols de contenido visual + header editorial.
 *      Mobile: 2 cols × 3 filas (stack limpio).
 *
 * T12: Parallax GSAP — translateY sutil (-20px / +20px) por celda.
 *      Solo desktop (gsap.matchMedia min-width: 1024px).
 *      ScrollTrigger scrub: 1.2 por celda.
 *      prefers-reduced-motion: skip.
 *
 * Hover en cada celda: scale(1.03) + brightness sobre overlay — CSS.
 *
 * LENIS COMPATIBILITY:
 * LenisProvider expone window.lenis y llama ScrollTrigger.update() en su RAF.
 * Los ScrollTriggers de esta sección funcionan sin scroller proxy adicional
 * porque ScrollTrigger.update() ya está llamado por Lenis en cada frame.
 */
export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<HTMLDivElement[]>([]);

  const setCellRef = (el: HTMLDivElement | null, i: number) => {
    if (el) cellRefs.current[i] = el;
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {

      /* ── Estado inicial para entrance reveals ── */
      if (!prefersReduced) {
        gsap.set(headingRef.current, { opacity: 0, y: 20 });
        gsap.set(cellRefs.current, { opacity: 0, scale: 0.97 });
      }

      /* ── Heading reveal ── */
      ScrollTrigger.create({
        trigger: headingRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (prefersReduced) return;
          gsap.to(headingRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
          });
        },
        // Con reduced motion, el heading es visible desde el inicio (no se setea invisible)
        onEnterBack: () => { /* noop */ },
      });

      /* ── Entrance de celdas en stagger ── */
      if (!prefersReduced) {
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(cellRefs.current, {
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: 'expo.out',
              stagger: {
                each: 0.12,
                from: 'start',
              },
            });
          },
        });
      }

      /* ── Parallax sutil — solo desktop ── */
      if (!prefersReduced) {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 1024px)', () => {
          /**
           * Cada celda tiene un translateY sutil diferente según su posición.
           * Los valores alternan entre positivo y negativo para crear
           * el efecto de profundidad del bento.
           *
           * Rango: -20px a +20px (muy sutil — no debe distraer del contenido)
           */
          const parallaxOffsets = [-20, 12, -16, 20, -12, 16];

          cellRefs.current.forEach((cell, i) => {
            if (!cell) return;

            const yTarget = parallaxOffsets[i] ?? -10;

            gsap.fromTo(
              cell,
              { y: 0 },
              {
                y: yTarget,
                ease: 'none',
                scrollTrigger: {
                  trigger: cell,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.2,
                },
              }
            );
          });

          return () => {
            // Cleanup matchMedia — GSAP lo maneja automáticamente
          };
        });
      }

      /* ── Hover overlay — JS para targeting preciso (complementa CSS) ── */
      cellRefs.current.forEach((cell) => {
        if (!cell) return;

        const overlay = cell.querySelector('[data-gallery-overlay]') as HTMLElement | null;

        const onEnter = () => {
          if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.3, ease: 'power1.out' });
        };
        const onLeave = () => {
          if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.35, ease: 'power1.in' });
        };

        cell.addEventListener('mouseenter', onEnter);
        cell.addEventListener('mouseleave', onLeave);

        // Cleanup almacenado en closure — GSAP context lo limpia
        return () => {
          cell.removeEventListener('mouseenter', onEnter);
          cell.removeEventListener('mouseleave', onLeave);
        };
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="galeria"
      aria-label="Galería de trabajos"
      style={{
        background: 'var(--bg-base)',
        padding: 'var(--space-section) 0',
      }}
    >
      {/* ── Header editorial ── */}
      <div
        ref={headingRef}
        className="container-xl"
        style={{ marginBottom: 'var(--space-10)' }}
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
          Resultados que hablan
        </p>

        {/* H2 display Cormorant */}
        <h2
          className="font-display font-light"
          style={{
            fontSize: 'var(--text-4xl)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            color: 'var(--text-primary)',
            maxWidth: '22ch',
          }}
        >
          El trabajo dice más que las palabras
          <span
            aria-hidden="true"
            style={{ color: 'var(--gold)' }}
          >
            .
          </span>
        </h2>
      </div>

      {/* ── Bento grid ── */}
      {/*
        DESKTOP: CSS Grid 12 columnas × base de 80px de fila.
        Cada celda ocupa colSpan/rowSpan definidos en GALLERY_ITEMS.
        Total lógico: 12 cols × 6 rows = área completa del bento.

        Layout visual:
        ┌─────────────────────┬────────────────┬──────────────┐
        │  Foto 1             │  Foto 2        │  Foto 3      │
        │  col-span-5 row-3   │  col-span-4 r2 │  col-span-3  │
        │                     ├────────────────┤  row-span-3  │
        │                     │  Foto 4        │              │
        ├─────────────────────┤  col-span-4 r3 ├──────────────┤
        │  Foto 5             │                │  Foto 6      │
        │  col-span-5 row-3   │                │  col-span-3  │
        │                     │                │  row-span-3  │
        └─────────────────────┴────────────────┴──────────────┘

        MOBILE: 2 columnas × stack natural. Las celdas se redistribuyen
        ignorando el bento asimétrico para lectura lineal.
      */}

      {/* Wrapper: padding lateral en desktop, edge-to-edge en mobile */}
      <div
        style={{
          paddingInline: 'clamp(0px, 4vw, 3rem)',
        }}
      >
        {/* Grid container */}
        <div
          ref={gridRef}
          className="gallery-grid"
          style={{
            /* Mobile: 2 cols simples */
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridAutoRows: '140px',
            gap: '4px',
          }}
        >
          {/* Mobile: todas las celdas son 1 col × 1 row */}
          {/* Desktop: bento asimétrico via style inline por celda */}
          {GALLERY_ITEMS.map((item, i) => (
            <GalleryCell
              key={item.num}
              item={item}
              cellRef={(el) => setCellRef(el, i)}
            />
          ))}
        </div>
      </div>

      {/* ── CSS para override de desktop — bento asimétrico ── */}
      {/*
        Las clases de CSS Grid (gridColumn/gridRow) en cada celda se aplican
        con style inline en desktop vía la media query de este style tag.
        Usamos un <style> scoped para no ensuciar globals.css.
      */}
      <style>{`
        /* ── Mobile: garantizar 2 cols × 1 row por celda ── */
        /* (sin media query = default desde el style inline del grid) */
        @media (max-width: 1023px) {
          .gallery-grid .gallery-cell {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }

        /* ── Desktop: bento asimétrico 12 cols × 80px rows ── */
        @media (min-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(12, 1fr) !important;
            grid-auto-rows: 80px !important;
            gap: 8px !important;
          }

          /* Foto 1: izquierda alta corta — col-5, row-2 = 160px */
          .gallery-grid .gallery-cell:nth-child(1) {
            grid-column: span 5;
            grid-row: span 2;
          }

          /* Foto 2: centro media — col-4, row-3 = 240px */
          .gallery-grid .gallery-cell:nth-child(2) {
            grid-column: span 4;
            grid-row: span 3;
          }

          /* Foto 3: derecha alta — col-3, row-4 = 320px */
          .gallery-grid .gallery-cell:nth-child(3) {
            grid-column: span 3;
            grid-row: span 4;
          }

          /* Foto 4: centro media — col-4, row-3 = 240px */
          .gallery-grid .gallery-cell:nth-child(4) {
            grid-column: span 4;
            grid-row: span 3;
          }

          /* Foto 5: izquierda alta — col-5, row-4 = 320px */
          .gallery-grid .gallery-cell:nth-child(5) {
            grid-column: span 5;
            grid-row: span 4;
          }

          /* Foto 6: derecha corta — col-3, row-2 = 160px */
          .gallery-grid .gallery-cell:nth-child(6) {
            grid-column: span 3;
            grid-row: span 2;
          }
        }

        /* ── Hover: scale + brightness en placeholder ── */
        .gallery-cell .placeholder-img {
          transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1), filter 300ms ease;
          will-change: transform;
        }
        .gallery-cell:hover .placeholder-img {
          transform: scale(1.03);
          filter: brightness(1.06);
        }

        /* ── Hover: scale + brightness en imágenes reales ── */
        .gallery-cell img {
          transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1), filter 300ms ease;
          will-change: transform;
        }
        .gallery-cell:hover img {
          transform: scale(1.03);
          filter: brightness(1.06);
        }

        /* ── prefers-reduced-motion: sin scale ni transitions ── */
        @media (prefers-reduced-motion: reduce) {
          .gallery-cell,
          .gallery-cell img,
          .gallery-cell .placeholder-img {
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
