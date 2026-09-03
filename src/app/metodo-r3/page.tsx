import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGoogleReviews } from '@/lib/reviews/googlePlaces'
import { WA_NUMBER } from '@/lib/contact/whatsapp'
import {
  ClipboardCheck, Target, RefreshCw, Cpu, MessageCircle, ArrowRight, Users, Activity, Star,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Método R3',
  description:
    'Descubre el Método R3: un enfoque multidisciplinar donde entrenamiento, fisioterapia y nutrición trabajan coordinados para conseguir resultados medibles y duraderos.',
}

export const revalidate = 259200 // 3 días, igual que el fetch de reseñas

const PASOS = [
  {
    icon: ClipboardCheck,
    title: 'Evaluación inicial multidisciplinar',
    desc: 'Antes de programar nada, valoramos tu punto de partida: movilidad, historial de lesiones, composición corporal y objetivos reales. Entrenador, fisioterapeuta y nutricionista comparten esa información desde el primer día.',
  },
  {
    icon: Target,
    title: 'Seguimiento conjunto de objetivos',
    desc: 'Un único plan, no tres planes sueltos. Tu progreso en el gimnasio, tu recuperación y tu alimentación se revisan juntos, para que ningún avance en un área se pierda por falta de coordinación en otra.',
  },
  {
    icon: RefreshCw,
    title: 'Ajustes dinámicos según tu evolución',
    desc: 'Tu cuerpo cambia semana a semana, y tu plan también. Si el fisioterapeuta detecta una molestia, el entrenador lo sabe antes de tu siguiente sesión. Nada se decide de forma aislada.',
  },
  {
    icon: Cpu,
    title: 'Tecnología de última generación',
    desc: 'Portal cliente para seguir tus rutinas y dieta desde el móvil, vídeos demostrativos de cada ejercicio y comunicación directa con tu equipo — sin depender de notas en papel ni recordar de memoria.',
  },
]

export default async function MetodoR3Page() {
  const googleReviews = await getGoogleReviews()
  const rating = googleReviews?.rating ?? 5.0
  const reviewCount = googleReviews?.userRatingCount

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-brand-400" />
              <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.25em]">
                Nuestra Filosofía
              </span>
              <span className="w-8 h-px bg-brand-400" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-8">
              El Método <span className="gradient-text">R3</span>
            </h1>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              No creemos en soluciones aisladas. Nuestro valor diferencial reside en la comunicación
              constante entre entrenadores, fisioterapeutas y nutricionistas — para que cada decisión
              sobre tu cuerpo se tome con la información completa, no a medias.
            </p>
          </div>

          {/* Stats reales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
            <div className="glass rounded-3xl p-6 flex items-center gap-4 border border-white/5">
              <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-white leading-none">+50</p>
                <p className="text-xs text-neutral-400 mt-1">Clientes satisfechos</p>
              </div>
            </div>
            <div className="glass rounded-3xl p-6 flex items-center gap-4 border border-white/5">
              <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-white leading-none">11</p>
                <p className="text-xs text-neutral-400 mt-1">Especialidades bajo un mismo equipo</p>
              </div>
            </div>
            <div className="glass rounded-3xl p-6 flex items-center gap-4 border border-white/5">
              <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-white leading-none">{rating.toFixed(1)} ★</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {reviewCount ? `${reviewCount} opiniones verificadas en Google` : 'Google Reviews'}
                </p>
              </div>
            </div>
          </div>

          {/* Los 4 pasos del método */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {PASOS.map((paso, i) => (
              <div key={paso.title} className="glass-dark rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                <span className="absolute top-6 right-6 text-5xl font-black text-white/[0.04]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
                  <paso.icon className="w-6 h-6 text-brand-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-3">{paso.title}</h2>
                <p className="text-sm text-neutral-400 leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA final */}
          <div className="glass rounded-3xl p-10 sm:p-14 text-center border border-brand-500/20 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">
                Empieza con una <span className="text-brand-400">evaluación inicial</span>
              </h2>
              <p className="text-neutral-400 max-w-xl mx-auto mb-8">
                Es el primer paso del Método R3, y el punto de partida para diseñar tu plan coordinado.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contacto"
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold transition-all hover:scale-105"
                >
                  Pide tu cita
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=Hola%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20el%20M%C3%A9todo%20R3`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-8 py-4 border border-brand-400/40 hover:border-brand-400 text-brand-300 hover:text-white bg-brand-500/5 hover:bg-brand-500/10 font-bold transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-brand-400" />
                  Pregúntanos por WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
