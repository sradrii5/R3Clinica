import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Image from 'next/image'
import { Dumbbell, Info, Calendar } from 'lucide-react'

export default async function PortalEntrenamiento() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Obtener rutina activa
  const { data: rutina } = await supabase
    .from('rutinas')
    .select('id, nombre, descripcion, fecha_inicio, fecha_fin')
    .eq('cliente_id', user?.id)
    .eq('activa', true)
    .maybeSingle()

  // Obtener ejercicios de esa rutina
  let ejercicios: any[] = []
  if (rutina) {
    const { data } = await supabase
      .from('ejercicios')
      .select('id, nombre, series, repeticiones, imagen_url, notas')
      .eq('rutina_id', rutina.id)
      .order('orden', { ascending: true })
    
    ejercicios = data || []
  }

  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return ''
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Tu Plan de Entrenamiento</h1>
          <p className="text-neutral-400 mt-2 text-sm">
            Sigue de forma rigurosa la rutina programada por tu entrenador.
          </p>
        </div>

        {rutina && (rutina.fecha_inicio || rutina.fecha_fin) && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 text-xs text-neutral-400 font-mono w-fit">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {rutina.fecha_inicio ? formatearFecha(rutina.fecha_inicio.toString()) : '---'}
              {' - '}
              {rutina.fecha_fin ? formatearFecha(rutina.fecha_fin.toString()) : '---'}
            </span>
          </div>
        )}
      </div>

      {rutina ? (
        <div className="space-y-8">
          {/* Descripción / Notas de la rutina */}
          {rutina.descripcion && (
            <div className="glass rounded-3xl p-6 border border-white/5 flex gap-4 items-start bg-brand-500/5">
              <Info className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white">Notas del Entrenador</h3>
                <p className="text-sm text-neutral-300 mt-1 leading-relaxed">{rutina.descripcion}</p>
              </div>
            </div>
          )}

          {/* Listado de Ejercicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ejercicios.length > 0 ? (
              ejercicios.map((ej, index) => (
                <div key={ej.id} className="glass rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-between hover:border-brand-500/10 transition-colors">
                  <div>
                    {/* Imagen del ejercicio */}
                    {ej.imagen_url ? (
                      <div className="relative w-full aspect-video bg-neutral-900 overflow-hidden border-b border-white/5">
                        <img
                          src={ej.imagen_url}
                          alt={ej.nombre}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-neutral-900/50 flex flex-col items-center justify-center border-b border-white/5 text-neutral-600 gap-2">
                        <Dumbbell className="w-8 h-8 opacity-30 animate-pulse" />
                        <span className="text-xs font-mono opacity-50">Visualización no disponible</span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <span className="text-xs font-mono font-bold text-brand-400/80 bg-brand-500/5 border border-brand-500/10 px-2.5 py-1 rounded-md">
                          Nº {index + 1}
                        </span>
                        <div className="flex items-center gap-4 text-sm text-neutral-300 font-mono">
                          <div>
                            <span className="text-xs text-neutral-500 block uppercase tracking-wider mb-0.5">Series</span>
                            <span className="font-bold text-white text-base">{ej.series}</span>
                          </div>
                          <div className="text-neutral-700">|</div>
                          <div>
                            <span className="text-xs text-neutral-500 block uppercase tracking-wider mb-0.5">Reps</span>
                            <span className="font-bold text-white text-base">{ej.repeticiones}</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">{ej.nombre}</h3>
                      {ej.notes || ej.notas ? (
                        <p className="text-sm text-neutral-400 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5">
                          {ej.notes || ej.notas}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 glass rounded-3xl p-12 text-center border border-white/5 text-neutral-500">
                <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Esta rutina no tiene ejercicios añadidos todavía.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass rounded-3xl p-12 text-center border border-white/5 text-neutral-500">
          <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm">No tienes ninguna rutina de entrenamiento activa.</p>
        </div>
      )}
    </div>
  )
}
