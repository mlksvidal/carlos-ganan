'use client';

import { getWhatsAppUrl } from '@/lib/constants';
import { clsx } from 'clsx';

/* ─── Ícono WhatsApp — inline SVG monolínea ───────────────────────── */

function WhatsAppIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

/* ─── Tipos ────────────────────────────────────────────────────────── */

export type WhatsAppVariant = 'primary' | 'floating' | 'inline';

interface WhatsAppButtonProps {
  variant?: WhatsAppVariant;
  /** Servicio específico para pre-cargar en el mensaje */
  service?: string;
  /** Mensaje custom (override del default) */
  message?: string;
  /** Texto del botón (solo variante primary e inline) */
  label?: string;
  className?: string;
}

/* ─── Componente principal ─────────────────────────────────────────── */

/**
 * WhatsAppButton — CTA de reserva vía WhatsApp.
 *
 * Variantes:
 * - `primary`  → Botón grande rectangular (CTA hero / sección reserva)
 * - `floating` → Fixed bottom-right, solo mobile (círculo verde WhatsApp)
 * - `inline`   → Texto link con underline dorado
 *
 * Todos usan:
 * - target="_blank" + rel="noopener noreferrer" (anti tab-nabbing)
 * - encodeURIComponent en mensaje (via getWhatsAppUrl)
 * - border-radius: 0 (estética editorial — 0px radius)
 */
export function WhatsAppButton({
  variant = 'primary',
  service,
  message,
  label,
  className,
}: WhatsAppButtonProps) {
  const href = getWhatsAppUrl(message, service);

  /* ── Variante PRIMARY — CTA grande rectangular dorado ── */
  if (variant === 'primary') {
    const buttonLabel = label ?? 'Reservar turno';

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${buttonLabel} por WhatsApp`}
        className={clsx(
          // Base — rectangular, sin border-radius
          'group relative inline-flex items-center gap-3',
          'border border-[rgba(201,169,97,0.70)] bg-transparent',
          'px-7 py-[14px] min-h-[48px]',
          // Tipografía — Inter uppercase tracking premium
          'text-[var(--gold)] font-[var(--font-inter,Inter,system-ui,sans-serif)]',
          'text-xs tracking-[0.14em] uppercase font-medium',
          // Overflow para la line animation
          'overflow-hidden',
          // Transiciones
          'transition-colors duration-[var(--dur-normal)] ease-[var(--ease-hover)]',
          // Hover — fill dorado, texto inverso
          'hover:bg-[var(--gold)] hover:border-[var(--gold)] hover:text-[var(--text-inverse)]',
          // Focus
          'focus-visible:outline-2 focus-visible:outline-[var(--gold-pale)] focus-visible:outline-offset-3',
          // Active
          'active:bg-[var(--gold-dim)] active:border-[var(--gold-dim)]',
          className,
        )}
      >
        {/* Background sweep animation — line que atraviesa el botón */}
        <span
          aria-hidden="true"
          className={clsx(
            'absolute inset-0 -translate-x-full',
            'bg-[var(--gold)]',
            'transition-transform duration-[var(--dur-normal)] ease-[var(--ease-hover)]',
            'group-hover:translate-x-0',
            // El fondo va detrás del texto
            '-z-[1]',
          )}
        />
        <WhatsAppIcon size={16} className="relative z-10 flex-shrink-0" />
        <span className="relative z-10">{buttonLabel}</span>
      </a>
    );
  }

  /* ── Variante FLOATING — fixed mobile-only, círculo verde ── */
  if (variant === 'floating') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Reservar turno por WhatsApp"
        className={clsx(
          // Solo visible en mobile
          'md:hidden',
          // Posición — fixed bottom-right
          'fixed bottom-6 right-6',
          // Z-index sobre todo — z-toast (600)
          'z-[600]',
          // Forma — círculo 56×56
          'w-14 h-14 rounded-full',
          // Fondo verde WhatsApp
          'bg-[#25D366]',
          // Layout
          'inline-flex items-center justify-center',
          // Sombra
          'shadow-[0_4px_20px_rgba(0,0,0,0.40)]',
          // Color ícono — blanco
          'text-white',
          // Hover — ligero scale
          'hover:scale-[1.06] hover:shadow-[0_6px_28px_rgba(0,0,0,0.50)]',
          // Transición
          'transition-[transform,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-out-quart)]',
          // Focus
          'focus-visible:outline-2 focus-visible:outline-[var(--gold-pale)] focus-visible:outline-offset-3',
          className,
        )}
      >
        <WhatsAppIcon size={24} />
        <span className="sr-only">Reservar turno por WhatsApp</span>
      </a>
    );
  }

  /* ── Variante INLINE — texto link con underline dorado ── */
  const inlineLabel = label ?? 'Reservar por WhatsApp';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${inlineLabel} — abre WhatsApp`}
      className={clsx(
        'group inline-flex items-center gap-2',
        // Tipografía
        'text-[var(--gold)] font-[var(--font-inter,Inter,system-ui,sans-serif)]',
        'text-sm tracking-[0.06em]',
        // Underline con animación — línea dorada que aparece en hover
        'relative',
        // Focus
        'focus-visible:outline-2 focus-visible:outline-[var(--gold-pale)] focus-visible:outline-offset-2',
        // Hover color
        'hover:text-[var(--gold-hi)]',
        'transition-colors duration-[var(--dur-fast)] ease-[var(--ease-hover)]',
        className,
      )}
    >
      <span className="relative">
        {inlineLabel}
        {/* Underline dorado — width 0 → 100% en hover */}
        <span
          aria-hidden="true"
          className={clsx(
            'absolute left-0 -bottom-0.5',
            'h-px w-0 bg-[var(--gold)]',
            'transition-[width] duration-[var(--dur-normal)] ease-[var(--ease-out-expo)]',
            'group-hover:w-full',
          )}
        />
      </span>
      <WhatsAppIcon size={14} className="flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-[var(--dur-fast)]" />
    </a>
  );
}
