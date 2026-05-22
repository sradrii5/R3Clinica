import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Dumbbell, Info, Calendar } from 'lucide-react'
import EjerciciosList from '@/components/portal/entreno/EjerciciosList'

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

  // Obtener ejercicios de esa rutina con soporte multimedia
  let ejercicios: any[] = []
  if (rutina) {
    const { data } = await supabase
      .from('ejercicios')
      .select('id, nombre, series, repeticiones, imagen_url, video_url, notas')
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
          {ejercicios.length > 0 ? (
            <EjerciciosList ejercicios={ejercicios} />
          ) : (
            <div className="glass rounded-3xl p-12 text-center border border-white/5 text-neutral-500">
              <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Esta rutina no tiene ejercicios añadidos todavía.</p>
            </div>
          )}
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
