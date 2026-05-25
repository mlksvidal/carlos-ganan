/**
 * opengraph-image.tsx — OG Image dinámica con Next.js ImageResponse.
 *
 * Next.js genera esta imagen automáticamente en la ruta /opengraph-image
 * y la registra como og:image en el metadata del layout.
 *
 * Dimensiones estándar: 1200x630 (requisito de la mayoría de plataformas).
 * Usa el Edge Runtime — no requiere @vercel/og por separado (incluido en Next.js 16).
 *
 * NOTA: esta ruta coexiste con el og:image declarado en metadata (layout.tsx).
 * Si se desea usar solo la imagen dinámica, remover la entrada `images` de
 * openGraph en metadata. Por ahora ambas conviven — la de metadata tiene prioridad
 * para la URL absoluta ya que apunta a /og-image.jpg (archivo estático futuro).
 * Esta ruta sirve como fallback dinámico de alta calidad.
 */
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Carlos Gañan — Barbería Premium San Rafael, Mendoza";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#0A0807",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Fondo con gradiente dorado sutil */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 25% 50%, rgba(201,169,97,0.12) 0%, transparent 65%)",
          }}
        />

        {/* Línea dorada decorativa */}
        <div
          style={{
            width: "120px",
            height: "1px",
            backgroundColor: "#C9A961",
            marginBottom: "24px",
            opacity: 0.7,
          }}
        />

        {/* Eyebrow */}
        <p
          style={{
            fontSize: "13px",
            color: "#C9A961",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "28px",
            fontFamily: "Georgia, serif",
          }}
        >
          BARBERÍA PREMIUM · SAN RAFAEL, MENDOZA
        </p>

        {/* Título */}
        <h1
          style={{
            fontSize: "80px",
            fontWeight: 300,
            color: "#E8DDD0",
            lineHeight: 1.05,
            letterSpacing: "-1px",
            marginBottom: "20px",
            fontFamily: "Georgia, serif",
          }}
        >
          Carlos Gañan
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: "28px",
            fontStyle: "italic",
            color: "#E8DDD0",
            opacity: 0.75,
            marginBottom: "40px",
            fontFamily: "Georgia, serif",
          }}
        >
          El detalle también comunica.
        </p>

        {/* Separador */}
        <div
          style={{
            width: "60px",
            height: "1px",
            backgroundColor: "#C9A961",
            marginBottom: "28px",
            opacity: 0.5,
          }}
        />

        {/* Dirección */}
        <p
          style={{
            fontSize: "16px",
            color: "#9A8E82",
            letterSpacing: "1px",
            fontFamily: "Georgia, serif",
          }}
        >
          San Lorenzo 269 · San Rafael, Mendoza, Argentina
        </p>

        {/* CTA badge */}
        <div
          style={{
            marginTop: "40px",
            backgroundColor: "#C9A961",
            padding: "14px 28px",
            display: "flex",
            alignItems: "center",
            width: "fit-content",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#0A0807",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            RESERVAR TURNO
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
