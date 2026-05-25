/**
 * loading.tsx — Suspense loading state global.
 *
 * Wordmark "Carlos Gañan" con shimmer dorado animado.
 * Coherente con la identidad de marca — sin spinner genérico.
 * Server Component — no necesita 'use client'.
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center"
      style={{ backgroundColor: '#0A0807' }}
      aria-label="Cargando…"
      role="status"
    >
      {/* Eyebrow dorado tenue */}
      <p
        className="text-[var(--gold)] uppercase tracking-[0.18em] font-medium mb-5"
        style={{ fontSize: 'var(--text-xs)', opacity: 0.6 }}
        aria-hidden="true"
      >
        Barbería Premium · San Rafael
      </p>

      {/* Wordmark con shimmer — animación CSS pura, sin deps */}
      <p
        className="font-display font-light"
        style={{
          fontSize: 'var(--text-3xl)',
          lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--tracking-tight)',
          background:
            'linear-gradient(90deg, var(--text-secondary) 0%, var(--gold) 40%, var(--text-secondary) 80%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmer-gold 2s linear infinite',
        }}
        aria-hidden="true"
      >
        Carlos Gañan
      </p>

      {/* Texto accesible para screen readers */}
      <span className="sr-only">Cargando Carlos Gañan Barbería…</span>

      {/* Keyframe — inyectado inline para evitar dependencia de globals.css */}
      <style>{`
        @keyframes shimmer-gold {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes shimmer-gold {
            0%, 100% { background-position: 0% center; }
          }
        }
      `}</style>
    </div>
  );
}
