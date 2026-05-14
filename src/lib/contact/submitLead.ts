// src/lib/contact/submitLead.ts
// ─────────────────────────────────────────────────────────────────────────────
//  Función principal de captación de leads para R3Clinica.
//
//  Flujo:
//  1. Convierte el DTO (camelCase) al payload de Supabase (snake_case).
//  2. Inserta el registro en la tabla `leads`.
//  3. Construye la URL de WhatsApp con el mensaje personalizado según tipo.
//  4. Devuelve el resultado con la URL para que el cliente redirija.
//
//  Se llama desde un Server Action de Next.js o desde un Route Handler.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@/lib/supabase/client'
import {
  buildMensajeParticular,
  buildMensajeEmpresa,
  buildWhatsAppUrl,
} from '@/lib/contact/whatsapp'
import type {
  Lead,
  LeadInsert,
  ContactResult,
} from '@/types/leads'

/**
 * Persiste el lead en Supabase y genera la URL de WhatsApp de redirección.
 *
 * @param lead  DTO del formulario (camelCase, tipado con unión discriminada)
 * @returns     ContactResult con el ID del lead y la URL de WhatsApp
 *
 * @example
 * // En un Server Action:
 * 'use server'
 * const result = await submitLead(formData)
 * if (result.success) redirect(result.whatsappUrl)
 */
export async function submitLead(lead: Lead): Promise<ContactResult> {
  const supabase = createClient()

  // ── 1. Mapear camelCase → snake_case para Supabase ────────────────────────
  const payload: LeadInsert = {
    nombre:            lead.nombre,
    apellidos:         lead.apellidos,
    email:             lead.email,
    telefono:          lead.telefono,
    tipo:              lead.tipo,
    servicio_interes:  lead.servicioInteres,
    mensaje:           lead.mensaje,
    origen:            lead.origen ?? 'web',
    utm_source:        lead.utmSource,
    utm_medium:        lead.utmMedium,
    utm_campaign:      lead.utmCampaign,
    whatsapp_enviado:  false, // se marca true después de redirigir
    // Campos exclusivos de empresa
    ...(lead.tipo === 'empresa' && {
      nombre_empresa:      lead.nombreEmpresa,
      cargo_contacto:      lead.cargoContacto,
      num_empleados:       lead.numEmpleados,
      sector:              lead.sector,
      descripcion_necesidad: lead.descripcionNecesidad,
    }),
  }

  // ── 2. Insertar en Supabase ───────────────────────────────────────────────
  const { data, error } = await supabase
    .from('leads')
    .insert(payload)
    .select('id')
    .single()

  if (error || !data) {
    console.error('[submitLead] Error al insertar lead:', error)
    return {
      success: false,
      error: error?.message ?? 'Error desconocido al guardar el formulario.',
    }
  }

  // ── 3. Marcar whatsapp_enviado = true ─────────────────────────────────────
  // Fire-and-forget: no bloqueamos el flujo del usuario
  supabase
    .from('leads')
    .update({ whatsapp_enviado: true })
    .eq('id', data.id)
    .then(({ error: updateError }) => {
      if (updateError) {
        console.warn('[submitLead] No se pudo actualizar whatsapp_enviado:', updateError)
      }
    })

  // ── 4. Construir URL de WhatsApp ──────────────────────────────────────────
  const mensaje =
    lead.tipo === 'empresa'
      ? buildMensajeEmpresa(lead)
      : buildMensajeParticular(lead)

  const whatsappUrl = buildWhatsAppUrl(mensaje)

  return {
    success: true,
    leadId: data.id,
    whatsappUrl,
  }
}
