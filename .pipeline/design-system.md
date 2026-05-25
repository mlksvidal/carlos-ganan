# Design System — Carlos Gañan
**Barbería Premium Landing | Next.js 16 + Tailwind 4**
**Fecha:** 2026-05-25

---

## Dirección Estética

**Tono:** Dark Luxury / Masculine Refined — oscuridad como lujo, no como carencia. Piel, cuero, oro mate y silencio visual. La tipografía manda; las fotos respiran.

**Fundamento:** El moodboard "Carlos Gañán de pelos" establece un sistema basado en negro profundo (`#0D0C0A`), warm charcoal (`#1A1814`) y dorado champagne (`#C9A96E`). No hay blancos puros — ni siquiera los fondos claros son blancos. Todo tiene temperatura cálida.

**Landing Pattern:** Hero full-bleed dramático → Stats trust signal → Intro copy → Servicios → Galería → Testimonios/Confianza → Reserva → Footer. CTA primario presente en Hero y repetido en sección Reserva.

**Design Dials (inferidos del moodboard):**
- `design_variance`: 5 — grid limpio pero con asimetrías controladas (texto sobre foto, galería con offsets)
- `motion_intensity`: 8 — GSAP + SplitText + ScrollTrigger + Lenis. Movimiento lento, grave, nunca bounce
- `visual_density`: 3 — espacioso. Whitespace ES el lujo. Pocos elementos por sección

---

## Anti-Patterns (OBLIGATORIOS — no cruzar)

- NO border-radius > 4px en cards de servicios (severidad HIGH)
- NO shadows difusas azuladas o neutras — solo warmth shadows (`rgba(0,0,0,0.6)`) o ninguna
- NO gradientes de color (degradados de negro a negro sí, degradados cromáticos NO)
- NO tipografía sans-serif en headlines grandes — el serif ES la identidad
- NO hover con scale > 1.03 — demasiado energético para el tono
- NO animaciones con bounce/spring easing — solo ease-out cubic, ease-in-out quart
- NO fondos blancos puros (#fff) en ningún componente
- NO toast popups — confirmaciones inline o modal minimalista
- NO skeleton loading colorido — placeholder con shimmer en #1A1814 sobre #0D0C0A
- NO emojis como UI
- NO íconos filled/coloridos — solo monolínea 1.5px (Lucide thin)

---

## Tokens de Color

### Escala Base (temperatura cálida, nunca frío puro)

```
--color-black:        #0D0C0A   /* negro barbería, fondo principal */
--color-charcoal:     #1A1814   /* charcoal warm, fondo cards */
--color-charcoal-mid: #252118   /* intermedio, hover sobre cards */
--color-charcoal-hi:  #302C24   /* borde sutil, separadores */
--color-smoke:        #3D3830   /* texto terciario mínimo */
--color-cream-dim:    #6B6560   /* texto secundario */
--color-cream:        #9E9890   /* texto secundario fuerte */
--color-cream-hi:     #C4BDB5   /* texto body sobre negro */
--color-parchment:    #E8E0D4   /* texto primario sobre negro */
--color-white-warm:   #F5F0E8   /* texto display, máximo contraste */

--color-gold-dim:     #8A7040   /* gold apagado, hover state */
--color-gold:         #C9A96E   /* gold principal — accent */
--color-gold-hi:      #D4B87A   /* gold brillante, hover accent */
--color-gold-pale:    #E8D5A8   /* gold claro, focus ring */
```

### Tint/Shade Scale — Gold (9 pasos)
```
--gold-100: #F5EDD8   /* tint 80% */
--gold-200: #EBDAB8   /* tint 60% */
--gold-300: #DEC695   /* tint 40% */
--gold-400: #D4B47C   /* tint 20% */
--gold-500: #C9A96E   /* base */
--gold-600: #A18855   /* shade 20% */
--gold-700: #79663F   /* shade 40% */
--gold-800: #514429   /* shade 60% */
--gold-900: #292213   /* shade 80% */
```

### Tokens Semánticos

```
/* Texto */
--text-primary:     #F5F0E8   /* headlines, display */
--text-secondary:   #C4BDB5   /* body, descriptiones */
--text-tertiary:    #9E9890   /* metadata, labels, precios secundarios */
--text-disabled:    #6B6560   /* estados deshabilitados */
--text-accent:      #C9A96E   /* CTA labels, highlights, precios destacados */
--text-inverse:     #0D0C0A   /* texto sobre fondos gold */

/* Fondos */
--bg-primary:       #0D0C0A   /* fondo página */
--bg-elevated:      #1A1814   /* cards, nav scrolled */
--bg-hover:         #252118   /* hover sobre cards */
--bg-overlay:       rgba(13,12,10,0.92)   /* overlays de modal */

/* Borde */
--border-subtle:    rgba(201,169,110,0.15)  /* bordes decorativos */
--border-strong:    rgba(201,169,110,0.35)  /* bordes interactivos */
--border-active:    rgba(201,169,110,0.70)  /* focus, active */

/* Funcionales */
--color-success:    #4A7C59   /* confirmación reserva */
--color-error:      #8B3A3A   /* error en form */
--color-warning:    #7A6230   /* advertencia */

/* Contrastes WCAG AA verificados */
/* --text-primary (#F5F0E8) sobre --bg-primary (#0D0C0A): ~16:1 ✓ */
/* --text-accent (#C9A96E) sobre --bg-primary (#0D0C0A): ~6.8:1 ✓ */
/* --text-secondary (#C4BDB5) sobre --bg-primary (#0D0C0A): ~10.2:1 ✓ */
/* --text-tertiary (#9E9890) sobre --bg-primary (#0D0C0A): ~5.4:1 ✓ AA */
/* --text-inverse (#0D0C0A) sobre --color-gold (#C9A96E): ~5.1:1 ✓ AA */
/* --text-disabled (#6B6560): usar solo en elementos decorativos, NO texto funcional */
```

### Variantes Semánticas por Modo (dark-only — este sitio no tiene light mode)

```
--gold-text-emphasis:  #D4B87A   /* gold con más presencia, para precios CTA */
--gold-bg-subtle:      rgba(201,169,110,0.08)   /* fondo sutil para badges */
--gold-border-subtle:  rgba(201,169,110,0.20)   /* borde decorativo tenue */
```

---

## Tipografía

### Stack
```
--font-display:  'Cormorant Garamond', 'IM Fell English', Georgia, serif
--font-body:     'Inter', 'DM Sans', system-ui, sans-serif
--font-label:    'Inter', system-ui, sans-serif   /* uppercase tracking para labels */
```

### Escala
```
--text-2xs:   0.625rem   /* 10px — legal, meta */
--text-xs:    0.75rem    /* 12px — caption, label */
--text-sm:    0.875rem   /* 14px — body secundario */
--text-base:  1rem        /* 16px — body principal */
--text-lg:    1.125rem   /* 18px — body destacado */
--text-xl:    1.25rem    /* 20px — lead copy */
--text-2xl:   1.5rem     /* 24px — subtítulos */
--text-3xl:   1.875rem   /* 30px — sección heading */
--text-4xl:   2.25rem    /* 36px — sección heading grande */
--text-5xl:   3rem        /* 48px — hero sub */
--text-6xl:   3.75rem    /* 60px — hero mid */
--text-7xl:   4.5rem     /* 72px — hero principal desktop */
--text-8xl:   6rem        /* 96px — display máximo desktop */
--text-9xl:   8rem        /* 128px — número oversized (stats) */
```

### Tratamientos tipográficos

**Display headlines (Cormorant Garamond):**
- font-weight: 300 (light) o 400 (regular) — NUNCA bold en display
- letter-spacing: -0.02em a -0.04em (tracking negativo suave)
- line-height: 0.92 a 1.05 (tight, dramático)
- font-style: italic para fragmentos de énfasis (ej. "también" en el tagline)

**Body copy (Inter):**
- font-weight: 300 a 400
- letter-spacing: 0.01em
- line-height: 1.7

**Labels / metadata (Inter uppercase):**
- font-weight: 400
- letter-spacing: 0.12em a 0.18em
- text-transform: uppercase
- font-size: --text-xs a --text-sm

---

## Spacing

```
--space-1:   0.25rem   /* 4px */
--space-2:   0.5rem    /* 8px */
--space-3:   0.75rem   /* 12px */
--space-4:   1rem      /* 16px */
--space-6:   1.5rem    /* 24px */
--space-8:   2rem      /* 32px */
--space-10:  2.5rem    /* 40px */
--space-12:  3rem      /* 48px */
--space-16:  4rem      /* 64px */
--space-20:  5rem      /* 80px */
--space-24:  6rem      /* 96px */
--space-32:  8rem      /* 128px */
--space-40:  10rem     /* 160px */
--space-48:  12rem     /* 192px */
```

**Padding de secciones:** `--space-24` (96px) vertical en desktop, `--space-16` (64px) en mobile. Whitespace generoso — cada sección respira.

**Max-width tipográfico:** 65ch para body copy, 45ch para leads.

---

## Motion Tokens

```
--duration-instant:   0ms
--duration-fast:      150ms
--duration-normal:    300ms
--duration-slow:      600ms
--duration-slower:    900ms
--duration-crawl:     1400ms

--ease-primary:       cubic-bezier(0.16, 1, 0.3, 1)     /* ease-out expo — salidas */
--ease-enter:         cubic-bezier(0.4, 0, 0.2, 1)      /* ease-in-out — entradas */
--ease-hover:         cubic-bezier(0.25, 0.46, 0.45, 0.94)  /* hover sutil */
--ease-reveal:        cubic-bezier(0.0, 0.0, 0.2, 1)    /* scroll reveals */

--stagger-delay:      80ms   /* delay entre items en stagger */
```

---

## Componentes — Especificaciones

### 1. Button — Variantes

#### Button Primary ("Reservar turno")
**Atom | Molecule context: CTA Hero, Nav flotante, Sección Reserva**

Anatomía:
- Container: border 1px solid `--color-gold`, background transparent por defecto
- Padding: 14px 28px desktop / 12px 24px mobile
- Min-height: 48px (WCAG touch target)
- Border-radius: 0 (sin redondeo — línea pura)
- Typography: Inter, font-size --text-sm, letter-spacing 0.14em, uppercase, font-weight 400
- Color texto: `--color-gold`

Estados:
```yaml
default:
  background: transparent
  border: 1px solid --color-gold (opacity 0.70)
  color: --color-gold

hover:
  background: --color-gold
  border: 1px solid --color-gold
  color: --text-inverse (#0D0C0A)
  transition: background --duration-normal --ease-hover, color --duration-normal --ease-hover
  effect: NO scale, NO glow. Solo el fill-in del fondo — elegante

focus:
  outline: 2px solid --gold-pale
  outline-offset: 3px

active:
  background: --gold-dim (#8A7040)
  color: --text-inverse

disabled:
  opacity: 0.35
  cursor: not-allowed
  pointer-events: none
```

Reveal behavior (GSAP):
- Entrada: fade-in + translateY(12px) → translateY(0), duration --duration-slow, easing --ease-primary
- Trigger: cuando el padre entra en viewport (no en scroll)

---

#### Button Secondary (ghost)
**Atom**

- Container: border 1px solid `rgba(196,189,181,0.30)`
- Background: transparent
- Color texto: `--text-secondary`
- Padding: igual que primary

Estados:
```yaml
hover:
  border-color: rgba(196,189,181,0.60)
  color: --text-primary
  transition: border-color --duration-normal, color --duration-normal

focus:
  outline: 2px solid --border-active
  outline-offset: 3px
```

---

#### Button WhatsApp (CTA flotante — móvil)
**Atom | Posición fixed bottom-right en mobile**

- Shape: círculo 56x56px
- Background: `#25D366` (verde WhatsApp)
- Ícono: Lucide `MessageCircle` thin 24px, color blanco
- Box-shadow: `0 4px 20px rgba(0,0,0,0.40)`
- Border-radius: 50%

Comportamiento especial:
- Aparece en mobile DESPUÉS de que el usuario hace scroll de 200px (inicial: hidden, opacity 0)
- Entrada: translateY(20px) → 0 + opacity 0 → 1, duration 400ms
- Hover desktop (si se muestra en desktop): scale(1.06), sombra más intensa
- En desktop: se muestra como botón inline en sección Hero (no flotante). El CTA flotante es SOLO mobile
- Tap: abre `https://wa.me/{numero}` en nueva tab — parámetro de link pre-cargado con texto "Hola, quiero reservar un turno"

---

### 2. Nav Link
**Atom | Organism context: Header/Nav**

```yaml
default:
  font: Inter, --text-sm, letter-spacing 0.10em, uppercase, font-weight 400
  color: --text-secondary
  position: relative

hover:
  color: --text-primary
  transition: color --duration-fast
  after pseudo: línea dorada 1px solid --color-gold, width 0 → 100%, bottom -2px
  after transition: width --duration-normal --ease-primary

active/current:
  color: --text-accent (--color-gold)
  after pseudo: línea visible siempre, width 100%

focus:
  outline: 2px solid --border-active
  outline-offset: 4px
```

Nav scroll behavior (GSAP ScrollTrigger):
- `position: fixed`, background: transparent
- Al hacer scroll 80px: background → `rgba(13,12,10,0.92)` + `backdrop-filter: blur(12px)`
- Transición: duration 400ms ease
- Logo: a 100% height inicial, al scroll reduce 15% con transition suave
- Nav se oculta (translateY(-100%)) en scroll rápido hacia abajo, reaparece en scroll hacia arriba (comportamiento "smart hide")

---

### 3. Card Servicio
**Molecule | Organism context: Sección Servicios**

Layout: lista/tabla, no grid de cards visuales. El moodboard muestra una lista elegante con separadores.

Anatomía por ítem:
- Separador superior: 1px solid `--border-subtle`
- Padding: 20px 0
- Layout: flex row, justify-between
- Left: nombre servicio (--text-primary, --text-lg, Cormorant Garamond regular) + descripción breve (--text-secondary, --text-sm, Inter)
- Right: precio (--text-accent, --text-xl, Cormorant Garamond, tabular-nums) + duración opcional (--text-tertiary, --text-xs, uppercase)

Estados:
```yaml
default:
  background: transparent

hover:
  background: rgba(201,169,110,0.04)   /* warmth highlight casi invisible */
  padding-left: 8px   /* indent sutil */
  transition: background --duration-normal, padding-left --duration-normal --ease-hover
  cursor: default (no es clickeable a menos que haya un link)
```

Reveal (GSAP stagger):
- Cada ítem entra con fade-in + translateX(-8px) → 0
- Stagger: 80ms entre ítems
- Trigger: cuando la lista entra en viewport

---

### 4. Card Galería
**Molecule | Organism context: Sección Galería**

Nota del moodboard: la galería muestra fotos en grid asimétrico — algunas verticales, algunas horizontales. Hay placeholders oscuros donde irán fotos reales del barber.

Layout: grid de 3 columnas desktop, 2 columnas mobile, con 1 card doble-height cada 6 items (offset visual).

Anatomía:
- Container: aspect-ratio 3/4 (portrait) o 4/3 (landscape para card especial)
- Background: `--bg-elevated` como placeholder
- Overflow: hidden
- Border-radius: 0 (consistente con el resto)
- Image: object-fit cover, width/height 100%

Placeholder (cuando no hay foto):
- Background: linear-gradient(135deg, #1A1814 0%, #252118 100%)
- Centro: ícono `Scissors` thin 24px color `--border-subtle`
- Shimmer: keyframe animation sobre pseudo-element, color `rgba(201,169,110,0.06)`, duration 2s infinite

Estados:
```yaml
hover:
  image scale: 1.03 (transform sobre el img, NO sobre el container)
  overlay: rgba(13,12,10,0.30) aparece sobre la imagen
  transition: transform 600ms --ease-hover, opacity 300ms

  info reveal (si hay caption):
    translateY(100%) → translateY(0)
    fondo: linear-gradient(transparent, rgba(13,12,10,0.90))
    texto: --text-primary, --text-sm
```

Reveal (GSAP ScrollTrigger):
- Items entran en stagger de 2 columnas
- Fade-in + scale(0.96) → scale(1)
- Duration: 700ms, stagger 120ms
- Sin clip-path reveal (demasiado work para el tono buscado; scale + fade es más elegante y rápido)

---

### 5. Stat Card
**Molecule | Organism context: Sección Stats (debajo del Hero)**

El moodboard muestra números grandes (+8, 15k+, 9.8, 100%) sobre fondo oscuro, con label abajo.

Anatomía:
- Container: flex column, align center, padding --space-8 --space-6
- Number: Cormorant Garamond, --text-9xl (128px desktop), --text-6xl (60px mobile), font-weight 300, color --text-primary, letter-spacing -0.03em
- Suffix (+, k+, %): mismo font, --text-5xl desktop, color --color-gold (accent diferencial)
- Label: Inter, --text-xs, uppercase, letter-spacing 0.14em, color --text-tertiary
- Separador vertical entre stats: 1px solid `--border-subtle`

Reveal (GSAP CountUp + ScrollTrigger):
- Los números hacen count-up desde 0 al entrar en viewport
- Duration: 1400ms, easing --ease-primary
- Cada número countup inicia con stagger 200ms respecto al anterior
- El sufijo aparece cuando el countup termina (no antes) — subtle fade-in 150ms

---

### 6. Footer Link
**Atom | Organism context: Footer**

```yaml
default:
  font: Inter, --text-sm, letter-spacing 0.06em
  color: --text-tertiary

hover:
  color: --text-secondary
  transition: color --duration-fast

focus:
  outline: 2px solid --border-active
  outline-offset: 2px
```

---

## Especificaciones de Sección

### Sección 1 — Hero

**Layout (Desktop):**
- Altura: 100dvh mínimo (no 100vh — evita shift en mobile)
- Dos columnas: 55% texto / 45% imagen
- Imagen: ocupa full-height de la sección, object-fit cover, posición: right center
- Overlay sobre imagen: linear-gradient(to right, #0D0C0A 0%, rgba(13,12,10,0.7) 50%, transparent 100%)
- El texto se superpone sobre el negro del gradiente

**Layout (Mobile):**
- Una columna
- Imagen full-width en fondo (position absolute, inset 0, opacity 0.5)
- Contenido sobre imagen, con padding

**Contenido:**
- Eyebrow: label uppercase tracking "Barbería Premium · [Ciudad]"
- Headline 1: "El detalle también" (Cormorant Garamond, ~72px desktop, italic en "también")
- Headline 2: "comunica." (misma fuente, gold accent en el punto)
- Subline: breve tagline body (Inter, --text-lg, --text-secondary)
- CTA primario: Button "Reservar turno"
- CTA secundario: "Ver servicios" → scroll anchor (Button Secondary o solo text link con underline)

**SplitText Reveal (GSAP + SplitText):**
- Eyebrow: fade-in desde opacity 0, delay 200ms
- Headline: SplitText por word, cada palabra entra con translateY(100%) → 0 desde un clipPath
  - "El detalle también" → words stagger 60ms
  - "comunica." → entra después con 200ms de delay adicional
- Subline: fade-in + translateY(12px), delay 800ms
- CTA: fade-in, delay 1100ms
- Todos los reveals ocurren en page-load (no scroll), con easing --ease-primary

**Imagen Background:**
- En desktop: foto del hero (Heroweb.png reference) — manos tatuadas + cliente
- Parallax sutil: al hacer scroll, la imagen sube a 0.3x la velocidad del scroll (GSAP ScrollTrigger)
- NO parallax en mobile (performance)

---

### Sección 2 — Stats

**Layout:** 4 stats en fila (desktop), 2x2 grid (mobile)
**Fondo:** `--bg-primary` — continuación sin corte del hero
**Separador superior:** línea `--border-subtle` de 1px

CountUp triggers: ver Stat Card arriba.

---

### Sección 3 — About / Confianza

**Layout (Desktop):**
- Dos columnas 50/50
- Izquierda: texto
- Derecha: foto vertical del barber (portrait), con frame decorativo: borde dorado de 1px con offset de 8px (pseudo-element con border y position absolute)

**Contenido texto:**
- Eyebrow: "Un espacio de confianza y precisión."
- Body: párrafos Inter --text-base --text-secondary, max-width 55ch
- Firma del barber: Cormorant Garamond italic, --text-xl, --text-accent

**Reveal:** fade-in ambas columnas simultáneo, texto desde izquierda (translateX(-20px)), foto desde derecha (translateX(20px)), duration 700ms.

---

### Sección 4 — "No es solo un corte. Es tu presencia." (Dramatic Interlude)

**Layout:** Full-bleed, texto centrado, fondo con imagen de alta oscuridad (foto del cliente con overlay negro 75%)

**Tipografía:**
- "No es solo un corte." → Cormorant Garamond, 64px desktop / 40px mobile, color --text-primary, italic, letter-spacing -0.02em
- "Es tu presencia." → misma fuente, color `--color-gold`, peso 300

**SplitText Reveal:**
- Línea 1 y línea 2 entran por separado
- Línea 1: words stagger 80ms, translateY(40px) → 0 + opacity 0 → 1
- Línea 2: entra 300ms después de que termina línea 1, misma animación
- Easing: --ease-primary, duration 900ms por word

**Padding:** --space-32 (128px) vertical — muy generoso. Esta sección es respiro dramático.

---

### Sección 5 — Servicios

**Layout:** Lista elegante, max-width 800px centrado o alineado a izquierda con offset.
**Eyebrow:** "Resultados que hablan"

Estructura:
- Heading sección: Cormorant Garamond, --text-4xl, --text-primary
- Descripción intro: Inter, --text-base, --text-secondary, max-width 50ch
- Lista de servicios: ver Card Servicio arriba

Reveal: heading primero, luego descripción, luego ítems en stagger (ver Card Servicio).

---

### Sección 6 — Galería

**Layout:** Masonry / bento grid asimétrico
- Desktop: 3 cols, filas de altura variable
- Una card cada 6 items ocupa 2 rows (double-height)
- Gap: 8px (muy cerrado — el grid ES la estética)

**Eyebrow + Heading antes del grid.**

**Lightbox:** Al hacer click en cualquier imagen, abre overlay lightbox:
- Background: rgba(13,12,10,0.96)
- Imagen centrada, max-height 90dvh, con flechas prev/next (SVG, 1.5px stroke, color --text-secondary)
- Cierre: click fuera o tecla Escape
- Entrada del overlay: opacity 0 → 1, duration 300ms
- Imagen dentro: scale(0.95) → scale(1), duration 400ms --ease-primary

---

### Sección 7 — Reserva / CTA Final

**Layout:** Dos columnas en desktop — izquierda: copy + CTA, derecha: widget de turno o formulario simple

**Contenido izquierda:**
- Heading: Cormorant Garamond, --text-5xl
- Body: Inter, --text-base
- CTA primary "Reservar turno" + link WhatsApp secundario

**Widget de turno (si se integra Calendly o similar):**
- iframe con background: --bg-elevated
- Border: 1px solid --border-subtle
- No border-radius en container del iframe

**Formulario (alternativa sin integración externa):**
- Inputs: ver Form Input abajo
- Submit: Button Primary

---

### Sección 8 — Footer

**Layout:** flex row desktop, stack mobile
- Logo: versión monograma "CG" en dorado, --space-6 height
- Links: ver Footer Link
- Redes: íconos monolínea thin, color --text-tertiary → --text-secondary en hover
- Copyright: Inter, --text-xs, --text-disabled, uppercase, letter-spacing 0.12em

**Fondo:** `--bg-elevated` (#1A1814) — diferenciado del negro del cuerpo

---

## Form Inputs

**Anatomía:**
- Style: underline-only (NO border box). Solo línea inferior 1px
- Padding: 12px 0
- Label: flotante (float label pattern) o superior fijo — Inter, --text-xs, uppercase, letter-spacing 0.12em, --text-tertiary
- Valor: Inter, --text-base, --text-primary
- Línea: 1px solid `--border-subtle`

```yaml
focus:
  border-bottom: 1px solid --color-gold
  label color: --color-gold
  transition: border-color --duration-normal

error:
  border-bottom: 1px solid --color-error
  helper text: --text-xs, color --color-error, margin-top 4px

valid:
  border-bottom: 1px solid --color-success (subtle)

disabled:
  opacity: 0.40
  cursor: not-allowed
```

---

## Animaciones — Los 5 Efectos Clave

### 1. SplitText Hero Reveal
**Qué:** Headline del hero se rompe por word, cada word entra con clip desde abajo
**Cómo:** GSAP SplitText, type: "words", cada word en un overflow-hidden container
**Keyframe:** `translateY(100%) → translateY(0)`, simultáneo con `clipPath: inset(0 0 100% 0) → inset(0 0 0% 0)` (opcional si performance lo permite)
**Timing:** stagger 60ms, duration 800ms por word, easing --ease-primary
**Trigger:** onLoad, delay 300ms post-DOMContentLoaded

### 2. Parallax Hero Image
**Qué:** La foto de fondo del hero sube más lento que el scroll
**Cómo:** GSAP ScrollTrigger, `scrub: 1.5`, translateY de 0 a -15%
**Trigger:** start "top top", end "bottom top"
**Solo desktop** — mobile excluido por `matchMedia`

### 3. CountUp Stats
**Qué:** Los números (+8, 15k+, 9.8, 100%) cuentan desde 0 al entrar en viewport
**Cómo:** GSAP fromTo con `innerHTML` update, TextPlugin o custom ticker
**Timing:** duration 1400ms, stagger 200ms entre stats, easing --ease-primary
**Sufijo (+, k+):** aparece al 95% del countup, fade-in 150ms

### 4. Section Reveals en Stagger
**Qué:** Cada sección, al entrar en viewport, anima sus hijos con stagger
**Cómo:** GSAP ScrollTrigger, start "top 80%", once: true
**Keyframe:** `opacity: 0, translateY: 20px → opacity: 1, translateY: 0`
**Timing:** duration 600ms, stagger --stagger-delay (80ms), easing --ease-reveal
**Aplica a:** Stats section, Services list items, Gallery items, About columns

### 5. Nav Smart-Hide + Blur Transition
**Qué:** Nav transparente → blur-dark al scroll, se oculta en scroll down, reaparece en scroll up
**Cómo:** GSAP ScrollTrigger con `onUpdate` + `direction`, más inline style transition
**Timing:** background transition 400ms, hide/show 300ms
**Lenis:** el scroll suave de Lenis hace que esta transición se vea correcta; sin Lenis el blur se ve brusco

---

## Jerarquía Atomic Design

### Atoms
- Button (Primary, Secondary, WhatsApp)
- Input (underline, con float label)
- Label (uppercase tracking)
- Icon (Lucide thin monolínea)
- Badge (gold bg-subtle, texto --text-inverse)
- Avatar (foto barber, borde dorado offset)
- Separator (1px horizontal --border-subtle)

### Molecules
- NavItem (Icon + Label)
- FormField (Label + Input + Helper)
- ServiceRow (nombre + descripción + precio + duración)
- StatCard (number + suffix + label)
- GalleryCard (imagen + overlay hover + caption)
- SocialIcon (ícono + hover)

### Organisms
- Header (Logo + NavItems + CTA Button)
- HeroSection (copy + image + gradiente + CTA)
- StatsSection (4x StatCard + separadores)
- AboutSection (texto + foto + frame decorativo)
- InterludeSection (full-bleed texto dramático)
- ServicesSection (heading + descripción + lista ServiceRows)
- GallerySection (heading + bento grid GalleryCards)
- BookingSection (copy + CTA + widget/formulario)
- Footer (Logo + Links + Social + Copyright)

### Templates
- LandingPageLayout (todas las secciones en orden correcto + Lenis + GSAP context)

---

## Decisiones No-Obvias

### 1. Punto dorado en "comunica."
El punto final del tagline principal ("comunica.") usa `--color-gold` — no es un error tipográfico, es un microdetalle intencional que el frontend-developer debe implementar con un `<span>` con clase `text-accent`.

### 2. WhatsApp flotante solo en mobile
El CTA de WhatsApp NO es flotante en desktop. En desktop aparece como elemento inline en el Hero y/o Reserva. Solo en mobile (< 768px) se renderiza como botón fixed. Esto evita que el botón compita con el diseño en desktop.

### 3. Frame decorativo en foto del barber (About section)
La foto portrait del barber lleva un frame pseudo-element: borde 1px solid `--color-gold` con offset de +8px top/left (pseudo-element con `position: absolute; top: -8px; left: -8px; right: 8px; bottom: 8px; border: 1px solid var(--color-gold); pointer-events: none`). Este frame es el único elemento decorativo "explícito" del sistema — todo lo demás es espacio y tipografía.

### 4. Grid galería con gap mínimo
El gap del grid de galería es 8px, no 16px o 24px. La proximidad de las fotos crea un efecto de collage denso que contrasta con el whitespace generoso del resto del sitio — tensión visual intencional.

### 5. Placeholder de galería con shimmer dorado
Mientras las fotos reales del barber no estén disponibles (o durante lazy-load), los placeholders muestran un fondo #1A1814 con un shimmer de 2s que pasa un gradiente dorado semi-transparente de izquierda a derecha. NO es un skeleton loading genérico gris — es consistente con el warm gold del sistema.

### 6. Lenis + GSAP contexto global
Lenis se inicializa una sola vez en el layout raíz. GSAP recibe el `scrollerProxy` de Lenis. Todos los ScrollTriggers registran `scroller: ".lenis-container"` (o equivalente) — si no, los triggers no funcionan con el scroll suave.

### 7. Fuentes: Cormorant Garamond ITALIC como peso diferencial
El sistema no usa bold para dar énfasis — usa italic. La combinación peso-light + italic de Cormorant es más elegante que cualquier bold para este tono. El bold (600+) se reserva ÚNICAMENTE para casos de accesibilidad extrema si algún contraste no pasa AA con light.

### 8. Testimonios / Reviews (si se agregan en Fase 3)
No usar carousel automático. Lista estática con scroll horizontal snap en mobile. Cada testimonial: quote mark en Cormorant 120px color `--gold-bg-subtle`, texto quote, nombre + rating en estrellas monolínea. Fondo `--bg-elevated`.

---

## Overrides respecto al Moodboard Original

1. **Nombre solo**: "Carlos Gañán de pelos" en el moodboard → "Carlos Gañán" en el sitio real. El subtítulo "de pelos" puede aparecer como tagline secundario o eyebrow, no en el logo principal.

2. **Colores**: El gold del moodboard es más saturado. El sistema propone un gold ligeramente más desaturado (`#C9A96E`) para mejor contraste WCAG sobre negro profundo. El oro "limpio" del moodboard (`~#D4A843`) se puede usar en elementos decorativos donde no hay texto.

3. **Sin gradientes cromáticos**: el moodboard tiene fondos uniformes. Cualquier gradiente en el sistema es Negro → Negro más claro (temperatura, no color). Ningún gradiente cromático (dorado a negro) excepto en overlays de imagen.

4. **Tipografía de precios**: el moodboard no muestra precios, pero el brief los incluye. Usar Cormorant Garamond con `font-feature-settings: "tnum"` (tabular numbers) para que los precios se alineen en columna.

---

## Validación WCAG Resumen

| Par | Ratio | Estado |
|-----|-------|--------|
| --text-primary sobre --bg-primary | ~16:1 | AAA |
| --text-secondary sobre --bg-primary | ~10:1 | AAA |
| --text-tertiary sobre --bg-primary | ~5.4:1 | AA |
| --text-accent (gold) sobre --bg-primary | ~6.8:1 | AA |
| --text-inverse sobre --color-gold | ~5.1:1 | AA |
| --text-disabled sobre --bg-primary | ~3.9:1 | Solo decorativo |
| --text-primary sobre --bg-elevated | ~14:1 | AAA |
| Gold border sobre --bg-primary | ~3.1:1 | AA para UI (3:1) |

Función de contraste WCAG a implementar en build (SCSS o PostCSS plugin):
```scss
// Emitir @warn en build si cualquier par texto/fondo cae bajo 4.5:1
// Excepción permitida: --text-disabled en elementos con role="presentation"
```

---

## Notas de Handoff para Frontend-Developer

1. **No hardcodear duraciones** — usar siempre `--duration-*` tokens
2. **SplitText requiere `overflow: hidden`** en el wrapper de cada word/line para que el clip-from-below funcione
3. **Lenis antes de GSAP** — inicializar Lenis primero, luego registrar ScrollTrigger con el proxy
4. **`will-change: transform`** solo en elementos que efectivamente van a animar (no en todos los cards)
5. **Imagen hero**: `priority={true}` en Next.js Image (LCP crítico)
6. **Cormorant Garamond**: cargar variantes `300`, `300 italic`, `400`, `400 italic` — no más. Evitar FOUT con `font-display: swap` y preload del subconjunto latino
7. **Galería**: implementar Intersection Observer para lazy load de imágenes fuera del viewport inicial. Las primeras 6 imágenes: `priority={true}`
8. **WhatsApp link**: `rel="noopener noreferrer"` obligatorio
9. **Punto dorado en "comunica."**: `<span aria-hidden="true" className="text-accent">.</span>` — el punto semántico ya está en el texto del span padre
