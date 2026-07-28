// src/lib/contact/submitLead.ts
// ─────────────────────────────────────────────────────────────────────────────
//  Función principal de captación de leads para R3Clinica.
//
//  Flujo:
//  1. Convierte el DTO (camelCase) al payload de Supabase (snake_case).
//  2. Inserta el registro en la tabla `leads` vía servidor (Route Handler).
//  3. Construye la URL de WhatsApp con el mensaje personalizado según tipo.
//  4. Devuelve el resultado con la URL para que el cliente redirija.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@/lib/supabase/server'
import {
  buildMensajeParticular,
  buildMensajeEmpresa,
  buildWhatsAppUrl,
} from '@/lib/contact/whatsapp'
import type { Lead, ContactResult } from '@/types/leads'

/**
 * Persiste el lead en Supabase y genera la URL de WhatsApp de redirección.
 * Debe ejecutarse en contexto de servidor (Route Handler o Server Action).
 */
export async function submitLead(lead: Lead): Promise<ContactResult> {
  const supabase = await createClient()

  // ── 1. Mapear camelCase → snake_case ──────────────────────────────────────
  const payload = {
    nombre:           lead.nombre,
    apellidos:        lead.apellidos ?? null,
    email:            lead.email,
    telefono:         lead.telefono ?? null,
    tipo:             lead.tipo,
    servicio_interes: lead.servicioInteres ?? null,
    mensaje:          lead.mensaje ?? null,
    origen:           lead.origen ?? 'web',
    utm_source:       lead.utmSource ?? null,
    utm_medium:       lead.utmMedium ?? null,
    utm_campaign:     lead.utmCampaign ?? null,
    whatsapp_enviado: false,
    // Campos exclusivos empresa
    nombre_empresa:       lead.tipo === 'empresa' ? lead.nombreEmpresa : null,
    cargo_contacto:       lead.tipo === 'empresa' ? (lead.cargoContacto ?? null) : null,
    num_empleados:        lead.tipo === 'empresa' ? (lead.numEmpleados ?? null) : null,
    sector:               lead.tipo === 'empresa' ? (lead.sector ?? null) : null,
    descripcion_necesidad: lead.tipo === 'empresa' ? (lead.descripcionNecesidad ?? null) : null,
  }

  // ── 2. Insertar en Supabase ───────────────────────────────────────────────
  const insertResult = await (supabase.from('leads') as unknown as {
    insert: (p: typeof payload) => {
      select: (s: string) => {
        single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
      }
    }
  })
    .insert(payload)
    .select('id')
    .single()

  if (insertResult.error || !insertResult.data) {
    console.error('[submitLead] Error al insertar lead:', insertResult.error)
    return {
      success: false,
      error: insertResult.error?.message ?? 'Error desconocido al guardar el formulario.',
    }
  }

  // ── 3. Marcar whatsapp_enviado = true (fire-and-forget) ───────────────────
  ;(supabase.from('leads') as unknown as {
    update: (p: { whatsapp_enviado: boolean }) => {
      eq: (col: string, val: string) => Promise<{ error: unknown }>
    }
  })
    .update({ whatsapp_enviado: true })
    .eq('id', insertResult.data.id)
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

  return {
    success: true,
    leadId: insertResult.data.id,
    whatsappUrl: buildWhatsAppUrl(mensaje),
  }
}
