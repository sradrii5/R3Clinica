import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, MessageCircle, ShieldCheck, Check } from 'lucide-react'
import { SERVICIOS_CATALOGO } from '@/data/servicios'

interface Props {
  params: Promise<{ slug: string }>
}

async function getServicioData(slug: string) {
  // First check static catalog of 11 services
  const foundInCatalog = SERVICIOS_CATALOGO.find(s => s.slug === slug)
  if (foundInCatalog) {
    return {
      nombre: foundInCatalog.nombre,
      slug: foundInCatalog.slug,
      categoria: foundInCatalog.categoria,
      badge: foundInCatalog.badge,
      descripcion_corta: foundInCatalog.descripcion_corta,
      descripcion_larga: foundInCatalog.descripcion_larga,
      opciones: foundInCatalog.opciones || [],
      incluye: foundInCatalog.incluye,
      beneficios: foundInCatalog.beneficios
    }
  }

  // Fallback to Supabase
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('servicios')
      .select('*')
      .eq('slug', slug)
      .single()

    if (data) {
      return {
        nombre: data.nombre,
        slug: data.slug,
        categoria: data.categoria,
        badge: data.categoria,
        descripcion_corta: data.descripcion_corta || '',
        descripcion_larga: data.descripcion || data.descripcion_corta || '',
        opciones: [],
        incluye: [
          'Evaluación inicial personalizada',
          'Seguimiento y control de evolución',
          'Atención por profesionales cualificados'
        ],
        beneficios: [
          'Mejora del rendimiento y salud general',
          'Prevención de lesiones futuras',
          'Atención cercana e individualizada'
        ]
      }
    }
  } catch (e) {
    // ignore
  }

  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const servicio = await getServicioData(slug)

  if (!servicio) return { title: 'Servicio no encontrado' }

  return {
    title: `${servicio.nombre} | R3Clínicas`,
    description: servicio.descripcion_corta ?? `Información y detalles sobre ${servicio.nombre} en R3Clínicas.`,
  }
}

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params
  const servicio = await getServicioData(slug)

  if (!servicio) notFound()

  const waMessage = encodeURIComponent(`Hola, me gustaría solicitar más información sobre el servicio de ${servicio.nombre}`)

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6 bg-[#060908]">
        <div className="max-w-4xl mx-auto">
          
          {/* Botón Volver */}
          <Link 
            href="/servicios" 
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a todos los servicios
          </Link>

          {/* Hero del Servicio */}
          <div className="relative rounded-3xl overflow-hidden glass-dark border border-white/10 p-8 md:p-12 mb-12">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-brand-400" />
                <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">
                  {servicio.badge || servicio.categoria}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">{servicio.nombre}</h1>
              
              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
                {servicio.descripcion_larga || servicio.descripcion_corta}
              </p>
              
              {servicio.opciones && servicio.opciones.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {servicio.opciones.map((op, i) => (
                    <span key={i} className="text-xs font-semibold text-brand-300 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-lg">
                      ✓ {op}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-6 flex flex-wrap items-center gap-4 border-t border-white/5">
                <Link
                  href="/contacto"
                  className="px-8 py-3.5 rounded-xl bg-brand-400 hover:bg-brand-300 text-black font-bold text-sm transition-all hover:scale-105 glow-brand"
                >
                  Pedir cita previa
                </Link>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl border border-brand-400/40 hover:border-brand-400 text-brand-300 hover:text-white bg-brand-500/5 font-bold text-sm transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-brand-400" />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Detalles Inclusiones y Beneficios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              
              {/* Qué incluye */}
              <section className="glass-dark border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-400" />
                  ¿Qué incluye esta disciplina?
                </h2>
                <ul className="space-y-3 pt-2">
                  {servicio.incluye.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300">
                      <div className="p-1 rounded bg-brand-500/10 text-brand-400 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Beneficios clave */}
              <section className="glass-dark border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4">
                <h2 className="text-xl font-bold text-white">Beneficios clave</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {servicio.beneficios.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-neutral-200 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>

            </div>

            {/* Sidebar info */}
            <aside className="space-y-6">
              <div className="glass-dark border border-white/5 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">Información del servicio</h3>
                <dl className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-neutral-500">Evaluación inicial</dt>
                    <dd className="text-white font-semibold">Incluida</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-neutral-500">Modalidad</dt>
                    <dd className="text-brand-400 font-semibold">Presencial / Online</dd>
                  </div>
                  <div className="flex justify-between pb-1">
                    <dt className="text-neutral-500">Supervisión</dt>
                    <dd className="text-white font-semibold">100% Profesional</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-3xl border border-brand-500/20 bg-brand-500/5 p-6 space-y-2">
                <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">El Método R3</p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Tu evolución es supervisada en comunicación continua entre nuestros entrenadores, fisioterapeutas y nutricionistas.
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
