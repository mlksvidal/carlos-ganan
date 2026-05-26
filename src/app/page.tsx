/**
 * page.tsx — Landing principal Carlos Gañan
 *
 * Batch 2 completado: Nav (T5) + Hero (T6-T7)
 * Batch 3 completado: Servicios (T9-T10)  [AboutSection removida por request del cliente]
 * Batch 4 completado: Instagram embed (T11-T12)
 * Batch 5 completado: Interlude + Ubicación + CTA Final (T13-T15)
 */
import { HeroSection } from '@/sections/HeroSection';
import { ServicesSection } from '@/sections/ServicesSection';
import { GallerySection } from '@/sections/GallerySection';
import { InterludeSection } from '@/sections/InterludeSection';
import { LocationSection } from '@/sections/LocationSection';
import { CTAFinalSection } from '@/sections/CTAFinalSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function Home() {
  return (
    <>
      {/* ─── Hero ──────────────────────────────────────────── */}
      <HeroSection />

      {/* ─── Servicios ────────────────────────────────────── */}
      <ServicesSection />

      {/* ─── Instagram ────────────────────────────────────── */}
      <GallerySection />

      {/* ─── Interlude — "No es solo un corte" ───────────── */}
      <InterludeSection />

      {/* ─── Ubicación + Horarios ─────────────────────────── */}
      <LocationSection />

      {/* ─── CTA Final — "Tu próxima visita" ─────────────── */}
      <CTAFinalSection />

      {/* ─── WhatsApp flotante — solo mobile ─────────────── */}
      <WhatsAppButton variant="floating" />
    </>
  );
}
