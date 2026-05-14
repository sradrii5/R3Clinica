import Link from 'next/link'
import { ArrowRight, Building2, Users, BarChart3, Shield } from 'lucide-react'

const BENEFICIOS = [
  { icon: Users,    title: 'Programas grupales',      desc: 'Actividades de team building y salud para equipos de cualquier tamaño.' },
  { icon: BarChart3, title: 'ROI medible',            desc: 'Reducción del absentismo y mejora de la productividad documentadas.' },
  { icon: Shield,   title: 'Prevención de lesiones',  desc: 'Evaluaciones biomecánicas y programas preventivos para tu plantilla.' },
  { icon: Building2, title: 'Gestión centralizada',   desc: 'Panel de control para RRHH con seguimiento de todos los empleados.' },
]

export default function CtaEmpresasSection() {
  return (
    <section id="empresas-cta" className="py-24 px-6">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative">
        {/* Fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-[#0a1a0e] to-[#080c0a] border border-brand-500/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 p-10 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div className="flex flex-col gap-6">
              <span className="inline-flex items-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-widest">
                <Building2 className="w-4 h-4" />
                Para Empresas
              </span>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight">
                Invierte en la salud<br />
                <span className="gradient-text">de tu equipo</span>
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Diseñamos programas de bienestar corporativo a medida para empresas de todos los tamaños.
                Fisioterapia en oficina, nutrición, entrenamiento grupal y prevención de riesgos laborales.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/empresas"
                  id="empresas-cta-btn"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all hover:scale-105 glow-green-sm"
                >
                  Solicitar propuesta
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/empresas"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full glass hover:border-brand-500/40 text-white font-semibold transition-all"
                >
                  Ver más información
                </Link>
              </div>
            </div>

            {/* Beneficios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFICIOS.map((b) => (
                <div key={b.title} className="glass rounded-2xl p-5 flex flex-col gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 w-fit">
                    <b.icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">{b.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
