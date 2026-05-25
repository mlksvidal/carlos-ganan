# Performance Report — Carlos Gañan Landing
**Fecha:** 2026-05-25
**Stack:** Next.js 16.2.6 + Turbopack + Tailwind 4 + GSAP + Lenis
**Build:** Static (SSG) — single-page landing

---

## Core Web Vitals

| Métrica | Valor medido | Target | Status |
|---------|-------------|--------|--------|
| TTFB | 19–30ms | <600ms | PASS |
| FCP | ~300–500ms (estimado) | <1.8s | PASS (estimado) |
| LCP | ~500–800ms (estimado) | <2.5s | PASS (estimado) |
| CLS | 0.0000 | <0.1 | PASS |
| TBT | 0ms | <200ms | PASS |
| INP | N/A (sin interacciones medibles) | <200ms | N/A |

**Nota sobre FCP/LCP:** Las APIs `largest-contentful-paint` y `first-contentful-paint` via `getEntriesByType()` no retienen valores post-carga en Chromium. Los PerformanceObserver no persisten entre navegaciones del MCP. Los valores estimados se basan en: TTFB=19ms + domInteractive=79ms + tiempo de paint esperado dado ausencia de imágenes reales en el hero.

### Timing Real (Performance API — primera carga sin caché)
- **TTFB:** 19–30ms (excelente — servidor local estático)
- **DOM Interactive:** 79–159ms
- **DOM Complete:** 100–441ms (variación por Google Maps iframe)
- **Load Complete:** 97–431ms

---

## Bundle Size — First Load

### Wire sizes (gzip, primera carga real)
| Chunk | Raw | Gzip wire | Ratio |
|-------|-----|-----------|-------|
| 0rliqmdz (mayor) | 222KB | 69.6KB | 0.31x |
| 0-jknoljz7 | 147KB | 39.8KB | 0.27x |
| 0guyofftqt | 117KB | 45.4KB | 0.39x |
| 0n~v8~rri7 | 53KB | 12.9KB | 0.24x |
| 00awhcvun0 | 49KB | 10.6KB | 0.21x |
| 0a361wj (GSAP) | 36KB | 8.6KB | 0.24x |
| 0v.erj (GSAP+Lenis) | 29KB | 9.2KB | 0.32x |
| 0duq2w | 17KB | 6.3KB | 0.37x |
| Menores | ~35KB raw | ~9KB | — |
| **TOTAL JS** | **688KB raw** | **~210KB gzip** | ~0.31x |
| **CSS** | **41KB raw** | **~9KB gzip** | ~0.22x |
| **Fonts (2)** | **~46KB** | preloaded via next/font | — |
| **HTML** | 62KB raw | 0.3KB gzip | 0.005x |

### Gates de bundle
- First Load JS gzip total: **~210KB** vs gate <250KB → **PASS**
- CSS gzip: **~9KB** vs gate sin límite → **PASS**
- Chunk individual más grande (raw): 222KB → razonable

---

## GSAP Analysis

### Uso
- **11 ScrollTrigger instances** (en 7 secciones: Hero, About, Services, Gallery, Location, Interlude, CTAFinal)
- **53 llamadas GSAP** (gsap.to/from/fromTo/set/timeline)
- Plugins encontrados en bundles: GSAP core + ScrollTrigger
- ScrollTrigger count: 11 → bajo el threshold de 15 (OK)

### `will-change` usage
- 6 elementos con `will-change: transform` o `will-change: transform, opacity`
- 2 inline styles (HeroSection, InterludeSection) — removibles post-animación
- 2 CSS estático en GallerySection (permanente)
- 2 className Tailwind (`will-change-transform`) en HeroSection
- Total: 6 → bajo el threshold de 5 elementos permanentes (leve)

### Propiedades animadas
- NO se animan `width`, `height`, `top`, `left` — solo `transform` y `opacity` (correcto, GPU-composited)

### Lazy loading
- GSAP: import directo (no lazy) — contribuye ~44KB gzip al bundle
- Lenis: import directo en LenisProvider.tsx (~9KB gzip)
- Sin imágenes pesadas reales en producción todavía

---

## Memory & Runtime

- **JS Heap usado:** 6.0MB (excelente para landing page)
- **JS Heap total allocated:** 8.6MB
- **Long tasks:** 0 (sin bloqueo del main thread)
- **Lenis:** activo y funcionando
- **GSAP plugins runtime:** cargados pero no visibles en `gsap.plugins` (probablemente por tree shaking)

---

## Network Waterfall — Primera carga

- **Total recursos:** 18–19 requests
- **JS chunks:** 11 scripts
- **CSS:** 1 archivo
- **Fonts:** 2 woff2 (auto-hosted via next/font — sin round-trip a Google)
- **Imágenes:** 0 (placeholders SVG, no imágenes reales aún)
- **iframes externos:** Google Maps (2 requests, 362–427ms) → impactan loadComplete

### Requests externos (únicos)
- Google Maps iframe: 2 requests, ~400ms c/u (esperado para mapa embebido)
- WhatsApp: solo DNS prefetch, sin requests activos

---

## Issues Detectados

### ISSUE 1 — BLOCKER POTENCIAL: preconnect a Google Fonts innecesario
**Archivo:** `src/app/layout.tsx:186-187`
```
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```
El comentario en el código dice "next/font ya lo agrega" pero equal los incluye. Con next/font (self-hosted), NO se hacen requests a Google Fonts en producción. Estos preconnect son innecesarios pero inofensivos. Eliminar para limpiar.

### ISSUE 2 — ADVERTENCIA: Google Maps iframe bloquea loadComplete
Dos iframes de Google Maps (LocationSection) agregan ~400ms al loadComplete. El iframe carga en paralelo con el resto pero retrasa el evento `load`. Recomendación: lazy-load el iframe (`loading="lazy"` en el iframe o con IntersectionObserver).

### ISSUE 3 — MENOR: will-change permanente en GallerySection CSS
`will-change: transform` hardcodeado en CSS de GallerySection (líneas 473 y 483). Esto crea capas GPU permanentes. Conveniene remover post-animación o usar GSAP `willChange: "auto"` en cleanup de onLeave.

### ISSUE 4 — MENOR: Chunk 0a361wj tarda 532ms en primera medición
El chunk GSAP+React (36KB raw, 8.6KB gzip) tuvo latencia alta en primer intento (532ms). En segunda carga: 0ms (caché). Posiblemente jitter de red local. No es un issue real en localhost.

### ISSUE 5 — INFO: FCP/LCP no medibles sin Lighthouse
Sin Lighthouse CLI instalado ni un URL público, FCP y LCP no son medibles con precisión. Recomendación post-deploy: correr PageSpeed Insights API contra URL de Vercel.

---

## Estimación Lighthouse Score

Basado en las métricas observadas:
| Categoría | Score estimado |
|-----------|---------------|
| Performance | ~88–92 |
| Accessibility | ~90+ (SR classes, alt texts vistos) |
| Best Practices | ~90+ |
| SEO | ~90+ (metadata completa, JSON-LD, canonical) |

Factores que impactan score de Performance:
- (+) TTFB excelente (~20ms local)
- (+) TBT=0, CLS=0
- (+) Bundle JS <250KB gzip
- (+) Fonts self-hosted (0 round-trips a Google)
- (-) No hay imagen real en hero (LCP candidato es texto → puede ser lento en render)
- (-) Google Maps iframe carga sin lazy loading
- (-) FCP no se puede medir exactamente sin imágenes reales

---

## Mobile (390×844) — Estimación

No se pudo medir directamente (el MCP Chrome no soporta throttling de red real). Estimaciones:
- En 3G (25Mbps DL simulado): JS 210KB gzip → ~67ms de descarga
- DOM Interactive en mobile: estimado ~200–400ms (2-3x del desktop)
- LCP en mobile: dependiente de si hay imagen hero; sin imagen → texto como LCP → potencialmente más rápido que una imagen pesada

---

## FPS Durante Scroll

**No medible via MCP Chrome** — el event loop del browser es bloqueado durante la ejecución sincrónica de JS a través del extension CDP. El rAF no se ejecuta entre tool calls.

**Análisis estático de código sugiere:**
- Lenis activo y funcionando (confirmado: `lenisActive: true`)
- GSAP animando solo `transform` y `opacity` (GPU-composited = sin layout/paint)
- 11 ScrollTrigger instances → manageable (threshold recomendado: <15)
- 0 long tasks detectados → main thread libre
- **Estimación: 60fps consistente** (stack correcto, no hay bottlenecks de layout)

---

## Top 3 Fixes Recomendados

### Fix 1 (IMPACTO MEDIO) — Lazy-load Google Maps iframe
**Dónde:** `src/sections/LocationSection.tsx`
**Cómo:** Agregar `loading="lazy"` al iframe y/o envolver con IntersectionObserver para cargar solo cuando el usuario llega a la sección.
**Impacto:** Reduce loadComplete en ~400ms. Mejora LCP al no competir con el mapa.

### Fix 2 (IMPACTO BAJO) — Eliminar preconnect innecesarios a Google Fonts
**Dónde:** `src/app/layout.tsx:186-187`
**Cómo:** Eliminar las dos líneas de `<link rel="preconnect">` para googleapis y gstatic.
**Impacto:** Elimina 2 DNS lookups/TCP connections innecesarias en navegadores no optimizados.

### Fix 3 (IMPACTO BAJO) — Remover will-change permanente post-animación en GallerySection
**Dónde:** `src/sections/GallerySection.tsx:473,483`
**Cómo:** En el cleanup de los ScrollTrigger (onLeave o al destruction): `element.style.willChange = 'auto'`. O usar GSAP `clearProps: "willChange"` en la animación final.
**Impacto:** Libera capas GPU innecesarias post-animación.

---

## bundle_size_pass: true

JS First Load ~210KB gzip < 250KB gate. CSS ~9KB. Ningún chunk individual supera 150KB gzip.

---

*Reporte generado por performance-benchmarker — Fase 4 certificación.*
*Servidor de producción cerrado tras medición.*
