import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactForm from '@/components/contact/ContactForm'
import { Building2, CheckCircle2, TrendingUp, Heart, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Servicios para Empresas',
  description:
    'Programas de bienestar corporativo a medida: entrenamiento grupal, nutrición, fisioterapia y prevención de riesgos laborales. Solicita tu propuesta.',
}

const ITEMS = [
  { icon: Users,       label: 'Entrenamiento grupal y sesiones en empresa' },
  { icon: Heart,       label: 'Fisioterapia preventiva y ergonomía en oficina' },
  { icon: TrendingUp,  label: 'Nutrición y planes alimentarios para equipos' },
  { icon: CheckCircle2,label: 'Seguimiento individual de cada empleado' },
  { icon: Building2,   label: 'Informes de progreso para RRHH' },
]

export default function EmpresasPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">Empresas</span>
            <h1 className="mt-3 text-5xl font-black">
              Bienestar corporativo<br />
              <span className="gradient-text">que genera resultados</span>
            </h1>
            <p className="mt-5 text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Equipos sanos son equipos productivos. Diseñamos programas integrales
              de salud para empresas que quieren reducir el absentismo y mejorar el clima laboral.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Lista beneficios */}
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl font-bold">¿Qué incluye el programa?</h2>
              <ul className="flex flex-col gap-4">
                {ITEMS.map((item) => (
                  <li key={item.label} className="flex items-center gap-4 glass p-4 rounded-xl">
                    <div className="p-2.5 rounded-xl bg-brand-500/10 shrink-0">
                      <item.icon className="w-5 h-5 text-brand-400" />
                    </div>
                    <span className="text-sm text-neutral-300">{item.label}</span>
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[
                  { v: '-32%',  l: 'Absentismo' },
                  { v: '+18%',  l: 'Productividad' },
                  { v: '98%',   l: 'Satisfacción' },
                ].map((s) => (
                  <div key={s.l} className="glass rounded-2xl p-5 text-center">
                    <p className="text-3xl font-black gradient-text">{s.v}</p>
                    <p className="text-xs text-neutral-500 mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario empresa pre-seleccionado */}
            <div className="glass rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-6">Solicita tu propuesta</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
