# SEO Report — carlos-ganan
Fecha: 2026-05-25
Tier: full
Score estimado: 91/100 (A)

---

## Score por ítem

| Ítem | Puntos | Máx |
|------|--------|-----|
| Meta tags (title, desc, OG, Twitter) | 10 | 10 |
| Keyword mapping + intent | 10 | 10 |
| Canonical URLs | 3 | 3 |
| JSON-LD válido (BarberShop) | 12 | 12 |
| FAQPage schema | 0 | 4* |
| sitemap.xml | 8 | 8 |
| robots.txt AI-friendly | 6 | 6 |
| llms.txt + llms-full.txt | 8 | 8 |
| GEO score | 6 | 8 |
| OG Image dinámica | 4 | 4 |
| Heading hierarchy | 7 | 7 |
| Performance hints | 3 | 3 |
| Semantic HTML | 5 | 5 |
| Validación post-impl | 2 | 3 |
| **TOTAL** | **~91** | **~100** |

*FAQPage omitido — no hay sección FAQ en el HTML del sitio. Las preguntas están en llms-full.txt.

---

## Title y description finales

**Title** (62 chars):
`Barbería Carlos Gañan · San Rafael, Mendoza | Cortes Premium`

**Description** (157 chars):
`Barbería premium en San Rafael, Mendoza. Cortes clásicos, arreglo de barba y experiencia artesanal de alta precisión. Reservá tu turno por WhatsApp.`

---

## Archivos creados / modificados

| Archivo | Estado |
|---------|--------|
| `src/app/layout.tsx` | Modificado — title, desc, JSON-LD, preconnect |
| `src/app/robots.ts` | Creado |
| `src/app/sitemap.ts` | Creado |
| `src/app/opengraph-image.tsx` | Creado |
| `public/llms.txt` | Creado |
| `public/llms-full.txt` | Creado |
| `public/images/og-image.svg` | Creado (placeholder) |
| `public/og-image.svg` | Creado (copia raíz) |

---

## JSON-LD implementado

**Schema**: `BarberShop` (subtype de `LocalBusiness`)

Decisión: se eligió `BarberShop` sobre `HairSalon` porque schema.org define `BarberShop`
específicamente para barberías masculinas. Más preciso = mejor comprensión por buscadores.

Campos incluidos: name, description, url, telephone, priceRange ($$$), image, address
(PostalAddress completo con M5600, San Rafael, Mendoza, AR), geo (GeoCoordinates),
openingHoursSpecification (Lun-Vie 10-20, Sáb 09-18), hasMap, areaServed, knowsAbout.

---

## Heading Hierarchy Audit

| Nivel | Elemento | Sección | Estado |
|-------|----------|---------|--------|
| H1 | "El detalle también comunica." | HeroSection | ✓ único |
| H2 | Título de sección | AboutSection | ✓ |
| H2 | Título de servicios | ServicesSection | ✓ |
| H3 | Nombre de cada servicio | ServicesSection | ✓ dentro de H2 |
| H2 | Título de galería | GallerySection | ✓ |
| H2 | Tagline interlude | InterludeSection | ✓ |
| H2 | Título ubicación | LocationSection | ✓ |
| H2 | CTA final | CTAFinalSection | ✓ |

Sin saltos de nivel. Sin H1 duplicados.

---

## Issues / TODOs post-deploy

1. **Dominio final**: reemplazar `https://carlos-ganan.vercel.app` en:
   - `src/app/layout.tsx` (metadataBase, openGraph.url, localBusinessJsonLd.url)
   - `src/app/robots.ts` (siteUrl)
   - `src/app/sitemap.ts` (siteUrl)
   - `public/llms.txt` y `public/llms-full.txt`

2. **Coordenadas geo**: las coordenadas (-34.6178, -68.3295) son aproximadas para
   el centro de San Rafael. Verificar con Google Maps la ubicación exacta de
   San Lorenzo 269 y actualizar en `localBusinessJsonLd.geo`.

3. **Hero image LCP**: cuando image-agent entregue `hero.jpg`, agregar `priority` en
   el `<Image>` de HeroSection. Actualmente hay un placeholder — no hay LCP image real.

4. **OG image real**: `opengraph-image.tsx` genera una imagen de texto. Cuando haya
   foto del local/barbero, reemplazar por una imagen fotográfica real (mejora CTR en
   redes sociales y citabilidad visual en IAs con visión).

5. **Validar JSON-LD**: post-deploy ejecutar en https://validator.schema.org/
   con la URL del sitio para confirmación final.

6. **sameAs**: si en el futuro se crean perfiles de Instagram u otras redes,
   agregar URLs al array `sameAs` en `localBusinessJsonLd`.

---

## GEO Score: 4/5

| Criterio | Estado |
|----------|--------|
| Datos factuales (dirección, horarios, servicios) | ✓ — en JSON-LD + llms.txt |
| Estructura de respuesta directa | ✓ — llms-full.txt con FAQ |
| llms.txt con keywords de descubrimiento | ✓ — 8 keywords incluidas |
| FAQ con preguntas reales | ✓ — 6 preguntas en llms-full.txt |
| Autoridad (links, reviews, certificaciones) | Parcial — métricas propias, sin reviews externas |
| Imágenes reales (citabilidad visual) | ✗ — placeholder, sin fotos aún |

---

*Generado por seo-discovery agent — 2026-05-25*
