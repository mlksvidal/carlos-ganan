'use client';

/**
 * error.tsx — Error boundary global (Next.js App Router).
 *
 * Recibe { error, reset } del framework.
 * No expone stack traces — solo mensaje amigable + retry.
 * DEBE ser Client Component ('use client') — Next.js lo requiere.
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        Algo salió mal
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
        Disculpá la interrupción
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
        Probemos de nuevo.
      </p>

      {/* Botón Reintentar — mismo estilo que Button primary */}
      <button
        type="button"
        onClick={reset}
        style={{
          display: 'inline-block',
          backgroundColor: 'var(--gold)',
          color: '#0A0807',
          fontSize: 'var(--text-xs)',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '0.875rem 2rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color var(--dur-fast, 150ms) ease',
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
