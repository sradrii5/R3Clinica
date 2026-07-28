import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Instagram, Linkedin, User, Users } from 'lucide-react'
import { MiembroEquipo } from '@/data/equipo'

export const metadata: Metadata = {
  title: 'Nuestro Equipo',
  description:
    'Conoce a los profesionales de R3Clinica. Un equipo multidisciplinar de expertos en entrenamiento, fisioterapia y nutrición.',
}

export const revalidate = 3600 // 1h

export default async function EquipoPage() {
  const supabase = await createClient()

  const { data: miembrosDb } = await (supabase.from('miembros_equipo') as unknown as {
    select: (cols: string) => {
      eq: (col: string, val: boolean) => {
        order: (col: string) => Promise<{ data: MiembroEquipo[] | null }>
      }
    }
  })
    .select('*')
    .eq('activo', true)
    .order('orden')

  const miembros = miembrosDb || []

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">Profesionales</span>
            <h1 className="mt-3 text-5xl font-black">
              Nuestro <span className="gradient-text">Equipo</span>
            </h1>
            <p className="mt-4 text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              En R3Clinica contamos con especialistas titulados y con amplia experiencia en el alto rendimiento. 
              Trabajamos de forma coordinada para ofrecerte el mejor servicio posible.
            </p>
          </div>

          {/* Grid de Equipo o Estado Vacío */}
          {miembros.length === 0 ? (
            <div className="glass rounded-3xl p-16 text-center border border-white/5 max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Equipo en Actualización</h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Estamos actualizando las fichas de nuestros fisioterapeutas, entrenadores y nutricionistas. 
                Pronto podrás consultar sus especialidades y trayectorias completas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {miembros.map((m) => (
                <div key={m.id} className="group flex flex-col justify-between glass rounded-3xl p-6 border border-white/5 hover:border-brand-500/20 transition-all duration-300">
                  <div>
                    {/* Foto placeholder/real */}
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 mb-6 border border-white/5 group-hover:border-brand-500/30 transition-all duration-500">
                      {m.foto_url ? (
                        <img 
                          src={m.foto_url} 
                          alt={`${m.nombre} ${m.apellidos}`} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-700">
                          <User className="w-20 h-20 opacity-30" />
                        </div>
                      )}
                      
                      {/* Overlay social */}
                      {(m.instagram_url || m.linkedin_url) && (
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-3">
                          {m.instagram_url && (
                            <a href={m.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full glass hover:bg-brand-500 text-white transition-colors">
                              <Instagram className="w-4 h-4" />
                            </a>
                          )}
                          {m.linkedin_url && (
                            <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full glass hover:bg-brand-500 text-white transition-colors">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {m.nombre} {m.apellidos}
                      </h3>
                      <p className="text-brand-400 text-sm font-semibold">{m.cargo}</p>
                      
                      {/* Especialidades */}
                      {m.especialidades && m.especialidades.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1.5 pt-2 pb-1">
                          {m.especialidades.map((esp) => (
                            <span key={esp} className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-white/5 text-neutral-400 border border-white/5">
                              {esp}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-neutral-400 leading-relaxed pt-2 line-clamp-4">
                        {m.bio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
