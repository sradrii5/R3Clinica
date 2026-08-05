// src/components/portal/admin/SeleccionarEjercicioModal.tsx
'use client'

import { useState, useMemo } from 'react'
import {
  Search, X, Dumbbell, Layers, ChevronDown, ChevronRight,
  Check, Filter, Video, Image as ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EjercicioCatalogo {
  id: string
  nombre: string
  descripcion: string | null
  grupo_muscular: string
  familia: string | null
  imagen_url: string | null
  video_url: string | null
}

interface SeleccionarEjercicioModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (ejercicio: EjercicioCatalogo) => void
  catalogo: EjercicioCatalogo[]
  selectedNombre?: string
}

const ZONAS_MUSCULARES = [
  'Todos',
  'Tren Superior',
  'Tren Inferior',
  'Core',
  'Cardio',
  'Pliometría',
  'Fisioterapia / Movilidad'
]

export default function SeleccionarEjercicioModal({
  isOpen,
  onClose,
  onSelect,
  catalogo,
  selectedNombre
}: SeleccionarEjercicioModalProps) {
  const [search, setSearch] = useState('')
  const [activeZona, setActiveZona] = useState('Todos')
  const [openFamilias, setOpenFamilias] = useState<Set<string>>(new Set())

  // Alternar acordeón de familia
  const toggleFamilia = (famName: string) => {
    setOpenFamilias(prev => {
      const next = new Set(prev)
      if (next.has(famName)) next.delete(famName)
      else next.add(famName)
      return next
    })
  }

  // Desplegar todas las familias si el usuario está buscando texto
  const isSearching = search.trim().length > 0

  // Filtrar catálogo por búsqueda y zona
  const filteredCatalogo = useMemo(() => {
    return catalogo.filter(ej => {
      // Filtro por texto (nombre, familia, descripción o grupo)
      const matchesSearch = !isSearching || [
        ej.nombre,
        ej.familia || '',
        ej.grupo_muscular,
        ej.descripcion || ''
      ].some(str => str.toLowerCase().includes(search.toLowerCase()))

      // Filtro por zona / grupo muscular
      const matchesZona = activeZona === 'Todos' || ej.grupo_muscular === activeZona

      return matchesSearch && matchesZona
    })
  }, [catalogo, search, activeZona, isSearching])

  // Agrupar por Familia y por Grupo Muscular (para los que no tienen familia)
  const agrupado = useMemo(() => {
    const familiasMap = new Map<string, { zona: string; ejercicios: EjercicioCatalogo[] }>()
    const sinFamiliaMap = new Map<string, EjercicioCatalogo[]>()

    for (const ej of filteredCatalogo) {
      if (ej.familia) {
        if (!familiasMap.has(ej.familia)) {
          familiasMap.set(ej.familia, { zona: ej.grupo_muscular, ejercicios: [] })
        }
        familiasMap.get(ej.familia)!.ejercicios.push(ej)
      } else {
        if (!sinFamiliaMap.has(ej.grupo_muscular)) {
          sinFamiliaMap.set(ej.grupo_muscular, [])
        }
        sinFamiliaMap.get(ej.grupo_muscular)!.push(ej)
      }
    }

    return {
      familias: Array.from(familiasMap.entries()).sort((a, b) => a[0].localeCompare(b[0])),
      sinFamilia: Array.from(sinFamiliaMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))
    }
  }, [filteredCatalogo])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0a0e0c] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">

        {/* Glow de fondo */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* ── Header: Título y Cierre ─────────────────────────────────── */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/10 border border-brand-500/20 rounded-xl text-brand-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Seleccionar Ejercicio</h3>
              <p className="text-xs text-neutral-400">Explora por familias o busca directamente por nombre.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Barra de búsqueda y Filtros por Zona ──────────────────────── */}
        <div className="p-5 border-b border-white/5 space-y-3 shrink-0 bg-[#080c0a]/60">
          {/* Buscador */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="Buscar ejercicio, familia o patrón de movimiento (ej: sentadilla, zancada, press)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#080c0a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Tabs por Zona Muscular */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-neutral-500 pr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Zona:
            </span>
            {ZONAS_MUSCULARES.map(zona => (
              <button
                key={zona}
                onClick={() => setActiveZona(zona)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border',
                  activeZona === zona
                    ? 'bg-white text-black font-bold border-white shadow-sm'
                    : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:text-white hover:bg-white/5'
                )}
              >
                {zona}
              </button>
            ))}
          </div>
        </div>

        {/* ── Cuerpo: Lista Acordeón por Familias ───────────────────────── */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

          {filteredCatalogo.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 border border-dashed border-white/5 rounded-2xl">
              <Dumbbell className="w-10 h-10 text-neutral-600 opacity-40" />
              <p className="text-sm font-semibold text-neutral-400">No se encontraron ejercicios</p>
              <p className="text-xs text-neutral-600">Prueba ajustando la búsqueda o el filtro de zona.</p>
            </div>
          ) : (
            <>
              {/* ── Familias agrupadas ── */}
              {agrupado.familias.map(([famName, { zona, ejercicios }]) => {
                const isOpenAccordion = isSearching || openFamilias.has(famName)

                return (
                  <div key={famName} className="border border-white/5 rounded-2xl overflow-hidden bg-[#080c0a]/40">

                    {/* Cabecera del Acordeón de Familia */}
                    <button
                      onClick={() => toggleFamilia(famName)}
                      className="w-full flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white flex items-center gap-2">
                            {famName}
                            <span className="text-[10px] font-semibold text-neutral-500 font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                              {ejercicios.length} {ejercicios.length === 1 ? 'ejercicio' : 'ejercicios'}
                            </span>
                          </span>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider">{zona}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-neutral-500">
                        {isOpenAccordion ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Lista de Ejercicios en la Familia */}
                    {isOpenAccordion && (
                      <div className="p-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#050806]/60 animate-fade-in">
                        {ejercicios.map(ej => {
                          const isSelected = selectedNombre === ej.nombre

                          return (
                            <button
                              key={ej.id}
                              onClick={() => { onSelect(ej); onClose() }}
                              className={cn(
                                'flex items-start justify-between p-3 rounded-xl text-left transition-all cursor-pointer border group',
                                isSelected
                                  ? 'bg-brand-500/15 border-brand-500/40 text-brand-300 shadow-lg shadow-brand-500/10'
                                  : 'bg-white/[0.02] border-white/5 hover:border-brand-500/30 hover:bg-white/[0.05] text-neutral-200'
                              )}
                            >
                              <div className="space-y-1 min-w-0 pr-2">
                                <p className="text-xs font-bold truncate flex items-center gap-1.5">
                                  {ej.nombre}
                                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />}
                                </p>
                                {ej.descripcion && (
                                  <p className="text-[11px] text-neutral-500 line-clamp-1 leading-relaxed">
                                    {ej.descripcion}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 pt-0.5">
                                  {ej.imagen_url && (
                                    <span className="text-[9px] text-neutral-500 flex items-center gap-1">
                                      <ImageIcon className="w-2.5 h-2.5" /> Foto
                                    </span>
                                  )}
                                  {ej.video_url && (
                                    <span className="text-[9px] text-brand-400/80 flex items-center gap-1">
                                      <Video className="w-2.5 h-2.5" /> Vídeo
                                    </span>
                                  )}
                                </div>
                              </div>

                              <span className="text-[10px] font-bold text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-0.5">
                                Seleccionar →
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* ── Ejercicios sueltos (sin familia asignada) ── */}
              {agrupado.sinFamilia.map(([grupoName, ejercicios]) => (
                <div key={`sf-${grupoName}`} className="border border-white/5 rounded-2xl overflow-hidden bg-[#080c0a]/40">
                  <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{grupoName} (Sin familia)</span>
                    <span className="text-[10px] text-neutral-500">{ejercicios.length} ejercicios</span>
                  </div>

                  <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#050806]/60">
                    {ejercicios.map(ej => {
                      const isSelected = selectedNombre === ej.nombre

                      return (
                        <button
                          key={ej.id}
                          onClick={() => { onSelect(ej); onClose() }}
                          className={cn(
                            'flex items-start justify-between p-3 rounded-xl text-left transition-all cursor-pointer border group',
                            isSelected
                              ? 'bg-brand-500/15 border-brand-500/40 text-brand-300'
                              : 'bg-white/[0.02] border-white/5 hover:border-brand-500/30 hover:bg-white/[0.05] text-neutral-200'
                          )}
                        >
                          <div className="space-y-1 min-w-0 pr-2">
                            <p className="text-xs font-bold truncate flex items-center gap-1.5">
                              {ej.nombre}
                              {isSelected && <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />}
                            </p>
                            {ej.descripcion && (
                              <p className="text-[11px] text-neutral-500 line-clamp-1 leading-relaxed">
                                {ej.descripcion}
                              </p>
                            )}
                          </div>

                          <span className="text-[10px] font-bold text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-0.5">
                            Seleccionar →
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between shrink-0 bg-[#080c0a]">
          <span className="text-xs text-neutral-500 font-mono">
            {filteredCatalogo.length} de {catalogo.length} ejercicios disponibles
          </span>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
