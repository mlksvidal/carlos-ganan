# Security Spec — carlos-ganan

**Tipo**: Landing estática Next.js 16 + Tailwind 4, deploy Vercel
**Backend**: NO (sin DB, sin auth, sin formularios)
**Único CTA externo**: WhatsApp wa.me link

---

## 1. STRIDE — Threat Model acotado a landing estática

| Amenaza | Componente | Riesgo | Aplicable | Mitigación |
|---------|-----------|--------|-----------|------------|
| **S — Spoofing** | Links externos `target="_blank"` (WhatsApp, Google Maps si aplica) | Tab-nabbing: sitio externo accede a `window.opener` y redirige pestaña original | SÍ | `rel="noopener noreferrer"` obligatorio en TODO `<a target="_blank">` |
| **S — Spoofing** | Dominio (phishing del negocio) | Atacante crea dominio similar y suplanta | BAJO (fuera de alcance dev) | HSTS preload + dominio oficial registrado |
| **T — Tampering** | Assets estáticos (JS/CSS/imágenes) | MITM modifica recursos en tránsito | BAJO (Vercel = HTTPS only) | HSTS + Vercel default TLS |
| **T — Tampering** | Dependencias npm (supply chain) | Paquete comprometido se cuela en build | MEDIO | `lockfile-lint` en CI, `npm audit` en Fase 4, lockfile commiteado |
| **R — Repudiation** | N/A (no hay acciones de usuario que requieran audit) | — | NO | — |
| **I — Info Disclosure** | Source maps en producción | `*.map` exponen código fuente original | MEDIO | Verificar `next.config.js` no genere source maps en prod, o que Vercel los bloquee |
| **I — Info Disclosure** | Logs / comentarios HTML | Comentarios con info interna en HTML servido | BAJO | Build de producción minifica y elimina |
| **I — Info Disclosure** | Headers verbose (X-Powered-By) | Revela stack | BAJO | Next.js: `poweredByHeader: false` en `next.config.js` |
| **D — DoS** | Vercel edge / CDN | Ataque volumétrico | BAJO | Vercel maneja DDoS protection por default |
| **D — DoS** | Imágenes pesadas no optimizadas | Lentitud, mala UX, costos | MEDIO | `next/image` + lint de assets (ver §5) |
| **E — Elevation** | N/A (no hay roles ni auth) | — | NO | — |
| **XSS — bonus** | WhatsApp link con query param `text=` | Query mal construida o no URL-encoded podría romper o inyectar | BAJO-MEDIO | Usar `encodeURIComponent()` en mensaje (ver §4) |
| **XSS — bonus** | SVGs subidos en `/public/images/` | SVG puede contener `<script>` ejecutable | MEDIO | Bloquear SVG en lint de assets (solo .webp/.jpg/.png) |

**Conclusión STRIDE**: superficie de ataque mínima. Riesgos reales = tab-nabbing en links externos, supply chain en deps, SVGs maliciosos en `/public/images/`.

---

## 2. Headers de seguridad — `vercel.json` listo para copy-paste

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://wa.me https://api.whatsapp.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://wa.me; upgrade-insecure-requests"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=604800"
        }
      ]
    }
  ]
}
```

### Notas sobre CSP
- **`'unsafe-inline'` en script-src**: requerido para Next.js inline scripts y GSAP timelines inline. Si frontend-developer usa nonces (`next.config.js` + custom `_document`), reemplazar por `'nonce-XXX'`.
- **`cdn.jsdelivr.net` y `unpkg.com`**: solo si GSAP se carga vía CDN. Si se instala vía `npm install gsap` (recomendado), eliminar esos hosts del script-src.
- **`fonts.googleapis.com` + `fonts.gstatic.com`**: requerido si se usan Google Fonts. Si se usa `next/font` (recomendado), se sirve self-hosted y se pueden remover.
- **`form-action https://wa.me`**: permite que el formulario apunte a WhatsApp (aunque acá son `<a>` no `<form>`, lo dejo por defensa en profundidad).
- **`upgrade-insecure-requests`**: fuerza HTTPS en cualquier subrecurso `http://` accidental.

### `next.config.js` — headers complementarios
```javascript
const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false, // NO exponer source maps
  reactStrictMode: true,
};
```

---

## 3. OWASP Top 10 — Checklist filtrado (landing estática)

| ID | Categoría | Aplica | Mitigación concreta |
|----|-----------|--------|---------------------|
| A01 | Broken Access Control | **NO** | No hay rutas privadas ni recursos protegidos |
| A02 | Cryptographic Failures | **PARCIAL** | HTTPS por default en Vercel + HSTS. No hay secrets que cifrar |
| A03 | Injection | **NO** | No hay DB, no hay backend, no hay queries SQL |
| A04 | Insecure Design | **NO** | Threat model completado en §1 |
| **A05** | **Security Misconfiguration** | **SÍ** | Headers via `vercel.json` (§2), `poweredByHeader: false`, no source maps en prod, `noindex` en cualquier preview deploy |
| **A06** | **Vulnerable & Outdated Components** | **SÍ** | `npm audit --audit-level=high` en CI; `lockfile-lint` para prevenir supply chain; pinning de versiones; dependabot/renovate |
| A07 | Identification & Auth Failures | **NO** | Sin auth |
| A08 | Software & Data Integrity Failures | **PARCIAL** | Lockfile commiteado, SRI en CDN scripts si se usan (ver §2) |
| **A09** | **Security Logging & Monitoring Failures** | **SÍ-mínimo** | Vercel Analytics + Web Vitals. NO loguear datos sensibles (no aplica porque no hay datos). Sentry opcional para errores client-side sin PII |
| A10 | SSRF | **NO** | No hay fetch de URLs controladas por usuario |

### A05 — checklist específico
- [ ] `vercel.json` con headers (§2)
- [ ] `next.config.js`: `poweredByHeader: false`, `productionBrowserSourceMaps: false`
- [ ] Preview deploys: header `X-Robots-Tag: noindex, nofollow` (Vercel preview por default no se indexa, pero verificar)
- [ ] CORS no aplica (sin API)
- [ ] No `.env` en repo (solo `.env.example` con keys vacías)

### A06 — checklist específico
- [ ] `npm audit --audit-level=high` antes de deploy (Fase 4)
- [ ] `npx lockfile-lint --allowed-hosts npm --allowed-schemes https: --type npm --path package-lock.json` en Fase 4
- [ ] Pinear versiones exactas en `package.json` (sin `^` ni `~` para deps críticas)
- [ ] No instalar deps que no se usen
- [ ] GSAP: instalar desde npm (no CDN) para tener control de versión

---

## 4. WhatsApp link — validación de seguridad

### Formato canónico
```
https://wa.me/5492604062206?text={mensaje_url_encoded}
```

### Reglas obligatorias para frontend-developer
1. **Número en formato internacional sin `+`, sin espacios, sin guiones**: `5492604062206` (Argentina = 54, área SR = 9 2604, número = 062206)
2. **Mensaje SIEMPRE URL-encoded** con `encodeURIComponent()`:
   ```javascript
   const phone = '5492604062206';
   const message = encodeURIComponent('Hola Carlos, quisiera reservar un turno para corte + barba');
   const waLink = `https://wa.me/${phone}?text=${message}`;
   ```
3. **NUNCA construir el mensaje concatenando input del usuario**: la landing no tiene formularios, pero si en el futuro se agregan, NO meter `${userInput}` directo en el `text=` sin `encodeURIComponent`.
4. **Mensaje hardcodeado por servicio**: cada CTA puede tener su mensaje predefinido (ej. "Hola Carlos, quisiera reservar Corte Clásico"), pero todos pasan por `encodeURIComponent`.
5. **`rel="noopener noreferrer"`** + **`target="_blank"`** en todos los `<a>` que apunten a `wa.me`.

### Plantilla TSX recomendada
```tsx
// components/WhatsAppButton.tsx
const WA_PHONE = '5492604062206';

export function WhatsAppButton({ service }: { service?: string }) {
  const baseMessage = service
    ? `Hola Carlos, quisiera reservar: ${service}`
    : 'Hola Carlos, quisiera reservar un turno';

  const href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(baseMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Reservar turno por WhatsApp"
    >
      Reservar turno
    </a>
  );
}
```

### Validación de input (futuro)
Si en el futuro se agrega un campo libre de texto:
- Validar longitud (máx 500 chars)
- Rechazar caracteres de control (`\x00-\x1f`)
- Whitelist de caracteres alfanuméricos + puntuación común
- Servir-side validation no aplica (es estático), pero el cliente sigue siendo zona hostile — limitar UI

---

## 5. Imágenes user-replaceable — Lint de assets en `/public/images/`

El usuario reemplazará fotos en `/public/images/` con fotos reales de la barbería. Esto es un vector de riesgo si se sube SVG con scripts, o imágenes gigantes que rompan performance.

### Reglas obligatorias
1. **Formatos permitidos**: `.webp`, `.jpg`, `.jpeg`, `.png`, `.avif`
2. **Formato PROHIBIDO**: `.svg` (puede contener `<script>` o `<foreignObject>` con XSS)
   - Excepción: SVGs del designer (logos, íconos) que pasan por sanitización manual y se sirven como componentes React, no desde `/public/`
3. **Peso máximo por imagen**:
   - Hero / fullscreen: 400 KB (después de optimización)
   - Galería / cards: 200 KB
   - Thumbnails: 50 KB
4. **Dimensiones máximas**: 2400px lado más largo (Next.js Image se encarga de servir tamaños responsive)
5. **Metadata EXIF**: limpiar antes de subir (puede contener geolocalización del cliente real)

### Script de lint recomendado — `scripts/lint-assets.js`
```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const ALLOWED_EXT = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);
const BLOCKED_EXT = new Set(['.svg', '.gif', '.bmp', '.tiff']);
const MAX_SIZE = {
  hero: 400 * 1024,
  default: 200 * 1024,
};

let errors = 0;

function lintDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      lintDir(full);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    const stat = fs.statSync(full);

    if (BLOCKED_EXT.has(ext)) {
      console.error(`BLOCKED ext: ${full} (${ext} not allowed — possible XSS via SVG)`);
      errors++;
      continue;
    }
    if (!ALLOWED_EXT.has(ext)) {
      console.error(`UNKNOWN ext: ${full} (${ext})`);
      errors++;
      continue;
    }

    const isHero = entry.name.toLowerCase().includes('hero');
    const limit = isHero ? MAX_SIZE.hero : MAX_SIZE.default;
    if (stat.size > limit) {
      console.error(`TOO BIG: ${full} (${(stat.size / 1024).toFixed(1)} KB > ${limit / 1024} KB)`);
      errors++;
    }

    // Detectar SVG malicioso aunque tenga otra extensión
    if (stat.size < 200_000) {
      const head = fs.readFileSync(full, { encoding: 'utf8' }).slice(0, 500).toLowerCase();
      if (head.includes('<svg') || head.includes('<script')) {
        console.error(`SUSPICIOUS content (SVG-like or script) in: ${full}`);
        errors++;
      }
    }
  }
}

lintDir(IMAGES_DIR);

if (errors > 0) {
  console.error(`\n${errors} asset error(s) found.`);
  process.exit(1);
} else {
  console.log('All assets OK.');
}
```

Agregar a `package.json`:
```json
{
  "scripts": {
    "lint:assets": "node scripts/lint-assets.js",
    "prebuild": "npm run lint:assets"
  }
}
```

Esto bloquea el build si hay un SVG en `/public/images/` o una imagen mayor al límite.

### Optimización recomendada (no es seguridad pero evita DoS por peso)
- Usar `next/image` siempre — nunca `<img>`
- `priority` solo en imagen LCP (hero)
- `sizes` responsive para que el browser pida el tamaño correcto

---

## 6. Checklist final para frontend-developer

- [ ] Todo `<a target="_blank">` lleva `rel="noopener noreferrer"`
- [ ] WhatsApp links: número `5492604062206` sin `+` ni espacios, mensaje con `encodeURIComponent`
- [ ] No usar `dangerouslySetInnerHTML` en ningún componente (no hace falta acá)
- [ ] No instalar deps no usadas; pinear versiones de GSAP/Lenis/SplitText
- [ ] Usar `next/font` (Cormorant, Cinzel) en lugar de Google Fonts via `<link>` — evita request a fonts.googleapis.com y elimina necesidad de ese host en CSP
- [ ] GSAP/Lenis/ScrollTrigger via `npm install` (NO via CDN script)
- [ ] No commitear `.env*` (solo `.env.example`)
- [ ] No dejar `console.log` ni comentarios HTML con info sensible

## 7. Checklist final para evidence-collector / reality-checker / Fase 4

- [ ] Headers HTTP responden con los valores de `vercel.json` (verificar con `curl -I https://carlos-ganan.vercel.app/`)
- [ ] HSTS presente con `preload`
- [ ] CSP no bloquea recursos legítimos (revisar consola del browser)
- [ ] `*.map` files NO accesibles via HTTP (404 en `https://carlos-ganan.vercel.app/_next/static/chunks/main.js.map`)
- [ ] `npm audit --audit-level=high` → 0 vulnerabilidades
- [ ] `lockfile-lint` pasa
- [ ] `lint:assets` pasa en build de producción
- [ ] Todos los WhatsApp links abren correctamente con mensaje pre-cargado
- [ ] Lighthouse Security audit ≥ 90

## 8. Recomendaciones para git-agent / deployer (no implementar acá)

- Pinear GitHub Actions a SHA (no a tags mutables)
- Habilitar CodeQL SAST en el repo
- Vercel: habilitar "Vercel Authentication" para preview deploys (evitar indexación)
- Configurar dependabot para alertas de vulnerabilidades

---

**Resumen ejecutivo**: superficie de ataque mínima (landing estática sin backend). Tres riesgos reales: tab-nabbing en links externos (mitigado con `rel="noopener noreferrer"`), supply chain en deps (mitigado con `lockfile-lint` + `npm audit`), SVGs maliciosos en `/public/images/` (mitigado con script `lint:assets`). Headers de seguridad en `vercel.json` cubren el resto.
