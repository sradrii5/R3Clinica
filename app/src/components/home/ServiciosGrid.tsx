import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Tables } from '@/types/supabase'

type Servicio = Tables<'servicios'>

const ICONOS: Record<string, string> = {
  entrenamiento: '🏋️',
  fisioterapia:  '🦴',
  nutricion:     '🥗',
  readaptacion:  '🔄',
  antiaging:     '⚡',
  biohacking:    '🧬',
}

const COLORS: Record<string, string> = {
  entrenamiento: 'from-emerald-500/10 to-transparent border-emerald-500/20 hover:border-emerald-500/50',
  fisioterapia:  'from-blue-500/10 to-transparent border-blue-500/20 hover:border-blue-500/50',
  nutricion:     'from-lime-500/10 to-transparent border-lime-500/20 hover:border-lime-500/50',
  readaptacion:  'from-violet-500/10 to-transparent border-violet-500/20 hover:border-violet-500/50',
  antiaging:     'from-amber-500/10 to-transparent border-amber-500/20 hover:border-amber-500/50',
  biohacking:    'from-cyan-500/10 to-transparent border-cyan-500/20 hover:border-cyan-500/50',
}

interface Props {
  servicios: Servicio[]
}

export default function ServiciosGrid({ servicios }: Props) {
  return (
    <section id="servicios" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">Especialidades</span>
        <h2 className="mt-3 text-4xl sm:text-5xl font-black">
          Todo lo que necesitas,<br />
          <span className="gradient-text">en un solo centro</span>
        </h2>
        <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
          Un equipo multidisciplinar diseña tu programa personalizado integrando
          todas las disciplinas para que alcances tu máximo potencial.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicios.map((s) => (
          <Link
            key={s.id}
            href={`/servicios/${s.slug}`}
            id={`servicio-card-${s.slug}`}
            className={`group relative flex flex-col gap-4 p-7 rounded-2xl bg-gradient-to-br ${COLORS[s.categoria] ?? 'from-white/5 to-transparent border-white/10'} border transition-all duration-300 hover:-translate-y-1`}
          >
            <span className="text-4xl">{ICONOS[s.categoria] ?? '⚙️'}</span>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">
                {s.nombre}
              </h3>
              {s.descripcion_corta && (
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{s.descripcion_corta}</p>
              )}
            </div>
            <div className="mt-auto flex items-center gap-1 text-sm font-medium text-neutral-500 group-hover:text-brand-400 transition-colors">
              Saber más <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
