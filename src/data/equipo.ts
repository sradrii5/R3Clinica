// src/data/equipo.ts

export interface MiembroEquipo {
  id: string
  nombre: string
  apellidos: string
  cargo: string
  especialidades: string[]
  bio: string
  foto_url: string | null
  instagram_url?: string | null
  linkedin_url?: string | null
  orden: number
  activo: boolean
}

// Catálogo sin datos de ejemplo: los administradores añadirán sus profesionales reales desde /portal/admin
export const EQUIPO_CATALOGO: MiembroEquipo[] = []
