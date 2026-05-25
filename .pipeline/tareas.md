# Tareas — carlos-ganan
Fecha: 2026-05-25
Total: 18 tareas | Tiempo estimado: ~13.5h (18 × 45min)
Stack: Next.js 16 App Router + Turbopack + Tailwind 4 + GSAP + ScrollTrigger + Lenis + SplitText
Estructura: single-repo (landing estática, sin backend)

## Gaps identificados

Riesgos/ambigüedades que conviene resolver antes de Fase 2:

1. **Stats numéricos placeholder**: el brief no especifica valores reales para "años de trayectoria / clientes atendidos / rating / satisfacción". Propuesta: 12 años, 8.500+ clientes, 4.9★, 98% satisfacción. Confirmar con usuario o usar como placeholders editables.
2. **Galería "Resultados que hablan"**: las fotos de cortes finales todavía no existen. Para Fase 3 se usarán placeholders cinematográficos generados por image-agent (Fase 2B); confirmar cantidad mínima (sugerido: 6 imágenes en grid 3×2 desktop / 2×3 mobile).
3. **Foto del hero y de la sección "presencia"**: idem — image-agent las generará en Fase 2B según brand.json. Riesgo: si no se generan a tiempo, Fase 3 queda bloqueada en hero. Mitigación: usar 1 placeholder oscuro semántico mientras tanto.
4. **Tono del mensaje prellenado de WhatsApp**: propuesta "Hola Carlos, me gustaría reservar un turno para [servicio]". Confirmar si prefiere otro tono.
5. **Favicon / manifest**: no especificado. brand-agent debería definirlo en Fase 2B.

Ninguno bloquea el inicio de Fase 2 (ux-architect puede arrancar paralelo).

---

## Tarea 0: Project Infrastructure (OBLIGATORIA)

**Tipo**: config
**Descripción**: Inicializar proyecto Next.js 16 con App Router + Turbopack + Tailwind 4 + TypeScript. Setup completo de tooling de calidad.
- `npx create-next-app@latest carlos-ganan --typescript --tailwind --app --turbopack --no-src-dir --import-alias "@/*"` (o equivalente Next 16)
- Instalar deps de animación: `gsap`, `@gsap/react`, `lenis`
- ESLint + Prettier + .editorconfig
- Husky + lint-staged (pre-commit: `next lint` + `tsc --noEmit`)
- `.env.example` (vacío por ahora, sin secrets)
- `.gitignore` completo (node_modules, .next, .env*.local, .vercel, .DS_Store)
- `README.md`: descripción, stack, setup (`npm install`, `npm run dev`), scripts, estructura de carpetas
- `vitest.config.ts` + script `"test"` en package.json (vitest + @testing-library/react opcional)
- Estructura de carpetas estandarizada (ver abajo)

**Archivos esperados**:
- `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- `.eslintrc.json`, `.prettierrc`, `.editorconfig`, `.gitignore`, `.env.example`
- `.husky/pre-commit`, `vitest.config.ts`, `README.md`
- `app/layout.tsx`, `app/page.tsx` (stub), `app/globals.css`

**Criterio de aceptación**:
- `npm run dev` arranca en localhost:3000 sin errores
- `npm run lint` pasa sin errores
- `npm run build` compila sin errores ni warnings de tipos
- README contiene instrucciones completas de setup local
- Pre-commit hook bloquea commit si hay errores de lint o tipo

**Dependencias**: ninguna

### Estructura de carpetas
```
carlos-ganan/
├── app/
│   ├── layout.tsx           ← root layout (fonts + metadata + Lenis provider)
│   ├── page.tsx             ← landing (orquesta secciones)
│   ├── globals.css          ← Tailwind + tokens del design system
│   ├── not-found.tsx
│   └── error.tsx
├── components/
│   ├── sections/            ← Hero, Stats, Services, Gallery, Location, FinalCTA
│   ├── ui/                  ← Button, Card primitives
│   ├── providers/           ← LenisProvider, GSAPProvider
│   └── shared/              ← Logo, WhatsAppButton, Footer, Nav
├── lib/
│   ├── constants.ts         ← WhatsApp number, mensajes, horarios, dirección
│   ├── whatsapp.ts          ← helper para construir wa.me URL
│   └── animations.ts        ← presets GSAP reutilizables
├── hooks/
│   ├── useGSAP.ts
│   └── useReducedMotion.ts
├── types/
│   └── index.ts             ← Service, GalleryItem, Stat
├── public/
│   ├── images/              ← assets de image-agent
│   ├── logo/                ← assets de logo-agent
│   └── fonts/               ← si usa local fonts (sino next/font/google)
└── __tests__/               ← (opcional, smoke tests de constants/whatsapp helper)
```

---

## Tarea 1: Design tokens + globals.css base

**Tipo**: frontend
**Descripción**: Implementar el design system parametric definido por ux-architect en `app/globals.css` + `tailwind.config.ts`. Tokens: colores (negro profundo, marrón chocolate, dorado champagne, beige cálido), tipografía (serif display + sans body), espaciados, easings, durations. Cargar fuentes con `next/font/google` (Cormorant Garamond + Inter, o lo que defina ui-designer) en `app/layout.tsx`. Configurar `dark` como default (sin toggle).

**Archivos esperados**:
- `app/globals.css` (con `@theme` de Tailwind 4 + custom properties)
- `tailwind.config.ts` (extender si hace falta)
- `app/layout.tsx` (fuentes cargadas + metadata base)

**Criterio de aceptación**:
- Screenshot de `/` muestra background negro profundo (#0a0a0a aprox) y texto en serif elegante
- Fuentes cargadas sin FOUT (font-display swap configurado)
- `npm run build` reporta CSS final < 30KB gzip
- Variables CSS accesibles vía `var(--color-bg)`, `var(--color-accent)`, etc.

**Dependencias**: Tarea 0

---

## Tarea 2: Layout root + metadata + Lenis provider

**Tipo**: frontend
**Descripción**: `app/layout.tsx` con metadata SEO completa (title, description, OG image, viewport, theme-color, robots), structured data LocalBusiness (JSON-LD), favicon, manifest. Envolver children en `LenisProvider` (scroll suave global). Configurar Lenis con duration 1.2, easing exponencial, sin smooth en touch devices.

**Archivos esperados**:
- `app/layout.tsx`
- `components/providers/LenisProvider.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `public/manifest.json`

**Criterio de aceptación**:
- View source muestra `<title>Carlos Gañan — Barbería en San Rafael, Mendoza</title>` + meta description + OG tags + JSON-LD LocalBusiness con dirección, horarios, telefono
- Scroll en desktop tiene easing suave (no nativo brusco)
- En mobile (touch) el scroll es nativo (no se rompe inercia iOS)
- Lighthouse SEO ≥ 95

**Dependencias**: Tarea 1

---

## Tarea 3: lib/constants + helper WhatsApp

**Tipo**: frontend
**Descripción**: Centralizar datos en `lib/constants.ts`: WhatsApp number, mensaje prellenado por servicio, dirección completa, horarios estructurados, lista de servicios (id, nombre, descripción corta, duración estimada), stats placeholder. Helper `lib/whatsapp.ts` que construye URL `https://wa.me/5492604062206?text=...` con encodeURIComponent.

**Archivos esperados**:
- `lib/constants.ts`
- `lib/whatsapp.ts`
- `__tests__/whatsapp.test.ts` (smoke test del helper)

**Criterio de aceptación**:
- `buildWhatsAppUrl({ service: 'corte-clasico' })` retorna URL válida con mensaje URL-encoded correctamente
- Test unitario pasa
- Cambiar el teléfono en un solo lugar lo actualiza en toda la app
- Lista de servicios coincide exactamente con los 5 del brief (sin precios)

**Dependencias**: Tarea 0

---

## Tarea 4: Componente WhatsAppButton compartido

**Tipo**: frontend
**Descripción**: Componente reutilizable con variantes (primary grande hero, secondary medium, floating fixed mobile). Acepta prop `service?` para preconstruir el mensaje. Animación hover (subtle scale + glow dorado). Soporte `prefers-reduced-motion`. Accesibilidad: `aria-label="Reservar turno por WhatsApp"`, `target="_blank"`, `rel="noopener noreferrer"`.

**Archivos esperados**:
- `components/shared/WhatsAppButton.tsx`
- `components/ui/Button.tsx` (primitive base, si no existe)

**Criterio de aceptación**:
- Screenshot muestra el botón con la estética dorada del moodboard
- Click en producción abre wa.me en tab nueva con mensaje correcto
- Hover: scale 1.02 + glow visible (a menos que reduced-motion esté activo)
- Lighthouse a11y reporta el botón sin errores (label, contraste AA)

**Dependencias**: Tareas 1, 3

---

## Tarea 5: Nav minimal + scroll behavior

**Tipo**: frontend
**Descripción**: Header minimal sticky con logo (de logo-agent) a la izquierda y un solo CTA WhatsApp a la derecha. Transparente en hero, fondo blur con borde inferior dorado sutil al scrollear (intersection observer o GSAP). Mobile: logo + ícono WhatsApp (sin hamburguesa, no hay submenús).

**Archivos esperados**:
- `components/shared/Nav.tsx`
- `components/shared/Logo.tsx`

**Criterio de aceptación**:
- Screenshot top-of-page: nav transparente sobre hero
- Screenshot scrolled 500px: nav con backdrop-blur + borde dorado
- Mobile screenshot 375px: logo + ícono WhatsApp visibles, sin overflow
- No causa Cumulative Layout Shift al cambiar estado (CLS = 0)

**Dependencias**: Tareas 1, 4

---

## Tarea 6: Sección Hero — estructura + foto cinematográfica

**Tipo**: frontend
**Descripción**: Hero full-viewport con foto cinematográfica (de image-agent) a la derecha en desktop / cover full-bleed en mobile. Lado izquierdo: eyebrow ("Barbería · San Rafael"), título display "El detalle también comunica" (Cormorant 72px desktop / 44px mobile), subtítulo "No es solo un corte. Es tu presencia.", CTA WhatsAppButton primary. Gradiente oscuro overlay sobre la foto para legibilidad. Sin animación todavía (eso va en T7).

**Archivos esperados**:
- `components/sections/Hero.tsx`
- `app/page.tsx` (importa Hero)

**Criterio de aceptación**:
- Screenshot desktop 1440×900: layout split 50/50, foto a la derecha, tipografía serif grande a la izquierda, CTA dorado visible
- Screenshot mobile 375×812: foto cover, texto centrado abajo, CTA full-width
- Sin scroll horizontal en ningún viewport
- Contraste texto-fondo ≥ 4.5:1 (WCAG AA)
- LCP element identificado correctamente (la foto del hero) con priority + sizes correctos en `next/image`

**Dependencias**: Tareas 1, 4, brand-agent + image-agent completados

---

## Tarea 7: Hero — animación cinematográfica de entrada

**Tipo**: frontend
**Descripción**: GSAP + SplitText: entrada secuenciada del título (split por palabras, stagger 0.08s, y desde 40px con blur(10px) → 0 + blur(0), ease "expo.out", duración 1.2s). Subtítulo fade-in con delay 0.6s. CTA scale 0.9 → 1 con delay 0.9s. Foto: subtle zoom-in (1.05 → 1) lento durante 2s en paralelo. Todo respeta `prefers-reduced-motion` (sin animación, solo opacity instantánea).

**Archivos esperados**:
- `components/sections/Hero.tsx` (modificado)
- `lib/animations.ts` (preset `cinematicEntrance`)
- `hooks/useReducedMotion.ts`

**Criterio de aceptación**:
- Video/GIF del primer load: el texto aparece palabra por palabra con blur que se disipa, foto hace zoom sutil simultáneamente
- Con `prefers-reduced-motion: reduce` activado: todo aparece sin animación, instantáneo
- No hay FOUC ni flash blanco (animación arranca después del load del font)
- 60fps durante toda la animación (Performance panel sin frame drops)

**Dependencias**: Tarea 6

---

## Tarea 8: Sección "Un espacio de confianza" + Stats

**Tipo**: frontend
**Descripción**: Sección con título "Un espacio de confianza y precisión", párrafo intro corto (3-4 líneas sobre la propuesta), seguido de 4 stats en row (años / clientes / rating / satisfacción) con números grandes serif + label pequeño sans. Stats animados con CountUp on scroll (GSAP ScrollTrigger trigger 80% viewport). Valores placeholder: 12 / 8500+ / 4.9★ / 98%.

**Archivos esperados**:
- `components/sections/About.tsx`
- `components/sections/Stats.tsx`
- `lib/animations.ts` (preset `countUp`)

**Criterio de aceptación**:
- Screenshot desktop: stats en row con números 64px+ dorados, separación amplia
- Screenshot mobile: stats en grid 2×2, números 40px
- Scroll triggered: al entrar viewport los números cuentan de 0 al valor final en 1.5s
- Stats placeholder editables desde `lib/constants.ts` (no hardcodeados en el JSX)

**Dependencias**: Tareas 1, 2

---

## Tarea 9: Sección Servicios — cards

**Tipo**: frontend
**Descripción**: 5 cards (Corte clásico, Corte+Barba, Barba+Arreglo, Corte Niños, Ritual completo). Cada card: ícono/ilustración minimal (line icons dorados), nombre del servicio en serif, descripción 1-2 líneas, CTA "Consultar por WhatsApp" que abre wa.me con mensaje preconstruido del servicio específico. SIN precios visibles. Grid 3+2 desktop / 1 col mobile. Hover: lift sutil + borde dorado se ilumina.

**Archivos esperados**:
- `components/sections/Services.tsx`
- `components/sections/ServiceCard.tsx`
- `public/icons/` (5 SVG icons line-style — pueden ser de Lucide u otra librería, sin colores hardcoded)

**Criterio de aceptación**:
- Screenshot desktop: grid 3 columnas top + 2 cards centradas bottom (o 3+2 según diseño final)
- Screenshot mobile 375px: 5 cards stack vertical, sin scroll horizontal
- Click en CTA de "Ritual completo" → wa.me con mensaje "Hola Carlos, me gustaría reservar el Ritual Completo"
- Hover desktop: card lift translateY(-4px) + borde dorado, transición 300ms
- A11y: cada card es un `<article>` con heading semántico, CTA con aria-label específico

**Dependencias**: Tareas 1, 3, 4

---

## Tarea 10: Servicios — animación stagger on scroll

**Tipo**: frontend
**Descripción**: ScrollTrigger: cuando la sección entra viewport (80%), las 5 cards aparecen con stagger 0.15s, y desde 30px → 0, opacity 0 → 1, ease "power3.out". Respeta reduced-motion.

**Archivos esperados**:
- `components/sections/Services.tsx` (modificado)
- `lib/animations.ts` (preset `staggerReveal`)

**Criterio de aceptación**:
- Scroll lento hasta la sección: las cards aparecen una a una con suavidad
- En reduced-motion: aparecen todas a la vez sin animación
- ScrollTrigger se destruye correctamente al desmontar (no memory leaks)

**Dependencias**: Tarea 9

---

## Tarea 11: Galería "Resultados que hablan"

**Tipo**: frontend
**Descripción**: Título serif + grid de 6 imágenes (de image-agent, placeholders durante Fase 3 iniciales). Grid 3×2 desktop / 2×3 mobile. Imágenes con aspect-ratio 4:5 portrait, hover desktop: subtle zoom + overlay dorado al 10%. Click NO abre lightbox (mantener simple, sin librerías extra). Lazy loading nativo + blur placeholder.

**Archivos esperados**:
- `components/sections/Gallery.tsx`
- `lib/constants.ts` (array de gallery items con src + alt)

**Criterio de aceptación**:
- Screenshot: grid 3×2 con imágenes portrait, gap consistente
- Mobile: grid 2×3 sin overflow
- `next/image` con sizes correcto (no carga 4K en mobile)
- alt text descriptivo en cada imagen (no "image1", sino "Corte clásico finalizado con barba arreglada")
- Lighthouse Performance ≥ 90 con la galería cargada

**Dependencias**: Tareas 1, image-agent completado

---

## Tarea 12: Galería — parallax sutil on scroll

**Tipo**: frontend
**Descripción**: Cada imagen del grid tiene parallax muy sutil (yPercent -10 a +10 según posición en viewport) usando ScrollTrigger + scrub. Crea profundidad sin marear. Desactivar en mobile (puede causar jank). Respeta reduced-motion.

**Archivos esperados**:
- `components/sections/Gallery.tsx` (modificado)

**Criterio de aceptación**:
- Scroll desktop por la galería: imágenes se mueven a velocidades ligeramente distintas, efecto profundidad visible
- En mobile (matchMedia): sin parallax, scroll nativo
- En reduced-motion: sin parallax
- 60fps mantenidos (no jank)

**Dependencias**: Tarea 11

---

## Tarea 13: Sección "No es solo un corte. Es tu presencia."

**Tipo**: frontend
**Descripción**: Sección full-bleed con foto cinematográfica de fondo (manos + tijeras o ambient), gradiente oscuro overlay, frase tagline grande centrada en serif (96px desktop / 56px mobile). SplitText reveal char-by-char on scroll trigger. Sin CTA — sección puramente atmosférica.

**Archivos esperados**:
- `components/sections/Presence.tsx`
- `lib/animations.ts` (preset `charReveal` si no existe)

**Criterio de aceptación**:
- Screenshot: full-viewport oscuro con frase enorme serif centrada
- Scroll trigger: cada caracter aparece con stagger 0.02s y subtle y-rise
- Sin scroll horizontal en ningún viewport
- Foto fondo no causa LCP issue (lazy + blur placeholder)

**Dependencias**: Tareas 1, image-agent completado

---

## Tarea 14: Sección Ubicación + Horarios

**Tipo**: frontend
**Descripción**: Layout 2 columnas desktop / stack mobile. Izquierda: dirección completa formateada ("San Lorenzo 269", "M5600 San Rafael", "Mendoza, Argentina") + link a Google Maps (abre en tab nueva). Derecha: horarios en tabla minimal (Lun-Vie 10:00-20:00, Sáb 9:00-18:00, Dom cerrado). Tipografía serif para títulos, sans para datos.

**Archivos esperados**:
- `components/sections/Location.tsx`

**Criterio de aceptación**:
- Screenshot: 2 columnas equilibradas, dirección a la izquierda con ícono pin, horarios a la derecha en tabla
- Link "Cómo llegar" abre `https://maps.google.com/?q=San+Lorenzo+269+San+Rafael+Mendoza` en tab nueva
- Mobile: stack vertical, sin overflow
- Horarios resaltan "Hoy" si coincide con día actual (opcional, agregar solo si time alcanza)
- Datos vienen de `lib/constants.ts`

**Dependencias**: Tareas 1, 3

---

## Tarea 15: CTA Final + Footer

**Tipo**: frontend
**Descripción**: Sección CTA final full-width: frase corta ("Reservá tu turno hoy" o similar definido por ui-designer) + WhatsAppButton primary grande centrado. Footer minimal debajo: nombre "Carlos Gañan", dirección 1 línea, WhatsApp clickeable, copyright "© 2026 Carlos Gañan. Todos los derechos reservados". Sin redes sociales, sin Instagram, sin newsletter.

**Archivos esperados**:
- `components/sections/FinalCTA.tsx`
- `components/shared/Footer.tsx`

**Criterio de aceptación**:
- Screenshot: CTA final con botón grande dorado centrado sobre fondo oscuro
- Footer mínimo, 3 líneas máximo, dorado sobre negro
- Click en WhatsApp del footer abre wa.me correcto
- Footer no excede 200px de alto
- Año del copyright dinámico (`new Date().getFullYear()`)

**Dependencias**: Tareas 1, 3, 4

---

## Tarea 16: Estados secundarios — 404, error, loading

**Tipo**: frontend
**Descripción**: `app/not-found.tsx` con tipografía serif elegante, mensaje "Página no encontrada" + CTA volver al home. `app/error.tsx` (client component) con fallback amigable + reset. `app/loading.tsx` con skeleton minimal del hero (sin spinners agresivos).

**Archivos esperados**:
- `app/not-found.tsx`
- `app/error.tsx`
- `app/loading.tsx`

**Criterio de aceptación**:
- Navegar a `/cualquier-cosa` muestra el 404 customizado (no el de Next default)
- Forzar error en dev muestra el `error.tsx` con botón "Reintentar"
- Loading state coherente con el design system (no spinner blanco genérico)

**Dependencias**: Tareas 1, 2

---

## Tarea 17: Integración + smoke test end-to-end + performance pass

**Tipo**: integración
**Descripción**: Ensamblar todas las secciones en `app/page.tsx` en orden correcto. Verificar transiciones entre secciones (sin saltos abruptos). Optimización final: convertir imágenes a AVIF/WebP via `next/image`, verificar sizes correctos, blur placeholders en todas las fotos. Bundle analysis (`@next/bundle-analyzer`). Headers en `vercel.json` (Cache-Control, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy). Lighthouse run completo.

**Archivos esperados**:
- `app/page.tsx` (final con todas las secciones)
- `vercel.json`
- `next.config.ts` (optimización de imágenes, formatos AVIF/WebP)

**Criterio de aceptación**:
- Build producción (`npm run build && npm start`) levanta sin errores
- Lighthouse Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- Bundle main < 250KB gzip
- No console errors ni warnings en producción
- Scroll desde top a footer es suave, sin jank, sin layout shifts (CLS < 0.05)
- Todos los CTAs WhatsApp abren wa.me con mensaje correcto según contexto
- Mobile (375px) y desktop (1440px) sin overflow horizontal
- `prefers-reduced-motion` desactiva todas las animaciones GSAP correctamente

**Dependencias**: Tareas 0-16 completadas

---

## Notas de coordinación pipeline

- **Tareas 6, 11, 13 dependen de image-agent** (Fase 2B) entregando los assets fotográficos. Si Fase 2B se retrasa, frontend-developer puede usar placeholders oscuros semánticos y luego swap.
- **Tarea 5 depende de logo-agent** entregando logo.svg / logo-mark.svg.
- **Tareas 1, 6, 8, 9, 11, 13, 15 dependen del design system** entregado por ux-architect + ui-designer en Fase 2.
- **Animaciones (T7, T10, T12, T13)**: ui-designer debe entregar specs comportamentales (timings, easings, distancias) en Fase 2 — sin esos specs, frontend-developer improvisaría.
- **Sin sección Instagram / redes sociales** — confirmado en brief.
- **Sin sistema de reservas** — todo CTA va a WhatsApp.
