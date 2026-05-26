/**
 * constants.ts — Datos del negocio Carlos Gañan
 *
 * Fuente única de verdad para toda la landing.
 * Cambiar aquí y se propaga a todos los componentes.
 */

/* ─── Identidad ────────────────────────────────────────────────────── */

export const BUSINESS_NAME = 'Carlos Gañan' as const;
export const BUSINESS_TAGLINE = 'El detalle también comunica.' as const;
export const BUSINESS_SLOGAN = 'No es solo un corte. Es tu presencia.' as const;
export const BUSINESS_EYEBROW = 'Barbería de autor en San Rafael' as const;
export const BUSINESS_LOCATION = 'San Rafael, Mendoza, Argentina' as const;

/* ─── Contacto ─────────────────────────────────────────────────────── */

/**
 * Número WhatsApp en formato internacional sin + ni espacios.
 * Argentina (+54) · Área San Rafael (9 2604) · Número (062206)
 * Formato requerido por wa.me: 5492604062206
 */
export const WHATSAPP_NUMBER = '5492604062206' as const;

/** Mensaje default pre-cargado al abrir WhatsApp */
export const WHATSAPP_MESSAGE = 'Hola Carlos, quisiera reservar un turno' as const;

export const ADDRESS = 'San Rafael, Mendoza, Argentina' as const;

/* ─── Horarios ─────────────────────────────────────────────────────── */

export interface HorarioItem {
  dias: string;
  horario: string;
}

export const HOURS: HorarioItem[] = [
  { dias: 'Lunes a Viernes', horario: '10:00 – 20:00' },
  { dias: 'Sábados', horario: '9:00 – 18:00' },
  { dias: 'Domingos', horario: 'Cerrado' },
] as const;

/* ─── Servicios ────────────────────────────────────────────────────── */

export interface Servicio {
  id: string;
  nombre: string;
  /** Descripción breve — se muestra en la lista de servicios */
  descripcion: string;
  /** Descripción editorial — copy de impacto para la sección ServicesSection */
  descripcionEditorial: string;
  duracion: string;
  /** Numeral romano — posición en la lista editorial */
  numeral: string;
}

export const SERVICES: Servicio[] = [
  {
    id: 'corte-clasico',
    nombre: 'Corte Clásico',
    descripcion: 'Corte preciso con tijera y máquina. Incluye lavado y secado.',
    descripcionEditorial: 'Tijera y máquina. La técnica refinada en cada milímetro.',
    duracion: '45 min',
    numeral: 'I',
  },
  {
    id: 'corte-barba',
    nombre: 'Corte + Barba',
    descripcion: 'Experiencia completa. Corte, perfilado de barba con navaja y arreglo definitivo.',
    descripcionEditorial: 'El ritual completo: corte de autor y barba diseñada al rostro.',
    duracion: '60 min',
    numeral: 'II',
  },
  {
    id: 'barba',
    nombre: 'Barba + Arreglo',
    descripcion: 'Definición, perfilado y acabado con navaja. Incluye toalla caliente.',
    descripcionEditorial: 'Diseño, afeitado y aceites premium para una barba que dice algo.',
    duracion: '30 min',
    numeral: 'III',
  },
  {
    id: 'nino',
    nombre: 'Corte Niños',
    descripcion: 'Para los más jóvenes. Atención personalizada, resultado impecable.',
    descripcionEditorial: 'Su primer corte importa. Paciencia, juego y un buen resultado.',
    duracion: '30 min',
    numeral: 'IV',
  },
  {
    id: 'ritual',
    nombre: 'Ritual Completo',
    descripcion: 'Corte, barba, tratamiento capilar y experiencia premium de salón.',
    descripcionEditorial: 'Corte, barba, tratamiento capilar y experiencia de salón. Una hora para vos.',
    duracion: '60 min',
    numeral: 'V',
  },
] as const;

/* ─── Stats / Métricas de confianza ───────────────────────────────── */

export interface Stat {
  valor: number;
  sufijo: string;
  label: string;
  /** Descripción accesible para screen readers */
  ariaLabel: string;
}

export const STATS: Stat[] = [
  {
    valor: 12,
    sufijo: '+',
    label: 'Años de experiencia',
    ariaLabel: 'Más de 12 años de experiencia',
  },
  {
    valor: 8500,
    sufijo: '+',
    label: 'Clientes atendidos',
    ariaLabel: 'Más de 8500 clientes atendidos',
  },
  {
    valor: 4.9,
    sufijo: '★',
    label: 'Puntuación promedio',
    ariaLabel: '4.9 estrella puntuación promedio',
  },
  {
    valor: 98,
    sufijo: '%',
    label: 'Clientes que regresan',
    ariaLabel: '98% de clientes que regresan',
  },
] as const;

/* ─── WhatsApp helper ──────────────────────────────────────────────── */

/**
 * Genera URL de WhatsApp con mensaje pre-cargado y URL-encoded.
 * SIEMPRE usa encodeURIComponent — nunca concatenar input sin encodear.
 *
 * @param message - Mensaje personalizado (opcional, usa WHATSAPP_MESSAGE por defecto)
 * @param service - Nombre del servicio para mensaje contextual (opcional)
 * @returns URL completa para abrir chat de WhatsApp
 *
 * @example
 * getWhatsAppUrl()
 * // → "https://wa.me/5492604062206?text=Hola%20Carlos%2C..."
 *
 * getWhatsAppUrl('Consulta sobre horarios')
 * // → "https://wa.me/5492604062206?text=Consulta%20sobre%20horarios"
 *
 * getWhatsAppUrl(undefined, 'Corte Clásico')
 * // → "https://wa.me/5492604062206?text=Hola%20Carlos%2C%20quisiera%20reservar%3A%20Corte%20Cl%C3%A1sico"
 */
export function getWhatsAppUrl(message?: string, service?: string): string {
  let text: string;

  if (message) {
    text = message;
  } else if (service) {
    text = `Hola Carlos, quisiera reservar: ${service}`;
  } else {
    text = WHATSAPP_MESSAGE;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
