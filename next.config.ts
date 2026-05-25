import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Seguridad: no exponer X-Powered-By header
  poweredByHeader: false,

  // No exponer source maps en producción (security-spec §2)
  productionBrowserSourceMaps: false,

  reactStrictMode: true,

  // Optimización de imágenes — formatos modernos
  images: {
    formats: ["image/avif", "image/webp"],
    // Dominios externos si se necesitan en el futuro
    remotePatterns: [],
  },
};

export default nextConfig;
