import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Instagram, Linkedin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nuestro Equipo',
  description:
    'Conoce a los profesionales de R3Clinica. Un equipo multidisciplinar de expertos en entrenamiento, fisioterapia y nutrición.',
}

export const revalidate = 86400 // 24h

export default async function EquipoPage() {
  const supabase = await createClient()

  const { data: miembros } = await supabase
    .from('miembros_equipo')
    .select('*')
    .eq('activo', true)
    .order('orden')

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">Profesionales</span>
            <h1 className="mt-3 text-5xl font-black">
              Nuestro <span className="gradient-text">Equipo</span>
            </h1>
            <p className="mt-4 text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              En R3Clinica contamos con especialistas titulados y con amplia experiencia en el alto rendimiento. 
              Trabajamos de forma coordinada para ofrecerte el mejor servicio posible.
            </p>
          </div>

          {/* Grid de Equipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {(miembros ?? []).map((m) => (
              <div key={m.id} className="group">
                {/* Foto placeholder/real */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass mb-6 border-white/5 group-hover:border-brand-500/30 transition-all duration-500">
                  {m.foto_url ? (
                    <img 
                      src={m.foto_url} 
                      alt={m.nombre} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                      <Users className="w-16 h-16 text-neutral-800" />
                    </div>
                  )}
                  
                  {/* Overlay social */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-center gap-4">
                    {m.instagram_url && (
                       <a href={m.instagram_url} target="_blank" className="p-2 rounded-full glass hover:bg-brand-500 transition-colors">
                          <Instagram className="w-5 h-5" />
                       </a>
                    )}
                    {m.linkedin_url && (
                       <a href={m.linkedin_url} target="_blank" className="p-2 rounded-full glass hover:bg-brand-500 transition-colors">
                          <Linkedin className="w-5 h-5" />
                       </a>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {m.nombre} {m.apellidos}
                  </h3>
                  <p className="text-brand-400 text-sm font-semibold mb-4">{m.cargo}</p>
                  
                  {/* Especialidades */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {m.especialidades?.map((esp) => (
                      <span key={esp} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md bg-white/5 text-neutral-500 border border-white/5">
                        {esp}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-neutral-500 leading-relaxed max-w-[280px] mx-auto line-clamp-3">
                    {m.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
