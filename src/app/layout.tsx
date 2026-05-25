import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { LenisProvider } from "@/components/LenisProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

/* ─── JSON-LD LocalBusiness ────────────────────────────────────────── */

/**
 * Schema.org BarberShop (subtype de LocalBusiness).
 * BarberShop es un tipo válido en schema.org — más preciso que HairSalon.
 *
 * Coordenadas: aproximadas para San Lorenzo 269, San Rafael, Mendoza.
 * TODO (post-deploy): verificar coordenadas exactas en Google Maps
 * y reemplazar -34.6178, -68.3295 por los valores confirmados.
 *
 * TODO (post-deploy): reemplazar https://carlos-ganan.vercel.app
 * por el dominio final cuando esté disponible.
 */
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: "Carlos Gañan — Barbería Premium",
  description:
    "Barbería premium en San Rafael, Mendoza. Cortes clásicos, arreglo de barba y experiencia de alta precisión artesanal. Más de 12 años de trayectoria.",
  url: "https://carlos-ganan.vercel.app", // TODO: reemplazar por dominio final
  telephone: "+54-9-2604-06-2206",
  priceRange: "$$$",
  image: "https://carlos-ganan.vercel.app/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "San Lorenzo 269",
    addressLocality: "San Rafael",
    addressRegion: "Mendoza",
    postalCode: "M5600",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    // TODO: verificar coordenadas exactas — estas son aproximadas para el centro de San Rafael
    latitude: -34.6178,
    longitude: -68.3295,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: [], // TODO: agregar URLs de redes sociales si las hay
  hasMap: "https://www.google.com/maps/search/?api=1&query=San+Lorenzo+269%2C+San+Rafael%2C+Mendoza%2C+Argentina",
  areaServed: {
    "@type": "City",
    name: "San Rafael",
  },
  knowsAbout: [
    "Corte de cabello",
    "Arreglo de barba",
    "Barbería masculina",
    "Corte clásico",
    "Ritual de barba",
  ],
};

/* ─── next/font — self-hosted, sin request a fonts.googleapis.com ─── */

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
});

/* ─── Metadata SEO ─────────────────────────────────────────────────── */

/**
 * Keyword mapping (anti-canibalización) — landing one-page:
 *   /  → keyword primaria: "barbería Carlos Gañan San Rafael"
 *       keywords secundarias: "corte de cabello San Rafael", "barbero Mendoza"
 *
 * Title: 62 chars — keyword primaria al inicio
 * Description: 157 chars — incluye keyword primaria + secundaria + CTA implícito
 *
 * TODO (post-deploy): reemplazar https://carlos-ganan.vercel.app
 * por el dominio final (ej: https://carlosganan.com.ar) en metadataBase,
 * openGraph.url y la constante localBusinessJsonLd.url.
 */
export const metadata: Metadata = {
  title: "Barbería Carlos Gañan · San Rafael, Mendoza | Cortes Premium",
  description:
    "Barbería premium en San Rafael, Mendoza. Cortes clásicos, arreglo de barba y experiencia artesanal de alta precisión. Reservá tu turno por WhatsApp.",
  keywords: [
    "barbería premium San Rafael",
    "barbero San Rafael Mendoza",
    "corte de cabello San Rafael",
    "barbería masculina Mendoza",
    "Carlos Gañan barbero",
    "arreglo de barba San Rafael",
  ],
  authors: [{ name: "Carlos Gañan" }],
  creator: "Carlos Gañan",
  // TODO: reemplazar por dominio final post-deploy
  metadataBase: new URL("https://carlos-ganan.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    // TODO: reemplazar por dominio final post-deploy
    url: "https://carlos-ganan.vercel.app",
    siteName: "Carlos Gañan — Barbería Premium",
    title: "Barbería Carlos Gañan · San Rafael, Mendoza | Cortes Premium",
    description:
      "Barbería premium en San Rafael, Mendoza. Cortes clásicos, arreglo de barba y experiencia artesanal de alta precisión. Reservá tu turno por WhatsApp.",
    // OG image generada dinámicamente por /src/app/opengraph-image.tsx
    // Next.js la resuelve automáticamente — no necesita declararse aquí explícitamente.
    // Si necesitás forzar una URL absoluta estática (ej. para preview local),
    // descomenta y completá:
    // images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Carlos Gañan — Barbería Premium San Rafael" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barbería Carlos Gañan · San Rafael, Mendoza | Cortes Premium",
    description:
      "Barbería premium en San Rafael, Mendoza. Cortes clásicos y arreglo de barba. Reservá tu turno por WhatsApp.",
    // Twitter image también resuelta automáticamente desde opengraph-image.tsx
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

/* ─── Root Layout ──────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      dir="ltr"
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <head>
        {/* Apple Web App — PWA ready en iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Preconnect a WhatsApp API (único dominio externo de acción crítica) */}
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://api.whatsapp.com" />
        {/* JSON-LD — LocalBusiness (BarberShop) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </head>
      <body>
        {/* Skip to content — WCAG 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[700] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-[var(--gold)] focus:text-[var(--text-inverse)] focus:text-sm focus:font-medium"
        >
          Saltar al contenido principal
        </a>

        <noscript>
          <p style={{ padding: "1rem", color: "#E8DDD0", background: "#0A0807", textAlign: "center" }}>
            Este sitio requiere JavaScript para funcionar correctamente.
          </p>
        </noscript>

        <LenisProvider>
          {/* Nav — top fija, transparente al inicio, blur al scroll */}
          <Nav />
          <main id="main-content">
            {children}
          </main>
          {/* Footer — siempre presente en todas las rutas */}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
