import Image from 'next/image';
import { BUSINESS_NAME, HOURS, getWhatsAppUrl } from '@/lib/constants';

/* ─── Footer ───────────────────────────────────────────────────────── */

/**
 * Footer — minimal, editorial, 3 columnas desktop / stack mobile.
 *
 * Col 1: Wordmark "Carlos Gañan" + eyebrow italic dorado "de pelos"
 * Col 2: Dirección + horarios condensados
 * Col 3: WhatsApp link + tagline corto
 *
 * Línea separadora dorada fina arriba del copyright.
 * bg negro profundo #0A0807.
 * padding 80-120px vertical desktop, 60px mobile.
 *
 * Server Component — sin 'use client' (no necesita estado ni efectos).
 */
export function Footer() {
  const year = new Date().getFullYear();
  const whatsappUrl = getWhatsAppUrl();

  return (
    <footer
      aria-label="Footer — Carlos Gañan Barbería"
      style={{
        backgroundColor: '#0A0807',
        borderTop: '1px solid var(--border)',
        padding:
          'clamp(3.5rem, 8vw, 7rem) clamp(1.5rem, 4vw, 4rem) clamp(2.5rem, 5vw, 4rem)',
      }}
    >
      <div
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--container-xl)' }}
      >
        {/* ── Grid principal 3 columnas ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">

          {/* ── Col 1 — Logo + tagline ── */}
          <div>
            <Image
              src="/images/logo.png"
              alt="Carlos Gañan — Barbería de autor en San Rafael"
              width={200}
              height={56}
              className="object-contain w-auto h-auto mb-4"
              style={{ maxWidth: '200px', mixBlendMode: 'lighten' }}
            />

            <p
              className="text-[var(--text-secondary)] mt-2 font-light"
              style={{
                fontSize: 'var(--text-sm)',
                lineHeight: 1.7,
                maxWidth: '28ch',
              }}
            >
              Barbería de autor en San Rafael, Mendoza.
            </p>
          </div>

          {/* ── Col 2 — Dirección + Horarios ── */}
          <div>
            <p
              className="text-[var(--gold)] uppercase tracking-[0.14em] font-medium mb-4"
              style={{ fontSize: 'var(--text-xs)' }}
            >
              Ubicación
            </p>

            <address
              className="not-italic text-[var(--text-secondary)] font-light mb-5"
              style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7 }}
            >
              San Lorenzo 269
              <br />
              M5600 San Rafael, Mendoza
              <br />
              Argentina
            </address>

            <ul
              className="space-y-2"
              aria-label="Horarios condensados"
            >
              {HOURS.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between gap-4"
                  style={{ fontSize: 'var(--text-xs)' }}
                >
                  <span className="text-[var(--text-secondary)]">
                    {item.dias}
                  </span>
                  <span
                    className={
                      item.horario === 'Cerrado'
                        ? 'text-[var(--text-secondary)] opacity-70'
                        : 'text-[var(--text-primary)]'
                    }
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {item.horario}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3 — WhatsApp + tagline ── */}
          <div>
            <p
              className="text-[var(--gold)] uppercase tracking-[0.14em] font-medium mb-4"
              style={{ fontSize: 'var(--text-xs)' }}
            >
              Contacto
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[var(--text-primary)] hover:text-[var(--gold)] transition-colors duration-[var(--dur-fast)]"
              style={{ fontSize: 'var(--text-sm)', letterSpacing: '0.02em' }}
              aria-label="Reservar turno por WhatsApp — +54 9 2604 06-2206"
            >
              {/* WhatsApp icon tiny */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-[var(--dur-fast)]"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              +54 9 2604 06-2206
            </a>

            <p
              className="text-[var(--text-secondary)] mt-3 font-light"
              style={{
                fontSize: 'var(--text-sm)',
                lineHeight: 1.7,
              }}
            >
              Una llamada o un mensaje.
              <br />
              Eso es todo lo que separa
              <br />
              una primera vez de una rutina.
            </p>
          </div>
        </div>

        {/* ── Separador dorado ── */}
        <div
          className="mt-12 md:mt-16"
          aria-hidden="true"
          style={{
            borderTop: '1px solid rgba(201, 169, 97, 0.25)',
            marginBottom: '2rem',
          }}
        />

        {/* ── Copyright ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p
            className="text-[var(--text-secondary)]"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              opacity: 0.6,
            }}
          >
            © {year} {BUSINESS_NAME}. Todos los derechos reservados.
          </p>

          <p
            className="text-[var(--text-secondary)]"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.06em',
              opacity: 0.35,
            }}
          >
            Diseño con precisión artesanal.
          </p>
        </div>
      </div>
    </footer>
  );
}
