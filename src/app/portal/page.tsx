import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import {
  Salad, ChevronRight, Activity, Calendar, ShieldCheck, Users, Dumbbell,
  Images, UserPlus, CalendarDays, MessageSquare, ArrowRight,
} from 'lucide-react'
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
    .select('nombre, objetivo, fecha_alta, es_admin')
    .eq('id', user?.id)
    .single()

  // ─── Vista de Administrador: nada de rutinas/nutrición personales, ──────────
  // solo un resumen operativo y accesos directos a las herramientas de gestión.
  if (perfil?.es_admin) {
    const [
      { count: clientesActivos },
      { count: ejerciciosCatalogo },
      { count: fotosGaleria },
    ] = await Promise.all([
      supabase.from('perfiles').select('id', { count: 'exact', head: true }).eq('es_admin', false).eq('activo', true),
      supabase.from('catalogo_ejercicios').select('id', { count: 'exact', head: true }),
      supabase.from('instalaciones').select('id', { count: 'exact', head: true }),
    ])

    const ACCESOS = [
      { href: '/portal/admin?tab=planes', label: 'Diseñar Planes', icon: Dumbbell },
      { href: '/portal/admin?tab=gestionar', label: 'Gestionar Clientes', icon: Users },
      { href: '/portal/admin?tab=nuevo', label: 'Registrar Atleta', icon: UserPlus },
      { href: '/portal/admin?tab=equipo', label: 'Gestionar Equipo', icon: ShieldCheck },
      { href: '/portal/admin?tab=catalogo', label: 'Gestionar Ejercicios', icon: Dumbbell },
      { href: '/portal/admin?tab=galeria', label: 'Galería del Centro', icon: Images },
      { href: '/portal/admin?tab=calendario', label: 'Calendario Global', icon: CalendarDays },
      { href: '/portal/admin?tab=comunicaciones', label: 'Comunicaciones', icon: MessageSquare },
    ]

    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-widest mb-2">
            <ShieldCheck className="w-4 h-4" />
            Panel de Administración
          </div>
          <h1 className="text-3xl font-black text-white">
            Hola, <span className="gradient-text">{perfil?.nombre || 'Admin'}</span>
          </h1>
          <p className="text-neutral-400 mt-2 text-sm leading-relaxed">
            Resumen operativo de R3Clinica. Accede directamente a la herramienta que necesites.
          </p>
        </div>

        {/* Resumen operativo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass rounded-3xl p-6 border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white leading-none">{clientesActivos ?? 0}</p>
              <p className="text-xs text-neutral-400 mt-1">Clientes activos</p>
            </div>
          </div>
          <div className="glass rounded-3xl p-6 border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white leading-none">{ejerciciosCatalogo ?? 0}</p>
              <p className="text-xs text-neutral-400 mt-1">Ejercicios en catálogo</p>
            </div>
          </div>
          <div className="glass rounded-3xl p-6 border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
              <Images className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white leading-none">{fotosGaleria ?? 0}</p>
              <p className="text-xs text-neutral-400 mt-1">Fotos en la galería</p>
            </div>
          </div>
        </div>

        {/* Accesos directos */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-widest">Accesos directos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACCESOS.map((acceso) => (
              <Link
                key={acceso.href}
                href={acceso.href}
                className="glass rounded-2xl p-5 border border-white/5 hover:border-brand-500/20 transition-all duration-200 flex flex-col gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400 group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-all shrink-0">
                  <acceso.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white">{acceso.label}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ─── Vista de Cliente ────────────────────────────────────────────────────────

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
      .select('id, rutina_id, nombre, series, repeticiones, imagen_url, video_url, orden, notas, dia_semana, fecha, hora, created_at')
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
