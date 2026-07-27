import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Salad, ChevronRight, Activity, Calendar } from 'lucide-react'
import CalendarioEntrenamiento from '@/components/portal/CalendarioEntrenamiento'
import type { Tables } from '@/types/supabase'

export default async function PortalDashboard() {
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

  // Obtener perfil
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre, objetivo, fecha_alta')
    .eq('id', user?.id)
    .single()

  // Obtener rutina activa
  const { data: rutina } = await supabase
    .from('rutinas')
    .select('id, nombre, descripcion')
    .eq('cliente_id', user?.id)
    .eq('activa', true)
    .maybeSingle()

  // Obtener ejercicios de la rutina activa
  let ejercicios: Tables<'ejercicios'>[] = []
  if (rutina) {
    const { data: exs } = await supabase
      .from('ejercicios')
      .select('id, rutina_id, nombre, series, repeticiones, imagen_url, video_url, orden, notas, dia_semana, fecha, created_at')
      .eq('rutina_id', rutina.id)
      .order('orden')
    ejercicios = exs || []
  }

  // Obtener plan nutricional activo
  const { data: planNutricional } = await supabase
    .from('planes_nutricionales')
    .select('id, nombre, calorias_objetivo')
    .eq('cliente_id', user?.id)
    .eq('activo', true)
    .maybeSingle()

  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return ''
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header de Bienvenida */}
      <div>
        <h1 className="text-3xl font-black text-white">
          Hola, <span className="gradient-text">{perfil?.nombre || 'Atleta'}</span>
        </h1>
        <p className="text-neutral-400 mt-2 text-sm leading-relaxed">
          Bienvenido a tu panel de optimización. Aquí tienes el control de tu evolución.
        </p>
      </div>

      {/* Calendario de Entrenamiento */}
      <CalendarioEntrenamiento 
        rutinaNombre={rutina?.nombre || null}
        rutinaDescripcion={rutina?.descripcion || null}
        ejercicios={ejercicios}
      />

      {/* Bloque de Nutrición y Perfil en fila inferior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Tarjeta de Nutrición */}
        <div className="glass rounded-3xl p-6 border border-white/5 flex flex-col justify-between hover:border-brand-500/20 transition-all duration-300 group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6 group-hover:bg-brand-500/20 transition-all">
              <Salad className="w-6 h-6 text-brand-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Tu Nutrición</h2>
            {planNutricional ? (
              <>
                <p className="text-lg font-semibold text-brand-300">{planNutricional.nombre}</p>
                <p className="text-sm text-neutral-400 mt-1">
                  Objetivo: <span className="font-mono font-semibold text-white">{planNutricional.calorias_objetivo || '---'} kcal</span> al día.
                </p>
              </>
            ) : (
              <p className="text-sm text-neutral-500 mt-1">
                No tienes ningún plan nutricional asignado actualmente.
              </p>
            )}
          </div>
          {planNutricional && (
            <Link
              href="/portal/nutricion"
              className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-semibold mt-6 transition-all"
            >
              Ver plan de alimentación
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Info Extra Lateral */}
        <div className="glass rounded-3xl p-6 border border-white/5 flex flex-col justify-center gap-6 divide-y divide-white/5">
          <div className="flex items-center gap-4 py-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Objetivo Actual</p>
              <p className="text-sm font-semibold text-white mt-0.5">
                {perfil?.objetivo || 'Pendiente de definir'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-6 pb-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Miembro Desde</p>
              <p className="text-sm font-semibold text-white mt-0.5">
                {perfil?.fecha_alta ? formatearFecha(perfil.fecha_alta.toString()) : '---'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
