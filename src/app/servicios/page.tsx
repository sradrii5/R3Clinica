import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ServiciosGrid from '@/components/home/ServiciosGrid'

export const metadata: Metadata = {
  title: 'Nuestros Servicios',
  description:
    'Explora nuestra gama completa de servicios de salud y rendimiento: entrenamiento personal, fisioterapia, nutrición, readaptación, anti-aging y biohacking.',
}

export const revalidate = 86400 // Revalida cada 24 horas

export default async function ServiciosPage() {
  const supabase = await createClient()

  const { data: servicios } = await supabase
    .from('servicios')
    .select('*')
    .eq('activo', true)
    .order('orden')

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">Excelencia Integral</span>
          <h1 className="mt-3 text-5xl font-black">
            Nuestras <span className="gradient-text">Disciplinas</span>
          </h1>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            Un enfoque 360º para tu salud. Combinamos ciencia, tecnología y el mejor equipo profesional 
            para optimizar cada aspecto de tu rendimiento físico y mental.
          </p>
        </div>
        
        <ServiciosGrid servicios={servicios ?? []} />
          
          {/* Sección de enfoque multidisciplinar */}
          <div className="mt-24 glass rounded-3xl p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">El Método <span className="text-brand-400">R3</span></h2>
                <p className="text-neutral-300 mb-6 leading-relaxed">
                  No creemos en soluciones aisladas. Nuestro valor diferencial reside en la comunicación constante 
                  entre nuestros entrenadores, fisioterapeutas y nutricionistas.
                </p>
                <ul className="space-y-4">
                  {[
                    'Evaluación inicial multidisciplinar',
                    'Seguimiento conjunto de objetivos',
                    'Ajustes dinámicos según tu evolución',
                    'Tecnología de última generación'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-neutral-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="aspect-square glass rounded-2xl flex flex-col items-center justify-center p-6 text-center group hover:border-brand-500/30 transition-all">
                    <span className="text-3xl mb-2">🤝</span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">Cohesión</span>
                 </div>
                 <div className="aspect-square glass rounded-2xl flex flex-col items-center justify-center p-6 text-center group hover:border-brand-500/30 transition-all">
                    <span className="text-3xl mb-2">🔬</span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">Ciencia</span>
                 </div>
                 <div className="aspect-square glass rounded-2xl flex flex-col items-center justify-center p-6 text-center group hover:border-brand-500/30 transition-all">
                    <span className="text-3xl mb-2">📈</span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">Progreso</span>
                 </div>
                 <div className="aspect-square glass rounded-2xl flex flex-col items-center justify-center p-6 text-center group hover:border-brand-500/30 transition-all">
                    <span className="text-3xl mb-2">🎯</span>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">Objetivos</span>
                 </div>
              </div>
            </div>
          </div>
      </main>
      <Footer />
    </>
  )
}
