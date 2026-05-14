// src/lib/contact/whatsapp.ts
// ─────────────────────────────────────────────────────────────────────────────
//  Plantillas de mensajes de WhatsApp con Deep Linking para R3Clinica.
//  Diferencia claramente entre leads 'particular' y 'empresa'.
// ─────────────────────────────────────────────────────────────────────────────

import type { LeadParticular, LeadEmpresa } from '@/types/leads'

/** Número de WhatsApp de R3Clinica (formato internacional sin +) */
const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '34600000000'

/**
 * Genera la URL de WhatsApp Deep Link con el mensaje codificado.
 */
export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WA_NUMBER}?text=${encoded}`
}

// ─── Plantilla: PARTICULAR ───────────────────────────────────────────────────
/**
 * Genera el mensaje de WhatsApp para un lead particular que solicita cita previa.
 *
 * Ejemplo de URL resultante:
 *   https://wa.me/34600000000?text=Hola%2C+me+llamo...
 */
export function buildMensajeParticular(lead: LeadParticular): string {
  const servicio = lead.servicioInteres
    ? `*Servicio de interés:* ${lead.servicioInteres}`
    : '*Servicio de interés:* No especificado'

  const mensaje = lead.mensaje ? `\n*Mensaje:* ${lead.mensaje}` : ''

  return `🏋️ *Solicitud de Cita — R3Clinica*

Hola, me llamo *${lead.nombre} ${lead.apellidos ?? ''}*.

${servicio}
*Teléfono:* ${lead.telefono ?? 'No facilitado'}
*Email:* ${lead.email}${mensaje}

Me gustaría obtener más información y reservar una consulta inicial. ¡Gracias!`
}

// ─── Plantilla: EMPRESA ──────────────────────────────────────────────────────
/**
 * Genera el mensaje de WhatsApp para un lead corporativo que solicita
 * servicios para empresa.
 */
export function buildMensajeEmpresa(lead: LeadEmpresa): string {
  const empleados = lead.numEmpleados
    ? `*Nº de empleados:* ${lead.numEmpleados}`
    : '*Nº de empleados:* No especificado'

  const sector = lead.sector ? `\n*Sector:* ${lead.sector}` : ''
  const necesidad = lead.descripcionNecesidad
    ? `\n*Necesidad:* ${lead.descripcionNecesidad}`
    : ''

  return `🏢 *Propuesta Corporativa — R3Clinica*

Hola, soy *${lead.nombre} ${lead.apellidos ?? ''}*, ${lead.cargoContacto ?? 'responsable'} en *${lead.nombreEmpresa}*.

${empleados}${sector}${necesidad}

*Teléfono:* ${lead.telefono ?? 'No facilitado'}
*Email:* ${lead.email}

Estamos interesados en vuestros servicios para empresas y nos gustaría recibir una propuesta personalizada. ¡Gracias!`
}
