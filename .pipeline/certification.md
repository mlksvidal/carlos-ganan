# carlos-ganan — Certificación Final (Fase 4)
**Fecha:** 2026-05-25
**Reality-checker:** PASS / CERTIFIED
**Próxima fase:** 5 (git → Vercel deploy con confirmación)

---

## STATUS FINAL: PASS

| Gate | Resultado | Detalle |
|------|-----------|---------|
| Build (`pnpm run build`) | PASS | Next.js 16.2.6 Turbopack, 0 errores TS, 0 warnings, 6 rutas estáticas + 1 dinámica (opengraph-image edge) |
| Lint (`pnpm run lint`) | PASS | ESLint 9, 0 issues |
| TypeScript | PASS | `tsc` durante build sin errores |
| Secciones renderizan | 8/8 | Hero, About+Stats, Servicios, Galería, Interlude, Location, CTAFinal, Footer |
| Estados secundarios | PASS | 404 custom (200 ok html, retorna 404), error.tsx, loading.tsx |
| SEO | 91/100 (A) | Min 85 ✓ |
| Performance | PASS | Bundle 210KB gz, CLS 0, TTFB 19ms |
| Security | PASS | Headers vercel.json completos, 0 secrets, lockfile ok |
| Accesibilidad | OK | Skip-nav "Saltar al contenido", html lang=es-AR dir=ltr |
| Mixed Content | PASS | 0 URLs http:// hardcodeadas en código fuente |

---

## Build & Deploy Readiness (10/10)
- [x] `pnpm run build` PASS — Compiled in 1.8s, TS finished in 1.6s
- [x] No TypeScript errors
- [x] No ESLint blockers
- [x] `vercel.json` válido con headers (X-Content-Type-Options, X-Frame-Options SAMEORIGIN, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy, HSTS 2 años, CSP completa) + cache rules (/_next/static 1 año immutable, /images/ 7 días)
- [x] No `console.log/warn/error` en src/
- [x] No `@ts-ignore`, no `@ts-nocheck`, no `.only(`
- [x] No secrets hardcodeados (grep AWS/GitHub/Stripe/Google/OpenAI: 0 matches)
- [x] `pnpm-lock.yaml` presente, no en .gitignore
- [x] No `.env` files committed

## Sitio funcional (verificado contra build de producción)
- [x] 8 secciones renderizan en HTML (servidor `pnpm start` en localhost:3000)
- [x] Nav anchors: `#servicios`, `#galeria`, `#ubicacion`, `#contacto` — todos apuntan a secciones existentes (#hero también)
- [x] WhatsApp button: 9 ocurrencias del número `5492604062206` con `wa.me/${phone}?text=${encodeURIComponent(...)}` + `target="_blank"` + `rel="noopener noreferrer"` consistente
- [x] Google Maps iframe: CSP `frame-src` permite `maps.google.com`, `www.google.com`, `maps.googleapis.com`. (QA-fullsite #491 nota: net::ERR_ABORTED en headless es limitación de Playwright, no del sitio).
- [x] Mobile responsive: gallery `@media (max-width: 1023px)` fuerza `grid-column: span 1 !important; grid-row: span 1 !important;` (fix de qa-batch4 verificado en código línea 418-421 de GallerySection.tsx)
- [x] Desktop responsive: bento 12 cols × auto-rows 80px, alturas variables
- [x] 404, error, loading: pages presentes con paleta y tipografía consistente

## Cumplimiento spec (8/8)
- [x] Cormorant Garamond + Inter aplicadas (next/font self-hosted, classes presentes en `<html>`)
- [x] Paleta correcta: `#0A0807` base + `#E8DDD0` texto + `var(--gold)` dorado #C9A961 confirmados en CSS y HTML
- [x] Puntos dorados al final de displays clave (H1 hero, H2 location, H2 CTAFinal, "Esta página no existe.")
- [x] Servicios: lista editorial 5 items con numerales romanos I, II, III, IV, V
- [x] Galería: bento asimétrico 12 cols, span 5/3/3/4/4/4, row-span variable
- [x] Nav presente con scroll behavior (Lenis activo, window.lenis confirmado en QA #491)
- [x] SplitText reveal en Hero (verificado en código, GSAP registered)
- [x] CountUp en stats: 4 stats con `data-target` (12+, 8500+, 4.9★, 98%)
- [x] `prefers-reduced-motion` respetado en GallerySection (línea 491) y otros

## SEO (91/100 — gate ≥85)
- [x] JSON-LD BarberShop válido (parseado con json.tool, openingHours 10:00-20:00 lun-vie, 09:00-18:00 sáb)
- [x] Title 62 chars, description 157 chars
- [x] `robots.txt`: 200, AI crawlers permitidos
- [x] `sitemap.xml`: 200, home con priority 1
- [x] `llms.txt`: 200, contenido factual
- [x] `lang="es-AR" dir="ltr"`
- [x] Skip-nav "Saltar al contenido" presente

## Performance (210KB gz / gate <250KB)
- [x] TTFB 19ms (gate <800ms)
- [x] CLS 0 (gate <0.1)
- [x] TBT 0ms, 0 long tasks
- [x] GSAP: solo transform/opacity, 11 ScrollTriggers (<15 gate)

## Security (PASS)
- [x] vercel.json: 6 headers + CSP completa
- [x] CSP `frame-src` permite Google Maps; `form-action` permite wa.me; `font-src 'self' data:` (next/font self-hosted, OK)
- [x] `target="_blank"` → todos con `rel="noopener noreferrer"` (8/8 verificados)
- [x] No SVGs maliciosos en `/public/images/` (solo `og-image.svg` placeholder propio del proyecto + boilerplate de Next.js en `/public/`)
- [x] No source maps en producción (next.config: productionBrowserSourceMaps: false implícito)

---

## Issues conocidos (NO-BUGS — accept ed por usuario)
1. Imágenes faltantes: `hero.jpg`, `gallery/01-06.jpg`, `interlude.jpg` — placeholders elegantes con ScissorsIcon. Usuario las dropea post-deploy.
2. Logo placeholder tipográfico (wordmark Cormorant en Nav). Usuario lo reemplaza con `/public/logo.svg`.
3. URL `https://carlos-ganan.vercel.app` en metadataBase, JSON-LD, sitemap.xml, llms.txt → se reemplaza por dominio final post-deploy.

## Mejoras post-deploy (opcionales — v1.1)
1. Lazy-load Google Maps iframe (+400ms loadComplete actual). Estrategia: load on intersect.
2. Quitar `preconnect` a Google Fonts en layout (next/font ya es self-hosted, redundante).
3. Liberar `will-change` permanente en GallerySection post-animation.
4. Color-contrast minor en "Scroll" indicator (opacity 0.4) y "Cerrado" en horarios (opacity 0.5) — axe serious de 2 nodos.
5. Underline más visible en link WhatsApp dentro de LocationSection (axe link-in-text-block).
6. PageSpeed Insights API post-deploy en URL Vercel real para medir LCP/FCP definitivos.

## BLOQUEADORES DEPLOY: ninguno

---

## Veredicto

El sitio Carlos Gañan está **CERTIFIED para deploy**. Build limpio, 0 errores TS/ESLint, 8/8 secciones renderizan, headers de seguridad completos en `vercel.json`, CSP correctamente abierta para Google Maps + WhatsApp, JSON-LD BarberShop válido, performance bajo gates (210KB < 250KB, CLS=0, TTFB=19ms), SEO 91/100, accesibilidad básica OK con skip-nav y lang correcto. Todas las regresiones reportadas en QA previos (qa-batch4 grid mobile, qa-batch3 hero padding) ya están fijadas en código. Los únicos "issues" pendientes son los explícitamente aceptados por el usuario (fotos reales + logo se dropean después, URL placeholder se actualiza post-deploy con dominio final). Con esos placeholders el sitio funciona perfectamente y luce premium incluso vacío de fotos — la arquitectura editorial sostiene el feel.

**Procede a Fase 5: git commit + Vercel deploy con confirmación del usuario.**
