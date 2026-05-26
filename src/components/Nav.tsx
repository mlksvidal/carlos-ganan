'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { X, Menu } from 'lucide-react';
import { clsx } from 'clsx';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { BUSINESS_NAME } from '@/lib/constants';

/* ─── Nav links ────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#galeria', label: 'Galería' },
  { href: '#ubicacion', label: 'Ubicación' },
  { href: '#contacto', label: 'Contacto' },
] as const;

/* ─── Nav Link atom ────────────────────────────────────────────────── */

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={clsx(
        'group relative',
        'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
        'text-[0.6875rem] tracking-[0.10em] uppercase font-medium',
        'transition-colors duration-[200ms] ease-[var(--ease-hover)]',
        'focus-visible:outline-2 focus-visible:outline-[var(--gold-pale)] focus-visible:outline-offset-4',
        // Padding para area de click cómoda
        'py-1',
      )}
    >
      {label}
      {/* Underline dorado — scaleX 0→1, transform-origin left */}
      <span
        aria-hidden="true"
        className={clsx(
          'absolute left-0 -bottom-px',
          'h-px w-full bg-[var(--gold)]',
          'origin-left scale-x-0',
          'transition-transform duration-[400ms] ease-[var(--ease-out-expo)]',
          'group-hover:scale-x-100',
        )}
      />
    </a>
  );
}

/* ─── Nav principal ────────────────────────────────────────────────── */

/**
 * Nav — navegación top fija con scroll behavior cinematográfico.
 *
 * Comportamiento:
 * - Transparente al inicio
 * - Al scroll >80px: bg elevado + backdrop blur
 * - Smart hide: se oculta al scroll-down, reaparece al scroll-up
 * - Mobile: hamburger → drawer full-height con links + CTA
 */
export function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  /* ── Scroll handler — smart hide + blur transition ── */
  const handleScroll = useCallback(() => {
    if (ticking.current) return;

    ticking.current = true;
    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Blur/bg threshold
      setIsScrolled(currentY > 80);

      // Smart hide: ocultar en scroll-down (>10px), mostrar en scroll-up
      if (Math.abs(delta) > 10) {
        if (delta > 0 && currentY > 200) {
          // Scroll down — ocultar
          setIsVisible(false);
        } else {
          // Scroll up — mostrar
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* ── Mobile drawer: bloquear scroll del body cuando está abierto ── */
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  /* ── Cerrar drawer con Escape ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  /* ── Scroll to section — esperar exit animation del drawer ── */
  const handleMobileNavClick = useCallback((href: string) => {
    setIsMobileOpen(false);
    // Esperar exit animation (~300ms) antes de hacer scroll
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        // Usar lenis global si está disponible, sino fallback nativo
        const lenis = (window as unknown as Record<string, unknown>)['lenis'] as {
          scrollTo: (target: Element, options?: object) => void;
        } | undefined;

        if (lenis) {
          lenis.scrollTo(el, { offset: -80, duration: 0.5 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 300);
  }, []);

  return (
    <>
      {/* ─── Nav bar ─────────────────────────────────────────── */}
      <header
        ref={navRef}
        className={clsx(
          // Layout — fixed top
          'fixed top-0 left-0 right-0',
          'z-[var(--z-nav)]',
          // Transición visual
          'transition-[transform,background-color,backdrop-filter,box-shadow]',
          'duration-[400ms] ease-[var(--ease-smooth)]',
          // Smart hide — translateY
          isVisible ? 'translate-y-0' : '-translate-y-full',
          // Scroll state — bg + blur
          isScrolled
            ? 'bg-[rgba(13,12,10,0.92)] backdrop-blur-[12px] shadow-[0_1px_0_rgba(46,37,32,0.8)]'
            : 'bg-transparent',
        )}
        role="banner"
      >
        <nav
          className="container-xl flex items-center justify-between h-[72px] md:h-[80px]"
          aria-label="Navegación principal"
        >
          {/* ── Logo izquierda ── */}
          <a
            href="#"
            className={clsx(
              'flex items-center',
              'transition-opacity duration-[200ms] ease-[var(--ease-hover)]',
              'hover:opacity-80',
              'focus-visible:outline-2 focus-visible:outline-[var(--gold-pale)] focus-visible:outline-offset-4',
            )}
            aria-label={`${BUSINESS_NAME} — Barbería de autor en San Rafael — ir al inicio`}
          >
            <Image
              src="/images/logo.png"
              alt="Carlos Gañan — Barbería de autor en San Rafael"
              width={160}
              height={44}
              priority
              className="object-contain w-auto h-[36px] md:h-[44px]"
              style={{ maxWidth: '160px' }}
            />
          </a>

          {/* ── Links centro — solo desktop ── */}
          <ul
            className="hidden lg:flex items-center gap-8"
            role="list"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>

          {/* ── CTA derecha — solo desktop ── */}
          <div className="hidden lg:block">
            <WhatsAppButton variant="inline" label="Reservar turno" />
          </div>

          {/* ── Hamburger — solo mobile/tablet ── */}
          <button
            type="button"
            className={clsx(
              'lg:hidden',
              'relative w-10 h-10 flex items-center justify-center',
              'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              'transition-colors duration-[200ms] ease-[var(--ease-hover)]',
              'focus-visible:outline-2 focus-visible:outline-[var(--gold-pale)] focus-visible:outline-offset-2',
            )}
            onClick={() => setIsMobileOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav-drawer"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </nav>
      </header>

      {/* ─── Mobile drawer ───────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-[450] bg-[rgba(10,8,7,0.7)] backdrop-blur-[4px]',
          'lg:hidden',
          'transition-opacity duration-[300ms] ease-[var(--ease-smooth)]',
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={clsx(
          'fixed top-0 right-0 bottom-0 z-[460]',
          'lg:hidden',
          'w-[min(320px,85vw)]',
          'bg-[var(--bg-elevated)] border-l border-[var(--border)]',
          // Slide in/out desde la derecha
          'transition-transform duration-[350ms] ease-[var(--ease-out-expo)]',
          isMobileOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header del drawer */}
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-[var(--border)]">
          <Image
            src="/images/logo.png"
            alt="Carlos Gañan — Barbería de autor en San Rafael"
            width={130}
            height={36}
            className="object-contain w-auto h-[32px]"
            style={{ maxWidth: '130px' }}
          />
          <button
            type="button"
            className={clsx(
              'w-9 h-9 flex items-center justify-center',
              'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              'transition-colors duration-[200ms] ease-[var(--ease-hover)]',
              'focus-visible:outline-2 focus-visible:outline-[var(--gold-pale)] focus-visible:outline-offset-2',
            )}
            onClick={() => setIsMobileOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Links */}
        <nav
          className="px-6 py-8 flex flex-col gap-1"
          aria-label="Menú mobile"
        >
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleMobileNavClick(link.href)}
              className={clsx(
                'group relative flex items-center',
                'py-4 border-b border-[var(--border)]',
                'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                // Tipografía mobile — más grande para touch
                'font-display font-light tracking-[var(--tracking-tight)]',
                'text-[1.5rem]',
                'transition-colors duration-[200ms] ease-[var(--ease-hover)]',
                'focus-visible:outline-2 focus-visible:outline-[var(--gold-pale)] focus-visible:outline-offset-4',
              )}
              style={{
                // Entrada staggered — delay por index
                transitionDelay: isMobileOpen ? `${index * 40}ms` : '0ms',
              }}
            >
              {/* Línea dorada izquierda — aparece en hover */}
              <span
                aria-hidden="true"
                className={clsx(
                  'absolute left-0 top-1/2 -translate-y-1/2',
                  'w-0 h-px bg-[var(--gold)]',
                  'origin-left',
                  'transition-[width] duration-[300ms] ease-[var(--ease-out-expo)]',
                  'group-hover:w-8',
                )}
              />
              <span className="group-hover:translate-x-10 transition-transform duration-[300ms] ease-[var(--ease-out-expo)]">
                {link.label}
              </span>
            </a>
          ))}

          {/* CTA WhatsApp */}
          <div className="pt-8">
            <WhatsAppButton
              variant="primary"
              label="Reservar turno"
              className="w-full justify-center"
            />
          </div>
        </nav>

        {/* Firma — decorativo */}
        <div className="absolute bottom-8 left-6 right-6">
          <p
            className="text-[var(--text-secondary)] font-display italic font-light text-sm opacity-60"
          >
            Barbería de autor
          </p>
        </div>
      </div>
    </>
  );
}
