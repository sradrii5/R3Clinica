import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, MessageCircle } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: servicio } = await supabase
    .from('servicios')
    .select('nombre, descripcion_corta')
    .eq('slug', slug)
    .single()

  if (!servicio) return { title: 'Servicio no encontrado' }

  return {
    title: servicio.nombre,
    description: servicio.descripcion_corta ?? `Detalles sobre ${servicio.nombre} en R3Clinica.`,
  }
}

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: servicio } = await supabase
    .from('servicios')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!servicio) notFound()

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Volver */}
          <Link 
            href="/servicios" 
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-12 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a servicios
          </Link>

          {/* Hero del servicio */}
          <div className="relative rounded-3xl overflow-hidden glass p-8 md:p-12 mb-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
            
            <div className="relative z-10">
              <span className="text-brand-400 text-sm font-bold uppercase tracking-widest block mb-4">
                {servicio.categoria}
              </span>
              <h1 className="text-4xl md:text-5xl font-black mb-6">{servicio.nombre}</h1>
              <p className="text-lg text-neutral-300 leading-relaxed max-w-2xl">
                {servicio.descripcion ?? servicio.descripcion_corta}
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contacto"
                  className="px-8 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold transition-all hover:scale-105 glow-green-sm"
                >
                  Reservar cita
                </Link>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}?text=Hola, estoy interesado en ${servicio.nombre}`}
                  target="_blank"
                  className="px-8 py-3 rounded-full glass hover:border-brand-500/40 text-white font-bold transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 text-brand-400" />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Detalles adicionales (placeholder para contenido rico) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">¿En qué consiste?</h2>
                <p className="text-neutral-400 leading-relaxed">
                  En R3Clinica abordamos este servicio desde una perspectiva científica y personalizada. 
                  Nuestro protocolo comienza con una evaluación exhaustiva de tus necesidades y objetivos actuales 
                  para diseñar una hoja de ruta específica que garantice resultados duraderos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Beneficios principales</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Mejora del rendimiento físico',
                    'Prevención de lesiones futuras',
                    'Optimización de la recuperación',
                    'Enfoque basado en evidencia',
                    'Seguimiento personalizado',
                    'Integración multidisciplinar'
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm text-neutral-300">
                      <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar info */}
            <aside className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold mb-4">Información</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-neutral-500">Duración</dt>
                    <dd className="text-white">~55 min</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-neutral-500">Modalidad</dt>
                    <dd className="text-white">Presencial</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-neutral-500">Precio desde</dt>
                    <dd className="text-brand-400 font-bold">
                      {servicio.precio_desde ? `${servicio.precio_desde}€` : 'Consultar'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6">
                <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-2">Compromiso R3</p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Todos nuestros servicios son realizados por profesionales colegiados con amplia experiencia en el sector.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
