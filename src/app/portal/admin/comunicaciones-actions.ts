// src/app/portal/admin/comunicaciones-actions.ts
'use server'

import { createClient as createUserClient } from '@/lib/supabase/server'

// ─── Helper verificar admin ────────────────────────────────────────────────────

async function verificarAdmin() {
  const supabase = await createUserClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('No autenticado')

  const { data: perfil, error: perfilError } = await supabase
    .from('perfiles')
    .select('es_admin')
    .eq('id', user.id)
    .single()

  if (perfilError || !perfil || !perfil.es_admin) {
    throw new Error('Acceso denegado')
  }
  return user
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface DestinatarioEmail {
  email: string
  nombre: string
}

export type TipoPlantilla = 'recordatorio_cita' | 'oferta_especial' | 'actualizacion_plan' | 'personalizado'

export interface EnviarEmailPayload {
  destinatarios: DestinatarioEmail[]
  tipo: TipoPlantilla
  asunto: string
  mensaje: string
}
// ─── Enviar Email via Resend API ───────────────────────────────────────────────

/**
 * Envía emails a los destinatarios especificados usando la API de Resend.
 * Si RESEND_API_KEY no está configurada, devuelve un error descriptivo
 * en lugar de crashear — el sistema queda operativo para cuando se configure.
 */
export async function enviarEmailAction(payload: EnviarEmailPayload): Promise<{
  success: boolean
  enviados?: number
  error?: string
  pendingSetup?: boolean
}> {
  try {
    await verificarAdmin()

    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@r3clinica.com'

    if (!apiKey) {
      return {
        success: false,
        pendingSetup: true,
        error: 'El servicio de email aún no está configurado. Añade RESEND_API_KEY a las variables de entorno para activar el envío de emails.'
      }
    }

    if (payload.destinatarios.length === 0) {
      return { success: false, error: 'No hay destinatarios seleccionados.' }
    }

    // Limitar envíos masivos en un solo batch a 50 destinatarios por llamada
    const batchSize = 50
    let enviados = 0

    for (let i = 0; i < payload.destinatarios.length; i += batchSize) {
      const batch = payload.destinatarios.slice(i, i + batchSize)

      // Construir emails individualizados (personalización por nombre)
      const emailPromises = batch.map(async (dest) => {
        const mensajePersonalizado = payload.mensaje.replace(/\{nombre\}/g, dest.nombre)

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromEmail,
            to: dest.email,
            subject: payload.asunto,
            html: buildEmailHTML(dest.nombre, mensajePersonalizado, payload.tipo)
          })
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(`Error enviando a ${dest.email}: ${err.message || response.statusText}`)
        }

        return true
      })

      await Promise.all(emailPromises)
      enviados += batch.length
    }

    return { success: true, enviados }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al enviar el email'
    return { success: false, error: errorMsg }
  }
}

// ─── Template HTML ────────────────────────────────────────────────────────────

function buildEmailHTML(nombre: string, mensaje: string, tipo: TipoPlantilla): string {
  const iconos: Record<TipoPlantilla, string> = {
    recordatorio_cita: '📅',
    oferta_especial: '🎯',
    actualizacion_plan: '📋',
    personalizado: '✉️'
  }

  const icono = iconos[tipo] || '✉️'

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>R3Clinica</title>
</head>
<body style="margin:0;padding:0;background:#080c0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080c0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0d1410;border:1px solid rgba(255,255,255,0.06);border-radius:24px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">R3<span style="color:#22c55e;">Clinica</span></span>
                  </td>
                  <td align="right">
                    <span style="font-size:28px;">${icono}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Para</p>
              <h1 style="margin:0 0 24px;font-size:24px;font-weight:800;color:#ffffff;">${nombre}</h1>

              <div style="font-size:15px;line-height:1.7;color:#d1d5db;white-space:pre-wrap;">${mensaje}</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.05);">
              <p style="margin:0;font-size:12px;color:#4b5563;line-height:1.6;">
                Este mensaje ha sido enviado por el equipo de <strong style="color:#6b7280;">R3Clinica</strong>.<br/>
                Si tienes alguna pregunta, contacta con tu entrenador directamente.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
