import type { MetadataRoute } from "next";

/**
 * sitemap.ts — Sitemap para Carlos Gañan Barbería.
 *
 * Landing one-page: una sola ruta pública (/). Los anchors de sección
 * (#hero, #servicios, #galeria, #ubicacion) no se indexan por separado
 * — son parte de la misma URL canónica.
 *
 * TODO (post-deploy): reemplazar https://carlos-ganan.vercel.app
 * por el dominio final.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://carlos-ganan.vercel.app"; // TODO: reemplazar por dominio final

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
