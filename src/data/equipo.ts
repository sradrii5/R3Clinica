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

export const EQUIPO_CATALOGO: MiembroEquipo[] = [
  {
    id: 'rodrigo-lopez',
    nombre: 'Rodrigo',
    apellidos: 'López',
    cargo: 'Director Técnico & Readaptador Funcional',
    especialidades: ['Readaptación', 'Columna', 'VBT'],
    bio: 'Especialista en readaptación físico-deportiva y valoración biomecánica. Más de 8 años guiando la recuperación de lesiones complejas.',
    foto_url: null,
    instagram_url: 'https://instagram.com/r3clinica',
    linkedin_url: 'https://linkedin.com',
    orden: 1,
    activo: true
  },
  {
    id: 'sara-fernandez',
    nombre: 'Sara',
    apellidos: 'Fernández',
    cargo: 'Fisioterapeuta Colegiada',
    especialidades: ['Terapia Manual', 'Suelo Pélvico', 'Punción Seca'],
    bio: 'Experta en fisioterapia musculoesquelética y salud de la mujer. Enfoque integrativo en prevención y tratamiento del dolor.',
    foto_url: null,
    instagram_url: 'https://instagram.com/r3clinica',
    linkedin_url: 'https://linkedin.com',
    orden: 2,
    activo: true
  },
  {
    id: 'adrian-gomez',
    nombre: 'Adrián',
    apellidos: 'Gómez',
    cargo: 'Preparador Físico & Alto Rendimiento',
    especialidades: ['Fuerza', 'Pliometría', 'Oposiciones'],
    bio: 'Especialista en desarrollo de potencia, velocidad y preparación física específica para deportistas y oposiciones de cuerpos de seguridad.',
    foto_url: null,
    instagram_url: 'https://instagram.com/r3clinica',
    linkedin_url: 'https://linkedin.com',
    orden: 3,
    activo: true
  },
  {
    id: 'maria-ruiz',
    nombre: 'María',
    apellidos: 'Ruiz',
    cargo: 'Nutricionista Deportiva & Salud Hormonal',
    especialidades: ['Composición Corporal', 'Salud Femenina', 'Antropometría'],
    bio: 'Graduada en Nutrición Humana y Dietética. Especializada en reprogramación metabólica y educación nutricional personalizada.',
    foto_url: null,
    instagram_url: 'https://instagram.com/r3clinica',
    linkedin_url: 'https://linkedin.com',
    orden: 4,
    activo: true
  }
]
