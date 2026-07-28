import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { User, Activity, Calendar, ShieldCheck, Mail } from 'lucide-react'
import CambiarPasswordForm from '@/components/portal/perfil/CambiarPasswordForm'

export default async function PortalPerfil() {
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

  // Obtener perfil detallado
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre, apellidos, foto_url, objetivo, fecha_alta')
    .eq('id', user?.id)
    .single()

  // Obtener conteo de rutinas y planes que realmente tienen ejercicios y comidas configurados
  const { data: rutinasConEjercicios } = await supabase
    .from('rutinas')
    .select('id, ejercicios!inner(id)')
    .eq('cliente_id', user?.id)

  const totalRutinas = rutinasConEjercicios?.length || 0

  const { data: planesConComidas } = await supabase
    .from('planes_nutricionales')
    .select('id, comidas!inner(id)')
    .eq('cliente_id', user?.id)

  const totalPlanes = planesConComidas?.length || 0

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Tu Perfil Biológico</h1>
        <p className="text-neutral-400 mt-2 text-sm">
          Información general de tu cuenta y estado en R3Clinica.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Tarjeta de Identificación */}
        <div className="glass rounded-3xl p-6 border border-white/5 flex flex-col items-center text-center justify-between h-fit gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {perfil?.nombre || '---'} {perfil?.apellidos || ''}
              </h2>
              <p className="text-xs text-neutral-500 font-mono mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="w-full border-t border-white/5 pt-6 flex justify-around text-center">
            <div>
              <span className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">Rutinas</span>
              <span className="text-lg font-black text-white font-mono">{totalRutinas || 0}</span>
            </div>
            <div className="border-r border-white/5" />
            <div>
              <span className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">Planes</span>
              <span className="text-lg font-black text-white font-mono">{totalPlanes || 0}</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Detalles del Perfil y Cuenta */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Detalle */}
          <div className="glass rounded-3xl p-6 border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4">Detalles Clínicos</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest block">Objetivo Primario</span>
                  <span className="text-sm font-semibold text-white mt-0.5">
                    {perfil?.objetivo || 'Por definir'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest block">Fecha de Registro</span>
                  <span className="text-sm font-semibold text-white mt-0.5">
                    {perfil?.fecha_alta ? formatearFecha(perfil.fecha_alta.toString()) : '---'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Cuenta & Seguridad */}
          <div className="glass rounded-3xl p-6 border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4 font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
              Seguridad de la Cuenta
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-400">Email registrado</span>
                </div>
                <span className="font-mono text-white text-xs">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 text-sm">
                <span className="text-neutral-400">Estado de sesión</span>
                <span className="text-xs font-bold text-brand-400/80 bg-brand-500/5 border border-brand-500/10 px-2 py-0.5 rounded-md uppercase">
                  Conectado por RLS
                </span>
              </div>
            </div>
            
            <CambiarPasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}
