import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface GaleriaItem {
  src: string
  alt: string
  label: string
  className: string
}

const ITEMS: GaleriaItem[] = [
  {
    src: '/galeria-landing/instalaciones-pesas.jpg',
    alt: 'Sala de entrenamiento con peso libre en R3Clínicas',
    label: 'Sala de entrenamiento',
    className: 'col-span-2 row-span-2',
  },
  {
    src: '/galeria-landing/entrenamiento-mancuernas.jpg',
    alt: 'Cliente entrenando con mancuernas en R3Clínicas',
    label: 'Entrenamiento personal',
    className: 'col-span-2 row-span-1',
  },
  {
    src: '/galeria-landing/fisioterapia-manos.jpg',
    alt: 'Sesión de fisioterapia manual en R3Clínicas',
    label: 'Fisioterapia manual',
    className: 'col-span-1 row-span-1',
  },
  {
    src: '/galeria-landing/camilla-tratamiento.jpg',
    alt: 'Sala de tratamiento y electroterapia en R3Clínicas',
    label: 'Sala de tratamiento',
    className: 'col-span-1 row-span-1',
  },
  {
    src: '/galeria-landing/kettlebells-detalle.jpg',
    alt: 'Material profesional de entrenamiento funcional',
    label: 'Material profesional',
    className: 'col-span-2 row-span-1',
  },
  {
    src: '/galeria-landing/zona-confort.jpg',
    alt: 'Zona de espera y descanso de R3Clínicas',
    label: 'Zona de descanso',
    className: 'col-span-2 row-span-1',
  },
]

export default function GaleriaSection() {
  return (
    <section id="espacio" className="max-w-7xl mx-auto px-6 py-20 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-px bg-brand-400" />
            <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.25em]">Nuestro Espacio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Conoce <span className="gradient-text">el centro</span>
          </h2>
        </div>
        <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
          Entrenamiento, fisioterapia y recuperación en un mismo espacio, en pleno centro de Valladolid.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[160px] sm:auto-rows-[180px] lg:auto-rows-[200px] gap-4">
        {ITEMS.map((item) => (
          <div
            key={item.src}
            className={`group relative overflow-hidden rounded-3xl border border-white/5 hover:border-brand-500/20 transition-all duration-300 ${item.className}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
            <span className="absolute bottom-4 left-5 text-xs font-bold uppercase tracking-wider text-white/90">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center pt-2">
        <Link
          href="/el-centro"
          className="group flex items-center gap-2 text-sm font-bold text-brand-300 hover:text-brand-400 transition-colors"
        >
          Ver todas las instalaciones
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
