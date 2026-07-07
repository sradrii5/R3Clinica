import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Tables } from '@/types/supabase'

type Servicio = Tables<'servicios'>

/** Accent colors per category (no violet) */
const ACCENTS: Record<string, { border: string; text: string; bg: string }> = {
  entrenamiento: {
    border: 'hover:border-emerald-400/40',
    text:   'group-hover:text-emerald-400',
    bg:     'bg-emerald-400/[0.06]',
  },
  fisioterapia: {
    border: 'hover:border-sky-400/40',
    text:   'group-hover:text-sky-400',
    bg:     'bg-sky-400/[0.06]',
  },
  nutricion: {
    border: 'hover:border-lime-400/40',
    text:   'group-hover:text-lime-400',
    bg:     'bg-lime-400/[0.06]',
  },
  readaptacion: {
    border: 'hover:border-orange-400/40',
    text:   'group-hover:text-orange-400',
    bg:     'bg-orange-400/[0.06]',
  },
  antiaging: {
    border: 'hover:border-amber-400/40',
    text:   'group-hover:text-amber-400',
    bg:     'bg-amber-400/[0.06]',
  },
  biohacking: {
    border: 'hover:border-cyan-400/40',
    text:   'group-hover:text-cyan-400',
    bg:     'bg-cyan-400/[0.06]',
  },
}

const DEFAULT_ACCENT = {
  border: 'hover:border-brand-400/40',
  text:   'group-hover:text-brand-400',
  bg:     'bg-brand-400/[0.06]',
}

/** Geometric monogram instead of emoji */
function CategoryMark({ categoria }: { categoria: string }) {
  const abbr: Record<string, string> = {
    entrenamiento: 'EN',
    fisioterapia:  'FT',
    nutricion:     'NU',
    readaptacion:  'RE',
    antiaging:     'AA',
    biohacking:    'BH',
  }
  return (
    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">
      {abbr[categoria] ?? '—'}
    </span>
  )
}

interface Props {
  servicios: Servicio[]
}

export default function ServiciosGrid({ servicios }: Props) {
  return (
    <section id="servicios" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16 flex flex-col gap-4">
        <div className="flex items-center gap-3 reveal">
          <span className="w-8 h-px bg-brand-400" />
          <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.25em]">Especialidades</span>
        </div>
        <h2 className="reveal delay-100 text-4xl sm:text-5xl lg:text-6xl font-black leading-none uppercase tracking-tight">
          Todo lo que<br />
          <span className="gradient-text">necesitas.</span>
        </h2>
        <p className="reveal delay-200 text-neutral-500 max-w-md leading-relaxed text-sm">
          Un equipo multidisciplinar diseña tu programa personalizado integrando
          todas las disciplinas para alcanzar tu máximo potencial.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
        {servicios.map((s, i) => {
          const accent = ACCENTS[s.categoria] ?? DEFAULT_ACCENT
          return (
            <Link
              key={s.id}
              href={`/servicios/${s.slug}`}
              id={`servicio-card-${s.slug}`}
              className={`group relative flex flex-col gap-6 p-8 bg-[#060908] border border-transparent ${accent.border} transition-all duration-300 reveal`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Top row: monogram + number */}
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 flex items-center justify-center ${accent.bg} border border-white/[0.06]`}>
                  <CategoryMark categoria={s.categoria} />
                </div>
                <span className="text-xs text-neutral-700 font-mono tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className={`text-lg font-bold text-white ${accent.text} transition-colors duration-200 leading-tight`}>
                  {s.nombre}
                </h3>
                {s.descripcion_corta && (
                  <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
                    {s.descripcion_corta}
                  </p>
                )}
              </div>

              {/* CTA */}
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-600 ${accent.text} transition-colors duration-200`}>
                Saber más
                <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
              </div>

              {/* Bottom border accent — animates on hover */}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-brand-400/60 group-hover:w-full transition-all duration-500" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
