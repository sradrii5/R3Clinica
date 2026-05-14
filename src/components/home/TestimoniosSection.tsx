import { Star, Quote } from 'lucide-react'
import type { Tables } from '@/types/supabase'

type Testimonio = Tables<'testimonios'>

interface Props {
  testimonios: Testimonio[]
}

function StarRating({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < n ? 'fill-gold-400 text-gold-400' : 'text-neutral-700'}`}
        />
      ))}
    </div>
  )
}

export default function TestimoniosSection({ testimonios }: Props) {
  if (!testimonios.length) return null

  return (
    <section id="testimonios" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">Testimonios</span>
        <h2 className="mt-3 text-4xl sm:text-5xl font-black">
          Lo que dicen<br />
          <span className="gradient-text">nuestros clientes</span>
        </h2>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {testimonios.map((t) => (
          <div
            key={t.id}
            className="break-inside-avoid glass rounded-2xl p-6 flex flex-col gap-4 hover:border-brand-500/20 transition-colors duration-300"
          >
            <Quote className="w-7 h-7 text-brand-500/40" />
            <p className="text-neutral-300 text-sm leading-relaxed">"{t.contenido}"</p>
            <div className="mt-auto flex items-center gap-3 pt-4 border-t border-white/5">
              {/* Avatar placeholder */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-900 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {t.nombre_cliente.charAt(0)}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-semibold text-white truncate">{t.nombre_cliente}</span>
                {t.cargo_empresa && (
                  <span className="text-xs text-neutral-500 truncate">{t.cargo_empresa}</span>
                )}
                {t.puntuacion && <StarRating n={t.puntuacion} />}
              </div>
              {t.tipo === 'empresa' && (
                <span className="ml-auto shrink-0 text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  Empresa
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
