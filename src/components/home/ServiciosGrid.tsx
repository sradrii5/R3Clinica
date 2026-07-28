'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Dumbbell, Activity, ShieldCheck, Apple, Sparkles, HeartHandshake,
  Building2, ClipboardCheck, Smartphone, Cpu, Trophy, ArrowRight, Check, Search, MessageCircle
} from 'lucide-react'
import { SERVICIOS_CATALOGO, ServicioDetalle } from '@/data/servicios'
import { cn } from '@/lib/utils'

import type { LucideIcon } from 'lucide-react'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '34600000000'

const ICON_MAP: Record<string, LucideIcon> = {
  Dumbbell,
  Activity,
  ShieldCheck,
  Apple,
  Sparkles,
  HeartHandshake,
  Building2,
  ClipboardCheck,
  Smartphone,
  Cpu,
  Trophy
}

const CATEGORIES = [
  { id: 'todos', label: 'Todos los servicios' },
  { id: 'entrenamiento', label: 'Entrenamiento & Preparación' },
  { id: 'fisioterapia', label: 'Fisioterapia & Readaptación' },
  { id: 'salud', label: 'Nutrición, Antiaging & Biohacking' },
  { id: 'especiales', label: 'Mujer, Empresas & Online' },
]

export default function ServiciosGrid({ servicios }: { servicios?: unknown }) {
  void servicios
  const [selectedCat, setSelectedCat] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')

  // Combined services list prioritizing SERVICIOS_CATALOGO to ensure all 11 are present
  const listServicios: ServicioDetalle[] = useMemo(() => {
    return SERVICIOS_CATALOGO
  }, [])

  const filteredServicios = useMemo(() => {
    return listServicios.filter((s) => {
      // Category filter
      let matchesCat = true
      if (selectedCat === 'entrenamiento') {
        matchesCat = ['entrenamiento', 'preparacion', 'valoraciones'].includes(s.categoria)
      } else if (selectedCat === 'fisioterapia') {
        matchesCat = ['fisioterapia', 'readaptacion'].includes(s.categoria)
      } else if (selectedCat === 'salud') {
        matchesCat = ['nutricion', 'antiaging', 'biohacking'].includes(s.categoria)
      } else if (selectedCat === 'especiales') {
        matchesCat = ['mujer', 'empresas', 'online'].includes(s.categoria)
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim()
      let matchesSearch = true
      if (q) {
        matchesSearch =
          s.nombre.toLowerCase().includes(q) ||
          s.descripcion_corta.toLowerCase().includes(q) ||
          s.badge.toLowerCase().includes(q)
      }

      return matchesCat && matchesSearch
    })
  }, [listServicios, selectedCat, searchQuery])

  return (
    <section id="servicios" className="space-y-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-px bg-brand-400" />
            <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.25em]">11 Especialidades de Salud & Rendimiento</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Nuestros <span className="gradient-text">Servicios</span>
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar servicio (ej. espalda, online...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080c0a] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCat(cat.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border",
              selectedCat === cat.id
                ? "bg-brand-500 text-black border-brand-400 shadow-lg shadow-brand-500/20"
                : "bg-white/[0.02] text-neutral-400 border-white/5 hover:border-white/20 hover:text-white"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of 11 Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServicios.map((servicio) => {
          const IconComp = ICON_MAP[servicio.icono] || Dumbbell
          return (
            <div
              key={servicio.id}
              className="glass-dark border border-white/5 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-500/30 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Subtle top ambient glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-all pointer-events-none" />

              <div>
                {/* Top bar: Badge + Icon */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  {servicio.badge && (
                    <span className="text-[10px] font-bold text-brand-300 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-full text-right leading-tight">
                      {servicio.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors">
                  {servicio.nombre}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-5">
                  {servicio.descripcion_corta}
                </p>

                {/* Sub-options tags if any */}
                {servicio.opciones && servicio.opciones.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {servicio.opciones.map((op, idx) => (
                      <span key={idx} className="text-[10px] text-neutral-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md font-mono">
                        {op}
                      </span>
                    ))}
                  </div>
                )}

                {/* Key Inclusions Bullet Points */}
                <div className="space-y-2 pt-4 border-t border-white/5 mb-6">
                  {servicio.incluye.slice(0, 3).map((inc, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-400">
                      <Check className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/servicios/${servicio.slug}`}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 hover:border-brand-400/50 text-xs font-bold text-white hover:text-brand-400 flex items-center justify-center gap-1.5 transition-all"
                >
                  Saber más
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20el%20servicio%20de%20${encodeURIComponent(servicio.nombre)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 text-brand-400 transition-colors"
                  title="Consultar por WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>

            </div>
          )
        })}
      </div>

      {filteredServicios.length === 0 && (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl">
          <p className="text-neutral-400 text-sm">No se encontraron servicios que coincidan con la búsqueda.</p>
        </div>
      )}
    </section>
  )
}
