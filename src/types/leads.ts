// src/types/leads.ts
// ─────────────────────────────────────────────────────────────────────────────
//  Tipos TypeScript para el sistema de captación de leads de R3Clinica.
//  Espejo del esquema SQL: distingue Particular vs. Empresa.
// ─────────────────────────────────────────────────────────────────────────────

export type TipoCliente = 'particular' | 'empresa'

export type CategoriaServicio =
  | 'entrenamiento'
  | 'fisioterapia'
  | 'nutricion'
  | 'readaptacion'
  | 'antiaging'
  | 'biohacking'

/** Campos comunes a ambos tipos de lead */
interface LeadBase {
  nombre: string
  apellidos?: string
  email: string
  telefono?: string
  servicioInteres?: CategoriaServicio
  mensaje?: string
  origen?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

/** Lead de un particular que solicita cita previa */
export interface LeadParticular extends LeadBase {
  tipo: 'particular'
}

/** Lead de una empresa que solicita servicios corporativos */
export interface LeadEmpresa extends LeadBase {
  tipo: 'empresa'
  nombreEmpresa: string         // obligatorio para empresas
  cargoContacto?: string
  numEmpleados?: number
  sector?: string
  descripcionNecesidad?: string
}

/** Unión discriminada para uso en formularios y funciones */
export type Lead = LeadParticular | LeadEmpresa

// ─── Payload que se envía a Supabase (snake_case) ────────────────────────────
export type LeadInsert = {
  nombre: string
  apellidos?: string
  email: string
  telefono?: string
  tipo: TipoCliente
  servicio_interes?: CategoriaServicio
  mensaje?: string
  origen?: string
  nombre_empresa?: string
  cargo_contacto?: string
  num_empleados?: number
  sector?: string
  descripcion_necesidad?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  whatsapp_enviado: boolean
}

// ─── Resultado de la acción de envío ─────────────────────────────────────────
export type ContactResult =
  | { success: true; leadId: string; whatsappUrl: string }
  | { success: false; error: string }
