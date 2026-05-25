# CSS Foundation — Carlos Gañan

**Design Intelligence**: Barbería Premium / Cinematic Masculine | Estilo: Luxury Editorial + Inmersivo
**Plataforma**: Next.js 16 + Tailwind 4
**Tema**: Único oscuro (no hay toggle light/dark — solo dark cinematográfico)
**Anti-patterns HIGH**:
- NO fondos blancos ni grises neutros en ninguna sección
- NO border-radius > 4px salvo en imágenes (max 2px en UI elements)
- NO tipografía sans en headings — serif OBLIGATORIO en display
- NO colores planos sin textura/profundidad — usar capas oscuras con ligera variación de tonalidad
- NO animaciones bounce/spring — todo cubic-bezier cinematic, deliberado
- NO precios visibles — solo descripción de servicios + CTA WhatsApp

---

## 1. Paleta de colores (7 tokens semánticos)

Extraídos directamente del moodboard (pixel-accurate):

| Token              | Hex       | Rol semántico                                     |
|--------------------|-----------|---------------------------------------------------|
| `--bg-base`        | `#0A0807` | Fondo raíz — negro profundo con undertone café    |
| `--bg-elevated`    | `#1A1310` | Cards, nav, secciones alternadas                  |
| `--bg-surface`     | `#241C18` | Superficies de hover, inputs, overlays sutiles    |
| `--border`         | `#2E2520` | Separadores, divisores, bordes de cards           |
| `--text-primary`   | `#E8DDD0` | Texto principal — beige cálido, no blanco puro    |
| `--text-secondary` | `#9A8E82` | Labels, subtítulos, metadata, texto de apoyo      |
| `--gold`           | `#C9A961` | Acento primario — CTAs, highlights, subrayados    |
| `--gold-dim`       | `#8A6F3A` | Estado hover del dorado / versión atenuada        |
| `--gold-glow`      | `rgba(201,169,97,0.15)` | Glow sutil para hover de botones CTA |

**RGB companions** (para alpha compositing en GSAP/Tailwind):
```
--bg-base-rgb: 10, 8, 7
--gold-rgb: 201, 169, 97
--text-primary-rgb: 232, 221, 208
```

---

## 2. Tipografía

### Fuentes elegidas
- **Display/Headings**: Cormorant Garamond (serif editorial — coincide exactamente con el moodboard)
  - Weights a cargar: 300, 400, 500, 600 (Light, Regular, Medium, SemiBold)
  - Italic indispensable para frases de impacto ("El detalle también comunica.")
- **Body/UI**: Inter (sans-system — legibilidad máxima en dark background)
  - Weights: 300, 400, 500 (Light, Regular, Medium)

### Google Fonts URL (optimizada — solo pesos necesarios)
```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500&display=swap
```

### CSS Import
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500&display=swap');
```

### Escala tipográfica (Cinematic/Editorial — escala dramática)
Los headings usan Cormorant Garamond con letter-spacing tight.
El body usa Inter con tracking ligeramente amplio para legibilidad.

| Token          | Valor clamp                           | Uso                                      |
|----------------|---------------------------------------|------------------------------------------|
| `--text-xs`    | `0.6875rem` (11px)                    | Labels, badges, metadata minúscula       |
| `--text-sm`    | `0.8125rem` (13px)                    | Texto apoyo, horarios, dirección         |
| `--text-base`  | `clamp(0.9rem, 1vw, 1rem)`            | Body — Inter regular                     |
| `--text-lg`    | `clamp(1rem, 1.2vw, 1.125rem)`        | Body expandido, descripciones servicios  |
| `--text-xl`    | `clamp(1.125rem, 1.5vw, 1.25rem)`     | Subtítulos de sección                    |
| `--text-2xl`   | `clamp(1.5rem, 2.5vw, 1.875rem)`      | Títulos de cards                         |
| `--text-3xl`   | `clamp(2rem, 4vw, 2.5rem)`            | Títulos de sección (Cormorant)           |
| `--text-4xl`   | `clamp(2.5rem, 5vw, 3.5rem)`          | Títulos grandes (Cormorant)              |
| `--text-5xl`   | `clamp(3rem, 6vw, 4.5rem)`            | Display grande                           |
| `--text-hero`  | `clamp(3.5rem, 8vw, 6.5rem)`          | Hero principal — dramático, cinematográfico |

**Letter-spacing por contexto**:
- Headings Cormorant: `letter-spacing: -0.02em` (tight elegante)
- Nav / UI labels: `letter-spacing: 0.12em` (tracking amplio — estilo premium brand)
- Body Inter: `letter-spacing: 0.01em`

**Line-height**:
- Headings: `line-height: 1.05` (ultra-apretado para display grande)
- Body: `line-height: 1.65`

---

## 3. Spacing

Base 4px (sistema estándar). Secciones muy generosas — estética editorial.

| Token          | Valor   | Uso típico                                |
|----------------|---------|-------------------------------------------|
| `--space-1`    | `0.25rem` (4px)   | Micro gaps                      |
| `--space-2`    | `0.5rem` (8px)    | Gaps internos de componentes    |
| `--space-3`    | `0.75rem` (12px)  | Padding de labels               |
| `--space-4`    | `1rem` (16px)     | Padding base                    |
| `--space-6`    | `1.5rem` (24px)   | Gaps de grid pequeños           |
| `--space-8`    | `2rem` (32px)     | Padding de cards                |
| `--space-10`   | `2.5rem` (40px)   | Gaps de grid medianos           |
| `--space-12`   | `3rem` (48px)     | Padding de secciones mobile     |
| `--space-16`   | `4rem` (64px)     | Padding de secciones tablet     |
| `--space-20`   | `5rem` (80px)     | Separación entre secciones      |
| `--space-24`   | `6rem` (96px)     | Padding de secciones desktop    |
| `--space-32`   | `8rem` (128px)    | Secciones hero/full-bleed       |
| `--space-section` | `clamp(4rem, 8vw, 8rem)` | Padding vertical de secciones (fluido) |

---

## 4. Border radius

Estética angular elegante — mínimos absolutos.

| Token           | Valor  | Uso                                       |
|-----------------|--------|-------------------------------------------|
| `--radius-none` | `0px`  | Elementos UI base, botones outline        |
| `--radius-xs`   | `1px`  | Microdetalles                             |
| `--radius-sm`   | `2px`  | Badges, tags, divisores con esquinas      |
| `--radius-base` | `3px`  | Cards de servicios, input fields          |
| `--radius-img`  | `2px`  | Imágenes (mínimo para evitar pixelado)    |
| `--radius-full` | `0px`  | Botones CTA principales (rectangulares)  |

**Decisión de diseño**: Los botones CTA son 100% rectangulares (0px radius). Es coherente con la estética editorial del moodboard donde el botón "RESERVAR TURNO" es rectangular sharp. NO usar pill buttons.

---

## 5. Shadows

Enfocadas en profundidad cinematográfica — cálidas, oscuras. Sin sombras grises neutras.

| Token             | Valor                                                       | Uso                         |
|-------------------|-------------------------------------------------------------|-----------------------------|
| `--shadow-sm`     | `0 1px 4px rgba(0,0,0,0.4)`                                | Microelevaciones            |
| `--shadow-md`     | `0 4px 16px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)`   | Cards de servicios          |
| `--shadow-lg`     | `0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)`   | Modales, overlays           |
| `--shadow-gold`   | `0 0 24px rgba(201,169,97,0.25), 0 4px 16px rgba(0,0,0,0.5)` | Hover de CTA dorado      |
| `--shadow-inset`  | `inset 0 1px 0 rgba(232,221,208,0.06)`                     | Bordes superiores sutiles   |

---

## 6. Motion tokens (GSAP-ready)

**Filosofía**: cinematic, deliberado. Sin bounce. Todo cubic-bezier de alta calidad.

| Token                  | Valor                               | Uso GSAP                              |
|------------------------|-------------------------------------|---------------------------------------|
| `--ease-cinematic`     | `cubic-bezier(0.65, 0, 0.35, 1)`   | Ease principal — reveal de secciones  |
| `--ease-out-expo`      | `cubic-bezier(0.16, 1, 0.3, 1)`    | Entradas de texto, slides             |
| `--ease-out-quart`     | `cubic-bezier(0.25, 1, 0.5, 1)`    | Hover states, micro-interacciones     |
| `--ease-in-quart`      | `cubic-bezier(0.5, 0, 0.75, 0)`    | Salidas de elementos                  |
| `--ease-smooth`        | `cubic-bezier(0.4, 0, 0.2, 1)`     | Transiciones de estado UI             |
| `--dur-instant`        | `100ms`                             | Focus states                          |
| `--dur-fast`           | `200ms`                             | Hover de links, microinteracciones    |
| `--dur-normal`         | `400ms`                             | Transiciones de estado                |
| `--dur-slow`           | `700ms`                             | Entradas de componentes               |
| `--dur-reveal`         | `1100ms`                            | SplitText reveals, hero entrance      |
| `--dur-cinematic`      | `1600ms`                            | Full section transitions, parallax    |
| `--stagger-tight`      | `0.04s`                             | Stagger caracteres SplitText          |
| `--stagger-normal`     | `0.08s`                             | Stagger líneas de texto               |
| `--stagger-loose`      | `0.15s`                             | Stagger de cards (servicios, galería) |

**Strings para GSAP ease** (usar directamente en gsap.to(), fromTo()):
```js
// En lugar de variables CSS, GSAP usa strings directamente:
const EASE = {
  cinematic: "power3.inOut",      // para reveals grandes
  outExpo:   "expo.out",          // para entradas de texto
  outQuart:  "power2.out",        // para hovers
  inQuart:   "power2.in",         // para salidas
  smooth:    "power1.inOut",      // para UI states
};
```

**Lenis smooth scroll config recomendada**:
```js
{
  lerp: 0.08,        // Más suave que default (0.1) — feel cinematográfico
  duration: 1.4,     // Segundos para scroll completo
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
  smooth: true,
  smoothTouch: false // Desactivar en mobile para UX nativa
}
```

---

## 7. Breakpoints (mobile-first)

| Token             | Valor    | Contexto                                   |
|-------------------|----------|--------------------------------------------|
| `--bp-sm`         | `640px`  | Mobile grande / landscape                  |
| `--bp-md`         | `768px`  | Tablet portrait                            |
| `--bp-lg`         | `1024px` | Desktop pequeño / tablet landscape         |
| `--bp-xl`         | `1280px` | Desktop estándar (diseño principal)        |
| `--bp-2xl`        | `1536px` | Desktop grande / pantallas wide            |

---

## 8. Layout primitives

### Contenedores
| Token                  | Valor    | Uso                                        |
|------------------------|----------|--------------------------------------------|
| `--container-sm`       | `640px`  | Texto editorial centrado, frases de impacto|
| `--container-md`       | `768px`  | Contenido de texto ancho medio             |
| `--container-lg`       | `1024px` | Grids de servicios                         |
| `--container-xl`       | `1280px` | Container principal del sitio              |
| `--container-full`     | `100%`   | Secciones full-bleed (hero, full-screen)   |

### Grid patterns por sección
- **Hero**: 2 columnas asimétricas (60/40) — texto izquierda, imagen derecha con overflow. Mobile: stack vertical, imagen primero con overlay de texto
- **Stats**: 4 columnas uniformes. Mobile: 2×2 grid
- **Servicios**: 1 columna lista con separadores (diseño tipo menú editorial). NO usar grid de cards cuadradas
- **Galería**: 3 columnas × 2 filas con gaps variables (grid asimétrico — image 1 ocupa 2 cols en desktop). Mobile: 2 columnas
- **Ubicación/Horarios**: 2 columnas (mapa/texto horarios). Mobile: stack

### Composición espacial (decisión de arquitectura)
Este proyecto usa **layout editorial no-convencional**:
- Elementos que rompen el grid (imagen hero que sangra fuera del contenedor)
- Negative space generoso como elemento visual (no "llenar todo")
- Asimetría deliberada en la sección "Un espacio de confianza" (texto izquierda, galería derecha con offset vertical)
- Las secciones de texto full-bleed ("No es solo un corte") usan máximo 720px de ancho centrado sobre fondo negro puro

---

## 9. CSS variables completas (`:root` — solo dark)

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500&display=swap');

:root {
  /* ─── COLORES ─────────────────────────────────────────── */
  --bg-base:           #0A0807;
  --bg-elevated:       #1A1310;
  --bg-surface:        #241C18;
  --border:            #2E2520;
  --text-primary:      #E8DDD0;
  --text-secondary:    #9A8E82;
  --gold:              #C9A961;
  --gold-dim:          #8A6F3A;
  --gold-glow:         rgba(201, 169, 97, 0.15);

  /* RGB companions para alpha compositing */
  --bg-base-rgb:       10, 8, 7;
  --gold-rgb:          201, 169, 97;
  --text-primary-rgb:  232, 221, 208;

  /* ─── TIPOGRAFÍA ──────────────────────────────────────── */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Inter', system-ui, -apple-system, sans-serif;

  --text-xs:    0.6875rem;
  --text-sm:    0.8125rem;
  --text-base:  clamp(0.9rem, 1vw, 1rem);
  --text-lg:    clamp(1rem, 1.2vw, 1.125rem);
  --text-xl:    clamp(1.125rem, 1.5vw, 1.25rem);
  --text-2xl:   clamp(1.5rem, 2.5vw, 1.875rem);
  --text-3xl:   clamp(2rem, 4vw, 2.5rem);
  --text-4xl:   clamp(2.5rem, 5vw, 3.5rem);
  --text-5xl:   clamp(3rem, 6vw, 4.5rem);
  --text-hero:  clamp(3.5rem, 8vw, 6.5rem);

  --leading-tight:   1.05;
  --leading-snug:    1.25;
  --leading-normal:  1.5;
  --leading-relaxed: 1.65;

  --tracking-tightest: -0.03em;
  --tracking-tight:    -0.02em;
  --tracking-normal:    0.01em;
  --tracking-wide:      0.08em;
  --tracking-wider:     0.12em;
  --tracking-widest:    0.18em;

  /* ─── SPACING ─────────────────────────────────────────── */
  --space-1:   0.25rem;
  --space-2:   0.5rem;
  --space-3:   0.75rem;
  --space-4:   1rem;
  --space-6:   1.5rem;
  --space-8:   2rem;
  --space-10:  2.5rem;
  --space-12:  3rem;
  --space-16:  4rem;
  --space-20:  5rem;
  --space-24:  6rem;
  --space-32:  8rem;
  --space-section: clamp(4rem, 8vw, 8rem);

  /* ─── BORDER RADIUS ───────────────────────────────────── */
  --radius-none: 0px;
  --radius-xs:   1px;
  --radius-sm:   2px;
  --radius-base: 3px;
  --radius-img:  2px;
  --radius-full: 0px;   /* CTAs rectangulares — diseño editorial */

  /* ─── SHADOWS ─────────────────────────────────────────── */
  --shadow-sm:    0 1px 4px rgba(0, 0, 0, 0.4);
  --shadow-md:    0 4px 16px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3);
  --shadow-lg:    0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-gold:  0 0 24px rgba(201, 169, 97, 0.25), 0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-inset: inset 0 1px 0 rgba(232, 221, 208, 0.06);

  /* ─── Z-INDEX ─────────────────────────────────────────── */
  --z-below:   -1;
  --z-base:     0;
  --z-above:    10;
  --z-overlay:  100;
  --z-dropdown: 200;
  --z-sticky:   300;
  --z-nav:      400;
  --z-modal:    500;
  --z-toast:    600;

  /* ─── MOTION ──────────────────────────────────────────── */
  --ease-cinematic:  cubic-bezier(0.65, 0, 0.35, 1);
  --ease-out-expo:   cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart:  cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-quart:   cubic-bezier(0.5, 0, 0.75, 0);
  --ease-smooth:     cubic-bezier(0.4, 0, 0.2, 1);

  --dur-instant:    100ms;
  --dur-fast:       200ms;
  --dur-normal:     400ms;
  --dur-slow:       700ms;
  --dur-reveal:     1100ms;
  --dur-cinematic:  1600ms;

  --stagger-tight:  0.04s;
  --stagger-normal: 0.08s;
  --stagger-loose:  0.15s;

  /* ─── LAYOUT ──────────────────────────────────────────── */
  --container-sm:   640px;
  --container-md:   768px;
  --container-lg:   1024px;
  --container-xl:   1280px;
  --container-full: 100%;
}
```

---

## 10. Tailwind 4 — configuración de tokens

En Tailwind 4, los custom tokens se declaran en `globals.css` usando `@theme`:

```css
@theme {
  /* Colores */
  --color-bg-base:        #0A0807;
  --color-bg-elevated:    #1A1310;
  --color-bg-surface:     #241C18;
  --color-border:         #2E2520;
  --color-text-primary:   #E8DDD0;
  --color-text-secondary: #9A8E82;
  --color-gold:           #C9A961;
  --color-gold-dim:       #8A6F3A;

  /* Fuentes */
  --font-family-display: 'Cormorant Garamond', Georgia, serif;
  --font-family-body:    'Inter', system-ui, sans-serif;

  /* Breakpoints */
  --breakpoint-sm:  640px;
  --breakpoint-md:  768px;
  --breakpoint-lg:  1024px;
  --breakpoint-xl:  1280px;
  --breakpoint-2xl: 1536px;

  /* Spacing adicional (Tailwind 4 ya incluye la escala base) */
  --spacing-section: clamp(4rem, 8vw, 8rem);

  /* Border radius */
  --radius-none: 0px;
  --radius-sm:   2px;
  --radius-base: 3px;
  --radius-img:  2px;

  /* Animations */
  --ease-cinematic: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
  --ease-smooth:    cubic-bezier(0.4, 0, 0.2, 1);
}
```

Esto permite usar clases como `bg-bg-base`, `text-gold`, `font-display`, `rounded-base`, etc.

---

## 11. Jerarquía de archivos CSS

```
app/
├── globals.css         → @import Google Fonts + @theme Tailwind 4 + :root CSS vars
└── layout.tsx          → <html> con class="dark" fija (no toggle)

components/
├── ui/                 → componentes base usando tokens
└── sections/           → secciones que consumen el design system
```

`globals.css` es el único archivo CSS — Tailwind 4 no requiere archivos separados.
La directiva `color-scheme: dark` va en `:root` del globals.css.

---

## 12. Reset base y estilos globales

```css
:root {
  color-scheme: dark;  /* scrollbars e inputs nativos en dark */
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  scroll-behavior: auto; /* Lenis controla el scroll — NO usar smooth nativo */
}

/* Safari focus fix */
:where(button):focus:not(:focus-visible) { outline: 0; }

/* Focus visible global */
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}

/* Selección de texto — branded */
::selection {
  background-color: rgba(201, 169, 97, 0.25);
  color: var(--text-primary);
}

/* Imágenes responsive base */
img, video {
  max-width: 100%;
  height: auto;
  display: block;
}
```

---

## 13. Placeholders de galería (decisión post Fase 1)

El usuario confirmó que las 6 fotos de galería + hero son placeholders.
Los contenedores deben ser elegantes, no "roto":

```css
.placeholder-img {
  background: linear-gradient(
    135deg,
    var(--bg-elevated) 0%,
    var(--bg-surface) 100%
  );
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  /* El ícono (tijera SVG) va inline en el componente React */
}
```

Las imágenes van en `/public/images/` con nombres predefinidos:
- `hero-main.jpg` — hero principal
- `gallery-01.jpg` a `gallery-06.jpg` — galería resultados
- `ambient-01.jpg`, `ambient-02.jpg`, `ambient-03.jpg` — sección "espacio de confianza"

---

## 14. Notas para ui-designer

1. **Nav**: fondo transparente en hero, transición a `bg-elevated` con `backdrop-filter: blur(12px)` al hacer scroll (sticky). Nav links en `tracking-widest` (0.18em) Inter Medium — estilo brand label
2. **Hero**: el tagline "El detalle también comunica." debe usar Cormorant Garamond Italic Light (300) — la coma y el punto son parte del diseño
3. **Stats**: números en Cormorant Garamond 5xl semibold, label en Inter xs tracking-widest
4. **Servicios**: lista tipo menú con separadores `border-color` horizontales. NO cards cuadradas. Cada ítem: nombre del servicio en Cormorant 2xl + descripción breve en Inter sm text-secondary
5. **CTA "RESERVAR TURNO"**: botón rectangular (radius-none), bg-gold, text-bg-base, Inter Medium tracking-wider. Hover: shadow-gold + ligero translate-y(-1px)
6. **Animaciones GSAP**: ver motion tokens. SplitText en hero y sección "No es solo un corte". ScrollTrigger con scrub suave (no snap) en galería parallax
7. **WhatsApp flotante mobile**: ícono WhatsApp verde (#25D366) sobre bg-surface, shadow-md, position fixed bottom-6 right-6, z-toast

---

## 15. Decisiones no-obvias para frontend-developer

1. **`scroll-behavior: auto` obligatorio** — Lenis maneja el scroll. Si se usa `smooth` en CSS, conflicto con Lenis
2. **`-webkit-font-smoothing: antialiased`** — crítico en fondos oscuros. Sin esto Cormorant se ve grueso y feo en macOS
3. **Cormorant Garamond Italic** requiere cargar el subset `ital,wght@1,300;1,400;1,500` explícitamente en Google Fonts URL
4. **Tailwind 4 `@theme`** reemplaza `tailwind.config.js` — los tokens van en `globals.css`, no en un archivo de config separado
5. **`color-scheme: dark`** en `:root` afecta scrollbars nativos, inputs de tipo date/number, etc. — todos se ven dark automáticamente
6. **Z-index de nav (--z-nav: 400)** es intencionalmente alto para estar sobre GSAP transforms que crean nuevos stacking contexts
7. **Lenis + Next.js 16**: el provider de Lenis debe ser un Client Component wrapping el children en layout.tsx. El `smooth` debe ser `false` en touch devices (ver config en §6)
8. **`text-rendering: optimizeLegibility`** — mejora kerning de Cormorant Garamond, especialmente en tamaños hero

---

*Foundation generada por ux-architect — carlos-ganan — 2026-05-25*
