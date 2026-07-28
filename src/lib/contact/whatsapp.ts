// src/lib/contact/whatsapp.ts
// ─────────────────────────────────────────────────────────────────────────────
//  Plantillas de mensajes de WhatsApp con Deep Linking para R3Clinica.
//  Diferencia claramente entre leads 'particular' y 'empresa'.
// ─────────────────────────────────────────────────────────────────────────────

import type { LeadParticular, LeadEmpresa } from '@/types/leads'

/** Número de WhatsApp oficial de R3Clinica (602 73 82 39 / +34 602738239) */
export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '34602738239'

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

Hola, soy *${lead.nombre} ${lead.apellidos ?? ''}* (${lead.cargoContacto ?? 'Representante'}).
*Empresa:* ${lead.nombreEmpresa}
${empleados}${sector}

*Teléfono:* ${lead.telefono ?? 'No facilitado'}
*Email:* ${lead.email}${necesidad}

Nos gustaría solicitar información sobre vuestros programas de salud corporativa y prevención de riesgos.`
}
