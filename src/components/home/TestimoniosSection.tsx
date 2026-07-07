import { Star } from 'lucide-react'
import type { Tables } from '@/types/supabase'

type Testimonio = Tables<'testimonios'>

interface Props {
  testimonios: Testimonio[]
}

function StarRating({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < n ? 'fill-gold-400 text-gold-400' : 'text-neutral-800'}`}
        />
      ))}
    </div>
  )
}

export default function TestimoniosSection({ testimonios }: Props) {
  if (!testimonios.length) return null

  return (
    <section id="testimonios" className="py-24 px-6 max-w-7xl mx-auto" aria-labelledby="testimonios-heading">
      {/* Header */}
      <div className="mb-16 flex flex-col gap-4">
        <div className="flex items-center gap-3 reveal">
          <span className="w-8 h-px bg-brand-400" />
          <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.25em]">Testimonios</span>
        </div>
        <h2
          id="testimonios-heading"
          className="reveal delay-100 text-4xl sm:text-5xl lg:text-6xl font-black leading-none uppercase tracking-tight"
        >
          Lo que dicen<br />
          <span className="gradient-text">nuestros clientes.</span>
        </h2>
      </div>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-px space-y-px">
        {testimonios.map((t, i) => (
          <article
            key={t.id}
            className="reveal break-inside-avoid bg-[#060908] border border-white/[0.05] p-7 flex flex-col gap-5 hover:border-brand-400/20 transition-all duration-300 hover:bg-white/[0.01]"
            style={{ animationDelay: `${i * 60}ms` }}
            aria-label={`Testimonio de ${t.nombre_cliente}`}
          >
            {/* Stars */}
            {t.puntuacion && <StarRating n={t.puntuacion} />}

            {/* Quote */}
            <blockquote>
              <p className="text-neutral-300 text-sm leading-relaxed">
                &ldquo;{t.contenido}&rdquo;
              </p>
            </blockquote>

            {/* Author */}
            <footer className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
              <div
                className="w-8 h-8 flex items-center justify-center bg-brand-400/10 border border-brand-400/20 text-xs font-black text-brand-400 flex-shrink-0 uppercase"
                aria-hidden="true"
              >
                {t.nombre_cliente.charAt(0)}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-bold text-white truncate">{t.nombre_cliente}</span>
                {t.cargo_empresa && (
                  <span className="text-xs text-neutral-600 truncate">{t.cargo_empresa}</span>
                )}
              </div>
              {t.tipo === 'empresa' && (
                <span className="ml-auto flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-brand-400/20 text-brand-400">
                  Empresa
                </span>
              )}
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}
