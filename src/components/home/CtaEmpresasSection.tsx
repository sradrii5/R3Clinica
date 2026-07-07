import Link from 'next/link'
import { ArrowRight, Users2, TrendingUp, ShieldCheck, LayoutDashboard } from 'lucide-react'

const BENEFICIOS = [
  {
    icon: Users2,
    title: 'Programas grupales',
    desc: 'Actividades de team building y salud para equipos de cualquier tamaño.',
  },
  {
    icon: TrendingUp,
    title: 'ROI medible',
    desc: 'Reducción del absentismo y mejora de la productividad documentadas.',
  },
  {
    icon: ShieldCheck,
    title: 'Prevención de lesiones',
    desc: 'Evaluaciones biomecánicas y programas preventivos para tu plantilla.',
  },
  {
    icon: LayoutDashboard,
    title: 'Gestión centralizada',
    desc: 'Panel de control para RRHH con seguimiento de todos los empleados.',
  },
]

export default function CtaEmpresasSection() {
  return (
    <section id="empresas-cta" className="py-24 px-6" aria-labelledby="empresas-heading">
      <div className="max-w-7xl mx-auto border border-white/[0.07] relative overflow-hidden">

        {/* Accent diagonal stripe */}
        <div
          className="absolute top-0 right-0 w-64 h-full opacity-[0.07] pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'repeating-linear-gradient(135deg, #34d399 0px, #34d399 1px, transparent 1px, transparent 24px)',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">

          {/* Left — Text */}
          <div className="flex flex-col gap-8 p-10 md:p-16 border-b lg:border-b-0 lg:border-r border-white/[0.07]">
            <div className="flex items-center gap-3 reveal">
              <span className="w-8 h-px bg-brand-400" />
              <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.25em]">Para Empresas</span>
            </div>

            <h2
              id="empresas-heading"
              className="reveal delay-100 text-4xl sm:text-5xl font-black leading-none uppercase tracking-tight"
            >
              Invierte en la<br />
              <span className="gradient-text">salud de tu equipo.</span>
            </h2>

            <p className="reveal delay-200 text-neutral-500 leading-relaxed text-sm max-w-md">
              Diseñamos programas de bienestar corporativo a medida para empresas de todos
              los tamaños. Fisioterapia en oficina, nutrición, entrenamiento grupal y
              prevención de riesgos laborales.
            </p>

            <div className="reveal delay-300 flex flex-col sm:flex-row gap-3">
              <Link
                href="/empresas"
                id="empresas-cta-btn"
                className="group flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-400 hover:bg-brand-300 text-black font-bold text-sm transition-all duration-200 hover:scale-[1.02] glow-brand-sm"
                aria-label="Solicitar propuesta para tu empresa"
              >
                Solicitar propuesta
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/empresas"
                className="flex items-center justify-center gap-2 px-7 py-3.5 border border-white/10 hover:border-brand-400/40 text-white hover:text-brand-400 font-semibold text-sm transition-all duration-200"
              >
                Más información
              </Link>
            </div>
          </div>

          {/* Right — Benefits grid */}
          <div className="grid grid-cols-2 gap-px bg-white/[0.05]">
            {BENEFICIOS.map((b, i) => (
              <div
                key={b.title}
                className="reveal bg-[#060908] p-7 flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-200 border border-transparent hover:border-brand-400/10"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-8 h-8 flex items-center justify-center border border-white/[0.08] bg-white/[0.03]">
                  <b.icon className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight mb-1.5">{b.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
