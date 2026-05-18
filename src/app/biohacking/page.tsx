import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Zap, Shield, Activity, Brain, ArrowRight } from 'lucide-react'
import LiveMonitor from '@/components/biohacking/LiveMonitor'

export const metadata: Metadata = {
  title: 'Biohacking & Anti-aging',
  description:
    'Lleva tu rendimiento biológico al siguiente nivel con nuestros protocolos de biohacking y anti-aging basados en ciencia y tecnología.',
}

const PROTOCOLOS = [
  {
    icon: Zap,
    title: 'Optimización Metabólica',
    desc: 'Análisis profundo de biomarcadores para ajustar nutrición, suplementación y ejercicio a tu genética.',
  },
  {
    icon: Brain,
    title: 'Neuro-Enhancement',
    desc: 'Protocolos de enfoque, sueño y gestión del estrés mediante técnicas avanzadas y suplementación nootrópica.',
  },
  {
    icon: Activity,
    title: 'Longevidad Activa',
    desc: 'Estrategias antienvejecimiento centradas en la salud celular, mitocondrial y funcional.',
  },
  {
    icon: Shield,
    title: 'Bio-Resiliencia',
    desc: 'Fortalecimiento del sistema inmune y capacidad de recuperación ante estresores externos.',
  },
]

export default function BiohackingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="relative rounded-3xl overflow-hidden glass p-10 md:p-20 mb-24 border-brand-500/20 bg-gradient-to-br from-brand-900/40 via-[#0a1a0e] to-[#080c0a]">
             {/* Animación de fondo sutil */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
             
             <div className="relative z-10 max-w-2xl">
                <span className="text-brand-400 text-sm font-bold uppercase tracking-widest block mb-6">Frontera de la Ciencia</span>
                <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                   Biohacking <br />
                   <span className="gradient-text">& Anti-aging</span>
                </h1>
                <p className="text-lg text-neutral-300 mb-10 leading-relaxed">
                   No solo buscamos la ausencia de enfermedad, sino la presencia de un rendimiento óptimo. 
                   Utilizamos tecnología de vanguardia y datos para hackear tu biología y ralentizar el reloj biológico.
                </p>
                <Link
                   href="/contacto"
                   className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold transition-all hover:scale-105 glow-green"
                >
                   Empieza tu optimización
                   <ArrowRight className="w-5 h-5" />
                </Link>
             </div>
          </div>

          {/* Grid de Protocolos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
             {PROTOCOLOS.map((p) => (
                <div key={p.title} className="glass p-8 rounded-3xl group hover:border-brand-500/40 transition-all">
                   <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6 group-hover:bg-brand-500/20 transition-all">
                      <p.icon className="w-7 h-7 text-brand-400" />
                   </div>
                   <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
                   <p className="text-neutral-400 leading-relaxed">{p.desc}</p>
                </div>
             ))}
          </div>

          {/* Sección Tecnología */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div>
                <h2 className="text-4xl font-black mb-6">Medición <span className="text-brand-400">Objetiva</span></h2>
                <p className="text-neutral-300 mb-8 leading-relaxed text-lg">
                   En el Biohacking no hay lugar para las suposiciones. Basamos cada protocolo en datos reales 
                   obtenidos mediante monitorización continua y analíticas específicas.
                </p>
                <div className="space-y-4">
                   {[
                      'Análisis de variabilidad de la frecuencia cardíaca (HRV)',
                      'Monitorización de niveles de glucosa en tiempo real',
                      'Estudios genéticos de predisposición y rendimiento',
                      'Optimización del ritmo circadiano y descanso'
                   ].map((item) => (
                      <div key={item} className="flex items-center gap-4 p-4 glass rounded-xl border-white/5">
                         <div className="w-2 h-2 rounded-full bg-brand-500" />
                         <span className="text-sm text-neutral-400">{item}</span>
                      </div>
                   ))}
                </div>
             </div>
             <div className="relative">
                <div className="absolute inset-0 bg-brand-500/10 blur-[80px] rounded-full" />
                <LiveMonitor />
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
