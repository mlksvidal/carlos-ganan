import Link from 'next/link';

/**
 * not-found.tsx — Página 404 custom.
 *
 * Misma paleta y tipografía que el resto de la landing.
 * Server Component — no necesita 'use client'.
 */
export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center text-center"
      style={{
        backgroundColor: '#0A0807',
        padding: '0 clamp(1.5rem, 4vw, 4rem)',
      }}
    >
      {/* Eyebrow dorado */}
      <p
        className="text-[var(--gold)] uppercase tracking-[0.18em] font-medium mb-6"
        style={{ fontSize: 'var(--text-xs)' }}
      >
        404
      </p>

      {/* H1 Cormorant */}
      <h1
        className="font-display font-light text-[var(--text-primary)]"
        style={{
          fontSize: 'var(--text-4xl)',
          lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--tracking-tight)',
          maxWidth: '20ch',
          marginBottom: '1rem',
        }}
      >
        Esta página no existe
        <span aria-hidden="true" style={{ color: 'var(--gold)' }}>
          .
        </span>
      </h1>

      {/* Subtexto */}
      <p
        className="text-[var(--text-secondary)] font-light"
        style={{
          fontSize: 'var(--text-lg)',
          lineHeight: 1.7,
          maxWidth: '38ch',
          marginBottom: '2.5rem',
        }}
      >
        Pero el corte que estás buscando, sí.
      </p>

      {/* CTA — estilo Button primary del proyecto */}
      <Link
        href="/"
        style={{
          display: 'inline-block',
          backgroundColor: 'var(--gold)',
          color: '#0A0807',
          fontSize: 'var(--text-xs)',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '0.875rem 2rem',
          textDecoration: 'none',
          transition: 'background-color var(--dur-fast, 150ms) ease',
        }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
