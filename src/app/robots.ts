import type { MetadataRoute } from "next";

/**
 * robots.ts — Política de crawlers para Carlos Gañan Barbería.
 *
 * Estrategia: permisivo para todos los crawlers, incluyendo IA.
 * Disallowed: nada — es una landing one-page completamente pública.
 *
 * Crawlers de IA explícitamente permitidos (best practice GEO 2025):
 * - GPTBot (OpenAI / ChatGPT)
 * - Google-Extended (Gemini / AI Overviews de Google)
 * - anthropic-ai (Claude)
 * - CCBot (Common Crawl — base de datos de entrenamiento)
 * - PerplexityBot
 * - Applebot-Extended (Apple Intelligence)
 * - FacebookBot (Meta AI)
 *
 * TODO (post-deploy): reemplazar https://carlos-ganan.vercel.app
 * por el dominio final.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://carlos-ganan.vercel.app"; // TODO: reemplazar por dominio final

  return {
    rules: [
      // Todos los crawlers — permitir todo
      {
        userAgent: "*",
        allow: "/",
      },
      // Crawlers de IA — explícitamente permitidos (refuerzo semántico)
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
      },
      {
        userAgent: "CCBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
      },
      {
        userAgent: "FacebookBot",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
