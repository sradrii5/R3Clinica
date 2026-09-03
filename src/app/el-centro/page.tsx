import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { MapPin, Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'El Centro',
  description:
    'Conoce las instalaciones de R3Clínicas en Valladolid: espacios diseñados para entrenamiento, fisioterapia y recuperación.',
}

export const revalidate = 3600 // 1h

export default async function ElCentroPage() {
  const supabase = await createClient()

  const { data: instalaciones } = await supabase
    .from('instalaciones')
    .select('*')
    .eq('activo', true)
    .order('orden')

  const items = instalaciones ?? []

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-brand-500 text-sm font-semibold uppercase tracking-widest">Nuestro Espacio</span>
            <h1 className="mt-3 text-5xl font-black">
              El <span className="gradient-text">Centro</span>
            </h1>
            <p className="mt-4 text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Instalaciones diseñadas para que entrenamiento, fisioterapia y recuperación convivan
              en un mismo espacio, sin desplazamientos ni tiempos muertos entre sesiones.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-neutral-500">
              <MapPin className="w-4 h-4 text-brand-400" />
              C. Divina Pastora, 5, 47004 Valladolid
            </div>
          </div>

          {/* Grid de instalaciones o estado vacío */}
          {items.length === 0 ? (
            <div className="glass rounded-3xl p-16 text-center border border-white/5 max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Fotos en camino</h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Estamos preparando el reportaje fotográfico de nuestras instalaciones.
                Mientras tanto, puedes visitarnos en C. Divina Pastora, 5, Valladolid.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div key={item.id} className="group glass rounded-3xl overflow-hidden border border-white/5 hover:border-brand-500/20 transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-900">
                    <img
                      src={item.imagen_url}
                      alt={item.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{item.titulo}</h3>
                    {item.descripcion && (
                      <p className="text-sm text-neutral-400 leading-relaxed">{item.descripcion}</p>
                    )}
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
