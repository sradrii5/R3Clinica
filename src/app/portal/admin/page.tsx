// src/app/portal/admin/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, UserPlus, FileSpreadsheet, ArrowLeft, Users } from 'lucide-react'
import CrearClienteForm from '@/components/portal/admin/CrearClienteForm'
import AsignarPlanForm from '@/components/portal/admin/AsignarPlanForm'
import GestionarClientesForm from '@/components/portal/admin/GestionarClientesForm'

export const metadata = {
  title: 'Administración - R3Clinica',
  description: 'Panel de administración y gestión de clientes y planes deportivos.',
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const supabase = await createClient()

  // 1. Obtener usuario actual
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Verificar rol de administrador
  const { data: perfil, error: perfilError } = await supabase
    .from('perfiles')
    .select('es_admin')
    .eq('id', user.id)
    .single()

  if (perfilError || !perfil || !perfil.es_admin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 rotate-180" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Acceso No Autorizado</h1>
          <p className="text-sm text-neutral-400 max-w-md">
            Esta sección está reservada exclusivamente para el personal médico, entrenadores y administradores de R3Clinica.
          </p>
        </div>
        <Link
          href="/portal"
          className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Inicio
        </Link>
      </div>
    )
  }

  // 3. Obtener listado de clientes (atletas) activos para el dropdown
  const { data: clientes } = await supabase
    .from('perfiles')
    .select('id, nombre, apellidos, objetivo')
    .eq('es_admin', false)
    .eq('activo', true)
    .order('nombre')

  // 4. Obtener listado de todos los clientes (activos e inactivos) con su email para la pestaña de gestión
  const { data: todosLosClientes } = await supabase
    .from('perfiles')
    .select('id, nombre, apellidos, email, objetivo, activo, fecha_alta')
    .eq('es_admin', false)
    .order('nombre')

  // Obtener pestaña activa del query param
  const activeTab = (await searchParams).tab || 'planes'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Personal Autorizado R3
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Panel de Control</h1>
          <p className="text-sm text-neutral-400">
            Administra los usuarios de la clínica, diseña sus planes alimenticios y pautas de entrenamiento.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-4">
        <Link
          href="/portal/admin?tab=planes"
          className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'planes'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Diseñar Planes de Atletas
        </Link>
        <Link
          href="/portal/admin?tab=gestionar"
          className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'gestionar'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Gestionar Clientes
        </Link>
        <Link
          href="/portal/admin?tab=nuevo"
          className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'nuevo'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Registrar Nuevo Atleta
        </Link>
      </div>

      {/* Contenido */}
      <div className="py-2">
        {activeTab === 'planes' ? (
          <AsignarPlanForm clientes={clientes || []} />
        ) : activeTab === 'gestionar' ? (
          <GestionarClientesForm perfiles={todosLosClientes || []} />
        ) : (
          <CrearClienteForm />
        )}
      </div>
    </div>
  )
}
